import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Anthropic from "@anthropic-ai/sdk";
import * as categoriesSchema from "../../data/categories.json";

export interface ClassificationResult {
  category_id: string;
  subcategory_id: string;
  confidence: number;
  explanation: string;
  is_uncertain: boolean;
}

const CONFIDENCE_THRESHOLD = 0.75;

const SYSTEM_PROMPT = `You are a copyright classification specialist for the Kenya Copyright Board (KECOBO).
Your task is to analyse a creator's work description and classify it into the correct legal category and subcategory under the Kenya Copyright Act (2001, as amended 2022).

Available categories and subcategories:
${JSON.stringify(
  (categoriesSchema as any).categories.map((c: any) => ({
    id: c.id,
    label: c.label,
    description: c.description,
    subcategories: c.subcategories.map((s: any) => ({
      id: s.id,
      label: s.label,
      examples: s.examples,
    })),
  })),
  null,
  2
)}

Classification rules:
1. Prioritise the nature of the work itself, not its medium of storage.
2. A song's sound recording (SND) and its musical composition (MUS) are separately registrable.
3. Software/apps are classified under LIT-COMP-PROG (Literary Works — Computer Program).
4. When a work spans multiple categories, classify based on the PRIMARY creative element.
5. Use the confidence score honestly — if genuinely ambiguous, use a low score.

Respond with ONLY valid JSON in this exact structure:
{
  "category_id": "...",
  "subcategory_id": "...",
  "confidence": 0.95,
  "explanation": "One or two sentences explaining why this classification was chosen."
}`;

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private client: Anthropic;

  constructor(private config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.get("ANTHROPIC_API_KEY"),
    });
  }

  async classifyWork(description: string): Promise<ClassificationResult> {
    const threshold =
      parseFloat(this.config.get("LLM_CONFIDENCE_THRESHOLD", "0.75")) ||
      CONFIDENCE_THRESHOLD;

    const userMessage = `Please classify this copyright work:\n\n"${description}"`;

    let raw: string;
    try {
      const response = await this.client.messages.create({
        model: this.config.get("ANTHROPIC_MODEL", "claude-opus-4-7"),
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      });

      raw = (response.content[0] as any).text.trim();
    } catch (err: any) {
      this.logger.error("Anthropic API call failed", err?.message ?? err);
      return {
        category_id: "",
        subcategory_id: "",
        confidence: 0,
        explanation: "Automated classification is unavailable. Please select the category manually.",
        is_uncertain: true,
      };
    }

    let parsed: {
      category_id: string;
      subcategory_id: string;
      confidence: number;
      explanation: string;
    };

    try {
      // Strip markdown code fences if the model wrapped the JSON
      const jsonStr = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      this.logger.warn("LLM returned non-JSON response, using fallback", raw);
      return {
        category_id: "",
        subcategory_id: "",
        confidence: 0,
        explanation: "Could not parse classification. Please select manually.",
        is_uncertain: true,
      };
    }

    const isUncertain = parsed.confidence < threshold;

    this.logger.log(
      `Classification: ${parsed.subcategory_id} (confidence: ${parsed.confidence})`
    );

    return {
      category_id: parsed.category_id,
      subcategory_id: parsed.subcategory_id,
      confidence: parsed.confidence,
      explanation: parsed.explanation,
      is_uncertain: isUncertain,
    };
  }

  getCategories() {
    return categoriesSchema;
  }
}
