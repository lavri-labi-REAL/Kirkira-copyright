"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Alert } from "../ui/Alert";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

interface Props {
  application: any;
  onUpdate: (data: any) => Promise<void>;
  onNext: () => void;
  onBack: () => void;
}

const COUNTRIES = [
  { value: "KE", label: "Kenya" },
  { value: "UG", label: "Uganda" },
  { value: "TZ", label: "Tanzania" },
  { value: "RW", label: "Rwanda" },
  { value: "ET", label: "Ethiopia" },
  { value: "OTHER", label: "Other" },
];

export function Step3ConfirmProfile({ application, onUpdate, onNext, onBack }: Props) {
  const existing = application.applicant_profile_snapshot || {};

  const [profile, setProfile] = useState({
    full_name: existing.full_name || "",
    id_number: existing.id_number || "",
    id_type: existing.id_type || "national_id",
    email: existing.email || "",
    phone: existing.phone || "",
    address: existing.address || "",
    city: existing.city || "",
    country: existing.country || "KE",
    is_corporate: existing.is_corporate || false,
    company_name: existing.company_name || "",
    company_reg_number: existing.company_reg_number || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: any) =>
    setProfile((p) => ({ ...p, [field]: value }));

  const handleNext = async () => {
    const required = ["full_name", "id_number", "email", "phone", "address", "city"];
    const missing = required.filter((f) => !profile[f as keyof typeof profile]);
    if (missing.length) {
      setError(`Please complete: ${missing.join(", ")}`);
      return;
    }
    setSaving(true);
    try {
      await onUpdate({
        applicant_profile_snapshot: profile,
        wizard_step: 4,
      });
      onNext();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Confirm Your Profile</h2>
        <p className="text-gray-500 text-sm">
          This information will be captured in your copyright registration. A snapshot is saved and
          won't change if you later update your account.
        </p>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 flex items-center gap-2">
        <User className="w-5 h-5 text-primary-700" />
        <span className="text-sm text-primary-700">
          Review and complete your details below. All fields marked * are required.
        </span>
      </div>

      {/* Applicant type */}
      <div className="flex gap-4">
        {[
          { value: false, label: "Individual" },
          { value: true, label: "Corporate / Organisation" },
        ].map((opt) => (
          <label key={String(opt.value)} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              className="accent-amber-600"
              checked={profile.is_corporate === opt.value}
              onChange={() => set("is_corporate", opt.value)}
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>

      {profile.is_corporate && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-primary-50 rounded-lg">
          <Input
            label="Company / Organisation Name"
            required
            value={profile.company_name}
            onChange={(e) => set("company_name", e.target.value)}
          />
          <Input
            label="Company Registration Number"
            value={profile.company_reg_number}
            onChange={(e) => set("company_reg_number", e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Legal Name"
          required
          value={profile.full_name}
          onChange={(e) => set("full_name", e.target.value)}
          placeholder="As it appears on your ID"
        />
        <div className="grid grid-cols-2 gap-2">
          <Select
            label="ID Type"
            required
            value={profile.id_type}
            onChange={(e) => set("id_type", e.target.value)}
            options={[
              { value: "national_id", label: "National ID" },
              { value: "passport", label: "Passport" },
            ]}
          />
          <Input
            label="ID / Passport Number"
            required
            value={profile.id_number}
            onChange={(e) => set("id_number", e.target.value)}
          />
        </div>
        <Input
          label="Email Address"
          type="email"
          required
          value={profile.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <Input
          label="Phone Number"
          type="tel"
          required
          value={profile.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+254 ..."
        />
        <Input
          label="Physical Address"
          required
          value={profile.address}
          onChange={(e) => set("address", e.target.value)}
        />
        <Input
          label="City / Town"
          required
          value={profile.city}
          onChange={(e) => set("city", e.target.value)}
        />
        <Select
          label="Country"
          required
          value={profile.country}
          onChange={(e) => set("country", e.target.value)}
          options={COUNTRIES}
        />
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button onClick={handleNext} loading={saving}>
          Confirm & Continue <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
