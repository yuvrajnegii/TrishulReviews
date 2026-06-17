import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";

export default function Hero({
  eyebrow = "AI-03 · Trishul Eco-Homestays",
  title = "Understand every guest review at a glance.",
  subtitle = "Paste raw reviews and get instant sentiment, theme tags, and a draft reply for each one — powered by AI, backed by a database you can search.",
  ctaLabel = "Try the classifier",
  ctaTo = "/classify",
}) {
  const { mode, tokens } = useTheme();

  return (
    <section style={{
      background: mode === "light"
        ? "linear-gradient(180deg, #f1efff 0%, #f5f5f4 100%)"
        : `linear-gradient(180deg, ${tokens.surface} 0%, ${tokens.bg} 100%)`,
      borderBottom: `1px solid ${tokens.border}`,
      padding: "3.5rem 1.5rem 3rem",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <p style={{
          fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
          color: tokens.accent, margin: "0 0 0.75rem",
        }}>
          {eyebrow}
        </p>
        <h1 style={{
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, lineHeight: 1.25,
          color: tokens.text, margin: "0 0 0.9rem",
        }}>
          {title}
        </h1>
        <p style={{
          fontSize: 15, lineHeight: 1.65, color: tokens.textMuted, margin: "0 auto 1.75rem",
          maxWidth: 540,
        }}>
          {subtitle}
        </p>
        <Link to={ctaTo} style={{
          display: "inline-block", fontSize: 14, fontWeight: 600, padding: "10px 24px",
          background: tokens.accent, color: tokens.accentText, borderRadius: 8, textDecoration: "none",
        }}>
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
