module Api
    module V1
        class CoinsController < BaseController
            def index
                data = Rails.cache.fetch(cache_key("markets", index_params), expires_in: 2.minutes) do
                    p = index_params
                    res = coingecko.markets(
                        vs_currency: p[:vs_currency],
                        per_page: p[:per_page],
                        page: p[:page],
                        order: p[:order],
                        sparkline: p[:sparkline],
                        category: p[:category]
                    )
                    JSON.parse(res.body)
                end
                render json: data
            end

            def show
                data = Rails.cache.fetch(cache_key("coin", {id: params[:id]}), expires_in: 30.seconds) do
                    res = coingecko.coin(params[:id])
                    JSON.parse(res.body)
                end
                render json: data
            end

            def market_chart
                p = chart_params
                data = Rails.cache.fetch(
                    cache_key("market_chart", {
                        id: params[:id], **p
                    }),
                    expires_in: 2.minutes
                ) do
                    res = coingecko.market_chart(
                        id: params[:id],
                        vs_currency: p[:vs_currency],
                        days: p[:days]
                    )
                    JSON.parse(res.body)
                end
                render json: data
            end

            def search
                q = params[:q].to_s.strip
                if q.length < 2
                    return render json: {error: "too short"}, status: :bad_request
                end

                data = Rails.cache.fetch(cache_key("search", {q: q}), expires_in: 30.seconds) do
                    res = coingecko.search(query: q)
                    JSON.parse(res.body)
                end
                render json: { coins: data["coins"] }
            end

            private

            def chart_params
                {
                    vs_currency: params[:vs_currency] || "usd",
                    days: (params[:days] || 7).to_i.clamp(1, 365)
                }
            end

            def coingecko
                @coingecko ||= Coingecko::Client.new
            end

            ALLOWED_VIEWS = %w[all highlights base categories].freeze

            def current_view
                v = params[:view].to_s
                return "all" if v.blank?
                return v if ALLOWED_VIEWS.include?(v)
                "all"
            end

            def index_params
                {
                    vs_currency: params[:vs_currency] || "usd",
                    per_page: (params[:per_page] || 20).to_i.clamp(1, 250),
                    page: (params[:page] || 1).to_i.clamp(1, 100),
                    order: view_order,
                    category: view_category,
                    view: current_view,
                    sparkline: ActiveModel::Type::Boolean.new.cast(params[:sparkline])
                }
            end

            def view_order
                case current_view
                when "highlights"
                    "volume_desc"
                when "base", "categories"
                    "market_cap_desc"
                else
                    allowed_order
                end
            end

            def view_category
                case current_view
                when "base"
                    "base-ecosystem"
                when "categories"
                    "layer-1"
                else
                    nil
                end
            end

            ALLOWED_MARKET_ORDERS = %w[
                market_cap_desc market_cap_asc volume_asc volume_desc
                id_asc id_desc
                price_change_24h_desc price_change_24h_asc
                price_change_percentage_24h_desc price_change_percentage_24h_asc
            ].freeze

            def allowed_order
                o = params[:order].to_s
                return "market_cap_desc" if o.blank?
                return o if ALLOWED_MARKET_ORDERS.include?(o)
                "market_cap_desc"
            end
            
            def cache_key(name, h)
                ["v1", "coingecko", name, h.to_json].join(":")
            end
        end
    end
end