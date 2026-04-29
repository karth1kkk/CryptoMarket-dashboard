Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API-only app: no HTML. Return JSON so GET / in a browser is not 404.
  get "/", to: proc {
    [
      200,
      { "Content-Type" => "application/json; charset=utf-8" },
      [ { status: "ok", health: "/up", api: "/api/v1/coins", market_overview: "/api/v1/market_overview" }.to_json ]
    ]
  }

  namespace :api do
    namespace :v1 do
      post "auth/register", to: "auth#register"
      post "auth/login", to: "auth#login"

      get "market_overview", to: "market_overview#index"

      resources :coins, only: %i[index show], param: :id do
      get :market_chart, on: :member
      get :search, on: :collection
      end

      get "watchlist", to: "watchlist_items#index"
      post   "watchlist",           to: "watchlist_items#create"
      delete "watchlist/:coin_id",  to: "watchlist_items#destroy"
      
      get    "holdings",     to: "holdings#index"
      post   "holdings",     to: "holdings#create"
      patch  "holdings/:id", to: "holdings#update"   # id = coin_id if you use coin_id in route
      delete "holdings/:id", to: "holdings#destroy"
    end
  end
end
