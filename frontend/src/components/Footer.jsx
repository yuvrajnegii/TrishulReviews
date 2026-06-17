import { useTheme } from "../ThemeContext";

export default function Footer() {
  const { tokens } = useTheme();

  return (
    <footer style={{
      borderTop: `1px solid ${tokens.border}`,
      marginTop: "auto",
      padding: "1.5rem",
      background: tokens.bg,
    }}>
      <div style={{
        maxWidth: 960, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, flexWrap: "wrap",
      }}>
        <p style={{ fontSize: 12, color: tokens.textFaint, margin: 0 }}>
          © {new Date().getFullYear()} Trishul Eco-Homestays · TrishulReviews
        </p>
        <p style={{ fontSize: 11, color: tokens.textFaint, margin: 0 }}>
          AI-generated classifications — review before use.
        </p>
      </div>
    </footer>
  );
}
