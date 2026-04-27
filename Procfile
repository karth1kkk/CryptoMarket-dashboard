# Puma and Rails need to run with cwd = crypto-backend; gems resolve via root Gemfile.lock.
# heroku: BUNDLE_GEMFILE is the path used by the Ruby build (slug root = repo root).
web: sh -c "cd crypto-backend && BUNDLE_GEMFILE=../Gemfile bundle exec puma -C config/puma.rb"
# Fail fast with a clear message if Heroku Postgres (or DATABASE_URL) is not set yet.
release: sh -c 'if [ -z "${DATABASE_URL:-}" ]; then echo "" && echo "ERROR: DATABASE_URL is not set." && echo "On Heroku: Dashboard -> your app -> Resources -> add Heroku Postgres, or set DATABASE_URL in Config Vars." && echo "See crypto-backend/HEROKU.md" && echo "" && exit 1; fi; cd crypto-backend && BUNDLE_GEMFILE=../Gemfile bundle exec rails db:prepare'
