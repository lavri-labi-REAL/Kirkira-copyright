"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/layout/AppShell";
import { Input } from "../../components/ui/Input";
import { Alert } from "../../components/ui/Alert";
import { useAuth } from "../../lib/auth-context";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (tab === "login") await login(email, password);
      else await register(email, password, fullName);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      {/* Split layout: left brand panel + right form */}
      <div className="min-h-[calc(100vh-8rem)] flex">

        {/* Left: brand panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "40px 40px" }}
          />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-[80px]" />

          <div className="relative">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center ring-1 ring-accent/30">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <span className="font-bold text-white text-xl tracking-tight">Kira Copyright</span>
            </div>
          </div>

          <div className="relative space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white leading-tight">
                Protect your creative work with KECOBO
              </h2>
              <p className="text-indigo-300 mt-3 text-lg leading-relaxed">
                AI-guided copyright registration. Automated filing. Certificate delivery to your dashboard.
              </p>
            </div>

            {[
              "AI classifies your work in seconds",
              "7-step wizard with auto-save",
              "Files directly with KECOBO/NRR portal",
              "Nightly status sync & certificate download",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <span className="text-indigo-200 text-sm">{f}</span>
              </div>
            ))}
          </div>

          <p className="relative text-indigo-500 text-xs">
            Under the Kenya Copyright Act No. 12 of 2001
          </p>
        </div>

        {/* Right: form panel */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <span className="font-bold text-gray-900">Kira Copyright</span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {tab === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {tab === "login"
                  ? "Sign in to manage your copyright filings."
                  : "Start filing your copyright with KECOBO today."}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-8 gap-1">
              {(["login", "register"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); }}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                    tab === t
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "register" && (
                <Input
                  label="Full Legal Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="As it appears on your ID"
                  autoComplete="name"
                />
              )}
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === "register" ? "Minimum 8 characters" : "Your password"}
                minLength={8}
                autoComplete={tab === "login" ? "current-password" : "new-password"}
              />

              {error && <Alert type="error">{error}</Alert>}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-lg btn-primary w-full mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : null}
                {tab === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
              By continuing you agree to our terms of service. Your data is used solely for
              KECOBO copyright filing purposes.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
