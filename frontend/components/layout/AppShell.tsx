"use client";

import { ReactNode } from "react";
import { AuthProvider } from "../../lib/auth-context";
import { Navbar } from "./Navbar";
import Link from "next/link";
import { Shield } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-bold text-white text-sm">Kira Copyright</span>
              </div>
              <div className="flex flex-wrap gap-6 text-xs text-gray-500">
                <span>KECOBO Copyright Filing System</span>
                <span>Kenya Copyright Act No. 12 of 2001</span>
                <Link href="https://nrr.copyright.go.ke" target="_blank" className="hover:text-white transition-colors">
                  NRR Portal ↗
                </Link>
              </div>
              <p className="text-xs text-gray-600">
                © {new Date().getFullYear()} Kira · All rights reserved
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
