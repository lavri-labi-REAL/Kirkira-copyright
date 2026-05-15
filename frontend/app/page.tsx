"use client";

import Link from "next/link";
import { AppShell } from "../components/layout/AppShell";
import { Shield, Zap, FileCheck, Search, ArrowRight, CheckCircle, Star } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    color: "bg-primary-50 text-primary",
    title: "Automated Classification",
    desc: "Describe your work in plain language. Our solution identifies the correct KECOBO category and subcategory in seconds.",
  },
  {
    icon: FileCheck,
    color: "bg-accent-50 text-accent-600",
    title: "Guided 6-Step Wizard",
    desc: "We tell you exactly what documents you need before you start. Progress is saved automatically after every step.",
  },
  {
    icon: Shield,
    color: "bg-success/10 text-success-dark",
    title: "Automated Filing",
    desc: "We file your application directly on the KECOBO/NRR portal using secure browser automation — no manual effort.",
  },
  {
    icon: Search,
    color: "bg-warning/10 text-warning-dark",
    title: "Nightly Status Sync",
    desc: "We check KECOBO every night and deliver your certificate the moment it's approved.",
  },
];

const CATEGORIES = [
  "Literary Works",
  "Musical Works",
  "Artistic Works",
  "Dramatic Works",
  "Audio-Visual Works",
  "Sound Recordings",
  "Broadcasts",
];

const STEPS = [
  { n: "01", title: "Describe Your Work", desc: "Type a short description. Our solution suggests the right category instantly." },
  { n: "02", title: "Preview Requirements", desc: "See the exact fields and documents required before you upload anything." },
  { n: "03", title: "Profile & Co-Owners", desc: "Your profile is pre-filled and snapshotted. Add any co-authors or joint owners." },
  { n: "04", title: "Work Details & Uploads", desc: "Fill category-specific fields and upload your documents securely." },
  { n: "05", title: "Review & Confirm", desc: "Read-only summary of everything before you authorise filing." },
  { n: "06", title: "Background Filing", desc: "We queue and automate the KECOBO submission. You're done instantly." },
];

export default function HomePage() {
  return (
    <AppShell>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-hero-gradient">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow orb */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/90 mb-8">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            Powered by Revolution Analytics Ltd
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Register Your Copyright
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-300">
              Without the Paperwork
            </span>
          </h1>

          <p className="text-indigo-200 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Kira guides you through KECOBO copyright filing in&nbsp;6 simple steps. Our solution
            classifies your work, our wizard captures the data, and our automation files directly
            with KECOBO on your behalf.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="btn btn-lg bg-white text-primary hover:bg-primary-50 shadow-lg shadow-black/20"
            >
              Start Filing Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="btn btn-lg bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20"
            >
              Sign In
            </Link>
          </div>

          {/* Trust bar */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
            {[
              "Kenya Copyright Act 2001",
              "KECOBO / NRR Portal",
              "All 6 Wizard Steps",
              "Automated Certificate Delivery",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2 text-indigo-300 text-sm">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-eyebrow">How it works</p>
            <h2 className="section-title">Four pillars that handle everything</h2>
            <p className="section-subtitle mx-auto">
              From classification to certificate — Kira automates every step of KECOBO filing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card-hover card-body flex flex-col gap-4 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${f.color} transition-transform duration-200 group-hover:scale-110`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7-Step Process ───────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-eyebrow">The wizard</p>
            <h2 className="section-title">6 steps. Fully guided. Auto-saved.</h2>
            <p className="section-subtitle mx-auto">
              Every step is designed to collect the minimum required information, with your
              progress saved automatically so you never lose work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className={`card card-body relative overflow-hidden ${i === 5 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <span className="absolute -top-3 -right-2 text-7xl font-black text-primary/5 select-none leading-none">
                  {s.n}
                </span>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mb-4">
                    {parseInt(s.n)}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-eyebrow">Coverage</p>
          <h2 className="section-title">All KECOBO copyright categories</h2>
          <p className="section-subtitle mx-auto mb-12">
            Under the Kenya Copyright Act No.&nbsp;12 of 2001 (as amended 2022). 27 subcategories,
            all supported.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-16">
            {CATEGORIES.map((cat, i) => (
              <span
                key={cat}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-colors ${
                  i === 0
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary/30 hover:bg-primary-50"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-hero-gradient rounded-3xl p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-accent/20 blur-[60px]" />
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Ready to protect your work?
              </h3>
              <p className="text-indigo-200 mb-8 text-lg">
                Create your free account and file your first copyright in minutes.
              </p>
              <Link
                href="/login"
                className="btn btn-lg bg-white text-primary hover:bg-primary-50 shadow-lg"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
