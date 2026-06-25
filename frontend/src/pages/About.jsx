import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../ThemeContext";

export default function About() {
  const { tokens } = useTheme();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: tokens.bg }}>
      <Navbar />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1.5rem", width: "100%", boxSizing: "border-box", flex: 1 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: tokens.text, margin: "0 0 0.75rem" }}>
          About TrishulReviews
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: tokens.textMuted, maxWidth: 640, margin: 0 }}>
          TrishulReviews is an internal tool built for Trishul Eco-Homestays to help staff quickly
          understand guest feedback at scale. More details about the project, the team, and how it
          fits into the wider guest experience workflow will go here.
        </p>
      </main>

      <Footer />
    </div>
  );
}
