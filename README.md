# Kirkira KECOBO Copyright Filing System

Automated copyright registration with Kenya's Copyright Board (KECOBO / NRR).

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS (Kirkira theme) |
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Queue | BullMQ + Redis |
| LLM | Anthropic Claude (claude-opus-4-7) |
| Automation | Playwright (Chromium) |
| Auth | JWT (passport-jwt) |

## Repository Structure

```
kira-copyright/
├── frontend/          # Next.js app — 7-step wizard, dashboard, detail view
│   ├── app/           # Next.js App Router pages
│   │   ├── page.tsx              # Landing / home
│   │   ├── login/page.tsx        # Login + register
│   │   ├── dashboard/page.tsx    # Application dashboard
│   │   ├── apply/[id]/page.tsx   # Wizard orchestrator
│   │   └── applications/[id]/page.tsx  # Read-only detail view
│   ├── components/
│   │   ├── ui/        # Design system (Button, Input, Card, Alert, StatusBadge)
│   │   ├── layout/    # Navbar, AppShell
│   │   └── wizard/    # 7 step components + DocumentUploader
│   ├── lib/           # api.ts (typed API client), auth-context.tsx
│   └── data/          # categories.json (KECOBO schema)
│
├── backend/           # NestJS REST API
│   ├── src/
│   │   ├── main.ts               # Bootstrap + Swagger
│   │   ├── app.module.ts
│   │   ├── auth/                 # JWT auth (register/login)
│   │   ├── applications/         # CRUD + lifecycle + confirm-filing
│   │   ├── documents/            # File upload/delete
│   │   ├── llm/                  # Anthropic classification service
│   │   ├── categories/           # Schema endpoints
│   │   ├── queue/                # BullMQ producer
│   │   ├── scheduler/            # Nightly sync cron
│   │   └── prisma/               # PrismaService
│   ├── prisma/
│   │   ├── schema.prisma         # Full DB schema
│   │   └── seed.ts               # Test data
│   └── data/
│       └── categories.json       # KECOBO category schema
│
├── worker/            # Playwright automation
│   └── src/
│       ├── kecobo-client.ts      # Browser automation (login, file, sync)
│       ├── filing-worker.ts      # BullMQ consumer for filing jobs
│       ├── nightly-sync.ts       # BullMQ consumer for sync jobs
│       └── index.ts              # Entry point (starts both workers)
│
├── shared/            # Shared TypeScript types
│   └── src/types/index.ts
│
├── docs/
│   ├── sequence-diagram.md       # Full ASCII sequence diagram
│   ├── llm-prompts.md            # Prompt templates + confidence logic
│   └── api-reference.md          # REST endpoint documentation
│
├── docker-compose.yml            # postgres + redis + all services
├── .env.example                  # All required environment variables
└── kecobo_categories_schema_v1.0.0.json  # Master category schema
```

## Quick Start

### 1. Prerequisites

- Node.js 20+
- Docker + Docker Compose

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your Anthropic API key and KECOBO credentials
```

### 3. Start Infrastructure

```bash
docker-compose up postgres redis -d
```

### 4. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
npm run dev
```

### 5. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 6. Worker

```bash
cd worker
npm install
npx playwright install chromium
npm run dev
```

Open: http://localhost:3000

---

## Configuration

All config is via environment variables — see `.env.example`.

Key variables:

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key for LLM classification |
| `ANTHROPIC_MODEL` | Model ID (default: `claude-opus-4-7`) |
| `LLM_CONFIDENCE_THRESHOLD` | Float 0–1, below this → "uncertain" (default: 0.75) |
| `KECOBO_URL` | KECOBO portal URL |
| `KECOBO_USERNAME` | Portal login email |
| `KECOBO_PASSWORD` | Portal login password |
| `PLAYWRIGHT_HEADLESS` | `true` for production, `false` for debugging |
| `NIGHTLY_SYNC_CRON` | Cron expression (default: `0 21 * * *` = midnight EAT) |

---

## Implementation Priorities (Dev Sequence)

| # | Module | Status |
|---|--------|--------|
| 1 | Data & Schema | ✅ `categories.json` + Prisma schema |
| 2 | Wizard UX | ✅ All 7 steps implemented |
| 3 | LLM Classification | ✅ Anthropic API integration |
| 4 | Validation Layer | ✅ Server-side + client-side |
| 5 | Playwright MVP | ✅ Literary category (generalised to all) |
| 6 | Nightly Sync Job | ✅ BullMQ consumer + scheduler |

---

## Playwright Note

The `KECOBOClient` uses CSS selectors that match the **general pattern** of KECOBO/NRR portal UI.
When the portal is accessible for testing, run:

```bash
PLAYWRIGHT_HEADLESS=false npm run test:filing
```

This opens a visible browser so you can observe the automation and adjust selectors in
`worker/src/kecobo-client.ts` to match the live portal's HTML exactly.

Screenshots of every step are saved to `worker/screenshots/` for debugging.

---

## API Documentation

Swagger UI is available at: `http://localhost:3001/api/docs`

Full REST reference: [docs/api-reference.md](docs/api-reference.md)

---

## Sequence Diagram

[docs/sequence-diagram.md](docs/sequence-diagram.md)

## LLM Prompt Templates

[docs/llm-prompts.md](docs/llm-prompts.md)
