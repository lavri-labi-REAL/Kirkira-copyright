# KECOBO Filing System — Sequence Diagram

```
User         Frontend (Next.js)    Backend (NestJS)     Redis / BullMQ    Worker (Playwright)    KECOBO Portal    Database (PostgreSQL)
 │                  │                     │                    │                  │                    │                    │
 │──register/login──▶                     │                    │                  │                    │                    │
 │                  │─── POST /auth/login ──▶                  │                  │                    │                    │
 │                  │               ◀── JWT token ─────────────│                  │                    │                    │
 │◀──── JWT token ───                     │                    │                  │                    │                    │
 │                  │                     │                    │                  │                    │                    │
 │────── STEP 1: Describe Work ──────────────────────────────────────────────────────────────────────────────────────────────
 │                  │                     │                    │                  │                    │                    │
 │─── POST /applications ─────────────────▶                   │                  │                    │                    │
 │                  │                     │─────────────────── INSERT Application (status=DRAFT) ───────────────────────────▶
 │◀── { id, status: DRAFT } ──────────────│                    │                  │                    │                    │
 │                  │                     │                    │                  │                    │                    │
 │─ type description─▶                    │                    │                  │                    │                    │
 │                  │─── POST /classify ──▶                   │                  │                    │                    │
 │                  │                     │──── Anthropic API call ────────────────────────────────────────────────────────▶│
 │                  │                     │◀── { category_id, subcategory_id, confidence, explanation } ──────────────────◀│
 │◀── classification result ──────────────│                    │                  │                    │                    │
 │                  │                     │                    │                  │                    │                    │
 │─ accept/override ▶                     │                    │                  │                    │                    │
 │                  │─── PATCH /applications/:id ─────────────▶                  │                    │                    │
 │                  │           (wizard_step=2, category, description)            │                    │                    │
 │                  │                     │─────────────────── UPDATE Application ──────────────────────────────────────────▶
 │◀── updated application ────────────────│                    │                  │                    │                    │
 │                  │                     │                    │                  │                    │                    │
 │──── STEP 2: Preview Requirements (client-side render only, no API call) ───────────────────────────────────────────────
 │                  │                     │                    │                  │                    │                    │
 │──── STEP 3: Confirm Profile ──────────────────────────────────────────────────────────────────────────────────────────
 │                  │                     │                    │                  │                    │                    │
 │─ confirm profile ▶                     │                    │                  │                    │                    │
 │                  │─── PATCH /applications/:id ─────────────▶                  │                    │                    │
 │                  │           (applicant_profile_snapshot, wizard_step=4)       │                    │                    │
 │                  │                     │─────────────────── UPDATE Application ──────────────────────────────────────────▶
 │                  │                     │                    │                  │                    │                    │
 │──── STEP 4: Additional Owners ─────────────────────────────────────────────────────────────────────────────────────────
 │                  │                     │                    │                  │                    │                    │
 │─ owners data ─── ▶                    │                    │                  │                    │                    │
 │                  │─── PATCH /applications/:id ─────────────▶                  │                    │                    │
 │                  │           (owners[], wizard_step=5)       │                  │                    │                    │
 │                  │                     │─────────────────── UPDATE Application ──────────────────────────────────────────▶
 │                  │                     │                    │                  │                    │                    │
 │──── STEP 5: Work Details & Documents ──────────────────────────────────────────────────────────────────────────────────
 │                  │                     │                    │                  │                    │                    │
 │─ fill fields ─── ▶                    │                    │                  │                    │                    │
 │                  │─── PATCH /applications/:id ─────────────▶                  │                    │                    │
 │                  │           (work_metadata, title, wizard_step=6)             │                    │                    │
 │                  │                     │─────────────────── UPDATE Application ──────────────────────────────────────────▶
 │                  │                     │                    │                  │                    │                    │
 │─ upload file ─── ▶                    │                    │                  │                    │                    │
 │                  │─── POST /applications/:id/documents ─────▶                 │                    │                    │
 │                  │           (multipart file)               │                  │                    │                    │
 │                  │                     │─────────────────── INSERT Document ────────────────────────────────────────────▶
 │                  │                     │─── (store file on disk / S3) ─────────────────────────────────────────────────▶
 │◀── uploaded document ──────────────────│                    │                  │                    │                    │
 │                  │                     │                    │                  │                    │                    │
 │──── STEP 6: Review & Confirm ──────────────────────────────────────────────────────────────────────────────────────────
 │                  │                     │                    │                  │                    │                    │
 │─ confirm & file ▶                      │                    │                  │                    │                    │
 │                  │─── POST /applications/:id/confirm-filing ▶                 │                    │                    │
 │                  │                     │─── validate completeness ─────────────────────────────────────────────────────▶
 │                  │                     │─── UPDATE status=READY_FOR_FILING ────────────────────────────────────────────▶
 │                  │                     │─── INSERT AuditLog ────────────────────────────────────────────────────────────▶
 │                  │                     │─── INSERT FilingJob ───────────────────────────────────────────────────────────▶
 │                  │                     │─────────────────── ENQUEUE job to Redis ──────────────────▶│                    │
 │◀── { status: READY_FOR_FILING } ───────│                    │                  │                    │                    │
 │                  │                     │                    │                  │                    │                    │
 │─ redirect to dashboard ─────────────────────────────────────────────────────────────────────────────────────────────────
 │                  │                     │                    │                  │                    │                    │
 │══════════════ STEP 7: BACKGROUND FILING (async, user already on dashboard) ════════════════════════════════════════════
 │                  │                     │                    │                  │                    │                    │
 │                  │                     │                    │◀─── dequeue job ─│                    │                    │
 │                  │                     │                    │                  │─── launch browser ──────────────────────
 │                  │                     │                    │                  │─── login ──────────▶                    │
 │                  │                     │                    │                  │◀── session cookie ──│                    │
 │                  │                     │                    │                  │─── navigate to Register Work ──────────▶
 │                  │                     │                    │                  │─── fill category ──▶                    │
 │                  │                     │                    │                  │─── fill work info ─▶                    │
 │                  │                     │                    │                  │─── fill applicant ─▶                    │
 │                  │                     │                    │                  │─── upload documents ▶                   │
 │                  │                     │                    │                  │─── click Submit ────▶                    │
 │                  │                     │                    │                  │◀── confirmation page │                   │
 │                  │                     │                    │                  │─── extract reference ────────────────────
 │                  │                     │                    │                  │─── take screenshot ─────────────────────
 │                  │                     │◀────────────────── UPDATE status=SUBMITTED, kecobo_reference ──────────────────
 │                  │                     │                    │                  │─── INSERT AuditLog ────────────────────▶
 │                  │                     │                    │                  │─── close browser ───────────────────────
 │                  │                     │                    │                  │                    │                    │
 │══════════════ NIGHTLY SYNC (scheduled, runs at 9 PM UTC = midnight EAT) ═══════════════════════════════════════════════
 │                  │                     │                    │                  │                    │                    │
 │                  │                     │─── SELECT active apps (status=SUBMITTED|UNDER_REVIEW) ─────────────────────────▶
 │                  │                     │─── ENQUEUE sync job ──────────────────▶│                   │                    │
 │                  │                     │                    │◀─── dequeue ─────│                    │                    │
 │                  │                     │                    │                  │─── login ──────────▶                    │
 │                  │                     │                    │                  │─── navigate to My Applications ────────▶
 │                  │                     │                    │                  │─── search by reference ────────────────▶
 │                  │                     │                    │                  │◀── application row ─│                   │
 │                  │                     │                    │                  │─── read status ─────▶                   │
 │                  │                     │                    │                  │                    │                    │
 │                  │                     │          [if APPROVED] ──────────────────────────────────────────────────────
 │                  │                     │                    │                  │─── click Download Certificate ─────────▶
 │                  │                     │                    │                  │◀── PDF download ────│                   │
 │                  │                     │                    │                  │─── UPDATE status=APPROVED ──────────────▶
 │                  │                     │                    │                  │─── INSERT Document(CERTIFICATE) ───────▶
 │                  │                     │                    │                  │                    │                    │
 │                  │                     │          [if REJECTED] ─────────────────────────────────────────────────────
 │                  │                     │                    │                  │─── extract rejection reason ───────────▶
 │                  │                     │                    │                  │─── UPDATE status=REJECTED ──────────────▶
 │                  │                     │                    │                  │─── INSERT AuditLog ────────────────────▶
 │                  │                     │                    │                  │                    │                    │
 │─── next visit to dashboard ────────────────────────────────────────────────────────────────────────────────────────────
 │                  │─── GET /applications ───────────────────▶                  │                    │                    │
 │                  │                     │─── SELECT all user applications ──────────────────────────────────────────────▶
 │◀── updated application cards ──────────│                    │                  │                    │                    │
```
