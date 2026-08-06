import { useTheme } from "../ThemeContext";

export default function MetricCard({ value, label, color, delay = 0 }) {
  const { tokens } = useTheme();
  return (
    <div className="gl-animate-in" style={{
      background: tokens.surface, borderRadius: 12, padding: "0.95rem 1.1rem",
      textAlign: "center", border: `1px solid ${tokens.border}`, borderTop: `2.5px solid ${color}`,
      animationDelay: `${delay}ms`,
    }}>
      <p style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.01em", margin: 0, color: tokens.text, lineHeight: 1.1 }}>{value}</p>
      <p style={{ fontSize: 12, color: tokens.textFaint, margin: "4px 0 0", textTransform: "capitalize" }}>{label}</p>
    </div>
  );
}
