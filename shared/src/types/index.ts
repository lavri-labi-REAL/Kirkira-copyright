// ─── Application Status ──────────────────────────────────────────────────────

export enum ApplicationStatus {
  DRAFT = "draft",
  READY_FOR_FILING = "ready_for_filing",
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum DocumentType {
  WORK_FILE = "work_file",
  ID_DOCUMENT = "id_document",
  DECLARATION_FORM = "declaration_form",
  SUPPORTING = "supporting",
  CERTIFICATE = "certificate",
  SCREENSHOT = "screenshot",
}

// ─── LLM Classification ───────────────────────────────────────────────────────

export interface ClassificationResult {
  category_id: string;
  subcategory_id: string;
  confidence: number;
  explanation: string;
  is_uncertain: boolean;
}

// ─── Applicant Profile (Stammdaten) ──────────────────────────────────────────

export interface ApplicantProfile {
  full_name: string;
  id_number: string;
  id_type: "national_id" | "passport";
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  is_corporate: boolean;
  company_name?: string;
  company_reg_number?: string;
}

// ─── Owner / Co-Author ───────────────────────────────────────────────────────

export interface Owner {
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  ownership_share?: number;
  role: string;
  id_number?: string;
}

// ─── Work Metadata (category-specific fields) ─────────────────────────────────

export type WorkMetadata = Record<string, string | number | boolean | null>;

// ─── Application ─────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  user_id: string;
  status: ApplicationStatus;
  wizard_step: number;
  category_id: string | null;
  subcategory_id: string | null;
  llm_confidence: number | null;
  title: string | null;
  description: string | null;
  applicant_profile_snapshot: ApplicantProfile | null;
  owners: Owner[];
  work_metadata: WorkMetadata;
  kecobo_reference: string | null;
  kecobo_status: string | null;
  kecobo_last_checked_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  documents: ApplicationDocument[];
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  type: DocumentType;
  document_id: string;
  label: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

// ─── API DTOs ─────────────────────────────────────────────────────────────────

export interface CreateApplicationDto {
  title?: string;
  description?: string;
}

export interface UpdateApplicationDto {
  wizard_step?: number;
  category_id?: string;
  subcategory_id?: string;
  title?: string;
  description?: string;
  applicant_profile_snapshot?: ApplicantProfile;
  owners?: Owner[];
  work_metadata?: WorkMetadata;
}

export interface ClassifyWorkDto {
  description: string;
  file_mime_type?: string;
}

export interface ConfirmFilingDto {
  application_id: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

// ─── Status display helpers ───────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bgColor: string; description: string }
> = {
  [ApplicationStatus.DRAFT]: {
    label: "Draft",
    color: "#90A4AE",
    bgColor: "#ECEFF1",
    description: "Continue editing",
  },
  [ApplicationStatus.READY_FOR_FILING]: {
    label: "Ready for Filing",
    color: "#1A237E",
    bgColor: "#E8EAF6",
    description: "Queued for automation",
  },
  [ApplicationStatus.SUBMITTED]: {
    label: "Submitted",
    color: "#3949AB",
    bgColor: "#E8EAF6",
    description: "Filed with KECOBO",
  },
  [ApplicationStatus.UNDER_REVIEW]: {
    label: "Under Review",
    color: "#F57C00",
    bgColor: "#FFF3E0",
    description: "KECOBO is reviewing",
  },
  [ApplicationStatus.APPROVED]: {
    label: "Approved",
    color: "#2E7D32",
    bgColor: "#E8F5E9",
    description: "Certificate ready",
  },
  [ApplicationStatus.REJECTED]: {
    label: "Rejected",
    color: "#C62828",
    bgColor: "#FFEBEE",
    description: "Edit & resubmit",
  },
};
