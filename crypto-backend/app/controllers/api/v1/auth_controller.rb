module Api
    module V1
        class AuthController < BaseController
            def register
                user = User.new(user_params)
                if user.save
                    token = user.access_tokens.create!
                    render json: {user: {id: user.id, email: user.email }, token: token.token },
                    status: :created
                else
                    render json: {error: "validation_error", details: user.errors.to_hash }, status: :unprocessable_entity
                end
            end
            
            def login
                user = User.find_by(email: params.dig(:user, :email).to_s.downcase)
                if user&.authenticate(params.dig(:user, :password))
                    token = user.access_tokens.create!
                    render json: { user: { id: user.id, email: user.email}, token: token.token}
                else 
                    render json: { error: "invalid_credentials"}, status: :unauthorized
                end
            end
            
            def user_params
                params.require(:user).permit(:email, :password, :password_confirmation)
            end
        end
    end
end                