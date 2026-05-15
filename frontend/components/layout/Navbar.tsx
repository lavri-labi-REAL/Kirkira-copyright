"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import { Shield, LogOut, LayoutDashboard, PlusCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#1A237E] shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center ring-1 ring-accent/30 group-hover:bg-accent/30 transition-colors">
              <Shield className="w-4.5 h-4.5 text-accent" style={{ width: 18, height: 18 }} />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Kira
              <span className="text-accent font-light ml-0.5">©</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <NavLink href="/dashboard" active={pathname === "/dashboard"}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </NavLink>
                <NewFilingButton />
                <div className="w-px h-5 bg-white/20 mx-1" />
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((p) => !p)}
                    className="flex items-center gap-2 text-indigo-200 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                  >
                    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                      {user.full_name?.[0]?.toUpperCase()}
                    </div>
                    {user.full_name.split(" ")[0]}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-modal border border-gray-100 py-1 z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-900 truncate">{user.full_name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink href="/login" active={false}>Sign in</NavLink>
                <Link href="/login" className="btn btn-md btn-accent text-sm ml-1">
                  Get Started
                  <span className="text-white/70">→</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: just show avatar or sign-in */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <Link href="/dashboard" className="btn btn-sm bg-white/10 text-white border border-white/20">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="btn btn-sm btn-accent">Sign in</Link>
            )}
          </div>
        </div>
      </div>

      {/* Click-outside closer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}
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
          ? "bg-white/15 text-white"
          : "text-indigo-200 hover:text-white hover:bg-white/10"
      )}
    >
      {children}
    </Link>
  );
}

function NewFilingButton() {
  const handleNew = async () => {
    try {
      const token = localStorage.getItem("kira_token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/applications`,
        { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      const app = await res.json();
      window.location.href = `/apply/${app.id}`;
    } catch {}
  };
  return (
    <button
      onClick={handleNew}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
    >
      <PlusCircle className="w-4 h-4" />
      New Filing
    </button>
  );
}
