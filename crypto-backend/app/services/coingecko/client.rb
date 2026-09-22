module Coingecko
  class Client
    BASE = "https://api.coingecko.com/api/v3"

    def initialize
      @conn = Faraday.new(url: BASE) do |f|
        f.request :url_encoded
        f.response :raise_error
        f.adapter Faraday.default_adapter
      end
      @api_key = ENV["COINGECKO_API_KEY"]
    end

    # Helper to attach the demo key to every request
    def attach_key(req)
      req.headers["x-cg-demo-api-key"] = @api_key if @api_key.present?
    end

    def markets(vs_currency: "usd", per_page: 20, page: 1, order: "market_cap_desc", sparkline: false, category: nil)
      @conn.get("coins/markets") do |req|
        attach_key(req)  # <-- use the helper
        req.params["vs_currency"] = vs_currency
        req.params["per_page"] = per_page
        req.params["page"] = page
        req.params["order"] = order
        req.params["sparkline"] = sparkline
        req.params["category"] = category if category.present?
      end
    end

    def market_chart(id:, vs_currency: "usd", days: 7)
      @conn.get("coins/#{id}/market_chart") do |req|
        attach_key(req)  # <-- use the helper
        req.params["vs_currency"] = vs_currency
        req.params["days"] = days
      end
    end

    def coin(id)
      @conn.get("coins/#{id}") do |req|
        attach_key(req)  # <-- use the helper
        req.params["localization"] = "false"
        req.params["tickers"] = "false"
        req.params["market_data"] = "true"
        req.params["community_data"] = "false"
        req.params["developer_data"] = "false"
      end
    end

    def search(query:)
      @conn.get("search") do |req|
        attach_key(req)  # <-- use the helper
        req.params["query"] = query.to_s
      end
    end

    def global
      @conn.get("global") do |req|
        attach_key(req)  # <-- use the helper
      end
    end

    def trending
      @conn.get("search/trending") do |req|
        attach_key(req)  # <-- use the helper
      end
    end
  end
end