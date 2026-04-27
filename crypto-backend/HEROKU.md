# Deploy `crypto-backend` to Heroku (from this monorepo)

## Recommended: root `Gemfile` + `heroku/ruby` (no subdir buildpack)

This repository includes **`Gemfile` and `Gemfile.lock` at the monorepo root** so a normal **`heroku/ruby` buildpack** can detect Ruby. The root `Gemfile` only does `eval_gemfile "crypto-backend/Gemfile"`. The **root `Procfile`** runs Puma/Rails in `crypto-backend` with `BUNDLE_GEMFILE=../Gemfile` so the correct lockfile is used.

1. **Buildpacks** — only the Ruby buildpack (clear old experiments if you added a subdir buildpack first):

   ```bash
   heroku buildpacks:clear -a YOUR_APP
   heroku buildpacks:set heroku/ruby -a YOUR_APP
   heroku config:unset PROJECT_PATH APP_BASE 2>/dev/null || true
   ```

2. **Postgres** (add-on provides `DATABASE_URL`):

   ```bash
   heroku addons:create heroku-postgresql:essential-0 -a YOUR_APP
   ```

3. **Rails / secrets** — from `crypto-backend` on your machine:

   ```bash
   heroku config:set RAILS_ENV=production RAILS_MASTER_KEY="$(cat config/master.key)" -a YOUR_APP
   ```
   Run `cat` from **`crypto-backend`**. **Do not** commit `master.key`.

4. **CORS** — your deployed frontend origin:

   ```bash
   heroku config:set FRONTEND_URL="https://your-frontend.example.com" -a YOUR_APP
   ```

5. **Optional** — `COINGECKO_API_KEY`, and `REDIS_URL` (only if you use Redis; otherwise production cable stays **async**).

6. **Commit and push** the monorepo (must include **root** `Gemfile`, `Gemfile.lock`, `Procfile`, `.ruby-version`):

   ```bash
   git add Gemfile Gemfile.lock Procfile .ruby-version
   git commit -m "Add Heroku monorepo root Ruby files"
   git push heroku main
   ```

7. **Scale** — `heroku ps:scale web=1 -a YOUR_APP`, then `heroku open -a YOUR_APP`. Health: `GET /up`.

**After you change `crypto-backend/Gemfile`**, refresh the root lockfile from the repo root:

```bash
bundle install   # or: bundle lock
```

Then commit the updated **`Gemfile.lock` at the monorepo root** (not only the one in `crypto-backend`, if you still generate one there).

**Ruby version:** `crypto-backend/Gemfile` sets `ruby file: ".ruby-version"`; the monorepo root also has **`.ruby-version`**. If Heroku does not support your Ruby, lower both and run `bundle install` at the monorepo root, then commit.

---

## Optional: subdirectory buildpack instead of a root `Gemfile`

If you prefer **not** to use a root `Gemfile`, remove it from the tree (or do not commit it) and use a **subdirectory buildpack** so the slug root is `crypto-backend/` only:

```bash
heroku buildpacks:clear -a YOUR_APP
heroku buildpacks:add --index 1 https://github.com/timanovsky/heroku-buildpack-subdir -a YOUR_APP
heroku buildpacks:add --index 2 heroku/ruby -a YOUR_APP
heroku config:set PROJECT_PATH=crypto-backend -a YOUR_APP
heroku config:unset BUNDLE_GEMFILE 2>/dev/null || true
```

Do **not** use both a root `eval_gemfile` **and** this flow on the same commit unless you know what the subdir buildpack is copying.

### Alternative: lstoll `APP_BASE` monorepo buildpack

```bash
heroku buildpacks:add --index 1 https://github.com/lstoll/heroku-buildpack-monorepo
heroku buildpacks:add --index 2 heroku/ruby
heroku config:set APP_BASE=crypto-backend -a YOUR_APP
```

---

## Smallest heroku: backend-only repository

`git subtree split` or a dedicated repo with only `crypto-backend/` is another option: `Gemfile` is naturally at the root of the pushed branch, with no monorepo tricks.
