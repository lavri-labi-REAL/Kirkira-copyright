"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Alert } from "../ui/Alert";
import { ChevronLeft, ChevronRight, Plus, Trash2, Users } from "lucide-react";

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

const emptyOwner = (): Owner => ({
  full_name: "",
  email: "",
  phone: "",
  address: "",
  role: "co-author",
  ownership_share: "",
  id_number: "",
});

export function Step4AdditionalOwners({ application, onUpdate, onNext, onBack }: Props) {
  const [hasCoOwners, setHasCoOwners] = useState(
    application.owners?.length > 0 ? true : null
  );
  const [owners, setOwners] = useState<Owner[]>(
    application.owners?.length > 0 ? application.owners : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addOwner = () => setOwners((prev) => [...prev, emptyOwner()]);

  const removeOwner = (idx: number) =>
    setOwners((prev) => prev.filter((_, i) => i !== idx));

  const updateOwner = (idx: number, field: keyof Owner, value: any) =>
    setOwners((prev) => {
      const copy = [...prev];
      (copy[idx] as any)[field] = value;
      return copy;
    });

  const handleNext = async () => {
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
        owners: hasCoOwners ? owners : [],
        wizard_step: 5,
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
        <h2 className="text-xl font-bold text-gray-900 mb-1">Additional Co-Owners</h2>
        <p className="text-gray-500 text-sm">
          Are there other people or organisations who own or co-created this work?
        </p>
      </div>

      <div className="flex gap-4">
        {[
          { value: false, label: "No — I am the sole owner" },
          { value: true, label: "Yes — add co-owners" },
        ].map((opt) => (
          <label
            key={String(opt.value)}
            className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border transition-colors ${
              hasCoOwners === opt.value
                ? "border-primary bg-primary-50 text-primary-700"
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
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-5 space-y-4 relative"
            >
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
