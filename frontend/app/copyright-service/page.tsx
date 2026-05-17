"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import {
  Pen, CheckCircle, ArrowRight, ChevronLeft,
  Music, BookOpen, Film, Mic, Radio, Image, Layers,
} from "lucide-react";

const CATEGORIES = [
  { icon: BookOpen, label: "Literary Works", examples: "Novels, poetry, essays, software code, databases" },
  { icon: Music, label: "Musical Works", examples: "Compositions, lyrics, scores — with or without words" },
  { icon: Image, label: "Artistic Works", examples: "Paintings, drawings, sculptures, photographs, maps" },
  { icon: Film, label: "Audiovisual Works", examples: "Films, documentaries, animations, TV productions" },
  { icon: Mic, label: "Sound Recordings", examples: "Albums, singles, podcasts, spoken-word recordings" },
  { icon: Radio, label: "Broadcasts", examples: "Radio and television broadcasts, cable programmes" },
  { icon: Layers, label: "Published Editions", examples: "Typographical arrangements of published works" },
];

const BENEFITS = [
  "Legal presumption of ownership — you hold the burden of proof in any dispute",
  "Required for court enforcement and litigation in Kenya",
  "Enables commercial licensing, royalties, and publishing deals",
  "Protects against plagiarism, piracy, and unauthorised use",
  "Official certificate with date of creation as legal evidence",
  "Heirs inherit protection for 50 years after your death",
];

const PROCESS = [
  { n: "01", title: "Describe Your Work", desc: "Tell our system about your creative work — what it is, what it contains, and how it was created. No technical knowledge required." },
  { n: "02", title: "Automated Classification", desc: "Our system analyses your description and suggests the correct legal category under the Kenya Copyright Act — saving you the complexity of legal research." },
  { n: "03", title: "Complete Your Application", desc: "Upload supporting documents, provide applicant and co-owner details, and confirm your work metadata through our guided wizard." },
  { n: "04", title: "We File with KECOBO", desc: "Your application is filed directly on the KECOBO National Rights Registry (NRR) portal on your behalf — no queues, no paperwork." },
  { n: "05", title: "Receive Your Certificate", desc: "Track your application status in real time. Your copyright certificate is delivered to your dashboard the moment KECOBO issues it." },
];

const FACTS = [
  { value: "Life +50", label: "Protection for literary, musical & artistic works" },
  { value: "50 yrs", label: "Protection for sound recordings & broadcasts" },
  { value: "7", label: "KECOBO copyright categories" },
  { value: "100%", label: "Automated NRR portal filing" },
];

export default function CopyrightServicePage() {
  const [starting, setStarting] = useState(false);

  async function startFiling() {
    if (starting) return;
    setStarting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/applications`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      const app = await res.json();
      window.location.href = `/apply/${app.id}`;
    } catch {
      setStarting(false);
    }
  }

  return (
    <AppShell>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='13' y='26' font-size='18' font-weight='300' fill='%23F59E0B' opacity='0.2' font-family='sans-serif'%3E%2B%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-8">
            <ChevronLeft className="w-4 h-4" /> Back to Services
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Pen className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">Copyright Registration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Secure Your Creative Legacy<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">With Official KECOBO Registration</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mb-8 leading-relaxed">
            Copyright in Kenya arises automatically — but registration with KECOBO is what gives you legal teeth. KIRA's automated filing system takes you from description to official certificate with zero paperwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={startFiling} disabled={starting} className="btn btn-lg btn-primary">
              {starting ? "Starting…" : "Start Filing Now"} <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#process" className="btn btn-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── What is Copyright ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-eyebrow mb-2">What Is Copyright?</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your creative work, legally yours</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Copyright is the legal right that protects original creative works — giving the creator exclusive control over how their work is reproduced, distributed, performed, and adapted. Under the <strong>Kenya Copyright Act (Cap. 130, 2001 as amended 2022)</strong>, copyright arises automatically the moment an original work is created.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              However, <em>formal registration with KECOBO</em> provides a legal presumption of ownership and is essential when enforcing your rights in court, licensing your work commercially, or proving your authorship date.
            </p>
            <p className="text-gray-600 leading-relaxed">
              KIRA handles the entire registration process directly on the KECOBO National Rights Registry — so you can focus on creating, not filing.
            </p>
          </div>
          <div className="bg-primary rounded-2xl p-8 text-white">
            <h3 className="text-lg font-bold mb-2">Copyright vs. Registration</h3>
            <p className="text-orange-100 text-sm mb-6">Understanding the difference is critical.</p>
            <div className="space-y-4">
              {[
                { label: "Automatic copyright", desc: "Exists from the moment of creation. No paperwork needed." },
                { label: "KECOBO registration", desc: "Creates a public record, legal presumption of ownership, and a dated certificate — essential for enforcement." },
                { label: "Without registration", desc: "You may struggle to prove authorship in court and cannot efficiently license your work commercially." },
              ].map((r) => (
                <div key={r.label} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-white/70 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold text-sm">{r.label}: </span>
                    <span className="text-orange-100 text-sm">{r.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7 Categories ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-2">Protected Works</p>
            <h2 className="text-3xl font-bold text-gray-900">All 7 KECOBO Copyright Categories</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">KIRA covers every category of work registrable under the Kenya Copyright Act.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.label} className="flex gap-4 p-5 rounded-2xl bg-amber-50 border border-primary/10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.label}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{cat.examples}</p>
                  </div>
                </div>
              );
            })}
            <div className="flex gap-4 p-5 rounded-2xl bg-primary border border-primary/10 lg:col-span-1">
              <div className="flex items-center justify-center w-full">
                <div className="text-center">
                  <p className="text-white font-bold text-lg mb-1">Not sure which applies?</p>
                  <p className="text-orange-100 text-sm mb-4">Our automated classifier will suggest the correct category when you describe your work.</p>
                  <button onClick={startFiling} disabled={starting} className="btn bg-white text-primary hover:bg-primary-50 text-sm">
                    {starting ? "Starting…" : "Try it now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-2">Why Register?</p>
            <h2 className="text-3xl font-bold text-gray-900">6 Reasons to Register with KECOBO Today</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-gray-100 shadow-card">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section id="process" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-2">Our Process</p>
            <h2 className="text-3xl font-bold text-gray-900">From Description to Certificate</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Fully automated. No paperwork, no queues, no guesswork.</p>
          </div>
          <div className="space-y-4">
            {PROCESS.map((step, i) => (
              <div key={step.n} className="flex gap-5 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Facts Strip ──────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-primary">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {FACTS.map((f) => (
            <div key={f.label}>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{f.value}</div>
              <div className="text-xs sm:text-sm text-orange-100">{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to register your copyright?</h2>
          <p className="text-gray-500 mb-8">Start our guided wizard and we'll have your application filed with KECOBO — usually in under 15 minutes.</p>
          <button onClick={startFiling} disabled={starting} className="btn btn-lg btn-primary mx-auto">
            {starting ? "Starting…" : "Start Filing Now"} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </AppShell>
  );
}
