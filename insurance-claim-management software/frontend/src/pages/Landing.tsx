"use client"

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  FileText,
  Headphones,
  HeartPulse,
  Lock,
  Mail,
  Menu,
  Phone,
  Plane,
  Quote,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react"

const products = [
  {
    icon: HeartPulse,
    name: "Health Insurance",
    description: "Cashless hospitalisation, annual check-ups and cover for your whole family.",
    points: ["Individual & family floater plans", "No-claim bonus every year", "Network of 8,000+ hospitals"],
    accent: "bg-rose-50 text-rose-600",
  },
  {
    icon: Car,
    name: "Motor Insurance",
    description: "Comprehensive protection for your car or bike, including third-party liability.",
    points: ["Zero-depreciation add-on", "Roadside assistance", "Claims settled in 48 hours"],
    accent: "bg-blue-50 text-blue-600",
  },
  {
    icon: Shield,
    name: "Life Insurance",
    description: "Term and savings plans that keep your family financially secure, whatever happens.",
    points: ["Cover up to ₹1 Cr", "Flexible 10-30 year terms", "Optional critical illness rider"],
    accent: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Plane,
    name: "Travel Insurance",
    description: "Trip cancellation, medical emergencies and lost baggage — covered before you fly.",
    points: ["Worldwide emergency cover", "Baggage delay protection", "Single-trip or annual plans"],
    accent: "bg-emerald-50 text-emerald-600",
  },
]

const features = [
  {
    icon: Clock,
    title: "Claims in hours, not weeks",
    description: "Digital claim filing with a live status timeline. Most claims are reviewed within 48 hours.",
  },
  {
    icon: CreditCard,
    title: "Transparent pricing",
    description: "See the exact premium, coverage and terms before you pay. No hidden charges, ever.",
  },
  {
    icon: Headphones,
    title: "Real people on support",
    description: "Talk to a licensed advisor over chat or phone, seven days a week, not a bot maze.",
  },
  {
    icon: FileText,
    title: "Paperless by default",
    description: "Policies, invoices and claim documents live in your account. Download anytime.",
  },
  {
    icon: Lock,
    title: "Bank-grade security",
    description: "256-bit encryption, role-based access and audit trails on every policy and claim.",
  },
  {
    icon: TrendingUp,
    title: "Track everything live",
    description: "Premiums paid, coverage left and claim progress — always one screen away.",
  },
]

const steps = [
  {
    title: "Pick your cover",
    description: "Compare plans across health, motor, life and travel, with plain-language terms.",
  },
  {
    title: "Pay securely",
    description: "Choose a payment mode, get an instant receipt, and your policy activates right away.",
  },
  {
    title: "Claim in minutes",
    description: "Submit a claim from your dashboard and follow every status change as it happens.",
  },
]

const stats = [
  { value: "25,000+", label: "Policies in force" },
  { value: "98%", label: "Claims decided in 48h" },
  { value: "4.9/5", label: "Average customer rating" },
  { value: "₹12,000 Cr+", label: "Coverage protecting families" },
]

const reviews = [
  {
    name: "Priya Sharma",
    role: "Health cover · 2 years",
    initials: "PS",
    color: "bg-rose-100 text-rose-700",
    text: "My hospital claim was approved before I even got home. The timeline showed every step and nobody asked me to resend a document twice.",
  },
  {
    name: "Daniel Okafor",
    role: "Motor cover · 1 year",
    initials: "DO",
    color: "bg-blue-100 text-blue-700",
    text: "A tree fell on my car on a Sunday. I filed the claim from my phone and had approval by Tuesday morning. Genuinely the least painful insurance experience I've had.",
  },
  {
    name: "Mei Lin",
    role: "Family floater · 3 years",
    initials: "ML",
    color: "bg-emerald-100 text-emerald-700",
    text: "What sold me was the pricing page. Everything was itemised — premium, coverage, exclusions — with no fine print surprises at renewal.",
  },
]

const posts = [
  {
    category: "Health",
    date: "12 Nov 2026",
    read: "6 min read",
    title: "5 things to check before you buy health insurance",
    excerpt: "Waiting periods, room-rent limits and network hospitals matter far more than the headline premium.",
    body: [
      "The cheapest health plan is rarely the cheapest once you claim. Start by checking the waiting period on pre-existing conditions — most plans run 2-4 years, and some are longer for specific ailments.",
      "Next, look at room-rent limits and co-payment clauses. A plan that caps your room at 1% of sum insured can leave you paying the difference out of pocket in a metro hospital.",
      "Finally, confirm the network hospital list in your city and whether cashless approval is available at the point of admission. A plan is only as good as the desk that approves your treatment.",
    ],
  },
  {
    category: "Claims",
    date: "28 Oct 2026",
    read: "4 min read",
    title: "How to file a claim without the paperwork headache",
    excerpt: "Four documents cover most claims. Here's how to submit them once and keep the process moving.",
    body: [
      "Before you start, keep the policy number and incident date handy. Claims are matched against the policy period, so a wrong date is the most common reason a submission bounces back.",
      "For health claims you'll typically need the discharge summary, itemised bill, payment receipts and a prescription summary. Motor claims need the repair estimate plus photographs of the damage.",
      "Upload clear scans rather than phone photos of screens, and note the document reference you receive. You can follow the status of every claim from the dashboard without calling support.",
    ],
  },
  {
    category: "Motor",
    date: "9 Oct 2026",
    read: "5 min read",
    title: "Motor insurance add-ons actually worth paying for",
    excerpt: "Zero depreciation and roadside assistance usually earn their keep. The rest depends on how you drive.",
    body: [
      "Zero-depreciation cover removes the deduction applied to plastic and metal parts during a repair. On a car under five years old it frequently pays for itself after a single claim.",
      "Roadside assistance is worth it if you commute long distances or drive outside the city. Flat tyres, dead batteries and towing usually cost more than the add-on itself.",
      "Engine protect and return-to-invoice cover are situational. If you drive through flooded areas, engine protect can be valuable — otherwise put the premium towards a higher voluntary deductible instead.",
    ],
  },
]

const faqs = [
  {
    q: "How quickly can I get covered?",
    a: "For most plans, cover starts the moment your premium payment is recorded — usually within a few minutes. Health plans with waiting periods for specific conditions will show those timelines before you buy.",
  },
  {
    q: "Can I track a claim after submitting it?",
    a: "Yes. Every claim has a status timeline: submitted, under review, recommendation and final decision. You see the same history your agent and our claims team see.",
  },
  {
    q: "What documents do I need for a claim?",
    a: "It depends on the type of claim, but health claims typically need a discharge summary and itemised bill, while motor claims need a repair estimate and photos. You can upload documents directly from the claim screen.",
  },
  {
    q: "Can I manage policies for my family?",
    a: "Family floater health plans cover multiple members under one policy. Each member is listed with their own details, and the shared coverage is visible on your dashboard.",
  },
  {
    q: "Is my payment information safe?",
    a: "This is a demonstration environment, so payments are simulated and no real card details are processed. In production, premium collection would run through a PCI-compliant gateway.",
  },
]

function Stars({ className = "text-amber-400" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className="fill-current" />
      ))}
    </div>
  )
}

export default function Landing() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePost, setActivePost] = useState<(typeof posts)[number] | null>(null)
  const [newsletter, setNewsletter] = useState("")

  useEffect(() => {
    const previous = document.title
    document.title = "InsurePro — Insurance that shows up when life doesn't go to plan"
    return () => {
      document.title = previous
    }
  }, [])

  const dashboardPath =
    user?.role === "ADMIN"
      ? "/admin/dashboard"
      : user?.role === "AGENT"
        ? "/agent/dashboard"
        : "/customer/dashboard"

  const navLinks = [
    { label: "Coverage", href: "#coverage" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Why InsurePro", href: "#why" },
    { label: "Reviews", href: "#reviews" },
    { label: "Insights", href: "#insights" },
    { label: "FAQ", href: "#faq" },
  ]

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletter.trim()) return
    toast({ title: "You're subscribed", description: `Product updates will go to ${newsletter.trim()}.` })
    setNewsletter("")
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Announcement */}
      <div className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm">
          <Sparkles size={14} className="text-amber-300" />
          <span>Now live: real-time claim tracking from submission to payout.</span>
          <a href="#claims" className="hidden font-semibold text-amber-300 hover:text-amber-200 sm:inline">
            See how it works →
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="InsurePro home">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white shadow-sm">
              <ShieldCheck size={20} />
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-900">InsurePro</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                    {user.fullName?.slice(0, 1)?.toUpperCase() || "U"}
                  </span>
                  <span className="max-w-[140px] truncate">{user.fullName}</span>
                </div>
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Go to dashboard <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Get started <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-200 bg-white md:hidden">
            <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4" aria-label="Mobile navigation">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
                {user ? (
                  <Link
                    to={dashboardPath}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Go to dashboard <ArrowRight size={16} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Get started <ArrowRight size={16} />
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
              <BadgeCheck size={14} /> Trusted by 25,000+ policyholders
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 text-balance sm:text-5xl lg:text-6xl">
              Insurance that shows up when life <span className="text-blue-600">doesn&apos;t go to plan</span>.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
              Health, motor, life and travel cover with transparent pricing, paperless policies and claims you can
              actually follow — from the first document to the final payout.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {user ? (
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
                >
                  Open my dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
                >
                  Get a free quote <ArrowRight size={18} />
                </Link>
              )}
              <a
                href="#coverage"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-base font-semibold text-gray-800 transition-colors hover:bg-gray-50"
              >
                Explore coverage
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Stars />
                <span><strong className="text-gray-900">4.9/5</strong> from 2,400+ reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> No hidden fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Cancel anytime
              </div>
            </div>
          </div>

          {/* Product mock */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl shadow-blue-900/10">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
                    <ShieldCheck size={16} />
                  </span>
                  <div>
                    <p className="text-xs text-gray-500">Policy</p>
                    <p className="text-sm font-semibold">POL-2026-10482</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">Family Health Plus</p>
                <div className="mt-1 flex items-end justify-between">
                  <p className="text-2xl font-bold">₹5,00,000</p>
                  <p className="text-sm text-gray-500">₹1,200<span className="text-xs">/mo</span></p>
                </div>
                <p className="mt-1 text-xs text-gray-500">Coverage for 4 members · Renews 14 Nov 2027</p>
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-600">Annual deductible</span>
                  <span className="text-gray-500">68% met</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[68%] rounded-full bg-blue-600" />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Claim CLM-1042</p>
                <div className="mt-3 space-y-3">
                  {[
                    { label: "Submitted", done: true },
                    { label: "Documents verified", done: true },
                    { label: "Approved · ₹2,45,000", done: true },
                  ].map((s, i) => (
                    <div key={s.label} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`grid h-5 w-5 place-items-center rounded-full ${
                            s.done ? "bg-emerald-500 text-white" : "border border-gray-300 bg-white"
                          }`}
                        >
                          {s.done && <CheckCircle2 size={12} />}
                        </span>
                        {i < 2 && <span className="mt-0.5 h-4 w-px bg-emerald-200" />}
                      </div>
                      <p className={`text-sm ${s.done ? "text-gray-700" : "text-gray-400"}`}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -left-4 top-24 hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-lg sm:flex">
              <Clock size={16} className="text-blue-600" />
              <div>
                <p className="text-xs font-semibold text-gray-900">41 hours</p>
                <p className="text-[11px] text-gray-500">average settlement</p>
              </div>
            </div>

            <div className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-lg sm:flex">
              <Headphones size={16} className="text-emerald-600" />
              <div>
                <p className="text-xs font-semibold text-gray-900">24/7 support</p>
                <p className="text-[11px] text-gray-500">real humans, always</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-gray-900">{s.value}</p>
              <p className="mt-1 text-sm text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section id="coverage" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Coverage</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              One place for every kind of protection
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Four product lines, dozens of plans. Compare what is covered, what it costs and what is excluded —
              before you decide.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <div
                key={p.name}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${p.accent}`}>
                  <p.icon size={22} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {p.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={user ? dashboardPath : "/register"}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {user ? "View in dashboard" : "Explore plans"} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Covered in three straightforward steps
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No branch visits, no piles of forms, no waiting on hold to find out what happens next.
            </p>
          </div>

          <div className="relative mt-14 grid gap-8 lg:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:block" />
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-blue-100 bg-white text-lg font-extrabold text-blue-600 shadow-sm">
                  {i + 1}
                </div>
                <h3 className="mt-5 text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Why InsurePro</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Built around the claim, not the fine print
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Most people only find out how good their insurer is when something goes wrong. We designed the whole
                system for that moment.
              </p>
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-center gap-2 text-blue-700">
                  <ShieldCheck size={18} />
                  <p className="text-sm font-semibold">Our promise</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-blue-900/80">
                  Every claim gets a named reviewer, a visible status and a decision within two business days — or we
                  tell you exactly why it needs more time.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-lg hover:shadow-gray-900/5">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <f.icon size={19} />
                  </div>
                  <h3 className="mt-3 font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Claims spotlight */}
      <section id="claims" className="scroll-mt-24 bg-gray-900 py-20 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Claims, visible</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Know exactly where your claim is. Always.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-300">
              Every status change is recorded with a timestamp and the person who made it. No vague "processing"
              emails, no calling to ask for an update.
            </p>
            <ul className="mt-6 space-y-3 text-gray-200">
              {[
                "Upload documents once and reuse them across claims",
                "See agent recommendations and final decisions",
                "Download a full status history for your records",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to={user ? dashboardPath : "/login"}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
            >
              {user ? "Track my claims" : "Sign in to track a claim"} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Claim CLM-1042</p>
                <p className="mt-1 text-lg font-semibold">Hospitalisation · ₹2,45,000</p>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                Approved
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {[
                { title: "Claim submitted", meta: "12 Nov, 09:14 · by you" },
                { title: "Documents verified", meta: "12 Nov, 11:02 · by claims team" },
                { title: "Agent recommended approval", meta: "13 Nov, 10:20 · by agent" },
                { title: "Final approval & payout", meta: "13 Nov, 16:45 · by reviewer" },
              ].map((t, i) => (
                <div key={t.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-400 text-gray-900">
                      <CheckCircle2 size={15} />
                    </span>
                    {i < 3 && <span className="mt-1 h-6 w-px bg-white/20" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-gray-400">{t.meta}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-white/10 p-4">
              <p className="text-xs text-gray-300">Payout completed in</p>
              <p className="text-2xl font-bold">41 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Reviews</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                What policyholders say
              </h2>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <Stars />
              <div>
                <p className="text-sm font-semibold text-gray-900">4.9 out of 5</p>
                <p className="text-xs text-gray-500">2,400+ verified reviews</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.name} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6">
                <Quote size={26} className="text-blue-200" />
                <Stars className="mt-4 text-amber-400" />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-gray-700">"{r.text}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <span className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${r.color}`}>
                    {r.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Insights / blog */}
      <section id="insights" className="scroll-mt-24 bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Insights</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Plain-English insurance guides
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Short, practical reads from our claims and underwriting teams — no jargon, no sales pitch.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg hover:shadow-gray-900/5"
              >
                <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3">
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <CalendarDays size={13} /> {post.date}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold leading-snug text-gray-900">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{post.read}</span>
                    <button
                      type="button"
                      onClick={() => setActivePost(post)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Read article <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Questions, answered
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-gray-200 bg-white p-5 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                  {f.q}
                  <ChevronDown size={18} className="shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-12 text-center shadow-xl shadow-blue-900/20 sm:px-12 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
            Get covered in under five minutes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            Create an account, compare plans and activate your policy today. Cancel anytime — no lock-in.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={user ? dashboardPath : "/register"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              {user ? "Go to dashboard" : "Create free account"} <ArrowRight size={18} />
            </Link>
            <a
              href="#coverage"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse coverage
            </a>
          </div>
          <p className="mt-5 text-sm text-blue-200">No credit card required · Cancel anytime · Human support</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
            <div>
              <Link to="/" className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
                  <ShieldCheck size={20} />
                </span>
                <span className="text-lg font-bold tracking-tight text-gray-900">InsurePro</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
                Modern insurance for health, motor, life and travel — with transparent pricing and claims you can
                follow in real time.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
                  <Lock size={12} /> 256-bit encryption
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
                  <BadgeCheck size={12} /> Verified processes
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">Coverage</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
                {products.map((p) => (
                  <li key={p.name}>
                    <a href="#coverage" className="transition-colors hover:text-blue-600">{p.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">Company</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
                <li><a href="#why" className="transition-colors hover:text-blue-600">Why InsurePro</a></li>
                <li><a href="#claims" className="transition-colors hover:text-blue-600">Claims process</a></li>
                <li><a href="#reviews" className="transition-colors hover:text-blue-600">Customer reviews</a></li>
                <li><a href="#insights" className="transition-colors hover:text-blue-600">Insights</a></li>
                <li><a href="#faq" className="transition-colors hover:text-blue-600">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">Stay in the loop</h3>
              <p className="mt-4 text-sm text-gray-600">
                Practical insurance tips once a month. No spam, unsubscribe anytime.
              </p>
              <form onSubmit={onSubscribe} className="mt-4 flex flex-wrap gap-2 sm:flex-nowrap">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={newsletter}
                  onChange={(e) => setNewsletter(e.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Join
                </button>
              </form>

              <div className="mt-5 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2"><Mail size={14} /> support@insurepro.example</p>
                <p className="flex items-center gap-2"><Phone size={14} /> +1 (555) 010-2040</p>
                <p className="flex items-center gap-2"><Clock size={14} /> Mon-Sun, 7:00-22:00</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 sm:flex-nowrap">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Sign in <ArrowRight size={13} />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                >
                  Create account <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
            <p className="text-xs text-gray-500">© 2026 InsurePro. All rights reserved.</p>
            <p className="text-xs text-gray-500">
              Demonstration project · Premiums are simulated and no real payments are processed.
            </p>
          </div>
        </div>
      </footer>

      {/* Blog reader */}
      <Dialog open={!!activePost} onOpenChange={(open) => !open && setActivePost(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {activePost && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1">{activePost.category}</span>
                  <span className="text-gray-500">{activePost.date} · {activePost.read}</span>
                </div>
                <DialogTitle className="mt-2 text-xl leading-snug">{activePost.title}</DialogTitle>
                <DialogDescription>{activePost.excerpt}</DialogDescription>
              </DialogHeader>
              <div className="mt-2 space-y-3">
                {activePost.body.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed text-gray-600">{paragraph}</p>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">Ready to see it for yourself?</p>
                <p className="mt-1 text-sm text-blue-900/80">
                  Compare plans and see exactly what is covered before you pay.
                </p>
                <Link
                  to={user ? dashboardPath : "/register"}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {user ? "Open dashboard" : "Explore plans"} <ArrowRight size={15} />
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
