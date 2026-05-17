"use client";

import { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { inquiries } from "../lib/api";

interface Props {
  service: string;
  serviceLabel: string;
  onClose: () => void;
}

export function InquiryModal({ service, serviceLabel, onClose }: Props) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    description: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.description.trim()) e.description = "Please describe what you'd like to protect";
    else if (form.description.trim().length < 20) e.description = "Please add at least 20 characters";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await inquiries.submit({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        service,
        description: form.description.trim(),
        notes: form.notes.trim() || undefined,
      });
      setSubmitted(true);
    } catch {
      setErrors({ _: "Something went wrong. Please try again or email us directly." });
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 rounded-t-2xl px-6 pt-6 pb-4 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
              <Send className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{serviceLabel} Inquiry</h2>
          </div>
          <p className="text-sm text-gray-500">
            Fill in the form below and one of our IP lawyers will get in touch within 1 business day.
          </p>
        </div>

        {submitted ? (
          /* Success state */
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Inquiry Received!</h3>
            <p className="text-gray-500 text-sm mb-6">
              Thank you for reaching out. Our legal team will review your inquiry and contact you at{" "}
              <strong>{form.email}</strong> within 1 business day.
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-5 space-y-4">
            {errors._ && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {errors._}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  placeholder="Jane Kamau"
                  className={`input ${errors.full_name ? "border-red-300 ring-1 ring-red-300" : ""}`}
                />
                {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="jane@company.co.ke"
                  className={`input ${errors.email ? "border-red-300 ring-1 ring-red-300" : ""}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+254 7xx xxx xxx"
                  className="input"
                />
              </div>

              {/* Company */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company / Organisation <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Acme Ltd"
                  className="input"
                />
              </div>
            </div>

            {/* Service — read-only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <div className="input bg-gray-50 text-gray-600 cursor-default select-none">
                {serviceLabel}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What would you like to protect? <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe your invention, design, or brand — what it does, what makes it unique, and the level of protection you're looking for."
                className={`input resize-none ${errors.description ? "border-red-300 ring-1 ring-red-300" : ""}`}
              />
              <div className="flex justify-between items-start mt-1">
                {errors.description ? (
                  <p className="text-xs text-red-500">{errors.description}</p>
                ) : (
                  <span />
                )}
                <span className={`text-xs ${form.description.length < 20 ? "text-gray-400" : "text-green-500"}`}>
                  {form.description.length} / 20 min
                </span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Any other context — timeline, budget, prior art, etc."
                className="input resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send Inquiry"}
                {!submitting && <Send className="w-4 h-4 ml-1" />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
