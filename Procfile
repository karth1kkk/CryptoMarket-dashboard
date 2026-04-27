# Puma and Rails need to run with cwd = crypto-backend; gems resolve via root Gemfile.lock.
# heroku: BUNDLE_GEMFILE is the path used by the Ruby build (slug root = repo root).
web: sh -c "cd crypto-backend && BUNDLE_GEMFILE=../Gemfile bundle exec puma -C config/puma.rb"
release: sh -c "cd crypto-backend && BUNDLE_GEMFILE=../Gemfile bundle exec rails db:prepare"
