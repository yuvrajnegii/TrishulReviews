import { useState, useRef, useEffect } from "react";

// ── Backend URL ────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000";

// ── Constants ──────────────────────────────────────────────────────────────
const THEME_TAGS = ["food", "host", "location", "cleanliness", "value", "experience"];

const SENTIMENT_STYLE = {
  positive: { bg: "#EAF3DE", text: "#27500A", border: "#639922", dot: "#639922", label: "Positive" },
  neutral:  { bg: "#FAEEDA", text: "#633806", border: "#BA7517", dot: "#EF9F27", label: "Neutral"  },
  negative: { bg: "#FCEBEB", text: "#791F1F", border: "#E24B4A", dot: "#E24B4A", label: "Negative" },
};

const THEME_STYLE = {
  food:        { bg: "#E6F1FB", text: "#0C447C", label: "Food"        },
  host:        { bg: "#EEEDFE", text: "#3C3489", label: "Host"        },
  location:    { bg: "#E1F5EE", text: "#085041", label: "Location"    },
  cleanliness: { bg: "#FAECE7", text: "#712B13", label: "Cleanliness" },
  value:       { bg: "#FAEEDA", text: "#633806", label: "Value"       },
  experience:  { bg: "#FBEAF0", text: "#72243E", label: "Experience"  },
};

const SAMPLE_REVIEWS = [
  "The host Meena was incredibly warm and helpful. She cooked us a traditional Garhwali breakfast that was absolutely outstanding. Would come back just for the food!",
  "The location is stunning — panoramic Himalayan views from every window. However, the 4km road to the property is in terrible shape and needs serious work.",
  "Mattresses were old and uncomfortable. The room had a persistent musty smell throughout our stay. Would not recommend for the price being charged.",
  "Absolutely loved our stay! Spotlessly clean rooms, wholesome food, and the valley views are worth every rupee. Our best homestay experience in Uttarakhand.",
  "Decent place. Nothing extraordinary but served its purpose for a one-night halt on the way to Chopta. Staff was polite and check-in was smooth.",
  "The host went out of his way to arrange a local guide for us at short notice. Truly exceptional hospitality that made our trip memorable.",
  "Bathroom cleanliness was disappointing for the price. Tiles were stained and the hot water supply was inconsistent in the mornings.",
  "Incredible value for money. Three meals included in the tariff and the portions were generous. Far better than staying at a hotel in town.",
  "Beautiful property but quite remote — no mobile signal. Bring downloaded maps and entertainment. The silence at night is something else though.",
  "Food was mediocre and repetitive — same dal and roti both days. Would be great if they offered more variety or local specialities.",
].join("\n");

// ── Sub-components ─────────────────────────────────────────────────────────
function Badge({ style, label }) {
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

function MetricCard({ value, label, color }) {
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

function ResultRow({ review, index }) {
  const ss = SENTIMENT_STYLE[review.sentiment] || SENTIMENT_STYLE.neutral;
  const ts = THEME_STYLE[review.theme] || THEME_STYLE.experience;
  return (
    <tr style={{ borderBottom: "1px solid #f0efe8", verticalAlign: "top" }}>
      <td style={{ padding: "10px 12px", fontSize: 13, color: "#888780", fontWeight: 500, paddingTop: 14 }}>{index + 1}</td>
      <td style={{ padding: "10px 12px 10px 0", fontSize: 13, color: "#1a1a18", lineHeight: 1.6, maxWidth: 260 }}>{review.text}</td>
      <td style={{ padding: "10px 12px 10px 0", paddingTop: 14 }}><Badge style={ss} label={ss.label} /></td>
      <td style={{ padding: "10px 12px 10px 0", paddingTop: 14 }}><Badge style={{ bg: ts.bg, text: ts.text, border: ts.bg }} label={ts.label} /></td>
      <td style={{ padding: "10px 12px 10px 0", fontSize: 12, color: "#888780", fontStyle: "italic", lineHeight: 1.6, maxWidth: 200 }}>"{review.response}"</td>
    </tr>
  );
}

function HistoryRow({ row, onDelete }) {
  const ss = SENTIMENT_STYLE[row.sentiment] || SENTIMENT_STYLE.neutral;
  const ts = THEME_STYLE[row.theme] || THEME_STYLE.experience;
  return (
    <tr style={{ borderBottom: "1px solid #f0efe8", verticalAlign: "top" }}>
      <td style={{ padding: "10px 12px", fontSize: 12, color: "#888780", paddingTop: 14, whiteSpace: "nowrap" }}>{row.created_at}</td>
      <td style={{ padding: "10px 12px 10px 0", fontSize: 13, color: "#1a1a18", lineHeight: 1.6, maxWidth: 260 }}>{row.review_text}</td>
      <td style={{ padding: "10px 12px 10px 0", paddingTop: 14 }}><Badge style={ss} label={ss.label} /></td>
      <td style={{ padding: "10px 12px 10px 0", paddingTop: 14 }}><Badge style={{ bg: ts.bg, text: ts.text, border: ts.bg }} label={ts.label} /></td>
      <td style={{ padding: "10px 12px 10px 0", fontSize: 12, color: "#888780", fontStyle: "italic", lineHeight: 1.6, maxWidth: 200 }}>"{row.response}"</td>
      <td style={{ padding: "10px 12px 10px 0", paddingTop: 12 }}>
        <button onClick={() => onDelete(row.id)} style={{
          fontSize: 11, padding: "3px 8px", cursor: "pointer",
          border: "1px solid #f0efe8", borderRadius: 6,
          background: "#fff", color: "#a32d2d",
        }}>Delete</button>
      </td>
    </tr>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("classify");

  // Classify tab state
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [filterTheme, setFilterTheme] = useState("all");
  const textareaRef = useRef(null);

  // History tab state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const reviews = input.split("\n").map(r => r.trim()).filter(Boolean);

  // ── Classify ──────────────────────────────────────────────────────────
  async function handleClassify() {
    if (!reviews.length || loading) return;
    setLoading(true);
    setError("");
    setResults([]);
    setFilterSentiment("all");
    setFilterTheme("all");
    try {
      const res  = await fetch(`${API_BASE}/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(reviews.map((text, i) => ({
        text,
        ...(data.classifications[i] || { sentiment: "neutral", theme: "experience", response: "Thank you for your feedback." })
      })));
    } catch (e) {
      setError("Classification failed — make sure the backend is running.");
    }
    setLoading(false);
  }

  function handleClear() {
    setInput(""); setResults([]); setError("");
    setFilterSentiment("all"); setFilterTheme("all");
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  // ── History ───────────────────────────────────────────────────────────
  async function fetchHistory() {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const res  = await fetch(`${API_BASE}/history`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHistory(data.history);
    } catch (e) {
      setHistoryError("Could not load history — make sure the backend is running.");
    }
    setHistoryLoading(false);
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_BASE}/history/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      setHistory(h => h.filter(r => r.id !== id));
    } catch (e) {
      alert("Delete failed.");
    }
  }

  useEffect(() => {
    if (tab === "history") fetchHistory();
  }, [tab]);

  // ── Derived ───────────────────────────────────────────────────────────
  const totalReviews = history.length;

  const positiveCount = history.filter(r => r.sentiment === "positive").length;
  const negativeCount = history.filter(r => r.sentiment === "negative").length;
  const neutralCount = history.filter(r => r.sentiment === "neutral").length;
  const counts = results.reduce((acc, r) => {
    acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
    return acc;
  }, {});

  const filtered = results.filter(r =>
    (filterSentiment === "all" || r.sentiment === filterSentiment) &&
    (filterTheme === "all" || r.theme === filterTheme)
  );

  // ── Shared styles ─────────────────────────────────────────────────────
  const btn = (active) => ({
    fontSize: 12, padding: "4px 10px", cursor: "pointer",
    border: "1px solid #e5e4dc", borderRadius: 6,
    background: active ? "#534AB7" : "#fff",
    color: active ? "#fff" : "#1a1a18",
  });

  const tableHead = ["#", "Review", "Sentiment", "Theme", "Suggested response"];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem", background: "#f5f5f4", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#1a1a18" }}>GuestLens</h1>
          <p style={{ fontSize: 12, color: "#888780", margin: 0 }}>Trishul Eco-Homestays · AI-03</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem", background: "#fff", border: "1px solid #e5e4dc", borderRadius: 8, padding: 4, width: "fit-content" }}>
        {["classify", "history"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            fontSize: 13, padding: "6px 18px", cursor: "pointer", borderRadius: 6,
            border: "none", fontWeight: tab === t ? 600 : 400,
            background: tab === t ? "#534AB7" : "transparent",
            color: tab === t ? "#fff" : "#888780",
            transition: "all 0.15s",
          }}>
            {t === "classify" ? "Classify" : "History"}
          </button>
        ))}
      </div>

      {/* ── CLASSIFY TAB ── */}
      {tab === "classify" && (
        <>
          <p style={{ fontSize: 13, color: "#5f5e5a", marginBottom: "1rem", lineHeight: 1.6 }}>
            Paste guest reviews below — one per line. Results are saved to the database automatically.
          </p>

          {/* Input card */}
          <div style={{ background: "#fff", border: "1px solid #e5e4dc", borderRadius: 12, overflow: "hidden", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid #f0efe8", background: "#fafaf8" }}>
              <span style={{ fontSize: 12, color: "#888780" }}>
                {reviews.length > 0 ? `${reviews.length} review${reviews.length !== 1 ? "s" : ""} detected` : "No reviews yet"}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setInput(SAMPLE_REVIEWS)} style={btn(false)}>Load 10 samples</button>
                <button onClick={handleClear} style={btn(false)}>Clear</button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={"Paste guest reviews here, one per line…\n\ne.g. The host was incredibly welcoming and the food was delicious."}
              rows={7}
              style={{ width: "100%", border: "none", outline: "none", fontSize: 13, lineHeight: 1.7, padding: "12px 14px", resize: "vertical", boxSizing: "border-box", background: "transparent", color: "#1a1a18", fontFamily: "inherit" }}
            />
          </div>

          {/* Classify button */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.75rem" }}>
            <button
              onClick={handleClassify}
              disabled={loading || reviews.length === 0}
              style={{ padding: "9px 22px", fontSize: 14, fontWeight: 600, cursor: reviews.length && !loading ? "pointer" : "not-allowed", background: reviews.length && !loading ? "#534AB7" : "#d1d0c9", color: reviews.length && !loading ? "#fff" : "#888780", border: "none", borderRadius: 8 }}
            >
              {loading ? "Classifying…" : `Classify ${reviews.length || ""} review${reviews.length !== 1 ? "s" : ""}`}
            </button>
            {loading && <span style={{ fontSize: 13, color: "#888780" }}>Calling backend…</span>}
            {error  && <span style={{ fontSize: 13, color: "#a32d2d" }}>{error}</span>}
          </div>

          {results.length > 0 && (
            <>
              {/* Metric cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.5rem" }}>
                <MetricCard value={counts.positive || 0} label="Positive" color="#639922" />
                <MetricCard value={counts.neutral  || 0} label="Neutral"  color="#EF9F27" />
                <MetricCard value={counts.negative || 0} label="Negative" color="#E24B4A" />
              </div>

              {/* Filters */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: "#888780" }}>Filter:</span>
                {["all", "positive", "neutral", "negative"].map(s => {
                  const active = filterSentiment === s;
                  const ss = SENTIMENT_STYLE[s];
                  return (
                    <button key={s} onClick={() => setFilterSentiment(s)} style={{ fontSize: 12, padding: "3px 11px", cursor: "pointer", borderRadius: 20, fontWeight: active ? 600 : 400, background: active && ss ? ss.bg : "transparent", color: active && ss ? ss.text : "#888780", border: `1px solid ${active && ss ? ss.border : "#e5e4dc"}` }}>
                      {s === "all" ? "All sentiments" : SENTIMENT_STYLE[s].label}
                    </button>
                  );
                })}
                <div style={{ width: 1, height: 16, background: "#e5e4dc" }} />
                <select value={filterTheme} onChange={e => setFilterTheme(e.target.value)} style={{ fontSize: 12, padding: "3px 8px", border: "1px solid #e5e4dc", borderRadius: 6, background: "#fff", color: "#1a1a18" }}>
                  <option value="all">All themes</option>
                  {THEME_TAGS.map(t => <option key={t} value={t}>{THEME_STYLE[t].label}</option>)}
                </select>
                {(filterSentiment !== "all" || filterTheme !== "all") && (
                  <button onClick={() => { setFilterSentiment("all"); setFilterTheme("all"); }} style={btn(false)}>Reset</button>
                )}
                <span style={{ fontSize: 12, color: "#888780", marginLeft: "auto" }}>Showing {filtered.length} of {results.length}</span>
              </div>

              {/* Results table */}
              <div style={{ background: "#fff", border: "1px solid #e5e4dc", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#fafaf8", borderBottom: "1px solid #e5e4dc" }}>
                        {tableHead.map(h => (
                          <th key={h} style={{ textAlign: "left", padding: "9px 12px 9px 0", fontSize: 11, fontWeight: 600, color: "#888780", letterSpacing: "0.04em", textTransform: "uppercase", ...(h === "#" ? { paddingLeft: 12, width: 36 } : {}), ...(h === "Suggested response" ? { paddingRight: 12 } : {}) }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length > 0
                        ? filtered.map((r, i) => <ResultRow key={i} review={r} index={results.indexOf(r)} />)
                        : <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", fontSize: 13, color: "#888780" }}>No reviews match the current filters.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <p style={{ fontSize: 11, color: "#b4b2a9", marginTop: "1rem", lineHeight: 1.6, borderTop: "1px solid #f0efe8", paddingTop: "0.75rem" }}>
                AI-generated classifications and responses. Review before use. Responses should be personalised before sending to guests.
              </p>
            </>
          )}
        </>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === "history" && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <p style={{ fontSize: 13, color: "#5f5e5a", margin: 0 }}>All past classified reviews stored in the database.</p>
            <button onClick={fetchHistory} style={btn(false)}>Refresh</button>
          </div>

          {historyLoading && <p style={{ fontSize: 13, color: "#888780" }}>Loading history…</p>}
          {historyError  && <p style={{ fontSize: 13, color: "#a32d2d" }}>{historyError}</p>}

          {!historyLoading && history.length === 0 && !historyError && (
            <div style={{ background: "#fff", border: "1px solid #e5e4dc", borderRadius: 12, padding: "3rem", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#888780", margin: 0 }}>No reviews classified yet. Go to the Classify tab to get started.</p>
            </div>
          )}

          {history.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid #e5e4dc", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#fafaf8", borderBottom: "1px solid #e5e4dc" }}>
                      {["Date", "Review", "Sentiment", "Theme", "Suggested response", ""].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "9px 12px 9px 0", fontSize: 11, fontWeight: 600, color: "#888780", letterSpacing: "0.04em", textTransform: "uppercase", ...(h === "Date" ? { paddingLeft: 12 } : {}), ...(h === "" ? { paddingRight: 12 } : {}) }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(row => <HistoryRow key={row.id} row={row} onDelete={handleDelete} />)}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
