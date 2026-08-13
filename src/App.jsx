import { useState } from "react";

// ─── PII Type Definitions ─────────────────────────────────────────────────────
const PII_TYPES = [
  {
    id: "names",
    label: "Full Names",
    icon: (
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    ),
    color: "from-violet-500 to-purple-600",
    accent: "#8b5cf6",
    rule: "Names → replace with realistic fake names like 'Arjun Sharma'",
  },
  {
    id: "emails",
    label: "Email Addresses",
    icon: (
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    ),
    color: "from-sky-500 to-blue-600",
    accent: "#0ea5e9",
    rule: "Emails → replace with realistic emails like 'arjun.sharma@example.com'",
  },
  {
    id: "phones",
    label: "Phone Numbers",
    icon: (
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    ),
    color: "from-emerald-500 to-teal-600",
    accent: "#10b981",
    rule: "Phones → replace with fake phone numbers like '+91 98000 00000'",
  },
  {
    id: "companies",
    label: "Company Names",
    icon: (
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
    ),
    color: "from-amber-500 to-orange-600",
    accent: "#f59e0b",
    rule: "Companies → replace with realistic fake company names like 'Apex Industries Ltd'",
  },
  {
    id: "addresses",
    label: "Physical Addresses",
    icon: (
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    ),
    color: "from-rose-500 to-pink-600",
    accent: "#f43f5e",
    rule: "Addresses → replace with realistic fake addresses like '42 Model Town, Sector 7, Delhi 110001'",
  },
  {
    id: "ssn",
    label: "Tax / ID Numbers",
    icon: (
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 14h16V6H4v12zm4-8h8v2H8v-2zm0 4h8v2H8v-2z" />
    ),
    color: "from-indigo-500 to-blue-700",
    accent: "#6366f1",
    rule: "Tax/SSN/IDs → replace with masked or fake IDs like 'XXXX XXXX XXXX'",
  },
  {
    id: "creditcards",
    label: "Credit Cards",
    icon: (
      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    ),
    color: "from-cyan-500 to-sky-700",
    accent: "#06b6d4",
    rule: "Credit cards → replace with fake cards like '4000 0000 0000 0000'",
  },
  {
    id: "dob",
    label: "Dates of Birth",
    icon: (
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
    ),
    color: "from-fuchsia-500 to-purple-700",
    accent: "#d946ef",
    rule: "DOB → replace with fake dates of birth like '01/01/1980'",
  },
  {
    id: "ips",
    label: "IP Addresses",
    icon: (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    ),
    color: "from-lime-500 to-green-700",
    accent: "#84cc16",
    rule: "IPs → replace with safe IP placeholders like '10.0.0.1'",
  },
];

const SAMPLE = `Sarthak Malvadkar is the Company Secretary at KSH International Limited.
He can be reached at cs.connect@kshinternational.com or +91 20 4505 3237.
Registered office: 11/3 Village Birdewadi, Chakan Taluka, Pune 410501, Maharashtra.
Promoter Kushal Subbayya Hegde (DOB: 14/03/1965) holds shares worth 1528 million.
His ID on file: [Aadhaar Redacted]. Card on file: 4111 1111 1111 1111. Server IP: 203.192.45.11.

Please reference Order Number: #ORD-99812-B and Support Ticket: TICK-45091. 
These are not sensitive PII and should be explicitly ignored by the redactor to ensure high precision.`;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// ─── Sub-components ───────────────────────────────────────────────────────────

function PrimaryBtn({ onClick, disabled, loading, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative inline-flex items-center gap-2.5 rounded-xl font-bold text-sm
        px-5 py-2.5 transition-all duration-300 select-none overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-[#0d0f14]
        active:scale-[0.97]
        ${disabled
          ? "bg-[#1e2130] text-slate-600 cursor-not-allowed border border-[#252940]"
          : "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] border border-indigo-400/20 cursor-pointer"}
      `}
    >
      {/* shimmer sweep on hover */}
      {!disabled && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
      )}
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
}

function GhostBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 rounded-xl font-semibold text-sm
        px-4 py-2 transition-all duration-200 select-none
        focus:outline-none focus:ring-2 focus:ring-slate-500/40 focus:ring-offset-2 focus:ring-offset-[#0d0f14]
        active:scale-[0.97]
        ${disabled
          ? "text-slate-700 cursor-not-allowed bg-transparent border border-[#1e2336]"
          : "text-slate-300 bg-[#161928] hover:bg-[#1e2336] border border-[#252a40] hover:border-[#334155] cursor-pointer hover:text-white"}
      `}
    >
      {children}
    </button>
  );
}

function Checkbox({ on }) {
  return (
    <span
      className={`
        w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center
        transition-all duration-200 border
        ${on
          ? "bg-gradient-to-br from-indigo-500 to-violet-600 border-indigo-500/50 shadow-sm shadow-indigo-500/30"
          : "bg-[#0d1020] border-[#2a3050] group-hover:border-indigo-500/40"}
      `}
    >
      {on && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  );
}

function TabButton({ label, active, disabled, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-5 py-4 text-sm font-bold transition-all duration-200
        border-b-2 whitespace-nowrap flex items-center gap-2.5 group
        ${active
          ? "border-indigo-500 text-indigo-400"
          : disabled
            ? "border-transparent text-slate-700 cursor-not-allowed"
            : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600 cursor-pointer"}
      `}
    >
      {label}
      {badge != null && (
        <span
          className={`
            px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide
            ${active ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-[#1e2336] text-slate-500 border border-[#2a3050]"}
          `}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, gradient, delay = 0 }) {
  return (
    <div
      className="relative bg-[#111827] border border-[#1e2740] rounded-2xl p-6 overflow-hidden animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-6 -mt-6 blur-xl`} />
      <div className={`text-4xl font-black tracking-tight bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="text-xs font-semibold text-slate-500 mt-2 uppercase tracking-widest">{label}</div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [text, setText]       = useState(SAMPLE);
  const [enabled, setEnabled] = useState(Object.fromEntries(PII_TYPES.map(t => [t.id, true])));
  const [result, setResult]   = useState(null);
  const [tab, setTab]         = useState("input");
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const [copied, setCopied]   = useState(false);

  const allOn      = Object.values(enabled).every(Boolean);
  const toggle     = (id) => setEnabled(p => ({ ...p, [id]: !p[id] }));
  const toggleAll  = () => setEnabled(Object.fromEntries(PII_TYPES.map(t => [t.id, !allOn])));
  const wordCount  = (t) => (t || "").trim().split(/\s+/).filter(Boolean).length;
  const totalFound = result ? Object.values(result.counts || {}).reduce((a, b) => a + b, 0) : 0;
  const typesFound = result ? Object.values(result.counts || {}).filter(v => v > 0).length : 0;

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setErr("");
    setResult(null);

    const activeTypes = PII_TYPES.filter(t => enabled[t.id]);
    const typesList = activeTypes.map(t => t.label).join(", ");
    const typeRules = activeTypes.map(t => `- ${t.rule}`).join("\n");

    const prompt = `You are a strict PII redaction engine. Your goal is to maximize RECALL (catch every instance of requested PII) while maintaining absolute PRECISION (never redact non-PII data).

Requested PII categories to redact: ${typesList}.

1. RECALL INSTRUCTIONS:
- Perform a thorough pass. If a word or phrase looks like it fits the requested PII category, redact it.
- NEVER use "[REDACTED]" or blank it out. Always replace with a realistic fake.
Replacement Rules:
${typeRules}

2. PRECISION INSTRUCTIONS (Do NOT redact):
- DO NOT redact generic system identifiers.
- DO NOT redact Order Numbers, Ticket Numbers, Invoice IDs, receipt IDs, or product SKUs (e.g. #ORD-99812, TICK-45091). These are NOT sensitive PII.
- Only redact exactly the categories requested above.

Reply ONLY with raw JSON in this format:
{"redacted":"<full redacted text>","items":[{"type":"<pii type>","original":"<original>","fake":"<replacement>"}],"counts":{"<type label>":<number>}}

Text:
${text}`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "API request failed");

      const raw = data.choices[0].message.content.trim();
      setResult(JSON.parse(raw));
      setTab("output");
    } catch (error) {
      console.error("API Error:", error);
      setErr("Redaction failed — please verify your Groq API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    if (!result?.redacted) return;
    navigator.clipboard?.writeText(result.redacted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex h-screen text-slate-200 overflow-hidden"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: "linear-gradient(135deg, #0a0c12 0%, #0d1020 50%, #0a0e1a 100%)",
      }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        className="w-[268px] flex-shrink-0 flex flex-col z-20 relative"
        style={{
          background: "linear-gradient(180deg, #0f1220 0%, #0b0e1a 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "4px 0 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-4.5 h-4.5 text-white w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {/* glow ring */}
              <span className="absolute inset-0 rounded-xl ring-1 ring-indigo-400/30" />
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-white tracking-tight leading-none">SafeRedact</div>
              <div className="text-[10px] font-semibold text-indigo-400/70 mt-0.5 tracking-widest uppercase">AI Privacy Engine</div>
            </div>
          </div>
        </div>

        {/* Select All */}
        <button
          onClick={toggleAll}
          className="group flex items-center justify-between px-6 py-3.5 w-full text-left border-b border-white/5 transition-colors hover:bg-white/[0.03] cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
            {allOn ? "Deselect All" : "Select All"}
          </span>
          <Checkbox on={allOn} />
        </button>

        {/* Scanner List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3">
          {PII_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => toggle(t.id)}
              className="group flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-xl transition-all duration-200 mb-1 cursor-pointer hover:bg-white/[0.04] active:scale-[0.98]"
            >
              {/* Icon chip */}
              <div
                className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                  enabled[t.id]
                    ? `bg-gradient-to-br ${t.color} shadow-sm`
                    : "bg-[#1a1f30]"
                }`}
              >
                <svg
                  className={`w-4 h-4 transition-colors ${enabled[t.id] ? "text-white" : "text-slate-600 group-hover:text-slate-500"}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {t.icon}
                </svg>
              </div>

              <span
                className={`flex-1 text-sm font-semibold transition-colors ${
                  enabled[t.id] ? "text-slate-200" : "text-slate-600 group-hover:text-slate-500"
                }`}
              >
                {t.label}
              </span>

              <Checkbox on={enabled[t.id]} />
            </button>
          ))}
        </div>

        {/* Footer badge */}
        <div className="px-6 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Llama 3.3 · 70B</span>
          </div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Tab Bar */}
        <div
          className="px-8 flex items-end justify-between z-10"
          style={{
            background: "rgba(10,12,20,0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex gap-1">
            <TabButton label="Input Document" active={tab === "input"} onClick={() => setTab("input")} />
            <TabButton
              label="Redacted Output"
              active={tab === "output"}
              disabled={!result}
              onClick={() => setTab("output")}
            />
            <TabButton
              label="Audit Report"
              active={tab === "report"}
              disabled={!result}
              badge={result ? totalFound : null}
              onClick={() => setTab("report")}
            />
          </div>

          <div className="pb-3.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Groq · Fast Mode
            </span>
          </div>
        </div>

        {/* Page Body */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">

          {/* ── INPUT TAB ── */}
          {tab === "input" && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-lg font-extrabold text-white tracking-tight">Source Document</h1>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Paste the text you want to anonymize below</p>
                </div>
                <div className="flex gap-2">
                  <GhostBtn onClick={() => setText(SAMPLE)}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Load Sample
                  </GhostBtn>
                  <GhostBtn onClick={() => { setText(""); setResult(null); }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear
                  </GhostBtn>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative group">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Paste your sensitive document here…"
                  className="
                    w-full h-72 p-5 rounded-2xl resize-none outline-none
                    text-slate-200 font-medium text-[14px] leading-relaxed
                    placeholder-slate-700 transition-all duration-300
                    custom-scrollbar
                  "
                  style={{
                    background: "rgba(15,18,30,0.8)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                  onFocus={e => {
                    e.target.style.border = "1px solid rgba(99,102,241,0.5)";
                    e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.4), 0 0 0 3px rgba(99,102,241,0.1)";
                  }}
                  onBlur={e => {
                    e.target.style.border = "1px solid rgba(255,255,255,0.07)";
                    e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.4)";
                  }}
                />
              </div>

              {/* Footer bar */}
              <div
                className="flex items-center justify-between mt-4 px-5 py-3.5 rounded-2xl"
                style={{
                  background: "rgba(15,18,30,0.6)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <span>{wordCount(text)} words</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span>{text.length} chars</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span>{Object.values(enabled).filter(Boolean).length} scanners active</span>
                </div>

                <PrimaryBtn onClick={run} disabled={loading || !text.trim()}>
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Scrubbing data…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Redact PII Now
                    </>
                  )}
                </PrimaryBtn>
              </div>

              {/* Error */}
              {err && (
                <div
                  className="mt-4 p-4 rounded-xl flex items-start gap-3 text-sm font-semibold animate-fade-in"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#f87171",
                  }}
                >
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {err}
                </div>
              )}
            </div>
          )}

          {/* ── OUTPUT TAB ── */}
          {tab === "output" && result && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-lg font-extrabold text-white tracking-tight">Cleaned Document</h1>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">All detected PII has been replaced with realistic fakes</p>
                </div>
                <PrimaryBtn onClick={copyText}>
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Copy Result
                    </>
                  )}
                </PrimaryBtn>
              </div>

              <div
                className="p-6 rounded-2xl text-sm font-medium leading-relaxed text-slate-300 min-h-[240px] whitespace-pre-wrap break-words"
                style={{
                  background: "rgba(15,18,30,0.8)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)",
                  lineHeight: "1.9",
                }}
              >
                {result.redacted}
              </div>

              {/* Mini stats strip */}
              <div className="mt-4 flex gap-4">
                <div
                  className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
                >
                  <span className="text-2xl font-black text-indigo-400">{totalFound}</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">items replaced</span>
                </div>
                <div
                  className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}
                >
                  <span className="text-2xl font-black text-emerald-400">{typesFound}</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">types detected</span>
                </div>
              </div>
            </div>
          )}

          {/* ── REPORT TAB ── */}
          {tab === "report" && result && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard value={totalFound} label="Total Found" gradient="from-indigo-400 to-violet-500" delay={0} />
                <StatCard value={typesFound} label="Categories" gradient="from-violet-400 to-fuchsia-500" delay={60} />
                <StatCard value={result.items?.length || 0} label="Replacements" gradient="from-emerald-400 to-teal-500" delay={120} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Breakdown bar chart */}
                <div
                  className="md:col-span-2 p-5 rounded-2xl"
                  style={{
                    background: "rgba(15,18,30,0.8)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <h2 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-5">Detection Breakdown</h2>
                  {Object.entries(result.counts || {})
                    .filter(([, v]) => v > 0)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count], i) => {
                      const piiType = PII_TYPES.find(p => p.label === type);
                      return (
                        <div key={type} className="mb-4 last:mb-0 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-slate-400">{type}</span>
                            <span className="text-slate-300">{count}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${piiType?.color || "from-indigo-500 to-violet-500"} transition-all duration-700`}
                              style={{ width: `${Math.round((count / (totalFound || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Ledger table */}
                <div
                  className="md:col-span-3 rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    background: "rgba(15,18,30,0.8)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <h2 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Replacement Ledger</h2>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-500"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {result.items?.length || 0} entries
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {["Type", "Original", "Replacement"].map(h => (
                            <th
                              key={h}
                              className="px-5 py-3 text-[9px] font-extrabold text-slate-600 uppercase tracking-widest sticky top-0"
                              style={{ background: "rgba(15,18,30,0.95)" }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(result.items || []).map((item, i) => {
                          const piiType = PII_TYPES.find(p => p.label === item.type);
                          return (
                            <tr
                              key={i}
                              className="transition-colors"
                              style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                              <td className="px-5 py-3.5">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r ${piiType?.color || "from-indigo-500 to-violet-600"} text-white`}
                                >
                                  {item.type}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-rose-400 font-medium line-through decoration-rose-400/30 max-w-[110px] truncate">
                                {item.original}
                              </td>
                              <td className="px-5 py-3.5 text-xs text-emerald-400 font-semibold max-w-[130px] truncate">
                                {item.fake}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}