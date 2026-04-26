# crypto-backend (Rails API)

Rails 8.1 API that proxies and caches CoinGecko data. See the **root [README.md](../README.md)** for how to run it with the Next.js app, environment variables, **API tables**, **Rack::Attack** / CORS, cache TTLs, and error handling.

## Quick start

```bash
bundle install
bin/rails db:prepare
bin/rails s -p 3001
```

Set `FRONTEND_URL` (defaults to `http://localhost:3000`) for CORS. The frontend’s `NEXT_PUBLIC_API_BASE_URL` should match the host and port you use here.

## Notable code

- `app/controllers/api/v1/` — `CoinsController`, `BaseController` (error handling)
- `app/services/coingecko/client.rb` — Faraday client to CoinGecko
- `config/initializers/cors.rb` — `FRONTEND_URL`
- `config/routes.rb` — `namespace :api` → `v1` → `resources :coins` plus `market_chart` (member) and `search` (collection)

## Stack

Ruby on Rails, PostgreSQL, Faraday, `rack-cors`, `rack-attack`, solid_cache / solid_queue / solid_cable.
