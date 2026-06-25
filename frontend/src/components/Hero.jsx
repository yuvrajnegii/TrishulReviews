import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";

export default function Hero({
  eyebrow = "Trishul Eco-Homestays · Review intelligence",
  title = "Understand every guest review at a glance.",
  subtitle = "Paste raw reviews and get instant sentiment, theme tags, and a draft reply for each one — powered by AI, backed by a database you can search.",
  ctaLabel = "Try the classifier",
  ctaTo = "/classify",
}) {
  const { tokens } = useTheme();

  return (
    <section style={{
      position: "relative",
      overflow: "hidden",
      background: tokens.surface,
      borderBottom: `1px solid ${tokens.border}`,
      padding: "3.25rem 1.5rem 3.5rem",
    }}>
      {/* Signature element: faint topographic contour lines, evoking the
          Himalayan terrain around Trishul's homestays — quiet, not literal. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 800 280"
        preserveAspectRatio="none"
        style={{
          position: "absolute", top: 0, right: 0, height: "100%", width: "46%",
          opacity: tokens.bg === "#fafaf9" ? 0.5 : 0.25,
          pointerEvents: "none",
        }}
      >
        <path d="M -20 220 Q 120 180 220 210 T 420 190 Q 560 170 620 130 T 860 60" fill="none" stroke={tokens.accent} strokeWidth="1.2" opacity="0.35" />
        <path d="M -20 250 Q 140 215 240 240 T 460 220 Q 590 200 660 165 T 880 95" fill="none" stroke={tokens.accent} strokeWidth="1.2" opacity="0.25" />
        <path d="M -20 280 Q 160 250 260 270 T 500 255 Q 620 235 700 205 T 900 130" fill="none" stroke={tokens.accent} strokeWidth="1.2" opacity="0.18" />
      </svg>

      <div style={{
        maxWidth: 1040, margin: "0 auto", position: "relative",
        display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(0,0.85fr)",
        gap: "2.5rem", alignItems: "center",
      }}
      className="hero-grid"
      >
        {/* Copy column */}
        <div>
          <p style={{
            fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
            color: tokens.accent, margin: "0 0 0.85rem",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 14, height: 1.5, background: tokens.accent, display: "inline-block" }} />
            {eyebrow}
          </p>
          <h1 style={{
            fontSize: "clamp(1.9rem, 3.6vw, 2.7rem)", fontWeight: 800, lineHeight: 1.15,
            letterSpacing: "-0.015em",
            color: tokens.text, margin: "0 0 1rem", maxWidth: 480,
          }}>
            {title}
          </h1>
          <p style={{
            fontSize: 15.5, lineHeight: 1.65, color: tokens.textMuted, margin: "0 0 1.75rem",
            maxWidth: 460,
          }}>
            {subtitle}
          </p>
          <Link to={ctaTo} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 14, fontWeight: 600, padding: "11px 22px",
            background: tokens.accent, color: tokens.accentText, borderRadius: 9, textDecoration: "none",
          }}>
            {ctaLabel}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>

        {/* Preview column — a static mock of what a classified review card
            looks like, so the hero shows the product instead of describing it */}
        <div style={{
          background: tokens.bg,
          border: `1px solid ${tokens.border}`,
          borderRadius: 14,
          padding: "1.1rem 1.1rem 1.25rem",
          boxShadow: tokens.bg === "#fafaf9" ? "0 1px 2px rgba(28,27,31,0.04), 0 12px 28px -8px rgba(28,27,31,0.08)" : "none",
        }}
        >
          <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: tokens.textFaint, margin: "0 0 10px" }}>
            Guest review
          </p>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: tokens.text, margin: "0 0 14px" }}>
            "The host went out of his way to arrange a local guide for us at short notice. Truly exceptional hospitality."
          </p>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: tokens.successSoft, color: tokens.success }}>Positive</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: tokens.accentSoft, color: tokens.accent }}>Host</span>
          </div>
          <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: 12 }}>
            <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: tokens.textFaint, margin: "0 0 6px" }}>
              Draft reply
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: tokens.textMuted, margin: 0, fontStyle: "italic" }}>
              "Thank you so much — we'll be sure to pass this along to him!"
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
