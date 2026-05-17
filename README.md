# KIRA — Kenya Innovation Rights Accelerator

An IP services platform built for [kira.co.ke](https://kira.co.ke), combining licensed IP lawyers with digital automation. Currently live for copyright registration (KECOBO), with trademark, industrial design, and patent services integrated via lawyer inquiry flow.

## Services

| Service | Status | Description |
|---------|--------|-------------|
| **Copyright** | ✅ Live | Automated KECOBO / NRR filing with AI-assisted classification |
| **Trademark** | ✅ Live | Lawyer-managed KIPI filing (via kira.co.ke) |
| **Industrial Design** | 🟡 Enquire | Lawyer inquiry → KIPI registration |
| **Patent** | 🟡 Enquire | Lawyer inquiry → KIPI / ARIPO / PCT filing |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Queue | BullMQ + Redis |
| Classification | Anthropic Claude (`claude-opus-4-7`) |
| Portal Automation | Playwright (Chromium) |

> **Auth:** The app runs in guest mode — no login required. It is designed to be embedded within kira.co.ke which handles authentication externally. A `GUEST_USER_ID` constant is used; swap it for an injected user ID when integrating.

---

## Repository Structure

```
kira-copyright/
├── frontend/                    # Next.js app
│   ├── app/
│   │   ├── page.tsx             # Services landing page (4 service cards)
│   │   ├── trademark-service/   # Trademark service detail + SEO page
│   │   ├── copyright-service/   # Copyright service detail + SEO page
│   │   ├── industrial-design-service/  # Industrial design detail + SEO page
│   │   ├── patents-service/     # Patent service detail + SEO page
│   │   ├── dashboard/           # Application dashboard (list + delete drafts)
│   │   ├── apply/[id]/          # 6-step filing wizard orchestrator
│   │   ├── applications/[id]/   # Read-only application detail view
│   │   └── login/               # Redirects to dashboard (auth handled externally)
│   ├── components/
│   │   ├── layout/              # Navbar (KIRA wordmark), AppShell, footer
│   │   ├── wizard/              # Step1–Step6 wizard components + DocumentUploader
│   │   └── InquiryModal.tsx     # Lawyer inquiry form (industrial design & patent)
│   ├── lib/
│   │   ├── api.ts               # Typed API client (applications, documents, inquiries, classify)
│   │   └── auth-context.tsx     # No-op stub (auth handled by parent platform)
│   └── data/
│       └── categories.json      # KECOBO copyright category schema
│
├── backend/                     # NestJS REST API
│   ├── src/
│   │   ├── applications/        # CRUD, lifecycle, confirm-filing, delete
│   │   ├── documents/           # File upload / delete
│   │   ├── llm/                 # Anthropic classification (graceful fallback)
│   │   ├── categories/          # Schema endpoints
│   │   ├── inquiries/           # Lawyer inquiry submission + listing
│   │   ├── queue/               # BullMQ producer
│   │   ├── scheduler/           # Nightly sync cron
│   │   └── prisma/              # PrismaService
│   ├── prisma/
│   │   ├── schema.prisma        # DB schema (User, Application, Document, AuditLog, FilingJob, Inquiry)
│   │   └── seed.ts              # Test data
│   └── data/
│       └── categories.json      # KECOBO category schema (shared with frontend)
│
├── worker/                      # Playwright KECOBO portal automation
│   └── src/
│       ├── kecobo-client.ts     # Browser automation (login, file, sync)
│       ├── filing-worker.ts     # BullMQ consumer — initial filing jobs
│       ├── nightly-sync.ts      # BullMQ consumer — status sync jobs
│       └── index.ts             # Entry point
│
├── shared/                      # Shared TypeScript types
├── docs/                        # Sequence diagrams, API reference, LLM prompts
├── docker-compose.yml
└── .env.example
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- Docker + Docker Compose

### 1. Environment

```bash
cp .env.example .env
# Required: ANTHROPIC_API_KEY, DATABASE_URL, REDIS_URL
# Optional: KECOBO_USERNAME, KECOBO_PASSWORD (needed for portal automation only)
```

### 2. Infrastructure

```bash
docker-compose up postgres redis -d
```

### 3. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
# Runs on http://localhost:3001
# Swagger: http://localhost:3001/api/docs
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 5. Worker (optional — KECOBO portal automation)

```bash
cd worker
npm install
npx playwright install chromium
npm run dev
```

---

## Configuration

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string (BullMQ) |
| `ANTHROPIC_API_KEY` | Anthropic API key for work classification |
| `ANTHROPIC_MODEL` | Model ID (default: `claude-opus-4-7`) |
| `LLM_CONFIDENCE_THRESHOLD` | Float 0–1, below this → manual selection prompt (default: `0.75`) |
| `KECOBO_URL` | KECOBO NRR portal URL |
| `KECOBO_USERNAME` | Portal login email |
| `KECOBO_PASSWORD` | Portal login password |
| `PLAYWRIGHT_HEADLESS` | `true` for production, `false` for debugging |
| `NIGHTLY_SYNC_CRON` | Cron expression for status sync (default: `0 21 * * *` = midnight EAT) |

---

## Key Design Decisions

- **No auth in this app** — runs as a guest session; authentication is handled by the parent kira.co.ke platform. The `GUEST_USER_ID` constant (`00000000-0000-0000-0000-000000000001`) is used until user injection is wired up.
- **Graceful LLM fallback** — if the Anthropic API call fails, classification returns `is_uncertain: true` and the user selects the category manually. No hard failures.
- **Inquiry model** — industrial design and patent services collect lawyer inquiries via a modal form stored in the `inquiries` table. Status tracked as `new → contacted → closed`.
- **Two-click delete** — draft applications can be deleted from the dashboard with a two-step confirmation pattern (no modal).
- **Service detail pages** — `/trademark-service`, `/copyright-service`, `/industrial-design-service`, `/patents-service` serve as SEO landing pages with full service descriptions, benefits, and process steps.

---

## Feature Status

| Feature | Status |
|---------|--------|
| Services landing page | ✅ |
| 6-step copyright filing wizard | ✅ |
| Automated KECOBO / NRR filing (Playwright) | ✅ |
| Work classification (Anthropic) | ✅ |
| Nightly status sync | ✅ |
| Application dashboard + delete | ✅ |
| Lawyer inquiry form (industrial design & patent) | ✅ |
| SEO service detail pages (×4) | ✅ |
| Trademark filing (KIPI) | 🔜 Planned |
| Industrial design filing (KIPI) | 🔜 Planned |
| Patent filing (KIPI / PCT) | 🔜 Planned |
| kira.co.ke auth integration | 🔜 Planned |

---

## API Documentation

Swagger UI: `http://localhost:3001/api/docs`

Full reference: [docs/api-reference.md](docs/api-reference.md)

## Playwright Debugging

```bash
PLAYWRIGHT_HEADLESS=false npm run test:filing
```

Opens a visible browser to observe portal automation. Screenshots saved to `worker/screenshots/`.

---

## Troubleshooting

### AI classification always returns "unavailable" (Windows)

**Symptom:** The Classify button falls back to manual selection even though `ANTHROPIC_API_KEY` is set in `backend/.env`.

**Cause:** On Windows, `dotenv` does not override variables that already exist in the system environment. If `ANTHROPIC_API_KEY` was ever set (even as an empty string) via *System Properties → Environment Variables*, it shadows the `.env` value.

**Fix:** Remove `ANTHROPIC_API_KEY` from your Windows system environment variables:

1. Open **System Properties** → **Advanced** → **Environment Variables**
2. Under *System variables* (or *User variables*), delete the `ANTHROPIC_API_KEY` entry
3. Restart your terminal and re-run `npm run dev` in the backend

The backend reads the key directly from the `.env` file as a fallback, so the app will work correctly once the conflicting system variable is removed.

### Classification endpoint returns 201 instead of 200

NestJS defaults `@Post()` endpoints to HTTP 201. This is expected behaviour — the frontend handles both `200` and `201` as success responses.
