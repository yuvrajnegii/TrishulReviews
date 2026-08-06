import { useTheme } from "../ThemeContext";

export default function Card({ icon, title, description, accent = "#4F46B8", delay = 0 }) {
  const { tokens } = useTheme();
  return (
    <div
      className="gl-animate-in"
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 14,
        padding: "1.4rem 1.3rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0, // allows the card to shrink inside a grid on narrow screens
        animationDelay: `${delay}ms`,
        transition: "border-color 0.15s ease, transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = "0 10px 24px -10px rgba(28,27,31,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = tokens.border; e.currentTarget.style.boxShadow = "none"; }}
    >
      {icon && (
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${accent}14`,
          color: accent,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: "-0.005em", margin: 0, color: tokens.text }}>{title}</h3>
      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: tokens.textMuted, margin: 0 }}>{description}</p>
    </div>
  );
}
