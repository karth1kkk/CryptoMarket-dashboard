module Api
  module V1
    class MarketOverviewController < BaseController
      def index
        data = Rails.cache.fetch(cache_key("market_overview"), expires_in: 3.minutes) do
          g = coingecko.global
          global = JSON.parse(g.body)["data"]

          t = coingecko.trending
          trending_raw = JSON.parse(t.body)
          trending = (trending_raw["coins"] || []).first(6).map { |c| build_trending_item(c["item"]) }

          g_res = coingecko.markets(
            vs_currency: "usd",
            per_page: 250,
            page: 1,
            order: "market_cap_desc",
            sparkline: false
          )
          list = JSON.parse(g_res.body)
          top_gainers = list
            .select { |c| c["price_change_percentage_24h"] }
            .sort_by { |c| -c["price_change_percentage_24h"].to_f }
            .first(3)
            .map { |row| light_coin(row) }

          {
            "global" => global,
            "trending" => trending,
            "top_gainers" => top_gainers
          }
        end
        render json: data
      end

      private

      def coingecko
        @coingecko ||= Coingecko::Client.new
      end

      def build_trending_item(item)
        return {} unless item
        d = item["data"] || {}
        price = d["price"]
        price = price.to_f if price
        pch = d["price_change_percentage_24h"]
        pchg =
          if pch.is_a?(Hash)
            pch["usd"]&.to_f
          else
            pch&.to_f
          end
        {
          "id" => item["id"],
          "name" => item["name"],
          "symbol" => (item["symbol"] || "").upcase,
          "thumb" => item["small"] || item["thumb"],
          "current_price" => (price && price > 0 ? price : nil),
          "price_change_percentage_24h" => pchg
        }
      end

      def light_coin(row)
        {
          "id" => row["id"],
          "name" => row["name"],
          "symbol" => (row["symbol"] || "").upcase,
          "image" => row["image"],
          "thumb" => row["image"],
          "current_price" => row["current_price"],
          "price_change_percentage_24h" => row["price_change_percentage_24h"]
        }
      end

      def cache_key(name)
        ["v1", "coingecko", name].join(":")
      end
    end
  end
end
