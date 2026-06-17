import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Badge from "../components/Badge";
import { API_BASE, SENTIMENT_STYLE, THEME_STYLE, btnStyle } from "../constants";

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

export default function History() {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  async function fetchHistory() {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const res = await fetch(`${API_BASE}/history`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHistory(data.history);
    } catch (e) {
      if (e instanceof TypeError) {
        setHistoryError("Could not reach the backend — make sure it's running on port 5000.");
      } else {
        setHistoryError(e.message || "Could not load history.");
      }
    }
    setHistoryLoading(false);
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API_BASE}/history/${id}`, { method: "DELETE" });
      setHistory(h => h.filter(r => r.id !== id));
    } catch (e) {
      alert("Delete failed.");
    }
  }

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f5f4" }}>
      <Navbar />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem", width: "100%", boxSizing: "border-box", flex: 1 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 0.75rem", color: "#1a1a18" }}>History</h1>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 13, color: "#5f5e5a", margin: 0 }}>All past classified reviews stored in the database.</p>
          <button onClick={fetchHistory} style={btnStyle(false)}>Refresh</button>
        </div>

        {historyLoading && <p style={{ fontSize: 13, color: "#888780" }}>Loading history…</p>}
        {historyError && <p style={{ fontSize: 13, color: "#a32d2d" }}>{historyError}</p>}

        {!historyLoading && history.length === 0 && !historyError && (
          <div style={{ background: "#fff", border: "1px solid #e5e4dc", borderRadius: 12, padding: "3rem", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#888780", margin: 0 }}>No reviews classified yet. Go to the Classify page to get started.</p>
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
      </main>

      <Footer />
    </div>
  );
}
