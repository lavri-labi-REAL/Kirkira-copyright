"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "../components/layout/AppShell";
import { InquiryModal } from "../components/InquiryModal";
import {
  ArrowRight, CheckCircle, Shield, Pen, Lightbulb, FlaskConical,
  Star, MessageSquare,
} from "lucide-react";

type ServiceId = "trademark" | "copyright" | "industrial-design" | "patent";

interface Service {
  id: ServiceId;
  icon: React.ElementType;
  label: string;
  tagline: string;
  description: string;
  highlights: string[];
  cta: string;
  href?: string;
  learnMore: string;
  featured: "primary" | "secondary" | false;
  badge: string;
  inquiry?: boolean;
}

const SERVICES: Service[] = [
  {
    id: "trademark",
    icon: Shield,
    label: "Trademark",
    tagline: "Protect your brand identity",
    description:
      "Register your brand name, logo, or slogan with KIPI. A licensed IP lawyer reviews your application before submission to maximise approval chances and protect your business identity.",
    highlights: [
      "Brand name & logo registration",
      "Expert lawyer review before filing",
      "KIPI portal filing & follow-up",
      "Trademark search included",
    ],
    cta: "Start Filing",
    href: "https://kira.co.ke",
    learnMore: "/trademark-service",
    featured: "primary",
    badge: "Live",
  },
  {
    id: "copyright",
    icon: Pen,
    label: "Copyright",
    tagline: "Protect your creative work",
    description:
      "Secure ownership of your creative work — music, literature, software, art, film, and more. Our automated system classifies your work, completes the application, and files directly with KECOBO.",
    highlights: [
      "Automated work classification",
      "Automated KECOBO / NRR filing",
      "Nightly status sync & certificate delivery",
      "All 7 copyright categories covered",
    ],
    cta: "Start Filing",
    learnMore: "/copyright-service",
    featured: "secondary",
    badge: "Live",
  },
  {
    id: "industrial-design",
    icon: FlaskConical,
    label: "Industrial Design",
    tagline: "Safeguard your product's appearance",
    description:
      "Protect the unique visual appearance of your product. Our lawyers will guide you through the KIPI registration process from design drawings to granted certificate.",
    highlights: [
      "Product appearance protection",
      "Design drawing preparation support",
      "KIPI registration & prosecution",
      "12-year renewable protection",
    ],
    cta: "Get in Touch",
    learnMore: "/industrial-design-service",
    featured: false,
    badge: "Enquire",
    inquiry: true,
  },
  {
    id: "patent",
    icon: Lightbulb,
    label: "Patent",
    tagline: "Protect your invention",
    description:
      "Protect your invention with structured legal support. A licensed patent lawyer prepares your specification, claims, and drawings for filing with KIPI or via PCT.",
    highlights: [
      "Invention novelty assessment",
      "Specification & claims drafting",
      "KIPI & PCT filing support",
      "20-year protection term",
    ],
    cta: "Get in Touch",
    learnMore: "/patents-service",
    featured: false,
    badge: "Enquire",
    inquiry: true,
  },
];

const STATS = [
  { value: "4", label: "IP Service Areas" },
  { value: "100%", label: "Lawyer-Reviewed Trademarks" },
  { value: "24h", label: "Avg. Response Time" },
  { value: "KE", label: "Kenya's IP Platform" },
];

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Choose Your Service",
    desc: "Select the type of IP protection you need — copyright, trademark, patent, or industrial design.",
  },
  {
    n: "02",
    title: "Complete the Guided Wizard",
    desc: "Our step-by-step wizard collects exactly what's needed. Auto-saved at every step so you never lose progress.",
  },
  {
    n: "03",
    title: "We File on Your Behalf",
    desc: "Our automation files your application directly with the relevant authority — KECOBO or KIPI.",
  },
  {
    n: "04",
    title: "Receive Your Certificate",
    desc: "Track your status in real time. Your certificate is delivered straight to your dashboard the moment it's issued.",
  },
];

export default function ServicesPage() {
  const [inquiryService, setInquiryService] = useState<ServiceId | null>(null);
  const [starting, setStarting] = useState(false);

  async function startCopyrightFiling() {
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

  const activeInquiry = SERVICES.find((s) => s.id === inquiryService);

  return (
    <AppShell>

      {/* ── Inquiry Modal ────────────────────────────────────────────────── */}
      {inquiryService && activeInquiry && (
        <InquiryModal
          service={inquiryService}
          serviceLabel={activeInquiry.label}
          onClose={() => setInquiryService(null)}
        />
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='13' y='26' font-size='18' font-weight='300' fill='%23F59E0B' opacity='0.25' font-family='sans-serif'%3E%2B%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-1.5 text-sm text-primary-700 font-medium mb-8">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            Kenya Innovation Rights Accelerator (KIRA)
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Protect What You
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-1">
              Create & Build
            </span>
          </h1>

          <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            KIRA unites licensed IP lawyers with digital automation — giving you expert‑level
            accuracy at modern‑tech speed. Trademark, copyright, design, and patent
            registration, all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#services"
              className="btn btn-lg btn-primary"
            >
              Explore Services
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
            {[
              "Kenya Copyright Act 2001",
              "KECOBO / NRR Portal",
              "KIPI Registration",
              "Secure & Confidential",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2 text-gray-400 text-sm">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div
          className="relative"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='13' y='26' font-size='18' font-weight='300' fill='%23F59E0B' opacity='0.15' font-family='sans-serif'%3E%2B%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="section-eyebrow">Our Services</p>
              <h2 className="section-title">
                <span className="text-primary">+ </span>Services
              </h2>
              <p className="section-subtitle mx-auto">
                Choose the type of protection you need. Click a service card to get started or enquire.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SERVICES.map((svc) => {
                const Icon = svc.icon;

                /* ── Primary featured card (Trademark — orange) ── */
                if (svc.featured === "primary") {
                  return (
                    <div
                      key={svc.id}
                      className="group relative bg-primary rounded-2xl p-8 flex flex-col gap-5 shadow-hover transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-bold bg-white text-primary px-2.5 py-1 rounded-full">
                          {svc.badge}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{svc.label}</h3>
                        <p className="text-orange-100 text-sm font-medium mb-3">{svc.tagline}</p>
                        <p className="text-orange-100 text-sm leading-relaxed">{svc.description}</p>
                      </div>
                      <ul className="space-y-1.5">
                        {svc.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-2 text-sm text-white">
                            <CheckCircle className="w-4 h-4 text-white/70 flex-shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <a
                          href={svc.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-white hover:gap-3 transition-all"
                        >
                          {svc.cta} <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                          href={svc.learnMore}
                          className="text-xs text-white/70 hover:text-white underline underline-offset-2 transition-colors"
                        >
                          Learn more
                        </a>
                      </div>
                    </div>
                  );
                }

                /* ── Secondary featured card (Copyright — amber tinted) ── */
                if (svc.featured === "secondary") {
                  return (
                    <div
                      key={svc.id}
                      className="group relative bg-amber-50 border-2 border-primary/30 rounded-2xl p-8 flex flex-col gap-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-primary/60"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs font-bold bg-primary text-white px-2.5 py-1 rounded-full">
                          {svc.badge}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{svc.label}</h3>
                        <p className="text-primary text-sm font-medium mb-3">{svc.tagline}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{svc.description}</p>
                      </div>
                      <ul className="space-y-1.5">
                        {svc.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <button
                          onClick={startCopyrightFiling}
                          disabled={starting}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-3 transition-all disabled:opacity-60 disabled:cursor-wait"
                        >
                          {starting ? "Starting…" : svc.cta} <ArrowRight className="w-4 h-4" />
                        </button>
                        <a href={svc.learnMore} className="text-xs text-primary/60 hover:text-primary underline underline-offset-2 transition-colors">
                          Learn more
                        </a>
                      </div>
                    </div>
                  );
                }

                /* ── Inquiry cards (Industrial Design & Patent) ── */
                return (
                  <div
                    key={svc.id}
                    className="relative bg-white rounded-2xl p-8 flex flex-col gap-5 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xs font-bold bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full">
                        {svc.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{svc.label}</h3>
                      <p className="text-primary text-sm font-medium mb-3">{svc.tagline}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{svc.description}</p>
                    </div>

                    <ul className="space-y-1.5">
                      {svc.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4 text-primary/50 flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-2 space-y-2">
                      <button
                        onClick={() => setInquiryService(svc.id)}
                        className="btn btn-primary w-full"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {svc.cta}
                      </button>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">A lawyer responds within 1 business day</p>
                        <Link href={svc.learnMore} className="text-xs text-primary/60 hover:text-primary underline underline-offset-2 transition-colors">
                          Learn more
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-extrabold text-primary mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-eyebrow">How It Works</p>
            <h2 className="section-title">Our 4-Step Process</h2>
            <p className="section-subtitle mx-auto">
              From first click to official certificate — we handle every step on your behalf.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.n} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%-12px)] w-6 h-0.5 bg-primary-200 z-10" />
                )}
                <div className="card card-body h-full">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mb-4 flex-shrink-0">
                    {parseInt(step.n)}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div
          className="relative"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='13' y='26' font-size='18' font-weight='300' fill='%23F59E0B' opacity='0.2' font-family='sans-serif'%3E%2B%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary rounded-3xl p-10 sm:p-14 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-[60px]" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-accent/20 blur-[50px]" />
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Ready to protect your brand or creative work?
                  </h3>
                  <p className="text-orange-100 text-lg">
                    Our lawyers and digital platform work together so your IP is filed correctly, quickly, and with full legal backing.
                  </p>
                </div>
                <a
                  href="#services"
                  className="flex-shrink-0 btn btn-lg bg-white text-primary hover:bg-primary-50 shadow-lg whitespace-nowrap"
                >
                  Our Services →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </AppShell>
  );
}
