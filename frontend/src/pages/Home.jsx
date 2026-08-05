import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useAuth } from "../AuthContext";
import { API_BASE, THEME_STYLE } from "../constants";
import { Sparkles, ThumbsUp, Meh, ThumbsDown, BarChart3, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: <ThumbsUp className="w-5 h-5 text-emerald-500" />,
    title: "Instant sentiment",
    description: "Every review is tagged positive, neutral, or negative the moment you paste it in — no manual reading required.",
    accent: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-indigo-500" />,
    title: "Theme tagging",
    description: "Reviews are automatically sorted by what they're actually about — food, host, location, cleanliness, value, or overall experience.",
    accent: "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    title: "Draft replies",
    description: "Get a suggested response for each review, ready to personalise and send back to your guest.",
    accent: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800",
  },
];

function StatCard({ label, value, colorClass, icon, delay }) {
  return (
    <div 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">{label}</p>
        <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-800 ${colorClass}`}>{icon}</div>
      </div>
      <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white animate-pulse">{value}</p>
    </div>
  );
}

function TopicBar({ label, count, total, index }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5 mb-4 last:mb-0 transition-all duration-500 hover:scale-[1.01]">
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
        <span>{label}</span>
        <span className="text-slate-500 dark:text-slate-400 font-mono">{count} reviews ({pct}%)</span>
      </div>
      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${pct}%` }} 
        />
      </div>
    </div>
  );
}

export default function Home() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors overflow-x-hidden">
      <Navbar />
      <Hero />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        
        {/* Live Stats Section with Staggered Animations */}
        {stats && stats.total > 0 && (
          <section className={`space-y-6 transition-opacity duration-700 ${isLoaded ? 'opacity-150' : 'opacity-0'}`}>
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold animate-bounce-slow">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> Live analytics
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Review intelligence at a glance</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total reviews" value={stats.total} colorClass="text-indigo-600" icon={<BarChart3 className="w-4 h-4 text-indigo-500" />} delay={100} />
              <StatCard label="Positive" value={stats.counts.positive || 0} colorClass="text-emerald-600" icon={<ThumbsUp className="w-4 h-4 text-emerald-500" />} delay={200} />
              <StatCard label="Neutral" value={stats.counts.neutral || 0} colorClass="text-amber-600" icon={<Meh className="w-4 h-4 text-amber-500" />} delay={300} />
              <StatCard label="Negative" value={stats.counts.negative || 0} colorClass="text-rose-600" icon={<ThumbsDown className="w-4 h-4 text-rose-500" />} delay={400} />
            </div>

            {insight && (
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3 shadow-sm animate-fade-in">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
                <p className="text-sm font-medium text-indigo-950 dark:text-indigo-200 leading-relaxed">
                  <strong>AI Insight:</strong> {insight}
                </p>
              </div>
            )}

            {topThemes.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                  <span>Topic breakdown</span>
                  <span className="text-xs font-normal text-slate-400">Sorted by frequency</span>
                </h3>
                {topThemes.map(([theme, count], idx) => (
                  <TopicBar key={theme} label={THEME_STYLE[theme]?.label || theme} count={count} total={stats.total} index={idx} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* How It Helps Section with Hover Lifts */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Core Features</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">From raw feedback to action, in seconds</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${f.accent} group-hover:scale-110 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Animated Gradient Call to Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 sm:p-12 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
          
          <div className="space-y-2 text-center sm:text-left relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to analyze your reviews?</h3>
            <p className="text-indigo-100 text-sm sm:text-base max-w-lg">
              Start classifying customer feedback instantly with our advanced AI sentiment engine.
            </p>
          </div>
          <Link 
            to="/classify"
            className="px-6 py-3.5 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-slate-100 shadow-xl transition-all hover:scale-105 flex items-center gap-2 shrink-0 relative z-10"
          >
            <Zap className="w-4 h-4 text-indigo-500 animate-bounce" /> Try Classifier Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
