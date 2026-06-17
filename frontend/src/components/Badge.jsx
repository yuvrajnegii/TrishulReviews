export default function Badge({ style, label }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: style.bg, color: style.text,
      border: `1px solid ${style.border || style.bg}`,
      borderRadius: 20, fontSize: 12, fontWeight: 500,
      padding: "3px 10px", whiteSpace: "nowrap",
    }}>
      {style.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: style.dot, flexShrink: 0 }} />}
      {label}
    </span>
  );
}
