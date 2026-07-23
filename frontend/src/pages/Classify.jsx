import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Badge from "../components/Badge";
import MetricCard from "../components/MetricCard";
import { useTheme } from "../ThemeContext";
import { API_BASE, THEME_TAGS, SENTIMENT_STYLE, THEME_STYLE, SAMPLE_REVIEWS, btnStyle } from "../constants";

function ResultRow({ review, index, tokens }) {
  const ss = SENTIMENT_STYLE[review.sentiment] || SENTIMENT_STYLE.neutral;
  const ts = THEME_STYLE[review.theme] || THEME_STYLE.experience;
  return (
    <tr style={{ borderBottom: `1px solid ${tokens.border}`, verticalAlign: "top" }}>
      <td style={{ padding: "10px 12px", fontSize: 13, color: tokens.textFaint, fontWeight: 500, paddingTop: 14 }}>{index + 1}</td>
      <td style={{ padding: "10px 12px 10px 0", fontSize: 13, color: tokens.text, lineHeight: 1.6, maxWidth: 260 }}>{review.text}</td>
      <td style={{ padding: "10px 12px 10px 0", paddingTop: 14 }}><Badge style={ss} label={ss.label} /></td>
      <td style={{ padding: "10px 12px 10px 0", paddingTop: 14 }}><Badge style={{ bg: ts.bg, text: ts.text, border: ts.bg }} label={ts.label} /></td>
      <td style={{ padding: "10px 12px 10px 0", fontSize: 12, color: tokens.textFaint, fontStyle: "italic", lineHeight: 1.6, maxWidth: 200 }}>"{review.response}"</td>
    </tr>
  );
}

export default function Classify() {
  const { tokens } = useTheme();
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [filterTheme, setFilterTheme] = useState("all");
  const textareaRef = useRef(null);

  const reviews = input.split("\n").map(r => r.trim()).filter(Boolean);

  async function handleClassify() {
    if (!reviews.length || loading) return;
    setLoading(true);
    setError("");
    setResults([]);
    setFilterSentiment("all");
    setFilterTheme("all");
    try {
      const res = await fetch(`${API_BASE}/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Classification failed.");
      setResults(reviews.map((text, i) => ({
        text,
        ...(data.classifications[i] || { sentiment: "neutral", theme: "experience", response: "Thank you for your feedback." })
      })));
    } catch (e) {
      if (e instanceof TypeError) {
        setError("Could not reach the backend — make sure it's running on port 8000.");
      } else {
        setError(e.message || "Classification failed.");
      }
    }
    setLoading(false);
  }

  function handleClear() {
    setInput(""); setResults([]); setError("");
    setFilterSentiment("all"); setFilterTheme("all");
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  const counts = results.reduce((acc, r) => {
    acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
    return acc;
  }, {});

  const filtered = results.filter(r =>
    (filterSentiment === "all" || r.sentiment === filterSentiment) &&
    (filterTheme === "all" || r.theme === filterTheme)
  );

  const tableHead = ["#", "Review", "Sentiment", "Theme", "Suggested response"];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: tokens.bg }}>
      <Navbar />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2.25rem 1.5rem", width: "100%", boxSizing: "border-box", flex: 1 }}>
        <h1 style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 0.4rem", color: tokens.text }}>Classify reviews</h1>
        <p style={{ fontSize: 13.5, color: tokens.textMuted, marginBottom: "1.25rem", lineHeight: 1.6 }}>
          Paste guest reviews below — one per line. Results are saved to the database automatically.
        </p>

        <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14, overflow: "hidden", marginBottom: "1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: `1px solid ${tokens.border}`, background: tokens.surfaceMuted, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: tokens.textFaint }}>
              {reviews.length > 0 ? `${reviews.length} review${reviews.length !== 1 ? "s" : ""} detected` : "No reviews yet"}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setInput(SAMPLE_REVIEWS)} style={btnStyle(false)}>Load 10 samples</button>
              <button onClick={handleClear} style={btnStyle(false)}>Clear</button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={"Paste guest reviews here, one per line…\n\ne.g. The host was incredibly welcoming and the food was delicious."}
            rows={7}
            style={{ width: "100%", border: "none", outline: "none", fontSize: 13.5, lineHeight: 1.7, padding: "13px 15px", resize: "vertical", boxSizing: "border-box", background: "transparent", color: tokens.text, fontFamily: "inherit" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.75rem", flexWrap: "wrap" }}>
          <button
            onClick={handleClassify}
            disabled={loading || reviews.length === 0}
            style={{
              padding: "10px 24px", fontSize: 14, fontWeight: 600, borderRadius: 9, border: "none",
              cursor: reviews.length && !loading ? "pointer" : "not-allowed",
              background: reviews.length && !loading ? tokens.accent : tokens.border,
              color: reviews.length && !loading ? tokens.accentText : tokens.textFaint,
              transition: "background 0.15s ease",
            }}
          >
            {loading ? "Classifying…" : `Classify ${reviews.length || ""} review${reviews.length !== 1 ? "s" : ""}`}
          </button>

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <style>{`@keyframes rotate { to { transform: rotate(360deg); } }`}</style>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `2.5px solid ${tokens.border}`,
                borderTopColor: tokens.accent,
                animation: "rotate 0.8s linear infinite",
              }} />
              <span style={{ fontSize: 13, color: tokens.textFaint }}>Classifying reviews…</span>
            </div>
          )}

          {error && <span style={{ fontSize: 13, color: tokens.danger }}>{error}</span>}
        </div>

        {results.length > 0 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
              <MetricCard value={counts.positive || 0} label="Positive" color={tokens.success} />
              <MetricCard value={counts.neutral || 0} label="Neutral" color="#C99A3A" />
              <MetricCard value={counts.negative || 0} label="Negative" color={tokens.danger} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: tokens.textFaint }}>Filter:</span>
              {["all", "positive", "neutral", "negative"].map(s => {
                const active = filterSentiment === s;
                const ss = SENTIMENT_STYLE[s];
                return (
                  <button key={s} onClick={() => setFilterSentiment(s)} style={{ fontSize: 12, padding: "3px 11px", cursor: "pointer", borderRadius: 20, fontWeight: active ? 600 : 500, background: active && ss ? ss.bg : "transparent", color: active && ss ? ss.text : tokens.textFaint, border: `1px solid ${active && ss ? ss.border : tokens.border}` }}>
                    {s === "all" ? "All sentiments" : SENTIMENT_STYLE[s].label}
                  </button>
                );
              })}
              <div style={{ width: 1, height: 16, background: tokens.border }} />
              <select value={filterTheme} onChange={e => setFilterTheme(e.target.value)} style={{ fontSize: 12, padding: "3px 8px", border: `1px solid ${tokens.border}`, borderRadius: 6, background: tokens.surface, color: tokens.text }}>
                <option value="all">All themes</option>
                {THEME_TAGS.map(t => <option key={t} value={t}>{THEME_STYLE[t].label}</option>)}
              </select>
              {(filterSentiment !== "all" || filterTheme !== "all") && (
                <button onClick={() => { setFilterSentiment("all"); setFilterTheme("all"); }} style={btnStyle(false)}>Reset</button>
              )}
              <span style={{ fontSize: 12, color: tokens.textFaint, marginLeft: "auto" }}>Showing {filtered.length} of {results.length}</span>
            </div>

            <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: tokens.surfaceMuted, borderBottom: `1px solid ${tokens.border}` }}>
                      {tableHead.map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "9px 12px 9px 0", fontSize: 11, fontWeight: 600, color: tokens.textFaint, letterSpacing: "0.04em", textTransform: "uppercase", ...(h === "#" ? { paddingLeft: 12, width: 36 } : {}), ...(h === "Suggested response" ? { paddingRight: 12 } : {}) }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0
                      ? filtered.map((r, i) => <ResultRow key={i} review={r} index={results.indexOf(r)} tokens={tokens} />)
                      : <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", fontSize: 13, color: tokens.textFaint }}>No reviews match the current filters.</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <p style={{ fontSize: 11, color: tokens.textFaint, marginTop: "1rem", lineHeight: 1.6, borderTop: `1px solid ${tokens.border}`, paddingTop: "0.75rem" }}>
              AI-generated classifications and responses. Review before use. Responses should be personalised before sending to guests.
            </p>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
