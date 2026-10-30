// PrivacyLens.jsx — landing page + protected configuration dashboard
// Deps: npm i framer-motion lucide-react   (Tailwind CSS v3+ with arbitrary values)
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  Eye, ShieldCheck, Bug, Cloud, Radar, ScanSearch, Replace, ShieldAlert,
  Lock, LayoutDashboard, KeyRound, Fingerprint, CreditCard, TrendingDown,
} from "lucide-react";

/* ---------- shared bits ---------- */
const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };
const glass = "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl";

// Gold pill whose label cycles — the animated "tag toggle" used in titles
function TagToggle({ words, className = "" }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words]);
  return (
    <span className={`inline-flex overflow-hidden rounded-full border border-[#dea93c]/50 bg-[#dea93c]/10 px-4 align-baseline font-mono text-[#dea93c] shadow-[0_0_30px_#dea93c33] ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span key={words[i]} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.3 }}>
          [{words[i]}]
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-28">
      <motion.h2 variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
        className="mb-14 max-w-3xl font-serif text-4xl tracking-tight md:text-6xl">
        {title}
      </motion.h2>
      {children}
    </section>
  );
}

/* ---------- 1. hero ---------- */
function ThreatShield() {
  return (
    <div className={`relative h-72 w-full overflow-hidden md:h-96 ${glass} bg-[radial-gradient(circle_at_50%_50%,#dea93c14,transparent_60%)]`}>
      <div className="absolute left-5 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2 text-red-400">
        <Bug size={40} /><span className="text-xs">AI scraper</span>
      </div>
      <div className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2 text-white/70">
        <Cloud size={40} /><span className="text-xs">Cloud LLM</span>
      </div>
      {/* attack packets: blocked at the shield */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span key={`a${i}`} className="absolute h-2.5 w-2.5 rounded-full bg-[#7d0508] shadow-[0_0_14px_#ff2a35]"
          style={{ top: `${26 + i * 11}%` }}
          animate={{ left: ["20%", "42%"], opacity: [0, 1, 0], scale: [1, 1, 2.2] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.32, ease: "easeIn" }} />
      ))}
      {/* sanitized packets: pass through */}
      {[0, 1, 2].map((i) => (
        <motion.span key={`g${i}`} className="absolute top-1/2 h-2 w-2 rounded-full bg-[#dea93c] shadow-[0_0_12px_#dea93c]"
          animate={{ left: ["58%", "78%"], opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6 }} />
      ))}
      <motion.div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#dea93c]/60 bg-black/60 text-[#dea93c]"
        animate={{ boxShadow: ["0 0 30px #dea93c44", "0 0 80px #dea93c99", "0 0 30px #dea93c44"] }}
        transition={{ duration: 2.4, repeat: Infinity }}>
        <ShieldCheck size={56} strokeWidth={1.5} />
      </motion.div>
    </div>
  );
}

function Hero({ goDash }) {
  return (
    <header className="relative overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#7d050866,transparent),linear-gradient(to_bottom,#000,#0a0203)] px-6 pb-24 pt-40">
      <motion.div variants={stagger} initial="hidden" animate="show" className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <motion.h1 variants={fade} className="font-serif text-6xl leading-[0.95] tracking-tight sm:text-7xl xl:text-8xl">
            Compute Locally.
            <span className="block bg-gradient-to-r from-[#dea93c] to-[#f6dc9a] bg-clip-text text-transparent">Reason Globally.</span>
          </motion.h1>
          <motion.p variants={fade} className="mt-8 max-w-md text-xl text-white/60">
            The AI Privacy Paradox: Convenience vs. Exposure.
          </motion.p>
          <motion.p variants={fade} className="mt-4 text-lg text-white/80">
            Your <TagToggle words={["CARD", "OTP", "AADHAAR", "PAN"]} /> never leaves the browser.
          </motion.p>
          <motion.div variants={fade} className="mt-10 flex flex-wrap gap-4">
            <a href="#demo" className="rounded-full bg-[#dea93c] px-7 py-3 font-semibold text-black transition hover:brightness-110">See the redaction</a>
            <button onClick={goDash} className="rounded-full border border-white/20 px-7 py-3 transition hover:border-[#dea93c] hover:text-[#dea93c]">Open dashboard</button>
          </motion.div>
        </div>
        <motion.div variants={fade}><ThreatShield /></motion.div>
      </motion.div>
    </header>
  );
}

/* ---------- 2. before / after redaction demo ---------- */
const Pill = ({ children }) => (
  <span className="mx-0.5 inline-flex rounded-full border border-[#dea93c]/60 bg-[#dea93c]/15 px-2.5 py-0.5 font-mono text-xs font-semibold text-[#dea93c] shadow-[0_0_14px_#dea93c66]">{children}</span>
);
const Secret = ({ redacted, tag, raw }) =>
  redacted ? <Pill>[REDACTED: {tag}]</Pill> : <span className="rounded bg-[#7d0508]/50 px-1.5 font-mono text-red-200">{raw}</span>;

function Checkout({ redacted }) {
  const row = "flex items-center justify-between border-b border-white/10 py-3 text-sm";
  return (
    <div className="p-6 sm:p-10">
      <p className="mb-6 font-serif text-2xl">Checkout · ShopKart</p>
      <div className={row}><span className="text-white/50">Name</span><span>Aarav Mehta</span></div>
      <div className={row}><span className="text-white/50">Card</span><Secret redacted={redacted} tag="CARD" raw="4111 1111 1111 1111" /></div>
      <div className={row}><span className="text-white/50">Total</span><span>₹4,299.00</span></div>
      <div className="mt-6 space-y-3 text-sm">
        <p className="max-w-xs rounded-2xl rounded-bl-sm bg-white/10 p-3">Bank: Your OTP is <Secret redacted={redacted} tag="OTP" raw="482913" />. Never share it.</p>
        <p className="ml-auto max-w-xs rounded-2xl rounded-br-sm bg-[#dea93c]/20 p-3">AI assistant: Want me to autofill the payment form?</p>
      </div>
    </div>
  );
}

function RedactionDemo() {
  const [pos, setPos] = useState(50);
  return (
    <Section id="demo" title={<>What the model sees: <TagToggle words={["CARD", "OTP"]} className="text-[0.8em]" /> instead of your data.</>}>
      <div className={`relative grid select-none overflow-hidden ${glass} bg-black/60`}>
        <div className="col-start-1 row-start-1"><Checkout redacted={false} /></div>
        <div className="col-start-1 row-start-1 bg-[#0b0708]" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}><Checkout redacted /></div>
        <span className="absolute bottom-3 left-4 text-xs text-red-300">Raw page</span>
        <span className="absolute bottom-3 right-4 text-xs text-[#dea93c]">Sent to the LLM</span>
        <div className="pointer-events-none absolute inset-y-0 w-px bg-[#dea93c]" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 -ml-4 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-[#dea93c] text-black shadow-[0_0_24px_#dea93c]"><Eye size={16} /></span>
        </div>
        <input aria-label="Compare raw and redacted" type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)}
          className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0" />
      </div>
    </Section>
  );
}

/* ---------- 3. architecture bento ---------- */
const ARCH = [
  { icon: Radar, title: "Local Interceptor", sub: "Intercepts DOM & JSON", text: "Hooks fetch, XHR and DOM mutations so every outgoing payload is inspected before it leaves the browser.", span: "md:col-span-2" },
  { icon: ScanSearch, title: "Detection Engine", sub: "Regex & local NER", text: "Pattern rules plus an on-device entity model flag cards, IDs and OTPs.", span: "" },
  { icon: Replace, title: "HTML Sanitizer", sub: "Swaps sensitive data", text: "Matches are swapped for typed placeholders and restored locally when the answer returns.", span: "" },
  { icon: ShieldAlert, title: "Outbound Guardrail", sub: "Blocks prompt injection", text: "Hidden instructions in pages and replies are stripped or blocked before the agent can act on them.", span: "md:col-span-2" },
];

function Architecture() {
  return (
    <Section id="architecture" title="Four stages, all on your device.">
      <div className="grid gap-5 md:grid-cols-3">
        {ARCH.map(({ icon: Icon, title, sub, text, span }, i) => (
          <motion.article key={title}
            initial={{ opacity: 0, rotateX: -90 }} whileInView={{ opacity: 1, rotateX: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1000, transformOrigin: "top" }}
            className={`${glass} ${span} p-8 transition duration-300 hover:border-[#7d0508] hover:shadow-[0_0_40px_-4px_#7d0508]`}>
            <Icon className="mb-8 text-[#dea93c]" size={32} strokeWidth={1.5} />
            <h3 className="font-serif text-2xl">{title}</h3>
            <p className="mt-1 text-sm text-[#dea93c]">{sub}</p>
            <p className="mt-4 max-w-md text-white/60">{text}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ---------- 4. dashboard (protected) ---------- */
const FILTERS = [
  { id: "pan", label: "PAN", re: "[A-Z]{5}[0-9]{4}[A-Z]", icon: Fingerprint, data: [3, 5, 2, 8, 6, 9, 4, 7] },
  { id: "aadhaar", label: "Aadhaar", re: "\\b\\d{4}\\s?\\d{4}\\s?\\d{4}\\b", icon: KeyRound, data: [2, 4, 6, 3, 7, 5, 8, 4] },
  { id: "card", label: "Credit cards", re: "\\b(?:\\d[ -]*?){13,16}\\b", icon: CreditCard, data: [5, 7, 4, 9, 6, 11, 8, 10] },
];
const HOURS = ["9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p"];

function Toggle({ on, onChange, label }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dea93c] ${on ? "bg-[#dea93c]" : "bg-white/15"}`}>
      <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow ${on ? "right-0.5" : "left-0.5"}`} />
    </button>
  );
}

function Dashboard() {
  const [on, setOn] = useState({ pan: true, aadhaar: true, card: true });
  const [hover, setHover] = useState(null);
  const series = useMemo(() => HOURS.map((_, h) => FILTERS.reduce((s, f) => s + (on[f.id] ? f.data[h] : 0), 0)), [on]);
  const max = useMemo(() => Math.max(...HOURS.map((_, h) => FILTERS.reduce((s, f) => s + f.data[h], 0))), []);
  const total = series.reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <h1 className="mb-12 font-serif text-5xl tracking-tight md:text-6xl">Privacy rules</h1>
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5 lg:grid-cols-5">
        <motion.section variants={fade} className={`${glass} p-8 lg:col-span-2`}>
          <h2 className="mb-6 text-lg font-semibold">Regex filters</h2>
          <ul className="space-y-6">
            {FILTERS.map(({ id, label, re, icon: Icon }) => (
              <li key={id} className="flex items-center gap-4">
                <Icon className={on[id] ? "text-[#dea93c]" : "text-white/30"} />
                <div className="min-w-0 flex-1">
                  <p>{label}</p>
                  <code className="block truncate font-mono text-xs text-white/40">/{re}/</code>
                </div>
                <Toggle on={on[id]} label={`Filter ${label}`} onChange={(v) => setOn({ ...on, [id]: v })} />
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={fade} className={`${glass} p-8 lg:col-span-3`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">Data leaks prevented today</h2>
              <motion.p key={total} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-2 font-serif text-6xl text-[#dea93c]">{total}</motion.p>
            </div>
            <TrendingDown className="text-white/30" />
          </div>
          <div className="mt-8 flex h-48 items-end gap-2 sm:gap-3" onMouseLeave={() => setHover(null)}>
            {series.map((v, i) => (
              <button key={HOURS[i]} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} aria-label={`${HOURS[i]}: ${v} leaks prevented`}
                className="flex h-full flex-1 items-end rounded-t-lg outline-none">
                <motion.div className={`w-full rounded-t-lg ${hover === i ? "bg-[#dea93c] shadow-[0_0_24px_#dea93c88]" : "bg-gradient-to-t from-[#7d0508] to-[#dea93c]/70"}`}
                  initial={{ height: 0 }} animate={{ height: `${Math.max((v / max) * 100, 2)}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18, delay: hover === null ? i * 0.05 : 0 }} />
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2 text-xs text-white/40 sm:gap-3">{HOURS.map((h) => <span key={h} className="flex-1 text-center">{h}</span>)}</div>
          <p className="mt-5 h-5 text-sm text-white/70">
            {hover === null ? "Hover a bar for the hourly count." : `${HOURS[hover]} · ${series[hover]} leaks blocked`}
          </p>
        </motion.section>
      </motion.div>
    </div>
  );
}

// Stub gate — replace with your real auth check (e.g. a react-router <Navigate> guard)
function Gate({ onAuth }) {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className={`${glass} w-full max-w-sm p-10 text-center`}>
        <Lock className="mx-auto mb-5 text-[#dea93c]" size={36} />
        <h1 className="font-serif text-3xl">Sign in to continue</h1>
        <p className="mt-3 text-sm text-white/50">Your privacy rules are only visible to you.</p>
        <button onClick={onAuth} className="mt-8 w-full rounded-full bg-[#dea93c] py-3 font-semibold text-black transition hover:brightness-110">Sign in</button>
      </div>
    </div>
  );
}

/* ---------- app shell ---------- */
export default function PrivacyLens() {
  const [view, setView] = useState("home");
  const [authed, setAuthed] = useState(false);
  const go = (v) => { setView(v); window.scrollTo({ top: 0 }); };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-black text-white antialiased selection:bg-[#dea93c] selection:text-black">
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <button onClick={() => go("home")} className="flex items-center gap-2 font-serif text-xl">
              <Eye className="text-[#dea93c]" size={22} /> PrivacyLens
            </button>
            <div className="flex items-center gap-6 text-sm text-white/70">
              {view === "home" && <a href="#architecture" className="hidden hover:text-white sm:block">Architecture</a>}
              <button onClick={() => go(view === "home" ? "dash" : "home")}
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 transition hover:border-[#dea93c] hover:text-[#dea93c]">
                <LayoutDashboard size={16} /> {view === "home" ? "Dashboard" : "Home"}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence mode="wait">
          <motion.main key={view} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            {view === "home" ? (
              <>
                <Hero goDash={() => go("dash")} />
                <RedactionDemo />
                <Architecture />
                <footer className="border-t border-white/10 py-10 text-center text-sm text-white/40">PrivacyLens · Compute locally. Reason globally.</footer>
              </>
            ) : authed ? <Dashboard /> : <Gate onAuth={() => setAuthed(true)} />}
          </motion.main>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
