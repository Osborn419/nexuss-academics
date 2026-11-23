# IT Study Group — created by Osborn Kobi Frimpong

The study hub for our Level 100 IT group at the **University of Ghana, Legon**.
Everyone takes the same five courses, plus one UGRC elective:

| Course | Title | Track |
| --- | --- | --- |
| DCIT 101 | Introduction to Computer Science | everyone |
| DCIT 103 | Office Productivity Tools | everyone |
| DCIT 105 | Mathematics for IT Professionals | everyone |
| ECON 101 | Introduction to Economics I | everyone |
| STAT 111 | Introduction to Statistics and Probability I | everyone |
| UGRC 150 | Critical Thinking and Practical Reasoning | elective (pick one) |
| UGRC 110 | Academic Writing I | elective (pick one) |

**Creator:** Osborn Kobi Frimpong · frimpongrobert67@gmail.com ·
okfrimpong002@st.ug.edu.gh · 059 979 3927

## What the site does

| Feature | Where |
| --- | --- |
| Home: current semester week, this week's materials, courses, contact | `/` |
| Week-by-week plan for all six courses | `/weeks` |
| Course pages with materials grouped by week | `/courses/dcit-101` etc. |
| Searchable library (filter by course, week, type) | `/materials` |
| Read notes / view PDFs inside the site | `/materials/[id]` |
| Slide decks with keyboard navigation | `/slides/[id]` |
| Timed, auto-marked practice tests with explanations | `/quizzes` |
| Leaderboard | `/leaderboard` |
| Registration with UGRC choice | `/join` |
| Creator dashboard | `/admin` |

## Semester calendar

Weeks run Monday → Sunday. Week 1 began **Monday 26 October 2026**, so
**Monday 23 November 2026 is week 5**. On weekends the site previews the
coming week. To correct it, open **/admin → Semester calendar** and type which
week next Monday is — everything updates instantly.

## Uploading materials (no need to send files to anyone)

1. Go to `/admin` and enter the passcode (`ADMIN_PASSCODE` in `.env`).
2. **Materials** → choose the course and week → select **as many files as you
   want** (PDF, PowerPoint, Word, Excel, ZIP… up to 50 MB each).
3. Leave the type on *Detect from file type*. Files upload one after another
   with a progress message; titles come from the file names.

Files are stored inside the PostgreSQL database, so they survive rebuilds and
redeploys. PDFs open right inside the site; PowerPoint/Word files download.
You can also type notes or slides directly in markdown (`---` separates slides).

## Building tests

**/admin → Tests**: single answer, multiple answers, true/false and short
answer. Every question can have an explanation shown after marking.

## Changing names, contacts, wording

Everything about the creator lives in **`src/config/site.ts`** — name, emails,
phone/WhatsApp (set `showPhone: false` to hide the number).

## Running locally

```bash
npm install
npx drizzle-kit push            # create/update tables
node scripts/seed.mjs           # starter content (only if the DB is empty)
node scripts/seed.mjs --reset   # wipe everything and start over
npm run dev
```

Starter notes live in `scripts/seed-data/*.mjs` (one file per course) and are
labelled "Study group" on the site; your uploads show your name.

Stack: Next.js 16 · TypeScript · Tailwind CSS v4 · Drizzle ORM · PostgreSQL.
