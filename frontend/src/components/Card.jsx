import { useTheme } from "../ThemeContext";

export default function Card({ icon, title, description, accent = "#4F46B8" }) {
  const { tokens } = useTheme();
  return (
    <div style={{
      background: tokens.surface,
      border: `1px solid ${tokens.border}`,
      borderRadius: 14,
      padding: "1.4rem 1.3rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minWidth: 0, // allows the card to shrink inside a grid on narrow screens
      transition: "border-color 0.15s ease, transform 0.15s ease",
    }}>
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
