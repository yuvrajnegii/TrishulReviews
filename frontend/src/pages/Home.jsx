import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { useTheme } from "../ThemeContext";

const FEATURES = [
  {
    icon: "💬",
    title: "Instant sentiment",
    description: "Every review is tagged positive, neutral, or negative the moment you paste it in — no manual reading required.",
    accent: "#639922",
  },
  {
    icon: "🏷️",
    title: "Theme tagging",
    description: "Reviews are automatically sorted by what they're actually about — food, host, location, cleanliness, value, or overall experience.",
    accent: "#3C3489",
  },
  {
    icon: "✍️",
    title: "Draft replies",
    description: "Get a suggested response for each review, ready to personalise and send back to your guest.",
    accent: "#0C447C",
  },
];

export default function Home() {
  const { tokens } = useTheme();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: tokens.bg }}>
      <Navbar />
      <Hero />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1.5rem", width: "100%", boxSizing: "border-box" }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: tokens.text, margin: "0 0 1.25rem", textAlign: "center" }}>
          What it does
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
