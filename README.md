# LeadFlow 🚀

> A lightweight, full-stack Lead Management tool for sales reps. Track leads, log every discussion, and never miss a follow-up.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Project Structure](#-architecture--project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start with Docker Compose](#-quick-start-with-docker-compose-recommended)
- [Local Development Setup](#-local-development-setup)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup (FastAPI)](#2-backend-setup-fastapi)
  - [3. Frontend Setup (Next.js)](#3-frontend-setup-nextjs)
- [Database Seeding](#-database-seeding)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Data Models & Schema](#-data-models--schema)
- [User Guide & Workflows](#-user-guide--workflows)
- [Design Notes & Limitations](#-design-notes--limitations)
- [Use of AI](#-use-of-ai)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🌟 Overview

Managing sales pipelines across spreadsheets leads to dropped deals and missed commitments. **LeadFlow** is a single-screen CRM built for speed:

- **Centralized Lead List**: Every lead with a status badge, company, phone, the latest discussion note, and how long ago it happened.
- **Follow-up Prioritization**: Follow-ups due today are pinned at the top and highlighted in amber. Overdue follow-ups are highlighted in red.
- **Discussion Timelines**: Click any lead to open a dialog with its full discussion history, newest first.
- **Search & Filter**: Debounced name search and one-click status filters.

---

## ✨ Key Features

- **Pipeline Stages**: `NEW` &rarr; `CONTACTED` &rarr; `QUALIFIED` &rarr; `PROPOSAL_SENT` &rarr; `WON` &rarr; `LOST`
- **Follow-up System**:
  - Pinned **"Today's follow-ups"** section, ordered by scheduled time.
  - **Amber** rows for follow-ups due today, **red** rows for overdue ones (a follow-up that is due today but whose time has already passed shows red).
  - Saving a discussion with a follow-up date and time updates the lead's follow-up immediately. Saving one without a date leaves the lead's follow-up unchanged.
- **Discussion History**:
  - Timestamped entries in reverse chronological order, each showing the follow-up that was set with it.
  - The most recent note and its "time ago" appear on the lead's row in the list.
  - Status can be changed from the dialog (optimistic update with rollback on failure).
- **Add Lead**: Name required; company and phone optional; status defaults to New.
- **Search**: Case-insensitive, debounced name search.
- **Seed Script**: Six sample leads with backdated discussions covering every follow-up state.
- **Dockerized Stack**: PostgreSQL, FastAPI and Next.js start together with one command.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19, App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) on [Radix UI](https://www.radix-ui.com/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Language**: TypeScript

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13)
- **ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (sync)
- **Driver**: [Psycopg 3](https://www.psycopg.org/psycopg3/)
- **Validation & Settings**: [Pydantic v2](https://docs.pydantic.dev/) and `pydantic-settings`
- **Server**: [Uvicorn](https://www.uvicorn.org/)

### Database & DevOps
- **Database**: [PostgreSQL 16](https://www.postgresql.org/)
- **Containerization**: Docker & Docker Compose

---

## 📂 Architecture & Project Structure

```text
LeadFlow/
├── docker-compose.yml          # PostgreSQL + FastAPI backend + Next.js frontend
├── .env.example                # Root environment template (database & ports)
├── Backend/                    # FastAPI REST API
│   ├── app/
│   │   ├── models/             # SQLAlchemy ORM models
│   │   │   ├── Lead.py         # Lead model & LeadStatus enum
│   │   │   └── Discussion.py   # Discussion (timeline entry) model
│   │   ├── routers/            # HTTP layer: routes, status codes
│   │   │   ├── leads.py        # /leads endpoints
│   │   │   └── discussions.py  # /leads/{id}/discussions endpoints
│   │   ├── services/           # Business logic & queries (no HTTP concepts)
│   │   │   ├── leads.py        # List/filter/search, latest-note subquery, status update
│   │   │   └── discussions.py  # Timeline queries & creation (+ follow-up update)
│   │   ├── config.py           # Settings (DATABASE_URL, CORS origins)
│   │   ├── database.py         # Engine, SessionLocal, get_db dependency
│   │   ├── schemas.py          # Pydantic request/response schemas
│   │   └── main.py             # App entrypoint, CORS, table creation on startup
│   ├── Dockerfile              # Python 3.13-slim image
│   ├── .dockerignore
│   ├── requirements.txt
│   ├── seed.py                 # Sample data script
│   └── .env.example            # Backend environment template
└── frontend/                   # Next.js application
    ├── src/
    │   ├── app/                # page.tsx (the single screen), layout.tsx, globals.css
    │   ├── components/         # App components
    │   │   ├── AddLeadDialog.tsx
    │   │   ├── DiscussionForm.tsx
    │   │   ├── LeadList.tsx            # Pinned section + all leads
    │   │   ├── LeadRow.tsx             # Row with badge, last note, follow-up styling
    │   │   ├── LeadTimelineDialog.tsx  # Timeline, status change, note form
    │   │   ├── SearchBar.tsx
    │   │   ├── StatusBadge.tsx
    │   │   ├── StatusFilter.tsx
    │   │   ├── TimelineEntry.tsx
    │   │   └── ui/                     # shadcn/ui primitives (generated)
    │   ├── hooks/              # useLeads, useDiscussions, useDebouncedValue
    │   └── lib/                # api.ts (fetch client), types.ts, sort.ts, time.ts
    ├── Dockerfile
    ├── .dockerignore
    ├── package.json
    └── .env.example            # Frontend API URL template
```

---

## 📋 Prerequisites

- **Docker & Docker Compose** (recommended): [Get Docker](https://docs.docker.com/get-docker/)
- *or, for a manual setup:*
  - **Python** 3.13 (3.11+ should work)
  - **Node.js** 20.9 or newer, with `npm`
  - **PostgreSQL** 15 or 16

---

## 🐳 Quick Start with Docker Compose (Recommended)

This starts the database, backend and frontend together.

### 1. Clone the repository

```bash
git clone https://github.com/AdityaAdarsh25/LeadFlow.git
cd LeadFlow
```

### 2. Create the environment file

```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

The defaults work out of the box:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=leadflow
DB_PORT=5432
```

### 3. Build and start everything

```bash
docker compose up --build -d
```

- PostgreSQL starts and passes its health check.
- The backend waits for a healthy database, creates the tables automatically and listens on `http://localhost:8000`.
- The frontend is built and served on `http://localhost:3000`.

Check that all three are up with `docker compose ps`.

**If the frontend image fails to build on your machine**, start only the database and backend in Docker and run the frontend locally:

```bash
docker compose up --build -d db backend
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000.

### 4. Seed the database (separate step)

Seeding is intentionally a separate command so that startup never changes your data:

```bash
docker compose exec backend python seed.py
```

### 5. Open the app

- App: **http://localhost:3000**
- API docs (Swagger): **http://localhost:8000/docs**

### Stop / reset

```bash
docker compose down        # stop the stack, keep the data
docker compose down -v     # stop and DELETE the database volume (fresh start)
```

---

## 💻 Local Development Setup

Run the services directly on your machine with hot reload.

### 1. Database Setup

Easiest is to run only the database from Compose:

```bash
docker compose up -d db
```

(Or point the backend at any local PostgreSQL and create a database for it.)

---

### 2. Backend Setup (FastAPI)

1. Go to the backend folder:
   ```bash
   cd Backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate

   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```

4. Create `Backend/.env` from the template and make sure the URL matches your database (user, password, **port** and database name from the root `.env`):
   ```bash
   # Linux / macOS
   cp .env.example .env

   # Windows
   Copy-Item .env.example .env
   ```
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/leadflow
   ```

5. Start the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The `leads` and `discussions` tables are created automatically on startup.

6. Verify:
   - Health: `http://localhost:8000/health`
   - Swagger docs: `http://localhost:8000/docs`

> If you also started the Compose backend, stop it first (`docker compose stop backend`) so port 8000 is free.

---

### 3. Frontend Setup (Next.js)

1. Go to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` (or copy `.env.example`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open **http://localhost:3000**.

> If you also started the Compose frontend, stop it first (`docker compose stop frontend`) so port 3000 is free.

---

## 🌱 Database Seeding

Loads six sample leads with backdated discussions, covering a follow-up due today, an overdue one, an upcoming one, won/lost leads, and a brand-new lead with no discussions.

**Via Docker:**
```bash
docker compose exec backend python seed.py
```

**Via local virtual environment:**
```bash
cd Backend
# with the virtual environment active
python seed.py
```

> **Notes**
> - The script skips itself if any leads already exist, so running it twice never creates duplicates.
> - Dates are relative to the moment you run it (for example, "due today" is a few hours from now). Re-seed on the day you demo so the "due today" and "overdue" states look right.
> - To reseed from scratch: `docker compose down -v`, `docker compose up -d`, then run the seed command again.

---

## ⚙️ Environment Variables

### Root (`./.env`): used by Docker Compose
| Variable | Description | Example |
| :--- | :--- | :--- |
| `POSTGRES_USER` | PostgreSQL username to create | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `postgres` |
| `POSTGRES_DB` | Database name to create | `leadflow` |
| `DB_PORT` | Host port mapped to the database container | `5432` |

Inside Compose, the backend gets its `DATABASE_URL` from these values automatically (host `db`, internal port 5432).

### Backend (`Backend/.env`): used for local runs
| Variable | Description | Format |
| :--- | :--- | :--- |
| `DATABASE_URL` | SQLAlchemy connection string (Psycopg 3) | `postgresql+psycopg://<user>:<password>@<host>:<port>/<db>` |
| `CORS_ORIGINS` *(optional)* | Allowed browser origins, as a JSON list | `["http://localhost:3000"]` |

### Frontend (`frontend/.env.local`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL of the API, as seen **from the browser** | `http://localhost:8000` |

> `NEXT_PUBLIC_*` values are baked in at build time. If you change it for the Docker frontend, rebuild with `docker compose up --build -d`.

---

## 📡 API Reference

Interactive docs: **Swagger UI** at `http://localhost:8000/docs`, **ReDoc** at `http://localhost:8000/redoc`.

### Endpoints

#### System
- **`GET /health`** returns `{"status": "ok"}`.

#### Leads
- **`GET /leads`**: list leads, newest first. Each lead includes `last_note` and `last_note_at` (null if there are no discussions).
  - Query parameters: `status` (`new`, `contacted`, `qualified`, `proposal_sent`, `won`, `lost`) and `q` (case-insensitive name search), both optional.
- **`POST /leads`**: create a lead. Returns `201`.
  ```json
  {
    "name": "Sarah Connor",
    "company": "Acme Corp",
    "phone": "+1 555-0199"
  }
  ```
  `name` is required (1-120 characters, whitespace trimmed). `status` is optional and defaults to `new`.
- **`PATCH /leads/{lead_id}`**: update a lead's status.
  ```json
  { "status": "qualified" }
  ```

#### Discussions
- **`GET /leads/{lead_id}/discussions`**: all discussions for the lead, newest first.
- **`POST /leads/{lead_id}/discussions`**: add a discussion. Returns `201`.
  ```json
  {
    "note": "Demo call completed. Client requested a pricing quote.",
    "follow_up_at": "2026-10-18T14:30:00Z"
  }
  ```
  `follow_up_at` is optional. If present, it must include a timezone (for example the `Z` suffix) and it also becomes the lead's follow-up. If omitted, the lead's follow-up is left unchanged.

### Error responses
| Status | When |
| :--- | :--- |
| `404 Not Found` | The lead id does not exist (`{"detail": "Lead not found"}`) |
| `422 Unprocessable Entity` | Invalid body or parameters: empty name, unknown status, malformed UUID, timestamp without a timezone |

---

## 🗄 Data Models & Schema

```mermaid
erDiagram
    LEAD ||--o{ DISCUSSION : "has many"
    LEAD {
        uuid id PK
        string name
        string company
        string phone
        string status
        timestamptz follow_up_at
        timestamptz created_at
    }
    DISCUSSION {
        uuid id PK
        uuid lead_id FK
        text note
        timestamptz follow_up_at
        timestamptz created_at
    }
```

- **Foreign key with cascade**: deleting a lead deletes its discussions. `discussions.lead_id` is indexed.
- **Derived fields**: `last_note` and `last_note_at` are not stored. They are computed per request with a single query (`DISTINCT ON` subquery, left-joined so leads without discussions still appear).
- **Atomic update**: saving a discussion and updating the lead's follow-up happen in one transaction.

---

## 🎯 User Guide & Workflows

### 1. Add a lead
1. Click **Add lead** at the top right.
2. Enter a name (required) and optionally a company and phone. New leads start as **New**.
3. Click **Add lead**. The dialog closes and the list refreshes.

### 2. Prioritize follow-ups
- **Today's follow-ups** are pinned at the top and highlighted in **amber**.
- **Red** rows are overdue (the follow-up time has passed).
- Everything else is listed below under **All leads**, newest first.

### 3. Log a discussion
1. Click a lead to open its timeline.
2. Type a note in **Log a new discussion**.
3. Optionally pick a follow-up date and time.
4. Click **Save note**. The timeline updates, and the list shows the new last note and follow-up.

### 4. Change a lead's status
- Use the status dropdown in the top right of the lead dialog. It updates instantly and is saved to the database.

### 5. Search and filter
- Type in the search box to filter by name.
- Click a status chip to filter by pipeline stage. Both can be combined.

---

## 🧭 Design Notes & Limitations

- **Time zones**: all timestamps are stored and transmitted as UTC. "Today", "overdue" and "time ago" are computed in the browser, in the viewer's own time zone. The API rejects follow-up timestamps without a time zone rather than guessing.
- **One follow-up per lead**: the lead holds its current follow-up. Each discussion keeps the follow-up that was set with it, so history is preserved.
- **Schema management**: tables are created with `create_all()` on startup, not with migrations. It never alters existing tables, so after changing a model run `docker compose down -v` (or drop the table) in development. A production setup would use Alembic.
- **No authentication**: login was optional in the brief and is not implemented. Because of that, CORS currently allows all origins; set `CORS_ORIGINS` to restrict it.
- **Not implemented**: editing or deleting leads and discussions, pagination, automated tests.

---

## 🤖 Use of AI

I built this project with Claude (Anthropic) as an AI assistant, working step by step. To be explicit about who did what:

**Mostly written by AI (reviewed, run and tested by me)**
- The frontend components, hooks and helpers (list, row, dialogs, forms, search/filter, time and sorting helpers, API client).
- The Dockerfiles, the Compose service definitions, the seed script and the CORS wiring.
- This README, which I updated with Claude's help.

**Written by me, with AI guidance and review**
- The backend models, Pydantic schemas, services and routers. Claude proposed skeletons with blanks and reviewed my code; I filled them in, and Claude pointed out bugs that I then fixed.
- The Postgres container configuration and `.env` setup.

**My own decisions**
- Stack and data model: Postgres, UUID keys, two tables (leads and discussions) and no users table.
- Behavior: follow-up rules (a note without a date leaves the lead's follow-up unchanged), UTC-only API timestamps, `status` stored as codes with display labels in the UI, derived last note computed in SQL, separate seed command.
- UI choices: filter chips, a single date-time input, amber/red highlighting, and the close-and-refresh behavior for Add Lead.
- I ran and tested the application end to end from my working copy, including the database and backend in Docker. A clean-clone run of the full stack was not completed: the frontend image compiled, but exporting it failed with a Docker storage error on my machine, so running the frontend locally is documented as a fallback.

---

## ❓ Troubleshooting & FAQ

### 1. Port already in use (5432, 8000 or 3000)
- **5432**: a local PostgreSQL is running. Stop it, or set `DB_PORT` in the root `.env` to another port (for example `5433`).
- **8000 / 3000**: another process (often a local `uvicorn` or `npm run dev`) is using it. Stop it, or stop the matching Compose service.

### 2. Changed `.env` credentials but login fails (`password authentication failed`)
PostgreSQL only reads `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB` the first time the data volume is created. After changing them, reset the volume:
```bash
docker compose down -v
docker compose up --build -d
```

### 3. The frontend cannot reach the API
- Check that `docker compose ps` shows the backend running and open `http://localhost:8000/health`.
- `NEXT_PUBLIC_API_URL` must be the address the **browser** can reach (`http://localhost:8000`), not the internal Docker hostname. It is baked in at build time, so rebuild after changing it.

### 4. CORS errors in the browser console
By default the backend allows all origins. If you restricted `CORS_ORIGINS`, make sure it lists your frontend origin exactly (scheme, host and port), as a JSON list.

### 5. Backend cannot connect to the database in Docker
- Inside Compose the backend reaches the database at host `db`, port `5432`. That is configured automatically.
- Make sure you created the root `.env` (`cp .env.example .env`) before running `docker compose up`; without it the database variables are empty.

### 6. "Leads already exist, skipping seed."
That is expected when the database already has data. To start fresh: `docker compose down -v`, `docker compose up -d`, then seed again.

### 7. Seeded dates look wrong (nothing due today)
Seed dates are relative to when the script ran. Reset and re-seed (see above) to refresh them.
