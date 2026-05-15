import { ReactNode } from "react";
import { clsx } from "clsx";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

type AlertType = "info" | "success" | "warning" | "error";

const cfg: Record<AlertType, { wrap: string; icon: string; Icon: any }> = {
  info:    { wrap: "bg-blue-50 border-blue-200 text-blue-800",   icon: "text-blue-500",  Icon: Info },
  success: { wrap: "bg-green-50 border-green-200 text-green-800", icon: "text-green-500", Icon: CheckCircle },
  warning: { wrap: "bg-amber-50 border-amber-200 text-amber-800", icon: "text-amber-500", Icon: AlertTriangle },
  error:   { wrap: "bg-red-50 border-red-200 text-red-800",       icon: "text-red-500",   Icon: AlertCircle },
};

export function Alert({
  type = "info",
  children,
  onClose,
}: {
  type?: AlertType;
  children: ReactNode;
  onClose?: () => void;
}) {
  const { wrap, icon, Icon } = cfg[type];
  return (
    <div className={clsx("flex gap-3 p-4 rounded-xl border text-sm", wrap)}>
      <Icon className={clsx("w-5 h-5 flex-shrink-0 mt-0.5", icon)} />
      <div className="flex-1 leading-relaxed">{children}</div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
