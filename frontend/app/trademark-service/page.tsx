"use client";

import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { InquiryModal } from "../../components/InquiryModal";
import { useState } from "react";
import {
  Shield, CheckCircle, ArrowRight, ChevronLeft,
  Globe, Scale, RefreshCcw, TrendingUp, Search, FileText, Megaphone, BadgeCheck, MessageSquare,
} from "lucide-react";

const WHAT_CAN_BE_TRADEMARKED = [
  { icon: FileText, label: "Brand & Business Names", desc: "Your company name, product name, or trading name." },
  { icon: Shield, label: "Logos & Visual Marks", desc: "Graphic symbols, emblems, and stylised wordmarks." },
  { icon: Megaphone, label: "Slogans & Taglines", desc: "Distinctive phrases that identify your business." },
  { icon: BadgeCheck, label: "Trade Dress", desc: "Distinctive product packaging, colours, or shapes." },
];

const BENEFITS = [
  "Exclusive legal right to use the mark commercially in Kenya",
  "Defence against counterfeit goods and brand imitation",
  "Right to license your brand for additional revenue",
  "Strengthens franchise and partnership negotiations",
  "A brand asset that appreciates in value over time",
  "10-year protection, renewable indefinitely",
];

const PROCESS = [
  {
    n: "01", title: "Trademark Search",
    desc: "We conduct a comprehensive search of the KIPI register to confirm your mark is available and assess the risk of conflicts with existing marks.",
  },
  {
    n: "02", title: "Application Preparation",
    desc: "Our licensed IP lawyers prepare your application — selecting the correct class, drafting the description, and attaching all required representations.",
  },
  {
    n: "03", title: "Filing with KIPI",
    desc: "We file directly with the Kenya Industrial Property Institute on your behalf, obtaining your filing date and application number.",
  },
  {
    n: "04", title: "Examination & Publication",
    desc: "KIPI examines your mark for distinctiveness and conflicting marks. If accepted, it is published in the Kenya Industrial Property Journal.",
  },
  {
    n: "05", title: "Registration & Certificate",
    desc: "Once the opposition period passes without challenge, KIPI issues your Certificate of Registration — your definitive proof of ownership.",
  },
];

const FACTS = [
  { value: "10 yrs", label: "Protection period (renewable)" },
  { value: "KIPI", label: "Registering authority" },
  { value: "45", label: "International trademark classes" },
  { value: "ARIPO", label: "Regional coverage available" },
];

export default function TrademarkServicePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <AppShell>
      {showModal && (
        <InquiryModal service="trademark" serviceLabel="Trademark Registration" onClose={() => setShowModal(false)} />
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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">Trademark Registration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Protect Your Brand Identity<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Before Someone Else Does</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mb-8 leading-relaxed">
            Your brand is one of your most valuable business assets. KIRA's licensed IP lawyers handle your trademark registration with KIPI from search to certificate — giving your brand the legal protection it deserves.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="https://kira.co.ke/home" className="btn btn-lg btn-primary">
              Start Filing Now <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#process" className="btn btn-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── What is a Trademark ───────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-eyebrow mb-2">What Is a Trademark?</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your brand's legal shield</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A trademark is any sign capable of distinguishing your goods or services from those of other businesses — this includes brand names, logos, slogans, and distinctive packaging. Once registered with the <strong>Kenya Industrial Property Institute (KIPI)</strong>, your trademark gives you the exclusive right to use it commercially in Kenya.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Unlike copyright, trademark protection is <em>not automatic</em>. Registration is the only way to secure enforceable rights, build brand equity, and take legal action against infringers and counterfeiters.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHAT_CAN_BE_TRADEMARKED.map((item) => {
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

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-2">Why Register?</p>
            <h2 className="text-3xl font-bold text-gray-900">6 Reasons to Register Your Trademark Today</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-5 rounded-2xl bg-amber-50 border border-primary/10">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coverage ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-eyebrow mb-2">Geographic Coverage</p>
            <h2 className="text-3xl font-bold text-gray-900">Protect Your Brand Across Africa</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Registration options range from Kenya-only to continent-wide protection, depending on your business footprint.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Scale, title: "National — KIPI", desc: "Protect your mark within Kenya. The starting point for most businesses operating locally.", badge: "Most Popular" },
              { icon: Globe, title: "Regional — ARIPO", desc: "Extend protection to multiple African countries through the African Regional Intellectual Property Organization.", badge: "Growing Business" },
              { icon: TrendingUp, title: "International — Madrid", desc: "File a single application through WIPO's Madrid System to seek protection in over 130 countries simultaneously.", badge: "Global Brands" },
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <div key={opt.title} className="card card-body flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full">{opt.badge}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{opt.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section id="process" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-2">Our Process</p>
            <h2 className="text-3xl font-bold text-gray-900">From Search to Certificate</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Our lawyers manage every step so you can focus on building your brand.</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to register your trademark?</h2>
          <p className="text-gray-500 mb-8">Fill in a short form and one of our IP lawyers will get in touch within 1 business day to guide you through the process.</p>
          <a href="https://kira.co.ke/home" className="btn btn-lg btn-primary mx-auto">
            Start Filing Now <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </AppShell>
  );
}
