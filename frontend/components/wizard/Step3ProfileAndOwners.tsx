"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Alert } from "../ui/Alert";
import { ChevronLeft, ChevronRight, Plus, Trash2, User, Users } from "lucide-react";

interface Owner {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  ownership_share: number | "";
  id_number: string;
}

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

const emptyOwner = (): Owner => ({
  full_name: "",
  email: "",
  phone: "",
  address: "",
  role: "co-author",
  ownership_share: "",
  id_number: "",
});

export function Step3ProfileAndOwners({ application, onUpdate, onNext, onBack }: Props) {
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

  const [hasCoOwners, setHasCoOwners] = useState<boolean | null>(
    application.owners?.length > 0 ? true : null
  );
  const [owners, setOwners] = useState<Owner[]>(
    application.owners?.length > 0 ? application.owners : []
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setP = (field: string, value: any) =>
    setProfile((p) => ({ ...p, [field]: value }));

  const addOwner = () => setOwners((prev) => [...prev, emptyOwner()]);
  const removeOwner = (idx: number) => setOwners((prev) => prev.filter((_, i) => i !== idx));
  const updateOwner = (idx: number, field: keyof Owner, value: any) =>
    setOwners((prev) => {
      const copy = [...prev];
      (copy[idx] as any)[field] = value;
      return copy;
    });

  const handleNext = async () => {
    const required = ["full_name", "id_number", "email", "phone", "address", "city"];
    const missing = required.filter((f) => !profile[f as keyof typeof profile]);
    if (missing.length) {
      setError(`Please complete: ${missing.join(", ")}`);
      return;
    }
    if (hasCoOwners === null) {
      setError("Please indicate whether there are additional co-owners.");
      return;
    }
    if (hasCoOwners) {
      const invalid = owners.find((o) => !o.full_name || !o.role);
      if (invalid || owners.length === 0) {
        setError("Each co-owner must have a full name and role.");
        return;
      }
    }
    setSaving(true);
    try {
      await onUpdate({
        applicant_profile_snapshot: profile,
        owners: hasCoOwners ? owners : [],
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
    <div className="space-y-8">
      {/* ── Profile section ── */}
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Confirm Your Profile</h2>
          <p className="text-gray-500 text-sm">
            This information will be captured in your copyright registration. A snapshot is saved and
            won't change if you later update your account.
          </p>
        </div>

        <div className="bg-[#E8EAF6] border border-indigo-200 rounded-lg p-3 flex items-center gap-2">
          <User className="w-5 h-5 text-[#1A237E] flex-shrink-0" />
          <span className="text-sm text-[#1A237E]">
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
                className="accent-[#1A237E]"
                checked={profile.is_corporate === opt.value}
                onChange={() => setP("is_corporate", opt.value)}
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>

        {profile.is_corporate && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-indigo-50 rounded-lg">
            <Input
              label="Company / Organisation Name"
              required
              value={profile.company_name}
              onChange={(e) => setP("company_name", e.target.value)}
            />
            <Input
              label="Company Registration Number"
              value={profile.company_reg_number}
              onChange={(e) => setP("company_reg_number", e.target.value)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Legal Name"
            required
            value={profile.full_name}
            onChange={(e) => setP("full_name", e.target.value)}
            placeholder="As it appears on your ID"
          />
          <div className="grid grid-cols-2 gap-2">
            <Select
              label="ID Type"
              required
              value={profile.id_type}
              onChange={(e) => setP("id_type", e.target.value)}
              options={[
                { value: "national_id", label: "National ID" },
                { value: "passport", label: "Passport" },
              ]}
            />
            <Input
              label="ID / Passport Number"
              required
              value={profile.id_number}
              onChange={(e) => setP("id_number", e.target.value)}
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            required
            value={profile.email}
            onChange={(e) => setP("email", e.target.value)}
          />
          <Input
            label="Phone Number"
            type="tel"
            required
            value={profile.phone}
            onChange={(e) => setP("phone", e.target.value)}
            placeholder="+254 ..."
          />
          <Input
            label="Physical Address"
            required
            value={profile.address}
            onChange={(e) => setP("address", e.target.value)}
          />
          <Input
            label="City / Town"
            required
            value={profile.city}
            onChange={(e) => setP("city", e.target.value)}
          />
          <Select
            label="Country"
            required
            value={profile.country}
            onChange={(e) => setP("country", e.target.value)}
            options={COUNTRIES}
          />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-gray-100" />

      {/* ── Co-owners section ── */}
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Additional Co-Owners</h2>
          <p className="text-gray-500 text-sm">
            Are there other people or organisations who own or co-created this work?
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          {[
            { value: false, label: "No — I am the sole owner" },
            { value: true, label: "Yes — add co-owners" },
          ].map((opt) => (
            <label
              key={String(opt.value)}
              className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border transition-colors ${
                hasCoOwners === opt.value
                  ? "border-[#1A237E] bg-[#E8EAF6] text-[#1A237E]"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={hasCoOwners === opt.value}
                onChange={() => {
                  setHasCoOwners(opt.value);
                  if (!opt.value) setOwners([]);
                  else if (owners.length === 0) setOwners([emptyOwner()]);
                }}
              />
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
        </div>

        {hasCoOwners && (
          <div className="space-y-4">
            {owners.map((owner, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Co-Owner {idx + 1}</h4>
                  <button
                    onClick={() => removeOwner(idx)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Full Name"
                    required
                    value={owner.full_name}
                    onChange={(e) => updateOwner(idx, "full_name", e.target.value)}
                  />
                  <Input
                    label="Role (e.g. co-author, producer)"
                    required
                    value={owner.role}
                    onChange={(e) => updateOwner(idx, "role", e.target.value)}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={owner.email}
                    onChange={(e) => updateOwner(idx, "email", e.target.value)}
                  />
                  <Input
                    label="Phone"
                    value={owner.phone}
                    onChange={(e) => updateOwner(idx, "phone", e.target.value)}
                  />
                  <Input
                    label="Address"
                    value={owner.address}
                    onChange={(e) => updateOwner(idx, "address", e.target.value)}
                  />
                  <Input
                    label="Ownership Share (%)"
                    type="number"
                    min={0}
                    max={100}
                    value={owner.ownership_share}
                    onChange={(e) =>
                      updateOwner(idx, "ownership_share", e.target.value ? Number(e.target.value) : "")
                    }
                    hint="Leave blank if shares are equal / undetermined"
                  />
                  <Input
                    label="ID / Passport Number"
                    value={owner.id_number}
                    onChange={(e) => updateOwner(idx, "id_number", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button variant="secondary" onClick={addOwner}>
              <Plus className="w-4 h-4" />
              Add Another Co-Owner
            </Button>
          </div>
        )}
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button onClick={handleNext} loading={saving}>
          Continue <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
