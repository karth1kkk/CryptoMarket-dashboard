module Api
    module V1
        class WatchlistItemsController < AuthenticatedBaseController
            def index
                render json: { coin_ids: current_user.watchlist_items.order(:created_at).pluck(:coin_id)}
            end
            
            def create
                w = current_user.watchlist_items.new(watchlist_params)
                if w.save
                    render json: { coin_ids: w.coin_id }, status: :created
                else
                    render json: { error: w.errors.to_hash }, status: :unprocessable_entity
                end
            end

            def destroy 
                w = current_user.watchlist_items.find_by!(coin_id: params[:coin_id])
                w.destroy!
                head :no_content
            end
            
            private

            def watchlist_params
                params.permit(:coin_id)
            end
        end
    end
end                