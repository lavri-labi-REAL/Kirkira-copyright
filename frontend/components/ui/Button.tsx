import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variantMap = {
  primary:   "btn-md btn-primary",
  secondary: "btn-md btn-secondary",
  ghost:     "btn-md btn-ghost",
  danger:    "btn-md btn-danger",
  accent:    "btn-md btn-accent",
};

const sizeMap = {
  sm: "!px-3 !py-1.5 !text-xs !rounded-lg",
  md: "",
  lg: "!px-7 !py-3.5 !text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(variantMap[variant], sizeMap[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      )}
      {children}
    </button>
  );
}
