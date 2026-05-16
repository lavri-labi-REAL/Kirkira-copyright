"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Alert } from "../ui/Alert";
import { DocumentUploader } from "./DocumentUploader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import categoriesData from "../../data/categories.json";

const schema = categoriesData as any;

interface Props {
  application: any;
  onUpdate: (data: any) => Promise<void>;
  onNext: () => void;
  onBack: () => void;
}

export function Step5WorkDetails({ application, onUpdate, onNext, onBack }: Props) {
  const category = schema.categories.find((c: any) => c.id === application.category_id);
  const subcategory = category?.subcategories?.find(
    (s: any) => s.id === application.subcategory_id
  );

  const commonFields = schema.common_fields.fields;
  const specificFields = subcategory?.specific_fields || [];
  const allDocuments = [
    ...schema.common_documents.documents,
    ...(subcategory?.specific_documents || []),
  ];

  const [metadata, setMetadata] = useState<Record<string, any>>({
    title: application.title || "",
    ...application.work_metadata,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = (id: string, value: any) =>
    setMetadata((prev) => ({ ...prev, [id]: value }));

  const renderField = (field: any) => {
    const value = metadata[field.id] ?? "";
    const onChange = (e: any) => setField(field.id, e.target.value);

    if (field.type === "select") {
      return (
        <Select
          key={field.id}
          label={field.label}
          required={field.required}
          value={value}
          onChange={onChange}
          placeholder="Select..."
          options={field.options?.map((o: string) => ({ value: o, label: o })) || []}
        />
      );
    }
    if (field.type === "boolean") {
      return (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <div className="flex gap-4">
            {["Yes", "No"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="accent-amber-600"
                  checked={metadata[field.id] === (opt === "Yes")}
                  onChange={() => setField(field.id, opt === "Yes")}
                />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }
    return (
      <Input
        key={field.id}
        label={field.label}
        required={field.required}
        type={field.type === "integer" ? "number" : field.type === "year" ? "number" : "text"}
        value={value}
        onChange={onChange}
        placeholder={field.id === "year_of_creation" ? "e.g. 2024" : undefined}
        min={field.type === "year" ? 1900 : undefined}
        max={field.type === "year" ? new Date().getFullYear() : undefined}
      />
    );
  };

  const handleNext = async () => {
    const requiredFields = [
      ...commonFields.filter((f: any) => f.required),
      ...specificFields.filter((f: any) => f.required),
    ];
    const missing = requiredFields.filter(
      (f: any) =>
        !metadata[f.id] && metadata[f.id] !== false && metadata[f.id] !== 0
    );
    if (missing.length) {
      setError(`Please complete required fields: ${missing.map((f: any) => f.label).join(", ")}`);
      return;
    }
    setSaving(true);
    const { title, ...rest } = metadata;
    try {
      await onUpdate({ title, work_metadata: rest, wizard_step: 6 });
      onNext();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Work Details & Documents</h2>
        <p className="text-gray-500 text-sm">
          Category: <strong>{category?.label}</strong> → <strong>{subcategory?.label}</strong>
        </p>
      </div>

      {/* Common fields */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          General Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Title of Work"
              required
              value={metadata.title || ""}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="The official title of your work"
            />
          </div>
          {commonFields
            .filter((f: any) => f.id !== "title")
            .map(renderField)}
        </div>
      </div>

      {/* Specific fields */}
      {specificFields.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            {subcategory?.label} — Specific Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {specificFields.map(renderField)}
          </div>
        </div>
      )}

      {/* Document uploads */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Upload Documents
        </h3>
        <div className="space-y-4">
          {allDocuments.map((doc: any) => (
            <DocumentUploader
              key={doc.id}
              applicationId={application.id}
              document={doc}
              existingDocs={application.documents}
            />
          ))}
        </div>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button onClick={handleNext} loading={saving}>
          Review Application <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
