const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kira_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}/api/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const auth = {
  register: (email: string, password: string, full_name: string) =>
    request<{ access_token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name }),
    }),

  login: (email: string, password: string) =>
    request<{ access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<any>("/auth/me"),
};

// ─── Applications ─────────────────────────────────────────────────────────────

export const applications = {
  create: () => request<any>("/applications", { method: "POST" }),

  list: () => request<any[]>("/applications"),

  get: (id: string) => request<any>(`/applications/${id}`),

  update: (id: string, data: Record<string, any>) =>
    request<any>(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  confirmFiling: (id: string) =>
    request<any>(`/applications/${id}/confirm-filing`, { method: "POST" }),

  delete: (id: string) =>
    request<any>(`/applications/${id}`, { method: "DELETE" }),
};

// ─── LLM Classification ───────────────────────────────────────────────────────

export const classify = {
  work: (description: string) =>
    request<{
      category_id: string;
      subcategory_id: string;
      confidence: number;
      explanation: string;
      is_uncertain: boolean;
    }>("/classify", {
      method: "POST",
      body: JSON.stringify({ description }),
    }),
};

// ─── Categories ──────────────────────────────────────────────────────────────

export const categories = {
  all: () => request<any[]>("/categories"),
  schema: () => request<any>("/categories/schema"),
  get: (id: string) => request<any>(`/categories/${id}`),
  subcategory: (catId: string, subId: string) =>
    request<any>(`/categories/${catId}/subcategories/${subId}`),
};

// ─── Documents ────────────────────────────────────────────────────────────────

export const documents = {
  upload: async (
    applicationId: string,
    documentId: string,
    label: string,
    type: string,
    file: File
  ) => {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    form.append("document_id", documentId);
    form.append("label", label);
    form.append("type", type);

    const res = await fetch(`${BASE}/api/v1/applications/${applicationId}/documents`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(err.message || "Upload failed");
    }
    return res.json();
  },

  delete: (applicationId: string, documentId: string) =>
    request<any>(`/applications/${applicationId}/documents/${documentId}`, {
      method: "DELETE",
    }),
};
