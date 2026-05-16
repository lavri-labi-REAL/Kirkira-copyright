"use client";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ChevronLeft, ChevronRight, FileText, FormInput, CheckCircle } from "lucide-react";
import categoriesData from "../../data/categories.json";

const schema = categoriesData as any;

interface Props {
  application: any;
  onNext: () => void;
  onBack: () => void;
}

export function Step2PreviewRequirements({ application, onNext, onBack }: Props) {
  const category = schema.categories.find((c: any) => c.id === application.category_id);
  const subcategory = category?.subcategories?.find((s: any) => s.id === application.subcategory_id);

  const commonFields = schema.common_fields.fields;
  const commonDocs = schema.common_documents.documents;
  const specificFields = subcategory?.specific_fields || [];
  const specificDocs = subcategory?.specific_documents || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">What You Will Need</h2>
        <p className="text-gray-500 text-sm">
          Based on your selection: <strong>{category?.label}</strong> →{" "}
          <strong>{subcategory?.label}</strong>
        </p>
      </div>

      {/* Registration fee note */}
      {schema.fees?.categories && (() => {
        const fee = schema.fees.categories.find((f: any) =>
          f.category.toLowerCase().includes(category?.label?.toLowerCase().split(" ")[0]?.toLowerCase())
        );
        if (fee) return (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 text-sm text-primary-700">
            <strong>Registration Fee:</strong> KES {fee.individual_kes.toLocaleString()} (individual) · KES {fee.corporate_kes.toLocaleString()} (corporate)
            <span className="block text-xs text-primary-400 mt-0.5">As per Copyright Regulations 2020, Second Schedule</span>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Required Fields */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <FormInput className="w-5 h-5 text-primary-700" />
            <h3 className="font-semibold text-gray-900">Required Information</h3>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Common Fields</p>
            {commonFields.map((f: any) => (
              <div key={f.id} className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 flex-shrink-0 ${f.required ? "text-green-500" : "text-gray-300"}`} />
                <span className="text-sm text-gray-700">{f.label}</span>
                {!f.required && <span className="text-xs text-gray-400">(if applicable)</span>}
              </div>
            ))}
            {specificFields.length > 0 && (
              <>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-3 mb-2">
                  Specific to {subcategory?.label}
                </p>
                {specificFields.map((f: any) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${f.required ? "text-[#00BCD4]" : "text-gray-300"}`} />
                    <span className="text-sm text-gray-700">{f.label}</span>
                    {!f.required && <span className="text-xs text-gray-400">(optional)</span>}
                  </div>
                ))}
              </>
            )}
          </div>
        </Card>

        {/* Required Documents */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary-700" />
            <h3 className="font-semibold text-gray-900">Required Documents</h3>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Always Required</p>
            {commonDocs.map((d: any) => (
              <div key={d.id} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{d.label}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 ml-6">{d.description}</p>
                <p className="text-xs text-gray-400 mt-0.5 ml-6">
                  Formats: {d.accepted_formats.join(", ")} · Max {d.max_size_mb}MB
                </p>
              </div>
            ))}
            {specificDocs.length > 0 && (
              <>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-3 mb-2">
                  Specific to {subcategory?.label}
                </p>
                {specificDocs.map((d: any) => (
                  <div key={d.id} className="border border-primary-100 rounded-lg p-3 bg-primary-50/40">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${d.required ? "text-[#00BCD4]" : "text-gray-300"}`} />
                      <span className="text-sm font-medium text-gray-900">{d.label}</span>
                      {!d.required && <span className="text-xs text-gray-400">(optional)</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 ml-6">
                      Formats: {d.accepted_formats.join(", ")} · Max {d.max_size_mb}MB
                    </p>
                    {d.note && <p className="text-xs text-amber-600 mt-0.5 ml-6">{d.note}</p>}
                  </div>
                ))}
              </>
            )}
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={onNext}>
          I'm Ready — Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
