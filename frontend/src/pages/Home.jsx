import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { useTheme } from "../ThemeContext";

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.5 8.5 0 1 1-3.8-7.1" />
        <path d="M21 4 12 13l-3-3" />
      </svg>
    ),
    title: "Instant sentiment",
    description: "Every review is tagged positive, neutral, or negative the moment you paste it in — no manual reading required.",
    accent: "#0F7A52",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41 11.18 4H4v7.18l9.41 9.41a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z" />
        <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "Theme tagging",
    description: "Reviews are automatically sorted by what they're actually about — food, host, location, cleanliness, value, or overall experience.",
    accent: "#4F46B8",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
    title: "Draft replies",
    description: "Get a suggested response for each review, ready to personalise and send back to your guest.",
    accent: "#B8460E",
  },
];

export default function Home() {
  const { tokens } = useTheme();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: tokens.bg }}>
      <Navbar />
      <Hero />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1.5rem", width: "100%", boxSizing: "border-box" }}>
        <p style={{
          fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
          color: tokens.textFaint, margin: "0 0 0.5rem", textAlign: "center",
        }}>
          How it helps
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", color: tokens.text, margin: "0 0 2rem", textAlign: "center" }}>
          From raw feedback to action, in seconds
        </h2>

        {/* Card grid — responsive: 3 columns on desktop, wraps to 1 on mobile */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}>
          {FEATURES.map(f => (
            <Card key={f.title} icon={f.icon} title={f.title} description={f.description} accent={f.accent} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
