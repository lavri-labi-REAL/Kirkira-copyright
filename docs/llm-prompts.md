# LLM Classification — Prompt Templates & Logic

## Classification System Prompt

```
You are a copyright classification specialist for the Kenya Copyright Board (KECOBO).
Your task is to analyse a creator's work description and classify it into the correct
legal category and subcategory under the Kenya Copyright Act (2001, as amended 2022).

Available categories and subcategories:
[INJECTED AT RUNTIME FROM categories.json — see llm.service.ts]

Classification rules:
1. Prioritise the nature of the work itself, not its medium of storage.
2. A song's sound recording (SND) and its musical composition (MUS) are
   separately registrable. If the user mentions "a song", prefer MUS.
   If they say "my studio recording of a song", prefer SND.
3. Software/apps are classified under LIT-COMP-PROG
   (Literary Works — Computer Program).
4. When a work spans multiple categories, classify based on the PRIMARY
   creative element (e.g. a film with a soundtrack → AV-FILM, not MUS).
5. Use the confidence score honestly:
   - 0.90–1.00: Very clear match, no ambiguity
   - 0.75–0.89: Good match, minor uncertainty
   - 0.50–0.74: Possible match, user should verify
   - < 0.50: Genuinely ambiguous, user must choose manually
6. Never fabricate category IDs. Only use IDs from the provided schema.

Respond with ONLY valid JSON in this exact structure:
{
  "category_id": "LIT",
  "subcategory_id": "LIT-BOOK",
  "confidence": 0.95,
  "explanation": "The description clearly refers to a novel (fiction book) with
                  340 pages. This aligns with the LIT-BOOK subcategory under
                  Literary Works."
}
```

## User Message Template

```
Please classify this copyright work:

"[USER_DESCRIPTION]"
```

## Few-Shot Examples Injected Into Context

To improve accuracy, the system prompt includes examples:

```
Examples of correct classifications:

User: "I wrote a 340-page sci-fi novel set in Nairobi."
→ { "category_id": "LIT", "subcategory_id": "LIT-BOOK", "confidence": 0.97,
    "explanation": "Clearly a novel — literary fiction." }

User: "I composed an instrumental jingle for a radio ad. No lyrics."
→ { "category_id": "MUS", "subcategory_id": "MUS-INSTRUMENTAL", "confidence": 0.95,
    "explanation": "An instrumental musical composition without lyrics." }

User: "We recorded a studio album with 12 tracks."
→ { "category_id": "SND", "subcategory_id": "SND-ALBUM", "confidence": 0.93,
    "explanation": "A sound recording (album). Note: the underlying musical compositions
                   can be separately registered under MUS." }

User: "I built a mobile app for expense tracking on Android."
→ { "category_id": "LIT", "subcategory_id": "LIT-COMP-PROG", "confidence": 0.96,
    "explanation": "Computer programs are classified under Literary Works per the
                   Kenya Copyright Act." }

User: "I made a short film — 12 minutes, directed and produced it myself."
→ { "category_id": "AV", "subcategory_id": "AV-FILM", "confidence": 0.94,
    "explanation": "A short film is an audio-visual work." }

User: "I created a woven fabric pattern with traditional Kenyan motifs."
→ { "category_id": "ART", "subcategory_id": "ART-APPLIED", "confidence": 0.88,
    "explanation": "A woven fabric pattern is applied art / craft." }

User: "I recorded my economics lecture for my students."
→ { "category_id": "SND", "subcategory_id": "SND-SPOKEN", "confidence": 0.85,
    "explanation": "A recorded lecture is a spoken word recording." }

User: "I painted a landscape in oil on canvas."
→ { "category_id": "ART", "subcategory_id": "ART-PAINTING", "confidence": 0.97,
    "explanation": "An oil painting is clearly an Artistic Work." }
```

## Confidence Scoring Logic

```typescript
const CONFIDENCE_THRESHOLD = 0.75; // configurable via env var

function evaluateConfidence(result: ClassificationResult): ClassificationResult {
  return {
    ...result,
    is_uncertain: result.confidence < CONFIDENCE_THRESHOLD,
  };
}

// If is_uncertain === true:
// → Show yellow warning in UI: "We are not sure — please choose manually"
// → Pre-fill dropdowns with the suggestion BUT require the user to confirm
// → Still allow filing with user's manual override
```

## Response Parsing & Guardrails

```typescript
function parseClassificationResponse(raw: string): ClassificationResult {
  // 1. Strip markdown code fences if model wrapped the JSON
  const jsonStr = raw
    .replace(/^```json?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  // 2. Parse JSON
  const parsed = JSON.parse(jsonStr);

  // 3. Validate required fields
  if (!parsed.category_id || !parsed.subcategory_id) {
    throw new Error("Missing category_id or subcategory_id in LLM response");
  }

  // 4. Clamp confidence to [0, 1]
  parsed.confidence = Math.max(0, Math.min(1, parsed.confidence || 0));

  // 5. Check category exists in schema
  const validCategoryIds = ["LIT", "MUS", "ART", "DRA", "AV", "SND", "BRD"];
  if (!validCategoryIds.includes(parsed.category_id)) {
    return {
      category_id: "",
      subcategory_id: "",
      confidence: 0,
      explanation: "LLM returned an invalid category. Please select manually.",
      is_uncertain: true,
    };
  }

  return {
    ...parsed,
    is_uncertain: parsed.confidence < CONFIDENCE_THRESHOLD,
  };
}
```

## Fallback Behaviour

If the Anthropic API is unavailable or returns a non-JSON response:

1. Log the error with full response text.
2. Return:
   ```json
   {
     "category_id": "",
     "subcategory_id": "",
     "confidence": 0,
     "explanation": "Could not classify automatically. Please select manually.",
     "is_uncertain": true
   }
   ```
3. The wizard proceeds normally — the user simply selects category manually.
4. Filing is never blocked due to LLM unavailability.

## Anthropic API Call Configuration

```typescript
const response = await client.messages.create({
  model: "claude-opus-4-7",           // Latest capable model
  max_tokens: 512,                     // Short JSON response
  system: SYSTEM_PROMPT,              // Category schema + rules
  messages: [{ role: "user", content: userMessage }],
  // No streaming needed — we wait for full JSON
});
```

Recommended model: `claude-opus-4-7` for best classification accuracy.
Fallback: `claude-sonnet-4-6` for lower cost in high-volume scenarios.
