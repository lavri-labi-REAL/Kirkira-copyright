"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "../../../components/layout/AppShell";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { Alert } from "../../../components/ui/Alert";
import { applications } from "../../../lib/api";
import { ArrowLeft, Download, Edit, FileText, User, Users, Tag, History } from "lucide-react";
import categoriesData from "../../../data/categories.json";

const schema = categoriesData as any;

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("kira_token");
    if (!token) { router.push("/login"); return; }
    applications.get(id)
      .then(setApp)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    </AppShell>
  );

  if (!app) return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Alert type="error">{error || "Application not found"}</Alert>
      </div>
    </AppShell>
  );

  const category = schema.categories.find((c: any) => c.id === app.category_id);
  const subcategory = category?.subcategories?.find((s: any) => s.id === app.subcategory_id);
  const profile = app.applicant_profile_snapshot || {};
  const owners: any[] = app.owners || [];
  const docs: any[] = app.documents || [];
  const auditLogs: any[] = app.audit_logs || [];
  const certificate = docs.find((d: any) => d.type === "CERTIFICATE");

  const Section = ({ title, icon: Icon, children }: any) => (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-[#1A237E]" />
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </Card>
  );

  const Row = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
      <div className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-0 text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-900 text-right">{value}</span>
      </div>
    ) : null;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{app.title || "Untitled"}</h1>
              <StatusBadge status={app.status} />
            </div>
            {app.kecobo_reference && (
              <p className="text-sm text-gray-400 mt-0.5">KECOBO Ref: {app.kecobo_reference}</p>
            )}
          </div>
          <div className="flex gap-2">
            {certificate && (
              <a href={`/api/v1/applications/${app.id}/documents/${certificate.id}/download`} download>
                <Button size="sm">
                  <Download className="w-4 h-4" /> Certificate
                </Button>
              </a>
            )}
            {(app.status === "DRAFT" || app.status === "REJECTED") && (
              <Link href={`/apply/${app.id}`}>
                <Button size="sm" variant="secondary">
                  <Edit className="w-4 h-4" />
                  {app.status === "REJECTED" ? "Edit & Resubmit" : "Continue"}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {app.status === "REJECTED" && app.rejection_reason && (
          <Alert type="error">
            <strong>Rejection Reason:</strong> {app.rejection_reason}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title="Work Classification" icon={Tag}>
            <Row label="Category" value={category?.label} />
            <Row label="Subcategory" value={subcategory?.label} />
            <Row label="Title" value={app.title} />
            <Row label="Description" value={app.description} />
            {app.llm_confidence && (
              <Row label="AI Confidence" value={`${Math.round(app.llm_confidence * 100)}%`} />
            )}
          </Section>

          <Section title="Applicant Profile" icon={User}>
            <Row label="Name" value={profile.full_name} />
            <Row label="ID" value={`${profile.id_type === "passport" ? "Passport" : "National ID"}: ${profile.id_number}`} />
            <Row label="Email" value={profile.email} />
            <Row label="Phone" value={profile.phone} />
            <Row label="Address" value={`${profile.address}, ${profile.city}`} />
            <Row label="Country" value={profile.country} />
            {profile.is_corporate && <Row label="Company" value={profile.company_name} />}
          </Section>
        </div>

        {owners.length > 0 && (
          <Section title={`Co-Owners (${owners.length})`} icon={Users}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {owners.map((o: any, i: number) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="font-medium text-gray-900">{o.full_name}</p>
                  <p className="text-gray-500">{o.role}</p>
                  {o.email && <p className="text-gray-400">{o.email}</p>}
                  {o.ownership_share && <p className="text-gray-400">{o.ownership_share}% share</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title={`Documents (${docs.length})`} icon={FileText}>
          <div className="space-y-2">
            {docs.map((d: any) => (
              <div key={d.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <FileText className={`w-4 h-4 flex-shrink-0 ${d.type === "CERTIFICATE" ? "text-green-500" : "text-gray-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{d.label}</p>
                  <p className="text-xs text-gray-400">{d.file_name}</p>
                </div>
                {d.type === "CERTIFICATE" && (
                  <a href={`/api/v1/applications/${app.id}/documents/${d.id}/download`} download>
                    <Button size="sm" variant="secondary">
                      <Download className="w-3.5 h-3.5" /> Download
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Audit Log */}
        {auditLogs.length > 0 && (
          <Section title="Status History" icon={History}>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
              <div className="space-y-4">
                {auditLogs.map((log: any, i: number) => (
                  <div key={log.id} className="flex gap-4 pl-10 relative">
                    <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-[#1A237E] ring-2 ring-white" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {log.from_status ? `${log.from_status} → ` : ""}{log.to_status}
                      </p>
                      {log.note && <p className="text-xs text-gray-500 mt-0.5">{log.note}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(log.created_at).toLocaleString()} · by {log.triggered_by}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}
      </div>
    </AppShell>
  );
}
