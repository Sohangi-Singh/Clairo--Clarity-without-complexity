"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { TOOLS } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

const useCasePills = [
  "📄 Writing letters", "🧾 Reading receipts", "⚠️ Understanding legal notices",
  "💼 Job applications", "🏥 Medical reports", "🔍 Detecting scams",
];

const howItWorks = [
  { num: "1", title: "Choose what you need", desc: "Pick from 13 simple tools" },
  { num: "2", title: "Answer a few simple questions", desc: "One question at a time, no confusion" },
  { num: "3", title: "Download your result", desc: "Ready to use, in seconds" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <Link href="/" className="flex items-baseline">
          <span className="logo-wordmark font-display text-[24px] font-semibold">
            <span className="text-[var(--text-primary)]">Cl</span>
            <span className="text-[var(--accent)]">ai</span>
            <span className="text-[var(--text-primary)]">ro</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="px-4 py-2 text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Sign in
          </Link>
          <Link href="/dashboard" className="px-5 py-2.5 text-[14px] font-medium bg-[var(--accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] hover:shadow-accent transition-all">
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 20%, var(--accent-light) 0%, transparent 60%)", opacity: 0.2 }} />
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-6">
            <motion.p variants={fadeUp} className="label-caps" style={{ letterSpacing: "0.1em" }}>
              CLARITY WITHOUT COMPLEXITY
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-display text-[40px] md:text-[64px] font-semibold leading-[1.1]">
              AI that works for<br />your whole{" "}
              <span className="text-[var(--accent)]">family.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[17px] text-[var(--text-secondary)] max-w-[500px]">
              No complicated setup. No confusing steps. Just tell us what you need — we&apos;ll handle the rest. Built for everyone, especially those who thought AI wasn&apos;t for them.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 text-[15px] font-medium bg-[var(--accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] hover:shadow-accent transition-all">
                Try it free — no signup needed <ArrowRight size={16} />
              </Link>
              <a href="#tools" className="inline-flex items-center gap-2 px-6 py-3 text-[15px] font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded-[var(--radius-md)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-all">
                See what Clairo can do
              </a>
            </motion.div>
            <motion.p variants={fadeUp} className="text-[12px] italic text-[var(--text-tertiary)]">
              Free to use. No credit card. No technical knowledge required.
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="hidden md:block">
            <div className="animate-float">
              <div className="bg-[var(--bg-surface)] rounded-[var(--radius-xl)] shadow-lg border border-[var(--border)] p-6 space-y-4">
                <div className="flex items-center gap-2 text-[13px] text-[var(--text-tertiary)]">
                  <span>Step 2 of 5</span>
                  <div className="flex gap-1">
                    {[true, true, false, false, false].map((filled, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${filled ? "bg-[var(--accent)]" : "bg-[var(--bg-overlay)]"}`} />
                    ))}
                  </div>
                </div>
                <h3 className="text-[18px] font-medium text-[var(--text-primary)]">Who is this letter for?</h3>
                <p className="text-[13px] text-[var(--text-secondary)]">This could be a bank, school, or government office.</p>
                <div className="grid grid-cols-2 gap-2">
                  {["🏦 Bank", "🏫 School", "🏛️ Government", "🏢 Company"].map((o) => (
                    <div key={o} className="p-3 text-[14px] text-center border border-[var(--border)] rounded-[var(--radius-md)]">{o}</div>
                  ))}
                </div>
                <p className="text-[12px] text-[var(--text-tertiary)]">I&apos;m not sure — help me decide</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-[var(--border)] py-4 overflow-hidden">
        <div className="flex items-center gap-4 px-6 md:px-12">
          <span className="text-[13px] text-[var(--text-tertiary)] flex-shrink-0">Works for:</span>
          <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {useCasePills.map((pill) => (
              <span key={pill} className="flex-shrink-0 px-3 py-1.5 text-[13px] bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-[var(--radius-full)] border border-[var(--border)]">{pill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <AnimatedSection className="text-center mb-12">
          <motion.h2 variants={fadeUp} className="font-display text-[32px] md:text-[40px] font-semibold">13 tools. Built for real life.</motion.h2>
          <motion.p variants={fadeUp} className="text-[17px] text-[var(--text-secondary)] mt-3 max-w-xl mx-auto">Every tool is designed around what real people actually struggle with.</motion.p>
        </AnimatedSection>
        <AnimatedSection className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <motion.div key={tool.id} variants={fadeUp}>
              <Link href={tool.href} className="group flex flex-col gap-2 p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-lg)] hover:border-l-[3px] hover:border-l-[var(--accent)] hover:shadow-md transition-all">
                <span className="text-[28px]">{tool.emoji}</span>
                <span className="text-[15px] font-medium text-[var(--text-primary)]">{tool.name}</span>
                <span className="text-[12px] text-[var(--text-secondary)]">{tool.description}</span>
                <ArrowRight size={14} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all mt-1" />
              </Link>
            </motion.div>
          ))}
        </AnimatedSection>
      </section>

      {/* How it works */}
      <section className="bg-[var(--bg-surface)] border-y border-[var(--border)] py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <AnimatedSection className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="font-display text-[32px] md:text-[40px] font-semibold">How it works</motion.h2>
          </AnimatedSection>
          <AnimatedSection className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <motion.div key={step.num} variants={fadeUp} className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-semibold text-[16px]">{step.num}</div>
                <h3 className="text-[17px] font-medium text-[var(--text-primary)]">{step.title}</h3>
                <p className="text-[14px] text-[var(--text-secondary)]">{step.desc}</p>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Personal story */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-[var(--accent-light)] rounded-[var(--radius-xl)] p-8 md:p-12 text-center">
          <p className="font-display text-[22px] md:text-[28px] italic text-[var(--text-primary)] leading-relaxed max-w-2xl mx-auto">
            &ldquo;I watched my parents spend hours on tasks that took me minutes with AI. I built Clairo so that gap doesn&apos;t exist anymore.&rdquo;
          </p>
          <p className="text-[15px] font-medium text-[var(--text-primary)] mt-6">— The Founder</p>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1">Built for my family. Designed for yours.</p>
        </motion.div>
      </section>

      {/* Languages */}
      <section className="bg-[var(--bg-surface)] border-y border-[var(--border)] py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-display text-[32px] md:text-[40px] font-semibold mb-4">Clairo speaks your language.</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {["English", "Hindi", "Hinglish", "Tamil", "Telugu", "Bengali", "Marathi", "Kannada", "Malayalam", "Gujarati", "Punjabi"].map((lang) => (
              <span key={lang} className="px-4 py-2 text-[14px] bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-[var(--radius-full)] border border-[var(--border)]">{lang}</span>
            ))}
          </div>
          <p className="text-[15px] text-[var(--text-secondary)] max-w-md mx-auto">Type in Hindi, speak in Tamil, write in Hinglish. Clairo understands you — in any language.</p>
        </div>
      </section>

      {/* Family Mode */}
      <section className="bg-[var(--bg-elevated)] py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <span className="text-[48px]">👨‍👩‍👧‍👦</span>
          <h2 className="font-display text-[28px] md:text-[36px] font-semibold mt-4 mb-4">Made for your whole family.</h2>
          <p className="text-[16px] text-[var(--text-secondary)] max-w-lg mx-auto mb-6">
            Family Mode makes Clairo even simpler — bigger buttons, larger text, and voice-first interactions designed for parents and elderly users.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--accent)] font-medium hover:underline">
            Learn about Family Mode <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--bg-surface)] border-t border-[var(--border)] py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-baseline mb-2">
                <span className="logo-wordmark font-display text-[22px] font-semibold">
                  <span className="text-[var(--text-primary)]">Cl</span>
                  <span className="text-[var(--accent)]">ai</span>
                  <span className="text-[var(--text-primary)]">ro</span>
                </span>
              </div>
              <p className="text-[13px] text-[var(--text-tertiary)]">Clarity without complexity</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TOOLS.slice(0, 6).map((t) => (
                <Link key={t.id} href={t.href} className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{t.name}</Link>
              ))}
            </div>
            <div className="text-right">
              <p className="text-[13px] text-[var(--text-secondary)]">Made with care in India 🇮🇳</p>
              <p className="text-[11px] text-[var(--text-tertiary)] mt-1">Powered by Google Gemini</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
