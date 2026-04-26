module Api
    module V1
        class CoinsController < BaseController
            def index
                data = Rails.cache.fetch(cache_key("markets", index_params), expires_in: 60.seconds) do
                    res = coingecko.markets(
                        vs_currency: index_params[:vs_currency],
                        per_page: index_params[:per_page],
                        page: index_params[:page]
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

            private

            def chart_params
                {
                    vs_currency: params[:vs_currency] || "usd",
                    days: (params[:days] || 7).to_i.clamp(1, 365)
                }
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

            def coingecko
                @coingecko ||= Coingecko::Client.new
            end

            def index_params
                {
                    vs_currency: params[:vs_currency] || "usd",
                    per_page: (params[:per_page] || 20).to_i.clamp(1, 250),
                    page: (params[:page] || 1).to_i.clamp(1, 100)
                }
            end
            
            def cache_key(name, h)
                ["v1", "coingecko", name, h.to_json].join(":")
            end
        end
    end
end