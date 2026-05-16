"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { StatusBadge } from "../ui/StatusBadge";
import { ChevronLeft, FileText, User, Users, Layers, CheckCircle, Send } from "lucide-react";
import categoriesData from "../../data/categories.json";

const schema = categoriesData as any;

interface Props {
  application: any;
  onConfirm: () => Promise<void>;
  onBack: () => void;
}

export function Step6ReviewConfirm({ application, onConfirm, onBack }: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const category = schema.categories.find((c: any) => c.id === application.category_id);
  const subcategory = category?.subcategories?.find(
    (s: any) => s.id === application.subcategory_id
  );
  const profile = application.applicant_profile_snapshot || {};
  const owners: any[] = application.owners || [];
  const docs: any[] = application.documents || [];
  const meta = application.work_metadata || {};

  const handleSubmit = async () => {
    if (!confirmed) {
      setError("Please confirm that all information is correct before filing.");
      return;
    }
    setSubmitting(true);
    try {
      await onConfirm();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="bg-gray-50 rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-5 h-5 text-primary-700" />
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Row = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
      <div className="flex justify-between gap-4 text-sm">
        <span className="text-gray-500 flex-shrink-0">{label}</span>
        <span className="text-gray-900 text-right">{value}</span>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Review & Confirm</h2>
        <p className="text-gray-500 text-sm">
          Please review your application carefully before submitting to KECOBO.
        </p>
      </div>

      <Alert type="info">
        Once you confirm, a background job will file this application with KECOBO automatically.
        You will be redirected to your dashboard where you can track the status.
      </Alert>

      <div className="space-y-4">
        {/* Category */}
        <Section title="Work Classification" icon={Layers}>
          <Row label="Category" value={category?.label} />
          <Row label="Subcategory" value={subcategory?.label} />
          <Row label="Title" value={application.title} />
          <Row label="Description" value={application.description} />
        </Section>

        {/* Applicant Profile */}
        <Section title="Applicant Profile" icon={User}>
          <Row label="Name" value={profile.full_name} />
          <Row
            label="ID"
            value={profile.id_type === "passport" ? `Passport: ${profile.id_number}` : `National ID: ${profile.id_number}`}
          />
          <Row label="Email" value={profile.email} />
          <Row label="Phone" value={profile.phone} />
          <Row label="Address" value={`${profile.address}, ${profile.city}, ${profile.country}`} />
          {profile.is_corporate && (
            <Row label="Company" value={`${profile.company_name} (${profile.company_reg_number})`} />
          )}
        </Section>

        {/* Co-Owners */}
        {owners.length > 0 && (
          <Section title={`Co-Owners (${owners.length})`} icon={Users}>
            {owners.map((o: any, i: number) => (
              <div key={i} className="text-sm border-t border-gray-200 pt-2 mt-2 first:border-0 first:pt-0 first:mt-0">
                <p className="font-medium text-gray-900">{o.full_name} — {o.role}</p>
                {o.email && <p className="text-gray-500">{o.email}</p>}
                {o.ownership_share && <p className="text-gray-500">{o.ownership_share}% share</p>}
              </div>
            ))}
          </Section>
        )}

        {/* Work Metadata */}
        <Section title="Work Details" icon={FileText}>
          {Object.entries(meta).map(([k, v]) =>
            v !== null && v !== undefined && v !== "" ? (
              <Row
                key={k}
                label={k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                value={String(v)}
              />
            ) : null
          )}
        </Section>

        {/* Documents */}
        <Section title={`Documents (${docs.length})`} icon={FileText}>
          {docs.map((d: any) => (
            <div key={d.id} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">{d.label}</span>
              <span className="text-gray-400 ml-auto">{d.file_name}</span>
            </div>
          ))}
        </Section>
      </div>

      {/* Confirmation checkbox */}
      <label className="flex items-start gap-3 cursor-pointer p-4 bg-primary-50 rounded-xl border border-primary-200">
        <input
          type="checkbox"
          className="mt-0.5 accent-amber-600 w-4 h-4"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        <span className="text-sm text-primary-700 font-medium">
          I confirm that all information provided is accurate and complete. I authorise Kira to
          file this copyright application with KECOBO on my behalf.
        </span>
      </label>

      {error && <Alert type="error">{error}</Alert>}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button onClick={handleSubmit} loading={submitting} disabled={!confirmed}>
          <Send className="w-4 h-4" />
          Confirm & File Application
        </Button>
      </div>
    </div>
  );
}
