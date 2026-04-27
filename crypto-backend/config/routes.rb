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
      [ { status: "ok", health: "/up", api: "/api/v1/coins" }.to_json ]
    ]
  }

  namespace :api do
    namespace :v1 do
      resources :coins, only: %i[index show], param: :id do
      get :market_chart, on: :member
      get :search, on: :collection
      end
    end
  end
end
