import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Badge from "../components/Badge";
import { useTheme } from "../ThemeContext";
import { THEME_TAGS, SENTIMENT_STYLE, THEME_STYLE } from "../constants";

const STEPS = [
  {
    n: "01",
    title: "Paste raw reviews",
    description: "Drop in guest feedback from Google, Booking.com, or anywhere else — one review per line, no formatting needed.",
  },
  {
    n: "02",
    title: "AI reads and tags each one",
    description: "A language model (via Groq) scores sentiment, picks the most relevant theme, and drafts a reply — for every review, in one pass.",
  },
  {
    n: "03",
    title: "Review, edit, and respond",
    description: "Results land in History where you can search, correct a tag, or copy a draft reply to send back to the guest.",
  },
];

const STACK = [
  { label: "React + Vite", note: "Frontend" },
  { label: "FastAPI", note: "Backend API" },
  { label: "PostgreSQL", note: "Storage" },
  { label: "Groq (Llama 3.3)", note: "Classification" },
  { label: "JWT + bcrypt", note: "Authentication" },
];

export default function About() {
  const { tokens } = useTheme();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: tokens.bg }}>
      <Navbar />

      {/* ── Header, matches the Hero's eyebrow/heading pattern ───────────── */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: tokens.surface, borderBottom: `1px solid ${tokens.border}`,
        padding: "3rem 1.5rem 2.75rem",
      }}>
        <svg
          aria-hidden="true"
          viewBox="0 0 800 220"
          preserveAspectRatio="none"
          style={{ position: "absolute", top: 0, right: 0, height: "100%", width: "40%", opacity: tokens.bg === "#fafaf9" ? 0.45 : 0.2, pointerEvents: "none" }}
        >
          <path d="M -20 170 Q 120 140 220 165 T 420 145 Q 560 125 620 95 T 860 40" fill="none" stroke={tokens.accent} strokeWidth="1.2" opacity="0.3" />
          <path d="M -20 195 Q 140 165 240 190 T 460 170 Q 590 150 660 115 T 880 60" fill="none" stroke={tokens.accent} strokeWidth="1.2" opacity="0.2" />
        </svg>
        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}>
          <p style={{
            fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
            color: tokens.accent, margin: "0 0 0.7rem",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 14, height: 1.5, background: tokens.accent, display: "inline-block" }} />
            About this tool
          </p>
          <h1 style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.015em", lineHeight: 1.2, color: tokens.text, margin: "0 0 0.85rem", maxWidth: 600 }}>
            Built so Trishul's team spends less time reading reviews, and more time acting on them.
          </h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: tokens.textMuted, margin: 0, maxWidth: 560 }}>
            TrishulReviews (internally called GuestLens) is a small internal tool for Trishul
            Eco-Homestays in Uttarakhand. It turns a pile of unsorted guest feedback into
            something the team can actually use in a few seconds.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1.5rem", width: "100%", boxSizing: "border-box", flex: 1 }}>

        {/* ── How it works — a real sequence, so numbering is justified ──── */}
        <p style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: tokens.textFaint, margin: "0 0 0.5rem" }}>
          How it works
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: tokens.text, margin: "0 0 1.75rem" }}>
          Three steps, end to end
        </h2>

        <div style={{ position: "relative", marginBottom: "3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {STEPS.map(s => (
              <div key={s.n} style={{
                background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14,
                padding: "1.3rem 1.3rem 1.5rem", display: "flex", flexDirection: "column", gap: 10,
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: tokens.accent, letterSpacing: "0.02em" }}>{s.n}</span>
                <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.005em", color: tokens.text, margin: 0 }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: tokens.textMuted, margin: 0 }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── What it tracks — real badges pulled from the live product ──── */}
        <p style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: tokens.textFaint, margin: "0 0 0.5rem" }}>
          What it tracks
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: tokens.text, margin: "0 0 1.5rem" }}>
          Every review gets a sentiment and a theme
        </h2>

        <div style={{
          background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14,
          padding: "1.5rem 1.5rem", marginBottom: "3rem",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.75rem",
        }}>
          <div>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: tokens.textMuted, margin: "0 0 10px" }}>Sentiment</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(SENTIMENT_STYLE).map(([key, s]) => (
                <Badge key={key} style={s} label={s.label} />
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: tokens.textMuted, margin: "0 0 10px" }}>Theme</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {THEME_TAGS.map(t => (
                <Badge key={t} style={{ bg: THEME_STYLE[t].bg, text: THEME_STYLE[t].text, border: THEME_STYLE[t].bg }} label={THEME_STYLE[t].label} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Built with ───────────────────────────────────────────────────── */}
        <p style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: tokens.textFaint, margin: "0 0 0.5rem" }}>
          Built with
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: tokens.text, margin: "0 0 1.5rem" }}>
          The stack behind it
        </h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "3rem" }}>
          {STACK.map(item => (
            <div key={item.label} style={{
              background: tokens.surfaceMuted, border: `1px solid ${tokens.border}`, borderRadius: 10,
              padding: "10px 16px", minWidth: 140,
            }}>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: tokens.text, margin: "0 0 2px" }}>{item.label}</p>
              <p style={{ fontSize: 11, color: tokens.textFaint, margin: 0, textTransform: "uppercase", letterSpacing: "0.03em" }}>{item.note}</p>
            </div>
          ))}
        </div>

        {/* ── Closing note ─────────────────────────────────────────────────── */}
        <div style={{
          borderTop: `1px solid ${tokens.border}`, paddingTop: "1.75rem",
          display: "flex", gap: 14, alignItems: "flex-start",
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: tokens.accentSoft,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tokens.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7Z" />
            </svg>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: tokens.textMuted, margin: 0, maxWidth: 600 }}>
            Trishul Eco-Homestays runs a small group of guesthouses in the hills of
            Uttarakhand. Classifications and draft replies here are AI-generated — staff
            review and personalise each one before it reaches a guest.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
