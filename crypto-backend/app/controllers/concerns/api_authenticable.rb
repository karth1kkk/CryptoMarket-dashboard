module ApiAuthenticable
    extend ActiveSupport::Concern

    private

    def authenticate_user!
        token = request.headers["Authorization"].to_s.remove(/\ABearer /i)
        if token.blank?
            render json: {error: "unauthorized"}, status: :unauthorized
            return
        end
        at = AccessToken.find_by(token: token)
        unless at
            render json: {error: "unauthorized" }, status: :unauthorized
            return
        end
        @current_user = at.user
    end
    
    def current_user
        @current_user
    end
end