import { useTheme } from "../ThemeContext";

export default function Card({ icon, title, description, accent = "#534AB7" }) {
  const { tokens } = useTheme();
  return (
    <div style={{
      background: tokens.surface,
      border: `1px solid ${tokens.border}`,
      borderTop: `3px solid ${accent}`,
      borderRadius: 12,
      padding: "1.25rem 1.25rem 1.4rem",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      minWidth: 0, // allows the card to shrink inside a grid on narrow screens
    }}>
      {icon && (
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: `${accent}1A`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: tokens.text }}>{title}</h3>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: tokens.textMuted, margin: 0 }}>{description}</p>
    </div>
  );
}
