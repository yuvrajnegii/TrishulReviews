import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import { API_BASE, THEME_STYLE } from "../constants";

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

function StatCard({ label, value, color, tokens, delay = 0 }) {
  return (
    <div className="gl-animate-in" style={{
      background: tokens.surface, border: `1px solid ${tokens.border}`,
      borderRadius: 14, padding: "1.25rem 1.5rem",
      animationDelay: `${delay}ms`,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px -8px rgba(28,27,31,0.15)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: tokens.textFaint, margin: "0 0 0.3rem" }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: color || tokens.text, margin: 0, letterSpacing: "-0.02em" }}>{value}</p>
    </div>
  );
}

function TopicBar({ label, count, total, tokens }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text }}>{label}</span>
        <span style={{ fontSize: 12, color: tokens.textFaint }}>{count} reviews</span>
      </div>
      <div style={{ height: 7, background: tokens.border, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "#4F46B8", borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

export default function Home() {
  const { tokens } = useTheme();
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!token) {
      setStats(null);
      return;
    }
    async function fetchStats() {
      try {
        const res = await fetch(`${API_BASE}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) return;
        const reviews = data.history || [];
        const counts = { positive: 0, neutral: 0, negative: 0 };
        const themes = {};
        reviews.forEach(r => {
          counts[r.sentiment] = (counts[r.sentiment] || 0) + 1;
          themes[r.theme] = (themes[r.theme] || 0) + 1;
        });
        setStats({ total: reviews.length, counts, themes });
      } catch (e) {
        // silently fail
      }
    }
    fetchStats();
  }, [token]);

  const topThemes = stats ? Object.entries(stats.themes).sort((a, b) => b[1] - a[1]).slice(0, 5) : [];

  const insight = stats && stats.total > 0
    ? (() => {
        const pct = Math.round((stats.counts.positive / stats.total) * 100);
        const topTheme = Object.entries(stats.themes).sort((a, b) => b[1] - a[1])[0];
        return `${pct}% of all reviews are positive. ${topTheme ? `"${THEME_STYLE[topTheme[0]]?.label || topTheme[0]}" is the most discussed topic with ${topTheme[1]} reviews.` : ""}`;
      })()
    : null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: tokens.bg }}>
      <Navbar />
      <Hero />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1.5rem", width: "100%", boxSizing: "border-box" }}>

        {stats && stats.total > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <p style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: tokens.textFaint, margin: "0 0 0.5rem", textAlign: "center" }}>Live stats</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", color: tokens.text, margin: "0 0 1.25rem", textAlign: "center" }}>Review intelligence at a glance</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.875rem", marginBottom: "1.25rem" }}>
              <StatCard label="Total reviews" value={stats.total} color="#4F46B8" tokens={tokens} delay={0} />
              <StatCard label="Positive" value={stats.counts.positive || 0} color="#0F7A52" tokens={tokens} delay={60} />
              <StatCard label="Neutral" value={stats.counts.neutral || 0} color="#C99A3A" tokens={tokens} delay={120} />
              <StatCard label="Negative" value={stats.counts.negative || 0} color="#B8460E" tokens={tokens} delay={180} />
            </div>

            {insight && (
              <div className="gl-animate-in" style={{ background: tokens.accentSoft, border: `1px solid ${tokens.accent}30`, borderRadius: 12, padding: "0.875rem 1.25rem", display: "flex", alignItems: "flex-start", gap: 10, marginBottom: "1.5rem", animationDelay: "220ms" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>✨</span>
                <p style={{ fontSize: 13, color: tokens.accent, margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
                  <strong>AI Insight:</strong> {insight}
                </p>
              </div>
            )}

            {topThemes.length > 0 && (
              <div className="gl-animate-in" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14, padding: "1.25rem 1.5rem", animationDelay: "280ms" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: tokens.text, margin: "0 0 1rem" }}>Topic breakdown</p>
                {topThemes.map(([theme, count]) => (
                  <TopicBar key={theme} label={THEME_STYLE[theme]?.label || theme} count={count} total={stats.total} tokens={tokens} />
                ))}
              </div>
            )}
          </section>
        )}

        <p style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: tokens.textFaint, margin: "0 0 0.5rem", textAlign: "center" }}>How it helps</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", color: tokens.text, margin: "0 0 2rem", textAlign: "center" }}>From raw feedback to action, in seconds</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {FEATURES.map((f, i) => (
            <Card key={f.title} icon={f.icon} title={f.title} description={f.description} accent={f.accent} delay={i * 80} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
