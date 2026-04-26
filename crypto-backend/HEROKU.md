# Deploy `crypto-backend` to Heroku (from this monorepo)

The Git repo **root** is one folder above this app, so there is no `Gemfile` at the root. **Heroku’s language detector** only sees Ruby if a `Gemfile` is at the app root, which causes:

> `No default language could be detected for this app`

## Fix: subdirectory buildpack + Ruby buildpack

1. **Create the app** (if you have not) from the monorepo root, not only from `crypto-backend`):

   ```bash
   cd "path/to/Crypto Market Dashboard"   # parent of crypto-backend
   heroku create your-app-name
   ```

2. **Point Heroku at the `crypto-backend` folder** before the Ruby buildpack runs:

   ```bash
   heroku buildpacks:clear
   heroku buildpacks:add --index 1 https://github.com/timanovsky/heroku-buildpack-subdir
   heroku buildpacks:add --index 2 heroku/ruby
   heroku config:set PROJECT_PATH=crypto-backend
   ```

3. **Postgres** (add-on provides `DATABASE_URL`):

   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

4. **Rails / secrets** — set a master key so encrypted credentials and boot work:

   ```bash
   heroku config:set RAILS_ENV=production
   heroku config:set RAILS_MASTER_KEY="$(cat config/master.key)"
   ```
   Run the `RAILS_MASTER_KEY` command from `crypto-backend` where `config/master.key` exists, or paste the key manually from that file. **Do not** commit `master.key`.

5. **CORS** — allow your real frontend (Vercel, Netlify, etc.):

   ```bash
   heroku config:set FRONTEND_URL="https://your-frontend.example.com"
   ```

6. **Optional: CoinGecko Pro**

   ```bash
   heroku config:set COINGECKO_API_KEY="your-key"
   ```

7. **Optional: Redis** for Action Cable — if you add Heroku Redis, set `REDIS_URL` (add-on does this). Without it, this project uses the **async** cable adapter in production (no Redis). Fine for a JSON API.

8. **Push** from the **monorepo** root (Git root contains both `crypto-dashboard` and `crypto-backend`):

   ```bash
   git push heroku main
   ```

9. **Scale the web process** (if not started automatically):

   ```bash
   heroku ps:scale web=1
   heroku open
   ```

`Procfile` runs `db:prepare` on each release to apply migrations. Health check: `GET /up` on your Heroku app URL.

## Ruby version

`Gemfile` uses `ruby file: ".ruby-version"` (currently 3.4.5). If Heroku’s build reports an unsupported version, set `.ruby-version` to a [Heroku-supported](https://devcenter.heroku.com/articles/ruby-support) version (e.g. 3.3.x), run `bundle install`, commit, and push again.

## Alternative: only deploy the backend

If you prefer **not** to use the subdir buildpack, create a small Git repo that only contains the contents of `crypto-backend` (or use `git subtree split`) and `heroku create` in that tree so `Gemfile` is at the root of the pushed branch. The subdir buildpack is usually simpler for a monorepo.
