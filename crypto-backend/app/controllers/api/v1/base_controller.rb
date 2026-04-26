module Api
    module V1
        class BaseController < ApplicationController
        rescue_from StandardError, with: :internal_error #dont use in prod
        rescue_from ActiveRecord::RecordNotFound, with: :not_found
        rescue_from Faraday::TimeoutError, with: :upstream_unavailable
        rescue_from Faraday::ConnectionFailed, with: :upstream_unavailable
        rescue_from Faraday::ClientError, with: :upstream_client_error
        rescue_from Faraday::ServerError, with: :upstream_unavailable
        rescue_from Faraday::Error, with: :faraday_error

        private

        def not_found
            render json: { error: "not_found"}, status: :not_found
        end
        
        def internal_error(exception)
            Rails.logger.error(exception.full_message)
            render json: { error: "internal_error"}, status: :internal_server_error
        end

        def upstream_unavailable(exception)
            Rails.logger.error("[upstream] #{exception.class}: #{exception.message}")
            render json: {error: "upstream_unavailable"}, status: :bad_gateway
        end

        def upstream_client_error(exception)
            Rails.logger.warn("[upstream] client error: #{exception.message}")
            #err 429
            status = exception.response&.status == 429 ? :too_many_requests : :bad_gateway
            render json: {error: "upstream_error"}, status: status
        end   
        
        def faraday_error(exception)
            Rails.logger.error("[Faraday] #{exception.message}")
            status = if exception.is_a?(Faraday::ClientError) && exception.response&.status == 429
                :too_many_requests
            elsif exception.is_a?(Faraday::ClientError)
                :bad_gateway
            else
                :bad_gateway
            end 
            render json: { error: "upstream_error" }, status: status   
        end
        end
    end
end