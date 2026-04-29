module Api
    module V1
        class AuthenticatedBaseController < BaseController
            include ApiAuthenticable
            before_action :authenticate_user!
        end
    end
end