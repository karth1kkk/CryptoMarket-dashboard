# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  frontend_origins =
    ENV.fetch("FRONTEND_URL", "https://crypto-market-dashboard-dusky.vercel.app/")
       .split(",")
       .map { |o| o.strip }
       .reject(&:empty?)

  allow do
    # Support one or many explicit origins via FRONTEND_URL CSV.
    # Example: FRONTEND_URL="http://localhost:3000,https://app.vercel.app"
    origins(*frontend_origins)

    # Allow Vercel preview deployments in production.
    origins %r{\Ahttps://.*\.vercel\.app\z}

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
