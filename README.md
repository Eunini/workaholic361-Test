# Workaholic360 Talent Dashboard

A recruiting dashboard built with Next.js, React, TypeScript, and SQLite. It lists ten sample candidates and lets you search by name or role, filter by stage, and save stage changes.

## Setup

Use Node.js 24.x and npm. Or, if you have nvm installed, run `nvm use` to select the version in `.nvmrc`.
```sh
npm ci
npm run dev
```

Open http://localhost:3000. No environment variables or external services are required. The database is created at `data/talent.sqlite` on the first request and seeded with sample candidates. Changes are kept between page reloads and server restarts.

To run a production build:
```sh
npm run build
npm start
```

Set `DATABASE_PATH` to use a different database file. To reset the default sample data, stop the server and delete the `data/` directory.

## Technologies used

- Next.js 16 (App Router and route handlers)
- React 19 and TypeScript
- SQLite through Node's built-in `node:sqlite` module
- CSS Modules, the Inter font, and Lucide icons
- Node's test runner with `tsx` for API tests, and ESLint

## How it works
The dashboard fetches candidates from `GET /api/candidates`. Changing a stage sends a `PATCH /api/candidates/:id` request with a JSON body such as `{"stage":"Interview"}`. The four supported stages are Sourced, Screening, Interview, and Hired. Candidates can move in either direction.

The selected stage and summary counts update once the API confirms the save. While saving, that candidate's dropdown is disabled. Every save shows a notification that slides in at the top right and slides out after a few seconds (hover to keep it open). A failed request shows an error notification and keeps the previous stage. The list also has loading, retry, and empty states.

Search and filtering run in the browser because the dataset is small. API handlers validate stages and candidate IDs; SQLite queries use prepared statements and a stage constraint in the schema. Invalid requests return 400, missing candidates return 404, and storage errors return 500.

SQLite keeps the local setup simple. The app uses Node's built-in `node:sqlite` module, so there is no separate database server or driver to install. Styling uses CSS Modules next to each component, the Inter font, and Lucide icons.

## Project structure

- `src/app/api/candidates/` — list and stage-update endpoints.
- `src/app/globals.css` — colours, fonts, and base styles.
- `src/components/layout/` — page shell and sidebar.
- `src/components/dashboard/` — the dashboard, stage cards, filters, and candidate table.
- `src/components/toast/` — slide-in notifications (`useToast()`).
- `src/components/ui/` — small reusable pieces: button, select, avatar, empty state, logo.
- `src/hooks/use-candidates.ts` — loads candidates and saves stage changes.
- `src/lib/api.ts` — browser calls to the API.
- `src/lib/candidates.ts` — candidate types, supported stages, and sample data.
- `src/lib/db.ts` — database setup and queries.
- `tests/api.test.ts` — API validation and persistence tests.

## Checks
```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The tests use a temporary database. They cover seeding, valid stage updates, persistence, invalid IDs and stages, malformed JSON, and missing candidates.

## Assumptions and limitations

- Candidate records and email addresses are sample data.
- This is a local, single-workspace app without authentication or candidate creation/deletion.
- SQLite needs a writable, persistent filesystem. For serverless hosting, the data layer would need a hosted database or persistent storage.
- Separate users can overwrite each other's stage updates. Changes from another browser appear after a reload.
- SQLite queries are synchronous; this is suitable for the small dataset but would need revisiting at a larger scale. Some Node 24 releases print an experimental SQLite warning.

## What I'd improve with more time

Add recruiter authentication, candidate creation and detail views, and a history of stage changes. For a shared deployment, add conflict detection for simultaneous updates and move to PostgreSQL. Larger candidate lists would also need server-side search and pagination. Browser tests in CI would cover the complete recruiter flow.
