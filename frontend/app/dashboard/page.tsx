"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Alert } from "../../components/ui/Alert";
import { applications } from "../../lib/api";
import {
  Plus, FileText, Download, Edit, Clock,
  CheckCircle, Loader, AlertCircle, Eye, Trash2,
} from "lucide-react";

export default function Dashboard() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    applications.list()
      .then(setApps)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleNew = async () => {
    try {
      const app = await applications.create();
      window.location.href = `/apply/${app.id}`;
    } catch (e: any) { setError(e.message); }
  };

  const stats = [
    { label: "Total Filings", value: apps.length, color: "text-primary", bg: "bg-primary-50" },
    { label: "Approved",      value: apps.filter(a => a.status === "APPROVED").length,  color: "text-green-600", bg: "bg-green-50" },
    { label: "In Progress",   value: apps.filter(a => ["SUBMITTED","UNDER_REVIEW","READY_FOR_FILING"].includes(a.status)).length, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Drafts",        value: apps.filter(a => a.status === "DRAFT").length, color: "text-gray-500", bg: "bg-gray-100" },
  ];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Copyright Filings</h1>
            <p className="text-gray-400 text-sm mt-1">Track and manage your KECOBO applications</p>
          </div>
          <button onClick={handleNew} className="btn btn-md btn-primary">
            <Plus className="w-4 h-4" />
            New Filing
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="card card-body !py-5 text-center">
              <div className={`text-3xl font-extrabold ${s.color} mb-0.5`}>{s.value}</div>
              <div className="text-xs text-gray-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {error && <div className="mb-6"><Alert type="error" onClose={() => setError("")}>{error}</Alert></div>}

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="card card-body flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
              <FileText className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No filings yet</h3>
            <p className="text-gray-400 text-sm mb-7 max-w-sm">
              Start your first copyright application with our guided wizard — AI classifies
              your work automatically.
            </p>
            <button onClick={handleNew} className="btn btn-md btn-primary">
              <Plus className="w-4 h-4" /> Start a New Filing
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                {apps.length} filing{apps.length !== 1 ? "s" : ""}
              </p>
            </div>
            {apps.map((app) => (
              <AppCard key={app.id} app={app} onRefresh={() => applications.list().then(setApps)} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function AppCard({ app, onRefresh }: { app: any; onRefresh: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try {
      await applications.delete(app.id);
      onRefresh();
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const hasCert = app.documents?.some((d: any) => d.type === "CERTIFICATE");

  const iconBg: Record<string,string> = {
    DRAFT:            "bg-gray-100 text-gray-400",
    READY_FOR_FILING: "bg-primary-50 text-primary",
    SUBMITTED:        "bg-blue-50 text-blue-500",
    UNDER_REVIEW:     "bg-amber-50 text-amber-500",
    APPROVED:         "bg-green-50 text-green-500",
    REJECTED:         "bg-red-50 text-red-500",
  };
  const StatusIcon: Record<string,any> = {
    DRAFT:            FileText,
    READY_FOR_FILING: Loader,
    SUBMITTED:        Loader,
    UNDER_REVIEW:     Loader,
    APPROVED:         CheckCircle,
    REJECTED:         AlertCircle,
  };
  const Icon = StatusIcon[app.status] || FileText;

  return (
    <div className="card card-hover !p-0 overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-4">

        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg[app.status] || "bg-gray-100 text-gray-400"}`}>
          <Icon className={`w-5 h-5 ${app.status === "UNDER_REVIEW" || app.status === "SUBMITTED" || app.status === "READY_FOR_FILING" ? "animate-spin" : ""}`}
            style={["UNDER_REVIEW","SUBMITTED","READY_FOR_FILING"].includes(app.status) ? {} : {}} />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <p className="font-semibold text-gray-900 truncate">
              {app.title || <span className="text-gray-400 font-normal italic">Untitled application</span>}
            </p>
            <StatusBadge status={app.status} />
            {app.category_id && (
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                {app.subcategory_id || app.category_id}
              </span>
            )}
          </div>

          {app.rejection_reason && app.status === "REJECTED" && (
            <p className="text-xs text-red-500 mt-0.5 line-clamp-1">
              {app.rejection_reason}
            </p>
          )}

          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {new Date(app.updated_at).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
            </span>
            {app.kecobo_reference && (
              <span className="text-xs text-gray-400 font-mono">
                {app.kecobo_reference}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {app.status === "DRAFT" && (
            <button onClick={() => { window.location.href = `/apply/${app.id}`; }} className="btn btn-sm btn-primary">
              <Edit className="w-3.5 h-3.5" /> Continue
            </button>
          )}
          {app.status === "REJECTED" && (
            <button onClick={() => { window.location.href = `/apply/${app.id}`; }} className="btn btn-sm btn-secondary">
              <Edit className="w-3.5 h-3.5" /> Resubmit
            </button>
          )}
          {hasCert && (
            <button className="btn btn-sm bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
              <Download className="w-3.5 h-3.5" /> Certificate
            </button>
          )}
          {app.status === "DRAFT" && (
            confirmDelete ? (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn btn-sm bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {deleting ? "Deleting…" : "Confirm"}
              </button>
            ) : (
              <button
                onClick={handleDelete}
                className="btn btn-sm btn-ghost text-gray-400 hover:text-red-500 hover:bg-red-50 !px-2"
                title="Delete application"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )
          )}
          <Link href={`/applications/${app.id}`} className="btn btn-sm btn-ghost text-gray-400 hover:text-gray-600 !px-2">
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Progress bar for in-progress */}
      {["READY_FOR_FILING","SUBMITTED","UNDER_REVIEW"].includes(app.status) && (
        <div className="h-0.5 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: app.status === "READY_FOR_FILING" ? "30%" : app.status === "SUBMITTED" ? "60%" : "85%" }}
          />
        </div>
      )}
    </div>
  );
}
