module Api
  module V1
    class BaseController < ApplicationController
      # Order matters: most specific first
      rescue_from StandardError, with: :internal_error # use cautiously in production
      rescue_from ActiveRecord::RecordNotFound, with: :not_found
      rescue_from Faraday::TimeoutError, with: :upstream_unavailable
      rescue_from Faraday::ConnectionFailed, with: :upstream_unavailable
      rescue_from Faraday::TooManyRequestsError, with: :upstream_rate_limited
      rescue_from Faraday::ClientError, with: :upstream_client_error
      rescue_from Faraday::ServerError, with: :upstream_unavailable
      rescue_from Faraday::Error, with: :faraday_error

      private

      def not_found
        render json: { error: "not_found" }, status: :not_found
      end

      def internal_error(exception)
        Rails.logger.error(exception.full_message)
        render json: { error: "internal_error" }, status: :internal_server_error
      end

      def upstream_unavailable(exception)
        Rails.logger.error("[upstream] #{exception.class}: #{exception.message}")
        render json: { error: "upstream_unavailable" }, status: :bad_gateway
      end

      def upstream_rate_limited(exception)
        Rails.logger.warn(
          "[upstream] rate limit (429): #{exception.class} — #{exception.message}"
        )
        render json: {
                 error: "rate_limited",
                 message: "CoinGecko request limit reached. Add COINGECKO_API_KEY or try again later."
               },
          status: :too_many_requests
      end

      def upstream_client_error(exception)
        Rails.logger.warn("[upstream] client error: #{exception.message}")
        st = faraday_response_status(exception)
        http_status = st == 429 ? :too_many_requests : :bad_gateway
        render json: { error: "upstream_error" }, status: http_status
      end

      def faraday_error(exception)
        Rails.logger.error("[Faraday] #{exception.message}")
        st = faraday_response_status(exception)
        http_status = if st == 429
          :too_many_requests
        elsif exception.is_a?(Faraday::ClientError)
          :bad_gateway
        else
          :bad_gateway
        end
        render json: { error: "upstream_error" }, status: http_status
      end

      # Faraday 2+ may set #response to a Hash instead of a Response (status in [:status]).
      def faraday_response_status(exception)
        r = exception.response
        return nil if r.nil?

        if r.is_a?(Hash)
          s = r[:status] || r["status"]
          return s.to_i if s
        end
        return r.status if r.respond_to?(:status)

        nil
      end
    end
  end
end
