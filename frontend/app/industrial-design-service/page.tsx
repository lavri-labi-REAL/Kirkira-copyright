"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { InquiryModal } from "../../components/InquiryModal";
import {
  FlaskConical, CheckCircle, ArrowRight, ChevronLeft, MessageSquare,
  Box, Layers, Palette, Monitor, XCircle,
} from "lucide-react";

const WHAT_QUALIFIES = [
  { icon: Box, label: "3D Product Features", desc: "Shape, configuration, and surface texture of physical products." },
  { icon: Palette, label: "2D Surface Patterns", desc: "Lines, colours, patterns, and ornamental features applied to products." },
  { icon: Layers, label: "Packaging & Containers", desc: "Distinctive bottle shapes, packaging structures, and product containers." },
  { icon: Monitor, label: "Screen Designs", desc: "UI layouts, icons, and graphical interfaces in some categories." },
];

const WHAT_DOESNT_QUALIFY = [
  "Features dictated purely by technical function",
  "Features required to connect to another product (must-fit exclusions)",
  "Designs contrary to public policy or morality",
  "Designs that are not new or original",
];

const BENEFITS = [
  "Exclusive right to use the design commercially in Kenya",
  "Prevents competitors from copying your product's visual identity",
  "Can be licensed to generate additional revenue streams",
  "Strengthens your brand's overall visual IP portfolio",
  "Adds tangible legal value to your product development investment",
  "Renewable protection for up to 15 years",
];

const PROCESS = [
  { n: "01", title: "Design Assessment", desc: "Our lawyers review your design for novelty, distinctiveness, and registrability under the Kenya Industrial Property Act." },
  { n: "02", title: "Drawing Preparation", desc: "Professional design drawings are prepared to KIPI's technical standards — covering all views required for a complete application." },
  { n: "03", title: "Application Filing", desc: "We file your application directly with the Kenya Industrial Property Institute, securing your priority filing date." },
  { n: "04", title: "Examination", desc: "KIPI examines your application for novelty and compliance. Our lawyers handle any examination reports or objections." },
  { n: "05", title: "Registration & Certificate", desc: "Once approved, KIPI issues your Certificate of Registration, giving you enforceable rights across Kenya." },
];

const FACTS = [
  { value: "15 yrs", label: "Maximum protection (3 × 5 yr terms)" },
  { value: "KIPI", label: "Registering authority" },
  { value: "ARIPO", label: "Regional extension available" },
  { value: "1 day", label: "Lawyer response time" },
];

export default function IndustrialDesignServicePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <AppShell>
      {showModal && (
        <InquiryModal service="industrial-design" serviceLabel="Industrial Design Registration" onClose={() => setShowModal(false)} />
      )}

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
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">Industrial Design Registration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Protect the Look That Sets<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Your Product Apart</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mb-8 leading-relaxed">
            Great product design is a competitive advantage — but only if it's protected. KIRA's IP lawyers handle your industrial design registration with KIPI, from drawings to certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => setShowModal(true)} className="btn btn-lg btn-primary">
              <MessageSquare className="w-5 h-5" /> Get in Touch
            </button>
            <a href="#process" className="btn btn-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── What is Industrial Design ─────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-eyebrow mb-2">What Is an Industrial Design?</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Legal protection for your product's visual identity</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              An industrial design protects the <strong>visual appearance</strong> of a product — its shape, configuration, pattern, or ornament — that gives it a distinctive and appealing look. Under the <strong>Kenya Industrial Property Act (2001)</strong>, a registered industrial design right prevents competitors from copying the visual features of your product.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Unlike a patent (which protects how something works), an industrial design protects <em>how something looks</em>. If your product's appearance is part of your brand identity, design registration is your most effective line of defence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHAT_QUALIFIES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="card card-body">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{item.label}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Does & Doesn't ───────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-amber-50 border border-primary/10 p-8">
            <h3 className="font-bold text-gray-900 text-lg mb-5">What Can Be Protected</h3>
            <ul className="space-y-3">
              {BENEFITS.slice(0, 4).map((b) => (
                <li key={b} className="flex gap-3 items-start text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8">
            <h3 className="font-bold text-gray-900 text-lg mb-5">What Cannot Be Protected</h3>
            <ul className="space-y-3">
              {WHAT_DOESNT_QUALIFY.map((b) => (
                <li key={b} className="flex gap-3 items-start text-sm text-gray-500">
                  <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-2">Why Register?</p>
            <h2 className="text-3xl font-bold text-gray-900">6 Reasons to Protect Your Design</h2>
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
            <h2 className="text-3xl font-bold text-gray-900">From Drawings to Certificate</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Our lawyers manage every step — you simply brief us on your design.</p>
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
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {FACTS.map((f) => (
            <div key={f.label}>
              <div className="text-3xl font-extrabold text-white mb-1">{f.value}</div>
              <div className="text-sm text-orange-100">{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to protect your design?</h2>
          <p className="text-gray-500 mb-8">Fill in a short form and one of our IP lawyers will get in touch within 1 business day to assess your design and outline the path to registration.</p>
          <button onClick={() => setShowModal(true)} className="btn btn-lg btn-primary mx-auto">
            <MessageSquare className="w-5 h-5" /> Get in Touch with a Lawyer
          </button>
        </div>
      </section>
    </AppShell>
  );
}
