import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Wand2, Layout, Download, Check, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI CV Generator — Free Online Resume Builder & Lebenslauf Maker" },
      { name: "description", content: "Build an ATS-optimized CV with AI. Pick from modern templates, live preview, and export to PDF instantly. Free CV maker for the German, French and remote job markets." },
      { name: "keywords", content: "CV generator, resume builder, Lebenslauf generator, create CV online free, AI CV maker, ATS resume" },
      { property: "og:title", content: "AI CV Generator — Free Online Resume Builder" },
      { property: "og:description", content: "Create a professional ATS-friendly CV in minutes with AI." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "AI CV Generator",
        applicationCategory: "BusinessApplication",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }),
    }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="grid place-items-center size-8 rounded-lg bg-primary text-primary-foreground"><FileText size={16}/></div>
          CV Genie
        </Link>
        <nav className="hidden md:flex gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex gap-2">
          <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/builder/$id" params={{ id: "guest" }}><Button size="sm">Try free</Button></Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1 text-xs text-muted-foreground">
            <Sparkles size={12} className="text-primary"/> AI-powered, ATS-optimized
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
            Your next role starts<br/>with a <span className="text-primary">better CV</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Build a polished, ATS-friendly resume in minutes. Rewrite each section with AI, switch templates live, and export a clean PDF.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/builder/$id" params={{ id: "guest" }}>
              <Button size="lg" className="gap-2">Build my CV <ArrowRight size={16}/></Button>
            </Link>
            <Link to="/auth"><Button size="lg" variant="outline">Create free account</Button></Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Free forever · No credit card · Try without signing up</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-14 rounded-2xl border bg-surface p-3 shadow-[var(--shadow-lift)] max-w-4xl mx-auto">
          <div className="rounded-xl bg-white grid grid-cols-2 overflow-hidden text-left">
            <div className="bg-[#0F172A] text-white p-6 text-xs space-y-3">
              <div className="text-lg font-semibold">Jane Doe</div>
              <div className="opacity-70">Senior Product Designer · Berlin</div>
              <div className="text-[10px] uppercase tracking-widest opacity-50 mt-4">Skills</div>
              <div className="flex flex-wrap gap-1">{["Figma","UX","Design Systems","Research"].map(s=> <span key={s} className="px-2 py-0.5 bg-white/10 rounded text-[10px]">{s}</span>)}</div>
            </div>
            <div className="p-6 text-xs text-slate-700 space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Profile</div>
              <p>Product designer with 8+ years shaping consumer fintech experiences for 2M+ users.</p>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-3">Experience</div>
              <div><b>Lead Designer</b> · Acme · 2021–Now</div>
              <div className="opacity-70">Drove the redesign of onboarding, lifting activation +27%.</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Wand2, t: "Rewrite with AI", d: "One click polishes each section in a professional, market-aware tone." },
    { icon: Layout, t: "Beautiful templates", d: "Modern, Minimal, Corporate — switch live without losing data." },
    { icon: Sparkles, t: "ATS optimization", d: "Paste a job description to align keywords and emphasis." },
    { icon: Download, t: "Clean PDF export", d: "Print-ready A4 PDF you can send directly to recruiters." },
  ];
  return (
    <section id="features" className="py-20 border-t bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold tracking-tight">Everything you need, nothing you don't.</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((i) => (
            <div key={i.t} className="rounded-xl border bg-card p-5">
              <div className="size-9 rounded-lg bg-accent text-accent-foreground grid place-items-center"><i.icon size={18}/></div>
              <div className="mt-4 font-medium">{i.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{i.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Fill in your details", d: "Tell us about your experience step-by-step. We save as you type." },
    { n: "02", t: "Polish with AI", d: "Click 'Improve with AI' on any section to rewrite it professionally." },
    { n: "03", t: "Pick a template & export", d: "Switch templates live, then download your A4 PDF instantly." },
  ];
  return (
    <section id="how" className="py-20 border-t">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold tracking-tight">From blank page to job-ready in 10 minutes.</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border p-6">
              <div className="text-xs text-primary font-semibold">{s.n}</div>
              <div className="mt-2 font-medium text-lg">{s.t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Free", price: "$0", desc: "Get your first CV out the door.", features: ["1 CV", "Modern template", "PDF export", "Basic editor"], cta: "Start free", popular: false },
    { name: "Pro", price: "$9", suffix: "/mo", desc: "For active job seekers.", features: ["Unlimited CVs", "All premium templates", "Improve with AI (unlimited)", "ATS keyword alignment", "Priority PDF rendering"], cta: "Coming soon", popular: true },
  ];
  return (
    <section id="pricing" className="py-20 border-t bg-surface">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-center">Simple pricing.</h2>
        <p className="text-center text-muted-foreground mt-2">Start free. Upgrade if you need more.</p>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-7 bg-card ${p.popular ? "ring-2 ring-primary" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="font-medium">{p.name}</div>
                {p.popular && <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">Most popular</span>}
              </div>
              <div className="mt-3 text-4xl font-semibold">{p.price}<span className="text-base text-muted-foreground font-normal">{p.suffix}</span></div>
              <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="text-primary mt-0.5"/> {f}</li>)}
              </ul>
              <Button className="mt-6 w-full" variant={p.popular ? "default" : "outline"} disabled={p.popular}>{p.cta}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { n: "Lena M.", r: "Product Designer, Berlin", q: "Got 3 interviews the week I sent the new version. The AI rewrites are scary good." },
    { n: "Tariq B.", r: "Backend Engineer, Remote", q: "Cleanest CV builder I've used. Took 15 minutes start to finish." },
    { n: "Sofia R.", r: "Marketing Lead, Paris", q: "Adapted my CV for the French market in one click. Real time-saver." },
  ];
  return (
    <section className="py-20 border-t">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold tracking-tight">Loved by job seekers.</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {items.map((t) => (
            <figure key={t.n} className="rounded-xl border p-6 bg-card">
              <div className="flex gap-0.5 text-primary">{Array.from({length:5}).map((_,i)=><Star key={i} size={14} fill="currentColor"/>)}</div>
              <blockquote className="mt-3 text-sm">"{t.q}"</blockquote>
              <figcaption className="mt-4 text-xs text-muted-foreground"><b className="text-foreground">{t.n}</b> · {t.r}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div className="font-semibold">CV Genie</div>
          <p className="text-muted-foreground mt-2">AI-powered CV and Lebenslauf generator. Build a resume that gets you interviews.</p>
        </div>
        <div>
          <div className="font-medium">Product</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><Link to="/auth">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium">Get started</div>
          <p className="text-muted-foreground mt-2">Ready to land your next role?</p>
          <Link to="/builder/$id" params={{ id: "guest" }}><Button size="sm" className="mt-3">Build my CV free</Button></Link>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} CV Genie. All rights reserved.</div>
    </footer>
  );
}
