# Kirkira KECOBO API Reference

Base URL: `http://localhost:3001/api/v1`
Swagger UI: `http://localhost:3001/api/docs`

All endpoints except `/auth/register` and `/auth/login` require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Auth

### POST /auth/register
Create a new user account.
```json
Request:  { "email": "user@example.com", "password": "min8chars", "full_name": "Jane Doe" }
Response: { "access_token": "eyJ...", "user": { "id": "uuid", "email": "...", "full_name": "..." } }
```

### POST /auth/login
Sign in.
```json
Request:  { "email": "user@example.com", "password": "..." }
Response: { "access_token": "eyJ...", "user": { "id": "uuid", "email": "...", "full_name": "..." } }
```

### GET /auth/me
Get the current user's profile.

---

## Applications

### POST /applications
Create a new draft application.
```json
Response: { "id": "uuid", "status": "DRAFT", "wizard_step": 1, "documents": [], ... }
```

### GET /applications
List all applications for the authenticated user, ordered by most recent.
```json
Response: [{ "id": "uuid", "status": "DRAFT", "title": "My Novel", ... }, ...]
```

### GET /applications/:id
Get a single application with documents and audit log.

### PATCH /applications/:id
Auto-save wizard step data. Send only changed fields.
```json
Request: {
  "wizard_step": 2,
  "category_id": "LIT",
  "subcategory_id": "LIT-BOOK",
  "title": "My Novel",
  "description": "A sci-fi story...",
  "applicant_profile_snapshot": { "full_name": "Jane Doe", ... },
  "owners": [{ "full_name": "Co-Author", "role": "co-author", ... }],
  "work_metadata": { "genre": "Fiction", "num_pages": 340, ... }
}
```

### POST /applications/:id/confirm-filing
Validate, transition to READY_FOR_FILING, and enqueue the Playwright job.
```json
Response: { "id": "uuid", "status": "READY_FOR_FILING", ... }
```
Returns `400` with missing fields if validation fails.

### DELETE /applications/:id
Delete a draft application. Returns `400` for non-draft applications.

---

## Documents

### POST /applications/:id/documents
Upload a document. Use `multipart/form-data`.

Form fields:
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | The document file |
| `document_id` | string | Schema document ID (e.g. `work_file`, `id_document`) |
| `label` | string | Human-readable label |
| `type` | string | `work_file` \| `id_document` \| `declaration_form` \| `supporting` |

```json
Response: { "id": "uuid", "type": "WORK_FILE", "file_name": "novel.pdf", "size_bytes": 123456, ... }
```

### DELETE /applications/:id/documents/:documentId
Delete a document and remove its file from storage.

---

## LLM Classification

### POST /classify
Classify a work description using the Anthropic API.
```json
Request:  { "description": "I wrote a 340-page sci-fi novel..." }
Response: {
  "category_id": "LIT",
  "subcategory_id": "LIT-BOOK",
  "confidence": 0.95,
  "explanation": "The description clearly refers to a novel.",
  "is_uncertain": false
}
```

### GET /classify/categories
Return the full categories schema (same as `categories.json`).

---

## Categories

### GET /categories
List all categories (id, label, description, subcategories).

### GET /categories/schema
Full schema including common fields, common documents, fees, and LLM hints.

### GET /categories/:categoryId
Single category with its subcategories.

### GET /categories/:categoryId/subcategories/:subcategoryId
Single subcategory with specific_fields and specific_documents.

---

## Status Lifecycle

| Status | Trigger |
|--------|---------|
| `DRAFT` | Application created |
| `READY_FOR_FILING` | User confirms (POST confirm-filing) |
| `SUBMITTED` | Worker successfully files with KECOBO |
| `UNDER_REVIEW` | Nightly sync reads this status from portal |
| `APPROVED` | Nightly sync — certificate downloaded |
| `REJECTED` | Nightly sync — rejection reason captured |

---

## Error Responses

All errors follow the format:
```json
{ "statusCode": 400, "message": "Missing required fields: title, category", "error": "Bad Request" }
```

Common status codes:
- `400` — Validation error / bad request
- `401` — Not authenticated
- `403` — Not authorised (wrong user)
- `404` — Resource not found
- `409` — Conflict (e.g. duplicate email)
- `500` — Internal server error
