# Nexus Academics — independent deployment guide

This application is standalone. It runs from your own repository and your own hosting account. Arena AI, Gift Hub, and this development preview are not runtime dependencies; do not configure the site to depend on a temporary preview URL.

## Architecture

- Next.js 16 App Router (Node.js runtime for API routes and database access)
- PostgreSQL via Drizzle ORM (`DATABASE_URL`)
- Authentication: scrypt password hashes and random database-backed session cookies
- Authorization: checked in each server route/page, not merely hidden in the UI
- Learning files: PostgreSQL by default, or Vercel Blob for browser-direct large uploads
- Optional AI: OpenAI-compatible endpoint, configured only via a private server environment variable

There is no client-side secret and no `NEXT_PUBLIC_` secret allowed. The only public variable in the configuration template is `NEXT_PUBLIC_SITE_URL`, which controls social/SEO metadata only.

---

## 1. Put the code in your own GitHub repository

1. Unzip the source export into a new folder.
2. Confirm `.env` does not exist in the repository. `.gitignore` excludes it.
3. Initialize and push:

```bash
git init
git add .
git commit -m "Initial Nexus Academics release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexus-academics.git
git push -u origin main
```

The supplied `.github/workflows/ci.yml` checks type generation, TypeScript, unit tests, ESLint and a production build on every push or pull request to `main`.

## 2. Provision PostgreSQL

Use any managed PostgreSQL provider. Vercel can provision Vercel Postgres/Neon from its Storage marketplace, while Supabase and Railway are also compatible.

Create:
- database: `nexus_academics`
- user with normal read/write privileges
- require TLS

Copy the **pooled** connection URL. In Vercel it is normally added automatically as `DATABASE_URL`. For Supabase, use the transaction-pooled connection string and keep `?pgbouncer=true` in it.

Do not expose a direct admin connection to the browser or client code.

## 3. Create Vercel Blob for durable learning files

This is the recommended setup for Vercel because Vercel Functions have a 4.5 MB request-body limit. The browser uploads directly to Blob; the application stores only its URL in PostgreSQL.

1. In Vercel: **Storage → Create Database → Blob**.
2. Select a public store (learning files should be publicly readable) and connect it to the project.
3. This adds `BLOB_READ_WRITE_TOKEN` to Vercel environment variables. Never prefix it with `NEXT_PUBLIC_`.
4. Optional set `MAX_UPLOAD_MB` for your own limit.

If you self-host and omit Blob, uploads go into PostgreSQL `bytea`. That remains persistent, but the database should be provisioned with enough storage and backups.

## 4. Configure Vercel

Vercel detects Next.js from `vercel.json` and `package.json`. Add these environment variables:

| Name | Required | Value |
| --- | --- | --- |
| `DATABASE_URL` | yes | pooled PostgreSQL connection string |
| `BLOB_READ_WRITE_TOKEN` | recommended on Vercel | Vercel Blob token |
| `MAX_UPLOAD_MB` | optional | default is 50 |
| `OPENAI_API_KEY` | optional | enables AI assistant |
| `AI_MODEL`, `AI_BASE_URL` | optional | provider settings |
| `NEXT_PUBLIC_SITE_URL` | optional | your final HTTPS origin |

Do **not** add `ADMIN_SETUP_TOKEN` yet for normal deployment. Add it temporarily just before owner creation, then delete it.

Run:

```bash
npm ci
npx drizzle-kit push
```

To apply the exact snapshot instead of Drizzle Kit, run against a new empty database:

```bash
psql "$DATABASE_URL" -f migrations/001_schema.sql
```

Use **one** schema method. Then deploy with `vercel --prod` or push to GitHub and let the Vercel project build it.

## 5. Create the owner exactly once

1. In Vercel environment variables, add `ADMIN_SETUP_TOKEN` to a newly generated secret:
   ```bash
   openssl rand -hex 32
   ```
2. Redeploy or restart production so the value is live.
3. Visit `https://YOUR-DOMAIN/setup`.
4. Enter your full name, one of the two owner emails configured in `src/config/site.ts`, a strong password, and the setup token.
5. Immediately remove `ADMIN_SETUP_TOKEN` from Vercel and redeploy. The application will then refuse further setup attempts.

The database enforces only one administrator. A student cannot select administrator access at registration; `/api/auth?action=register` always creates `student`.

If you need starter notes, visit `/admin`, then run `npm run seed` only as a one-off local or deployment maintenance command. Do not run `--reset` on production.

## 6. Connect your own permanent domain

In Vercel → Project → Settings → Domains, add the domain you own (for example `learn.yourdomain.com`). Follow the DNS instructions:

- `A`/`AAAA` record for `@` as instructed by Vercel, or `CNAME` for `www` to `cname.vercel-dns.com`.
- Allow DNS propagation; Vercel provisions HTTPS automatically.
- Set `NEXT_PUBLIC_SITE_URL=https://learn.yourdomain.com` and redeploy.
- Do not use the Vercel preview/development URL as the official site address.

Students should bookmark only that permanent HTTPS address. No Arena AI or Gift Hub redirect is required.

## 7. Verify the deployed site

From a normal browser or terminal:

```bash
TEST_BASE_URL=https://YOUR-DOMAIN node scripts/smoke.mjs
```

Also manually test:
- sign out, then open `/login` and `/register`
- create a disposable student and access `/dashboard`
- upload a file >5 MB from the admin Materials page (requires Blob)
- confirm the file opens after a new browser incognito window
- submit an assignment, verify private download
- verify cross-origin API mutation fails
- visit `/api/health` and expect `{"ok":true}`

## 8. Self-hosted alternative

A container can run without Vercel. `Dockerfile` builds and starts `npm run start`. Provide environment variables at runtime. A reverse proxy must support TLS, WebSocket-free server-side routes and an upload body size matching `MAX_UPLOAD_MB`.

```bash
openssl rand -hex 32 # ADMIN_SETUP_TOKEN, temporary only during setup
docker build -t nexus-academics .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e ADMIN_SETUP_TOKEN="$ADMIN_SETUP_TOKEN" \
  nexus-academics
```

For production, run the container behind your own domain and certificate (Caddy, Nginx, Cloudflare Tunnel, Fly.io, Render, Railway, or a VPS). For files larger than your platform's request limit, configure Vercel Blob or mount object-storage support; otherwise use the PostgreSQL `bytea` fallback.

## 9. Backups and maintenance

- Daily automated PostgreSQL backup and a manual restore test before major term changes.
- Blob data is durable while your Vercel Blob store remains subscribed; still export critical course material.
- Keep Node.js and dependencies patched; review `npm audit` after upgrades.
- Do not put `.env`, `ADMIN_SETUP_TOKEN`, API keys or database passwords in GitHub or ZIP files.
- The public `/downloads/nexus-academics-source.zip` is an export artifact. If it should not remain publicly downloadable, delete it from `public/downloads` and redeploy; source should live in your GitHub repository.

## What this deployment guide does **not** claim

It does not provision your GitHub account, Vercel project, domain registrar, database or Blob storage for you, and it cannot perform those external actions from this code-only ZIP. The application code is self-contained; external services must be created by you and connected with environment variables. Email verification, email password-reset delivery, live video calls, offline mode and real-time forum updates are also not implemented; read `README.md` for the complete limitation list.
