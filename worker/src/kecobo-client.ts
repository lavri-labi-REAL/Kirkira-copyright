/**
 * KECOBOClient — Playwright wrapper for the KECOBO/NRR portal.
 *
 * All page interactions are centralised here so that selectors can be
 * updated in one place if the portal changes.
 */

import { chromium, Browser, Page, BrowserContext } from "playwright";
import * as fs from "fs";
import * as path from "path";

export interface KECOBOCredentials {
  username: string;
  password: string;
  portalUrl: string;
}

export interface ApplicationData {
  id: string;
  title: string;
  description: string;
  category_id: string;
  subcategory_id: string;
  applicant_profile_snapshot: any;
  owners: any[];
  work_metadata: any;
  documents: Array<{
    id: string;
    type: string;
    document_id: string;
    label: string;
    file_path: string;
    file_name: string;
    mime_type: string;
  }>;
}

export interface FilingResult {
  success: boolean;
  reference?: string;
  error?: string;
  screenshotPath?: string;
}

export interface SyncResult {
  applicationId: string;
  kecoboReference: string;
  status: "submitted" | "under_review" | "approved" | "rejected" | "unknown";
  rawStatus: string;
  rejectionReason?: string;
  certificatePath?: string;
  screenshotPath?: string;
}

const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || "./screenshots";

export class KECOBOClient {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private credentials: KECOBOCredentials;
  private sessionId: string;

  constructor(credentials: KECOBOCredentials) {
    this.credentials = credentials;
    this.sessionId = Date.now().toString();
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  }

  async launch() {
    this.browser = await chromium.launch({
      headless: process.env.PLAYWRIGHT_HEADLESS !== "false",
      slowMo: parseInt(process.env.PLAYWRIGHT_SLOW_MO || "0"),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 900 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      acceptDownloads: true,
    });
    this.page = await this.context.newPage();

    // Log console errors for debugging
    this.page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`[Browser Console Error] ${msg.text()}`);
      }
    });
  }

  async close() {
    await this.browser?.close();
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  private async screenshot(name: string): Promise<string> {
    const filePath = path.join(SCREENSHOT_DIR, `${this.sessionId}_${name}.png`);
    await this.page!.screenshot({ path: filePath, fullPage: true });
    console.log(`[Screenshot] ${filePath}`);
    return filePath;
  }

  async login(): Promise<void> {
    const p = this.page!;
    console.log("[KECOBO] Navigating to portal login...");
    await p.goto(this.credentials.portalUrl, { waitUntil: "networkidle" });

    // Adjust selectors to match the actual NRR portal
    await p.fill('input[name="username"], input[type="email"], #username', this.credentials.username);
    await p.fill('input[name="password"], input[type="password"], #password', this.credentials.password);
    await p.click('button[type="submit"], input[type="submit"], .login-btn');

    await p.waitForLoadState("networkidle");

    // Verify successful login
    const isLoggedIn = await p.locator('.user-menu, .dashboard, [data-testid="user-name"]').isVisible().catch(() => false);
    if (!isLoggedIn) {
      await this.screenshot("login_failed");
      throw new Error("KECOBO login failed — check credentials");
    }

    await this.screenshot("login_success");
    console.log("[KECOBO] Login successful");
  }

  async fileApplication(data: ApplicationData): Promise<FilingResult> {
    const p = this.page!;

    try {
      console.log(`[KECOBO] Filing application: ${data.title}`);

      // Navigate to "Register Work" / "New Application"
      await p.click('a[href*="register"], a:has-text("Register Work"), a:has-text("New Application"), a:has-text("Apply")');
      await p.waitForLoadState("networkidle");
      await this.screenshot("register_work_page");

      // ── Step 1: Category Selection ────────────────────────────────────
      await this.selectCategory(data.category_id, data.subcategory_id);
      await this.screenshot("category_selected");

      // ── Step 2: Work Information ──────────────────────────────────────
      await this.fillWorkInformation(data);
      await this.screenshot("work_info_filled");

      // ── Step 3: Applicant Details ─────────────────────────────────────
      await this.fillApplicantDetails(data.applicant_profile_snapshot);
      await this.screenshot("applicant_filled");

      // ── Step 4: Co-Owners (if any) ────────────────────────────────────
      if (data.owners.length > 0) {
        await this.fillCoOwners(data.owners);
        await this.screenshot("co_owners_filled");
      }

      // ── Step 5: Upload Documents ──────────────────────────────────────
      await this.uploadDocuments(data.documents);
      await this.screenshot("documents_uploaded");

      // ── Step 6: Review & Submit ───────────────────────────────────────
      const reference = await this.reviewAndSubmit(data.title);
      await this.screenshot("submission_confirmed");

      console.log(`[KECOBO] Filed successfully. Reference: ${reference}`);
      return {
        success: true,
        reference,
        screenshotPath: path.join(SCREENSHOT_DIR, `${this.sessionId}_submission_confirmed.png`),
      };
    } catch (err: any) {
      const screenshotPath = await this.screenshot("filing_error").catch(() => "");
      console.error(`[KECOBO] Filing error: ${err.message}`);
      return { success: false, error: err.message, screenshotPath };
    }
  }

  private async selectCategory(categoryId: string, subcategoryId: string) {
    const p = this.page!;

    // Map Kirkira category IDs to KECOBO portal labels
    const CATEGORY_MAP: Record<string, string> = {
      LIT: "Literary Works",
      MUS: "Music",
      ART: "Artistic Works",
      DRA: "Dramatic Works",
      AV: "Video",
      SND: "Music",
      BRD: "Broadcasts",
    };

    const categoryLabel = CATEGORY_MAP[categoryId] || categoryId;

    // Try select element first, then radio buttons, then links
    const selectEl = p.locator('select[name*="category"], #category, select[name*="work_type"]').first();
    if (await selectEl.isVisible().catch(() => false)) {
      await selectEl.selectOption({ label: categoryLabel });
    } else {
      await p.locator(`text="${categoryLabel}"`).first().click();
    }

    await p.waitForLoadState("networkidle");
    await p.waitForTimeout(500);
  }

  private async fillWorkInformation(data: ApplicationData) {
    const p = this.page!;
    const meta = data.work_metadata || {};

    // Title
    const titleField = p.locator('input[name="title"], #title, input[placeholder*="title" i]').first();
    if (await titleField.isVisible().catch(() => false)) {
      await titleField.fill(data.title || "");
    }

    // Description
    const descField = p.locator('textarea[name="description"], #description, textarea[placeholder*="description" i]').first();
    if (await descField.isVisible().catch(() => false)) {
      await descField.fill(data.description || "");
    }

    // Year of creation
    if (meta.year_of_creation) {
      const yearField = p.locator('input[name*="year"], #year, input[placeholder*="year" i]').first();
      if (await yearField.isVisible().catch(() => false)) {
        await yearField.fill(String(meta.year_of_creation));
      }
    }

    // Language
    if (meta.language) {
      const langField = p.locator('input[name*="language"], select[name*="language"]').first();
      if (await langField.isVisible().catch(() => false)) {
        const tagName = await langField.evaluate((el) => el.tagName.toLowerCase());
        if (tagName === "select") {
          await langField.selectOption({ label: meta.language as string }).catch(() =>
            langField.selectOption({ value: meta.language as string })
          );
        } else {
          await langField.fill(meta.language as string);
        }
      }
    }

    // Genre, num_pages, composer etc — fill any visible fields by iterating meta
    for (const [key, value] of Object.entries(meta)) {
      if (!value || key === "title" || key === "description") continue;
      const field = p.locator(`input[name*="${key}"], textarea[name*="${key}"]`).first();
      if (await field.isVisible().catch(() => false)) {
        await field.fill(String(value));
      }
    }

    // Click Next / Continue
    await this.clickNextButton();
  }

  private async fillApplicantDetails(profile: any) {
    if (!profile) return;
    const p = this.page!;

    const fieldMap: Record<string, string> = {
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      id_number: profile.id_number,
    };

    for (const [nameKey, value] of Object.entries(fieldMap)) {
      if (!value) continue;
      const field = p.locator(`input[name*="${nameKey}"]`).first();
      if (await field.isVisible().catch(() => false)) {
        await field.fill(value);
      }
    }

    await this.clickNextButton();
  }

  private async fillCoOwners(owners: any[]) {
    const p = this.page!;

    // Click "Add Co-Owner" for each additional owner
    for (let i = 0; i < owners.length; i++) {
      const addBtn = p.locator(
        'button:has-text("Add Owner"), button:has-text("Add Co-Author"), a:has-text("Add")'
      ).first();
      if (await addBtn.isVisible().catch(() => false)) {
        await addBtn.click();
        await p.waitForTimeout(500);
      }

      const owner = owners[i];
      const nameField = p.locator(`input[name*="owner_name_${i}"], input[name*="co_author_${i}"]`).first();
      if (await nameField.isVisible().catch(() => false)) {
        await nameField.fill(owner.full_name);
      }
    }

    await this.clickNextButton();
  }

  private async uploadDocuments(
    docs: Array<{ type: string; file_path: string; file_name: string; document_id: string }>
  ) {
    const p = this.page!;

    const TYPE_TO_INPUT: Record<string, string> = {
      WORK_FILE: 'input[type="file"][name*="work"], input[type="file"][name*="file"]',
      ID_DOCUMENT: 'input[type="file"][name*="id"], input[type="file"][name*="identity"]',
      DECLARATION_FORM: 'input[type="file"][name*="declar"], input[type="file"][name*="affidavit"]',
      SUPPORTING: 'input[type="file"][name*="support"], input[type="file"][name*="additional"]',
    };

    for (const doc of docs) {
      if (!fs.existsSync(doc.file_path)) {
        console.warn(`[KECOBO] Document not found on disk: ${doc.file_path}`);
        continue;
      }

      const selector = TYPE_TO_INPUT[doc.type] || 'input[type="file"]';
      const fileInput = p.locator(selector).first();

      if (await fileInput.isVisible().catch(() => false)) {
        await fileInput.setInputFiles(doc.file_path);
        await p.waitForTimeout(1000);
        console.log(`[KECOBO] Uploaded ${doc.document_id}: ${doc.file_name}`);
      } else {
        console.warn(`[KECOBO] No file input found for type ${doc.type}`);
      }
    }

    await this.clickNextButton();
  }

  private async reviewAndSubmit(title: string): Promise<string> {
    const p = this.page!;

    // Look for final submit button
    const submitBtn = p
      .locator(
        'button:has-text("Submit"), button:has-text("File"), input[type="submit"][value*="Submit" i]'
      )
      .first();

    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await p.waitForLoadState("networkidle", { timeout: 30000 });
    }

    // Extract reference number from confirmation page
    const reference = await this.extractReference(title);
    return reference;
  }

  private async extractReference(title: string): Promise<string> {
    const p = this.page!;

    // Try common patterns for reference numbers
    const patterns = [
      /NRR[\-\/]\d{4}[\-\/]\d+/i,
      /REF[\-:]\s*([A-Z0-9\-]+)/i,
      /Application\s+Number[\s:]+([A-Z0-9\-]+)/i,
      /Reference[\s:]+([A-Z0-9\-]+)/i,
    ];

    const pageText = await p.textContent("body");
    if (pageText) {
      for (const pattern of patterns) {
        const match = pageText.match(pattern);
        if (match) return match[0];
      }
    }

    // Fall back: look for prominent number near "reference" text
    const refEl = p.locator('[class*="reference"], [class*="ref-number"], [id*="reference"]').first();
    if (await refEl.isVisible().catch(() => false)) {
      const text = await refEl.textContent();
      if (text) return text.trim();
    }

    // Last resort: timestamp-based reference
    return `KIRKIRA-${Date.now()}`;
  }

  async checkApplicationStatus(kecoboReference: string, title: string): Promise<SyncResult> {
    const p = this.page!;

    try {
      // Navigate to search / my applications
      await p.click('a[href*="my-applications"], a:has-text("My Applications"), a:has-text("View Applications")');
      await p.waitForLoadState("networkidle");

      // Search by reference or title
      const searchField = p.locator('input[type="search"], input[name*="search"], input[placeholder*="search" i]').first();
      if (await searchField.isVisible().catch(() => false)) {
        await searchField.fill(kecoboReference || title);
        await p.keyboard.press("Enter");
        await p.waitForLoadState("networkidle");
      }

      // Find the application row
      const row = p.locator(`tr:has-text("${kecoboReference}"), tr:has-text("${title}")`).first();
      await this.screenshot(`sync_${kecoboReference.replace(/[^a-z0-9]/gi, "_")}`);

      if (!(await row.isVisible().catch(() => false))) {
        return { applicationId: "", kecoboReference, status: "unknown", rawStatus: "not found" };
      }

      // Extract status text
      const statusCell = row.locator("td:nth-child(4), .status, [class*='status']").first();
      const rawStatus = (await statusCell.textContent())?.trim() || "unknown";

      const status = this.normaliseStatus(rawStatus);

      let rejectionReason: string | undefined;
      let certificatePath: string | undefined;

      if (status === "rejected") {
        // Click on the row to get rejection reason
        await row.click();
        await p.waitForLoadState("networkidle");
        const reason = p.locator('[class*="rejection"], [class*="reason"], p:has-text("Reason")').first();
        if (await reason.isVisible().catch(() => false)) {
          rejectionReason = (await reason.textContent())?.trim();
        }
      }

      if (status === "approved") {
        certificatePath = await this.downloadCertificate(kecoboReference);
      }

      const screenshotPath = await this.screenshot(`sync_status_${kecoboReference.replace(/[^a-z0-9]/gi, "_")}`);

      return {
        applicationId: "",
        kecoboReference,
        status,
        rawStatus,
        rejectionReason,
        certificatePath,
        screenshotPath,
      };
    } catch (err: any) {
      console.error(`[KECOBO Sync] Error checking ${kecoboReference}: ${err.message}`);
      return { applicationId: "", kecoboReference, status: "unknown", rawStatus: err.message };
    }
  }

  private normaliseStatus(raw: string): SyncResult["status"] {
    const lower = raw.toLowerCase();
    if (lower.includes("approv") || lower.includes("complete")) return "approved";
    if (lower.includes("reject") || lower.includes("declin")) return "rejected";
    if (lower.includes("review") || lower.includes("process") || lower.includes("pending")) return "under_review";
    if (lower.includes("submit") || lower.includes("received")) return "submitted";
    return "unknown";
  }

  private async downloadCertificate(kecoboReference: string): Promise<string | undefined> {
    const p = this.page!;

    const certBtn = p.locator('a:has-text("Download Certificate"), a:has-text("Certificate"), button:has-text("Download")').first();
    if (!(await certBtn.isVisible().catch(() => false))) return undefined;

    const certDir = path.join(SCREENSHOT_DIR, "certificates");
    if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

    const [download] = await Promise.all([
      this.context!.waitForEvent("download"),
      certBtn.click(),
    ]);

    const savePath = path.join(certDir, `cert_${kecoboReference.replace(/[^a-z0-9]/gi, "_")}.pdf`);
    await download.saveAs(savePath);
    console.log(`[KECOBO] Certificate downloaded: ${savePath}`);
    return savePath;
  }

  private async clickNextButton() {
    const p = this.page!;
    const nextBtn = p
      .locator('button:has-text("Next"), button:has-text("Continue"), button:has-text("Proceed"), input[type="submit"]:not([value*="ubmit" i])')
      .first();
    if (await nextBtn.isVisible().catch(() => false)) {
      await nextBtn.click();
      await p.waitForLoadState("networkidle");
      await p.waitForTimeout(500);
    }
  }
}
