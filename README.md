# Nexus Academics

**Created by Osborn Kobi Frimpong · Founder & Developer**
An academic learning platform for the University of Ghana Level 100 IT study group.

This repository is a complete standalone Next.js application. Arena AI, Gift Hub and the temporary sandbox preview are not required to run the deployed site. It uses your own repository, Node.js runtime, PostgreSQL database and optional Vercel Blob store. See **[DEPLOYMENT.md](DEPLOYMENT.md)** for independent GitHub, Vercel, custom domain, container and database setup.

## What this project is

A Next.js 16 App Router application backed by PostgreSQL (Drizzle ORM). It uses server-side sessions, scrypt password hashes, server-graded assessments, backend permission checks and durable database or Vercel Blob file storage. It does not use Supabase: the existing PostgreSQL backend was retained rather than replaced.

The seven catalogue codes are DCIT 101, DCIT 103, DCIT 105, STAT 111, ECON 101 (core), and UGRC 110 or UGRC 150 (choose one). **Confirm titles, credits, outlines and starter notes against Osborn's lecturer-supplied materials before treating them as official.** The seed material is example revision material, not official UG material.

## Local installation

Requirements: Node.js 22+, npm and PostgreSQL 14+.

1. Extract the ZIP and enter its directory.
2. Run `npm ci`.
3. Create a PostgreSQL database and copy `.env.example` to `.env`. Set `DATABASE_URL` to your real database URL.
4. Generate a private owner setup token: `openssl rand -hex 32`. Set `ADMIN_SETUP_TOKEN` only in your local `.env`.
5. Create the tables: `npm run db:push`. Alternatively run the snapshot on a new, empty database: `psql "$DATABASE_URL" -f migrations/001_schema.sql`. Use **one** method, not both.
6. Optional starter content: `npm run seed`. **Never run `node scripts/seed.mjs --reset` on a real database — it deletes data.**
7. Run `npm run dev`, open `http://localhost:3000/setup`, and enter your name, the configured owner email from `src/config/site.ts`, a password and the private setup token. This creates the only administrator. Delete the setup token afterward. To change your password, use `/profile`.

For a permanent public installation, use the Vercel or self-hosted instructions in [DEPLOYMENT.md](DEPLOYMENT.md). The sandbox preview URL must never be used as the public site URL.

### Run checks

```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run lint
npm test
npm run build
npm run start
# In another terminal, with the app running:
node scripts/smoke.mjs
```

## Routes

- Public: `/`, `/courses`, `/weeks`, `/materials`, `/slides`, `/quizzes` (catalogue only), `/leaderboard`, `/forum` (read), `/assignments` (list), `/announcements`, `/presentations`, `/flashcards`, `/calendar`, `/assistant` (status).
- Students: `/register`, `/login`, `/dashboard`, `/profile`; authenticated exam submission, bookmarks, course enrolment, weekly progress, forum posts/replies, assignment submissions and notifications.
- Administrator: `/admin` plus `/admin/courses`, `/admin/materials`, `/admin/quizzes`, `/admin/students`, `/admin/assignments`, `/admin/announcements`, `/admin/sessions`, `/admin/presentations`, `/admin/flashcards`, `/admin/forum`, `/admin/attempts`.

## File storage and durability

The administrator can upload PDFs, PowerPoint/Word/Excel documents, images, ZIP files, CSV and TXT files. Draft resources remain hidden from the library and file endpoint.

- **Recommended on Vercel:** set `BLOB_READ_WRITE_TOKEN`. The browser uploads files directly to Vercel Blob, bypassing the 4.5 MB Vercel Function request-body cap. PostgreSQL stores the URL and metadata, so the file remains available after redeployments while the Blob store is active.
- **Self-hosted default:** no Blob token means files are stored in PostgreSQL `bytea` and are backed up with the database. This works at the configured 50 MB default, but do not use that route on Vercel for large files.

The administrator can delete a material; when Blob mode is configured, its object is deleted as well. Assignment files are private: only the submitting student and the administrator may download them.

The semester date can be changed in `/admin`. The current default has Monday 23 November 2026 as Week 5; update it for a later cohort.

## Security implemented

- scrypt password hashes and server-side, random 30-day session tokens stored in PostgreSQL
- one-admin database constraint, private owner setup token and owner-email allowlist
- backend role enforcement for every privileged route and page
- exam scores calculated on the server; answer keys are not passed to the browser before submission
- formal exams accept one server-side submission per student; practice tests can be retaken
- private result and assignment download checks
- sanitized Markdown rendering; unsafe HTML/SVG files are forced as downloads
- file extension and magic-byte validation plus configurable size limits
- same-origin rejection for browser API mutations
- PostgreSQL TLS by default for hosted providers; local connections remain unencrypted unless configured otherwise
- optional Vercel Blob client tokens that never expose the read-write token

Supabase was not used: it is not configured in this environment. The app's own server and PostgreSQL authorization replace it. This is not a formal security certification.

## Known limitations

There is no automatic email delivery or public self-service email password reset. The administrator can generate a one-hour, single-use reset link from `/admin/students`; send it through a private channel.

No real-time WebSocket forum updates, built-in video conferencing, offline mode, hierarchical course-topic editor, manual essay marking, random answer-option order, dedicated question bank, versioned assignment submissions, background notification scheduler or complete audit log. A browser install prompt is enabled by the manifest, but it does not make database data available offline.

A formal examination has one-submission enforcement and server marking, but it is **not proctored**. Students can see questions before the first answer and the elapsed-time value comes from the client. Do not rely on it for high-stakes assessment without server-enforced start/end times, anti-cheat controls and supervised access.

The AI assistant is a real server-side integration only when `OPENAI_API_KEY` or `AI_API_KEY` is configured. It is not enabled by default, does not return simulated replies and requires a signed-in student. It searches administrator-uploaded Markdown/text material for grounding and should be supplemented with authoritative course material.

## Project structure

```text
src/app/                 Public pages, student pages, admin pages and API routes
src/components/          UI components, exam player and admin forms
src/db/schema.ts         Drizzle tables, indexes and storage metadata
src/db/index.ts          PostgreSQL connection and TLS/pool settings
src/lib/                 Authentication, grading, queries, uploads and calendar helpers
src/config/site.ts       Founder identity and owner email allowlist
src/proxy.ts             Same-origin protection for browser API mutations
scripts/seed.mjs         Optional starter catalogue
scripts/seed-data/       Example revision content, not official UG material
scripts/smoke.mjs        Non-destructive HTTP checks
migrations/001_schema.sql  SQL schema snapshot for fresh installs
tests/core.test.mjs      Grading, calendar and Markdown-safety tests
public/icons/            Install/PWA icons
public/images/           Application artwork
.env.example             Empty template; never commit real secrets
DEPLOYMENT.md            GitHub, Vercel, PostgreSQL, Blob and custom-domain guide
```

The provided ZIP excludes `.env`, `node_modules`, `.next`, build logs, generated cache files and database contents. Export/back up student data and uploaded files with `pg_dump`; this is the application source, not a database snapshot.
