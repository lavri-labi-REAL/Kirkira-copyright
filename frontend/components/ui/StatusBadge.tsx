import { clsx } from "clsx";

const STATUS: Record<string, { label: string; dot: string; badge: string }> = {
  DRAFT:            { label: "Draft",           dot: "bg-gray-400",   badge: "bg-gray-100 text-gray-600" },
  READY_FOR_FILING: { label: "Ready to File",   dot: "bg-primary-400", badge: "bg-primary-50 text-primary-700" },
  SUBMITTED:        { label: "Submitted",        dot: "bg-blue-500",   badge: "bg-blue-50 text-blue-700" },
  UNDER_REVIEW:     { label: "Under Review",     dot: "bg-amber-500",  badge: "bg-amber-50 text-amber-700" },
  APPROVED:         { label: "Approved",         dot: "bg-green-500",  badge: "bg-green-50 text-green-700" },
  REJECTED:         { label: "Rejected",         dot: "bg-red-500",    badge: "bg-red-50 text-red-700" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS.DRAFT;
  return (
    <span className={clsx("badge", s.badge)}>
      <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", s.dot)} />
      {s.label}
    </span>
  );
}
