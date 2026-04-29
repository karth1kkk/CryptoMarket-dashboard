module Api
    module V1
        class HoldingsController < AuthenticatedBaseController
            def index
                rows = current_user.holdings.as_json(only: %i[coin_id amount avg_cost_usd])
                render json: {holdings: rows}
            end
            
            def create
                h = current_user.holdings.new(holding_params)
                if h.save
                    render json: h, status: :created
                else
                    render json: { error: h.errors.to_hash}, status: :unprocessable_entity
                end
            end
            
            def update
                h = current_user.holdings.find_by!(coin_id: params[:id])
                if h.update(holding_params)
                    render json: h
                else
                    render json: { error: h.errors.to_hash }, status: :unprocessable_entity
                end
            end
            
            def destroy
                h = current_user.holdings.find_by!(coin_id: params[:id])
                h.destroy!
                head :no_content
            end
            
            private

            def holding_params
                params.require(:holding).permit(:coin_id, :amount, :avg_cost_usd)
            end
        end
    end
end                
