export default function MetricCard({ value, label, color }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 8, padding: "0.85rem 1.1rem",
      textAlign: "center", border: "1px solid #e5e4dc", borderTop: `2.5px solid ${color}`,
    }}>
      <p style={{ fontSize: 28, fontWeight: 500, margin: 0, color: "#1a1a18", lineHeight: 1.1 }}>{value}</p>
      <p style={{ fontSize: 12, color: "#888780", margin: "4px 0 0", textTransform: "capitalize" }}>{label}</p>
    </div>
  );
}
