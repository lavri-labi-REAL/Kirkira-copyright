"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, PlusCircle, LayoutDashboard } from "lucide-react";
import { clsx } from "clsx";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-nav border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center ring-1 ring-primary-200 group-hover:bg-primary-100 transition-colors">
              <Shield className="text-primary" style={{ width: 18, height: 18 }} />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              Kira
              <span className="text-primary font-light ml-0.5">©</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <NavLink href="/dashboard" active={pathname === "/dashboard"}>
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </NavLink>
            <NewFilingButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-primary-50 text-primary-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      )}
    >
      {children}
    </Link>
  );
}

function NewFilingButton() {
  const handleNew = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/applications`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      const app = await res.json();
      window.location.href = `/apply/${app.id}`;
    } catch {}
  };
  return (
    <button
      onClick={handleNew}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-600 transition-colors ml-1"
    >
      <PlusCircle className="w-4 h-4" />
      <span className="hidden sm:inline">New Filing</span>
    </button>
  );
}
