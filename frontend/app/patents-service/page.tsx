"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { InquiryModal } from "../../components/InquiryModal";
import {
  Lightbulb, CheckCircle, ArrowRight, ChevronLeft, MessageSquare,
  Globe, Scale, Cpu, Beaker, Wrench, Leaf, XCircle,
} from "lucide-react";

const WHAT_CAN_BE_PATENTED = [
  { icon: Cpu, label: "New Products & Devices", desc: "Physical inventions, machines, manufactured goods with novel features." },
  { icon: Beaker, label: "New Processes & Methods", desc: "Manufacturing techniques, chemical processes, business methods (in some jurisdictions)." },
  { icon: Wrench, label: "Improvements to Existing Inventions", desc: "Incremental innovations that add novel and inventive steps to existing technology." },
  { icon: Leaf, label: "New Compositions of Matter", desc: "Chemical compounds, formulations, and biological materials with industrial use." },
];

const PATENTABILITY = [
  { title: "Novelty", desc: "The invention must not have been previously disclosed anywhere in the world — in publications, public use, or prior patents." },
  { title: "Inventive Step", desc: "The invention must not be obvious to a person skilled in the relevant technical field." },
  { title: "Industrial Applicability", desc: "The invention must be capable of being made or used in any kind of industry, including agriculture." },
];

const WHAT_CANNOT = [
  "Scientific theories and mathematical methods",
  "Mental acts, rules, or methods",
  "Presentations of information",
  "Plants and animal varieties (protected under different regimes)",
  "Inventions contrary to public order or morality",
];

const FILING_OPTIONS = [
  { icon: Scale, title: "National — KIPI", desc: "File directly with the Kenya Industrial Property Institute for protection within Kenya. The most cost-effective starting point for local businesses.", badge: "Start Here" },
  { icon: Globe, title: "Regional — ARIPO", desc: "A single ARIPO application can cover multiple African member states simultaneously, including Kenya, Uganda, Zimbabwe, and others.", badge: "African Market" },
  { icon: ArrowRight, title: "International — PCT", desc: "The Patent Cooperation Treaty allows you to file a single international application seeking protection in over 150 countries — giving you 30 months to decide which countries to pursue.", badge: "Global IP" },
];

const PROCESS = [
  { n: "01", title: "Initial Consultation", desc: "We assess the novelty and patentability of your invention, advise on the best filing strategy, and outline the expected timeline and costs." },
  { n: "02", title: "Prior Art Search", desc: "A comprehensive search of existing patents and publications worldwide to identify prior art and refine your claims strategy." },
  { n: "03", title: "Specification Drafting", desc: "Our patent lawyers draft the full specification — including claims, detailed description, abstract, and drawings — to maximise the scope of your protection." },
  { n: "04", title: "Filing", desc: "We file your application with KIPI, ARIPO, or via PCT, securing your priority date and application number immediately." },
  { n: "05", title: "Prosecution", desc: "We handle all communication with the patent office, including responding to examination reports and objections, to move your application toward grant." },
  { n: "06", title: "Grant & Maintenance", desc: "Once granted, your patent certificate is issued. We advise on renewal obligations to maintain your protection throughout the 20-year term." },
];

const FACTS = [
  { value: "20 yrs", label: "Maximum protection from filing date" },
  { value: "150+", label: "Countries via PCT filing" },
  { value: "30 mo", label: "PCT decision window" },
  { value: "1 day", label: "Lawyer response time" },
];

export default function PatentsServicePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <AppShell>
      {showModal && (
        <InquiryModal service="patent" serviceLabel="Patent Registration" onClose={() => setShowModal(false)} />
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
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">Patent Registration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Turn Your Invention Into<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">A Protected Asset</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mb-8 leading-relaxed">
            A patent gives you the exclusive right to commercialise your invention for up to 20 years. KIRA's licensed patent lawyers handle everything — from novelty search to KIPI grant — with strategic advice tailored to your innovation.
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

      {/* ── What is a Patent ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-eyebrow mb-2">What Is a Patent?</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Exclusive rights to your invention</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A patent is a legal right granted by the state to an inventor, giving them the <strong>exclusive right to make, use, sell, and import their invention</strong> for a defined period. In Kenya, patents are granted by the <strong>Kenya Industrial Property Institute (KIPI)</strong> under the Industrial Property Act (2001) and provide up to 20 years of protection from the filing date.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              In exchange for this exclusive right, the inventor publicly discloses the details of the invention — contributing to the global body of technical knowledge and enabling further innovation after the patent expires.
            </p>
            <p className="text-gray-600 leading-relaxed">
              A patent is also a <em>commercial asset</em> — it can be licensed, sold, or used as collateral for financing, making it one of the most powerful forms of intellectual property for technology and manufacturing businesses.
            </p>
          </div>
          <div className="bg-primary rounded-2xl p-8 text-white">
            <h3 className="text-lg font-bold mb-5">The 3 Patentability Requirements</h3>
            <div className="space-y-5">
              {PATENTABILITY.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">✓</div>
                  <div>
                    <p className="font-bold text-white text-sm">{p.title}</p>
                    <p className="text-orange-100 text-xs leading-relaxed mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What Can Be Patented ─────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-2">What Can Be Patented?</p>
            <h2 className="text-3xl font-bold text-gray-900">Protectable Inventions</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Patents cover a wide range of technical innovations across every industry.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {WHAT_CAN_BE_PATENTED.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex gap-4 p-6 rounded-2xl bg-amber-50 border border-primary/10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.label}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8">
            <h3 className="font-bold text-gray-900 mb-4">What Cannot Be Patented</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {WHAT_CANNOT.map((item) => (
                <div key={item} className="flex gap-2 items-start text-sm text-gray-500">
                  <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filing Options ───────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-2">Filing Strategy</p>
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Level of Protection</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">From Kenya-only to global coverage — we advise on the right strategy for your market ambitions.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FILING_OPTIONS.map((opt) => {
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
            <h2 className="text-3xl font-bold text-gray-900">From Invention to Granted Patent</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Our patent lawyers manage every stage — ensuring your claims are as broad and defensible as possible.</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Have an invention worth protecting?</h2>
          <p className="text-gray-500 mb-8">Tell us about your invention and one of our patent lawyers will get in touch within 1 business day to assess patentability and outline your options.</p>
          <button onClick={() => setShowModal(true)} className="btn btn-lg btn-primary mx-auto">
            <MessageSquare className="w-5 h-5" /> Talk to a Patent Lawyer
          </button>
        </div>
      </section>
    </AppShell>
  );
}
