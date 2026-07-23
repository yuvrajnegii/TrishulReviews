import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Badge from "../components/Badge";
import { Modal, Input, Button, Toast } from "../components/ui";
import { useTheme } from "../ThemeContext";
import { API_BASE, THEME_TAGS, SENTIMENT_STYLE, THEME_STYLE, btnStyle } from "../constants";

const SENTIMENT_OPTIONS = ["positive", "neutral", "negative"];

function HistoryRow({ row, onDelete, onView, onEdit, tokens, isMobile }) {
  const ss = SENTIMENT_STYLE[row.sentiment] || SENTIMENT_STYLE.neutral;
  const ts = THEME_STYLE[row.theme] || THEME_STYLE.experience;

  if (isMobile) {
    return (
      <tr style={{ borderBottom: `1px solid ${tokens.border}`, verticalAlign: "top" }}>
        <td style={{ padding: "10px 12px", fontSize: 12, color: tokens.textFaint, whiteSpace: "nowrap", paddingTop: 14 }}>{row.created_at}</td>
        <td style={{ padding: "10px 8px 10px 0", fontSize: 13, color: tokens.text, lineHeight: 1.5, maxWidth: 140 }}>
          <div style={{ marginBottom: 6 }}>{row.review_text.length > 80 ? row.review_text.slice(0, 80) + "…" : row.review_text}</div>
          <Badge style={ss} label={ss.label} />
        </td>
        <td style={{ padding: "10px 12px 10px 0", paddingTop: 12, whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button onClick={() => onView(row.id)} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", cursor: "pointer", border: `1px solid ${tokens.border}`, borderRadius: 6, background: tokens.surface, color: tokens.accent }}>View</button>
            <button onClick={() => onEdit(row)} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", cursor: "pointer", border: `1px solid ${tokens.border}`, borderRadius: 6, background: tokens.surface, color: "#B98B2E" }}>Edit</button>
            <button onClick={() => onDelete(row.id)} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", cursor: "pointer", border: `1px solid ${tokens.border}`, borderRadius: 6, background: tokens.surface, color: tokens.danger }}>Del</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr style={{ borderBottom: `1px solid ${tokens.border}`, verticalAlign: "top" }}>
      <td style={{ padding: "10px 12px", fontSize: 12, color: tokens.textFaint, paddingTop: 14, whiteSpace: "nowrap" }}>{row.created_at}</td>
      <td style={{ padding: "10px 12px 10px 0", fontSize: 13, color: tokens.text, lineHeight: 1.6, maxWidth: 260 }}>{row.review_text}</td>
      <td style={{ padding: "10px 12px 10px 0", paddingTop: 14 }}><Badge style={ss} label={ss.label} /></td>
      <td style={{ padding: "10px 12px 10px 0", paddingTop: 14 }}><Badge style={{ bg: ts.bg, text: ts.text, border: ts.bg }} label={ts.label} /></td>
      <td style={{ padding: "10px 12px 10px 0", fontSize: 12, color: tokens.textFaint, fontStyle: "italic", lineHeight: 1.6, maxWidth: 200 }}>"{row.response}"</td>
      <td style={{ padding: "10px 12px 10px 0", paddingTop: 12, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onView(row.id)} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", cursor: "pointer", border: `1px solid ${tokens.border}`, borderRadius: 6, background: tokens.surface, color: tokens.accent }}>View</button>
          <button onClick={() => onEdit(row)} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", cursor: "pointer", border: `1px solid ${tokens.border}`, borderRadius: 6, background: tokens.surface, color: "#B98B2E" }}>Edit</button>
          <button onClick={() => onDelete(row.id)} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", cursor: "pointer", border: `1px solid ${tokens.border}`, borderRadius: 6, background: tokens.surface, color: tokens.danger }}>Delete</button>
        </div>
      </td>
    </tr>
  );
}

export default function History() {
  const { tokens } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [searchSentiment, setSearchSentiment] = useState("");
  const [searchTheme, setSearchTheme] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [viewRow, setViewRow] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [editSentiment, setEditSentiment] = useState("");
  const [editTheme, setEditTheme] = useState("");
  const [editResponse, setEditResponse] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [toast, setToast] = useState(null);

  async function fetchHistory() {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const res = await fetch(`${API_BASE}/history`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load history.");
      setHistory(data.history);
      setIsFiltered(false);
    } catch (e) {
      if (e instanceof TypeError) {
        setHistoryError("Could not reach the backend — make sure it's running on port 8000.");
      } else {
        setHistoryError(e.message);
      }
    }
    setHistoryLoading(false);
  }

  async function handleSearch() {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const params = new URLSearchParams();
      if (searchSentiment) params.set("sentiment", searchSentiment);
      if (searchTheme) params.set("theme", searchTheme);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      const res = await fetch(`${API_BASE}/history/search?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed.");
      setHistory(data.history);
      setIsFiltered(true);
    } catch (e) {
      if (e instanceof TypeError) {
        setHistoryError("Could not reach the backend — make sure it's running on port 8000.");
      } else {
        setHistoryError(e.message);
      }
    }
    setHistoryLoading(false);
  }

  function handleClearSearch() {
    setSearchSentiment(""); setSearchTheme(""); setSearchQuery("");
    fetchHistory();
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_BASE}/history/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      setHistory(h => h.filter(r => r.id !== id));
      setToast({ message: "Review deleted.", variant: "success" });
    } catch (e) {
      setToast({ message: e.message || "Delete failed.", variant: "error" });
    }
  }

  async function handleView(id) {
    setViewRow(null);
    setViewError("");
    setViewLoading(true);
    try {
      const res = await fetch(`${API_BASE}/history/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load review.");
      setViewRow(data);
    } catch (e) {
      setViewError(e.message || "Could not load review.");
    }
    setViewLoading(false);
  }

  function handleEdit(row) {
    setEditRow(row);
    setEditSentiment(row.sentiment);
    setEditTheme(row.theme);
    setEditResponse(row.response);
    setEditError("");
  }

  async function handleSaveEdit() {
    if (!editRow) return;
    setEditSaving(true);
    setEditError("");
    try {
      const res = await fetch(`${API_BASE}/history/${editRow.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentiment: editSentiment, theme: editTheme, response: editResponse }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setHistory(h => h.map(r => (r.id === data.id ? data : r)));
      setEditRow(null);
      setToast({ message: "Review updated.", variant: "success" });
    } catch (e) {
      setEditError(e.message || "Update failed.");
    }
    setEditSaving(false);
  }

  useEffect(() => { fetchHistory(); }, []);

  const mobileHeaders = ["Date", "Review", ""];
  const desktopHeaders = ["Date", "Review", "Sentiment", "Theme", "Suggested response", ""];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: tokens.bg }}>
      <Navbar />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2.25rem 1.5rem", width: "100%", boxSizing: "border-box", flex: 1 }}>
        <h1 style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 0.75rem", color: tokens.text }}>History</h1>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 13.5, color: tokens.textMuted, margin: 0 }}>All past classified reviews stored in the database.</p>
          <button onClick={fetchHistory} style={btnStyle(false)}>Refresh</button>
        </div>

        <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: "1.25rem", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select value={searchSentiment} onChange={e => setSearchSentiment(e.target.value)} style={{ fontSize: 12, padding: "5px 8px", border: `1px solid ${tokens.border}`, borderRadius: 6, background: tokens.surface, color: tokens.text }}>
            <option value="">Any sentiment</option>
            {SENTIMENT_OPTIONS.map(s => <option key={s} value={s}>{SENTIMENT_STYLE[s].label}</option>)}
          </select>
          <select value={searchTheme} onChange={e => setSearchTheme(e.target.value)} style={{ fontSize: 12, padding: "5px 8px", border: `1px solid ${tokens.border}`, borderRadius: 6, background: tokens.surface, color: tokens.text }}>
            <option value="">Any theme</option>
            {THEME_TAGS.map(t => <option key={t} value={t}>{THEME_STYLE[t].label}</option>)}
          </select>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Keyword in review text…"
            style={{ fontSize: 12, padding: "6px 10px", border: `1px solid ${tokens.border}`, borderRadius: 6, flex: 1, minWidth: 120, background: tokens.surface, color: tokens.text }}
          />
          <button onClick={handleSearch} style={btnStyle(true)}>Search</button>
          {isFiltered && <button onClick={handleClearSearch} style={btnStyle(false)}>Clear filters</button>}
        </div>

        {historyLoading && <p style={{ fontSize: 13, color: tokens.textFaint }}>Loading history…</p>}
        {historyError && <p style={{ fontSize: 13, color: tokens.danger }}>{historyError}</p>}

        {!historyLoading && history.length === 0 && !historyError && (
          <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14, padding: "3rem", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: tokens.textFaint, margin: 0 }}>
              {isFiltered ? "No reviews match these filters." : "No reviews classified yet. Go to the Classify page to get started."}
            </p>
          </div>
        )}

        {history.length > 0 && (
          <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: tokens.surfaceMuted, borderBottom: `1px solid ${tokens.border}` }}>
                    {(isMobile ? mobileHeaders : desktopHeaders).map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "9px 12px 9px 0", fontSize: 11, fontWeight: 600, color: tokens.textFaint, letterSpacing: "0.04em", textTransform: "uppercase", ...(h === "Date" ? { paddingLeft: 12 } : {}), ...(h === "" ? { paddingRight: 12 } : {}) }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map(row => (
                    <HistoryRow key={row.id} row={row} onDelete={handleDelete} onView={handleView} onEdit={handleEdit} tokens={tokens} isMobile={isMobile} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Modal open={viewLoading || !!viewRow || !!viewError} onClose={() => { setViewRow(null); setViewError(""); }} title="Review details">
        {viewLoading && <p>Loading…</p>}
        {viewError && <p style={{ color: tokens.danger }}>{viewError}</p>}
        {viewRow && !viewLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div><strong style={{ color: tokens.text }}>ID:</strong> {viewRow.id}</div>
            <div><strong style={{ color: tokens.text }}>Submitted:</strong> {viewRow.created_at}</div>
            <div><strong style={{ color: tokens.text }}>Review:</strong> {viewRow.review_text}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge style={SENTIMENT_STYLE[viewRow.sentiment] || SENTIMENT_STYLE.neutral} label={(SENTIMENT_STYLE[viewRow.sentiment] || SENTIMENT_STYLE.neutral).label} />
              <Badge style={{ bg: THEME_STYLE[viewRow.theme]?.bg, text: THEME_STYLE[viewRow.theme]?.text, border: THEME_STYLE[viewRow.theme]?.bg }} label={THEME_STYLE[viewRow.theme]?.label || viewRow.theme} />
            </div>
            <div><strong style={{ color: tokens.text }}>Suggested response:</strong> "{viewRow.response}"</div>
          </div>
        )}
      </Modal>

      <Modal open={!!editRow} onClose={() => setEditRow(null)} title={`Edit review #${editRow?.id ?? ""}`}>
        {editRow && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0, color: tokens.textMuted, fontStyle: "italic" }}>"{editRow.review_text}"</p>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: tokens.textMuted, display: "block", marginBottom: 6 }}>Sentiment</label>
              <select value={editSentiment} onChange={e => setEditSentiment(e.target.value)} style={{ fontSize: 13, padding: "8px 10px", border: `1px solid ${tokens.border}`, borderRadius: 8, width: "100%", background: tokens.surface, color: tokens.text }}>
                {SENTIMENT_OPTIONS.map(s => <option key={s} value={s}>{SENTIMENT_STYLE[s].label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: tokens.textMuted, display: "block", marginBottom: 6 }}>Theme</label>
              <select value={editTheme} onChange={e => setEditTheme(e.target.value)} style={{ fontSize: 13, padding: "8px 10px", border: `1px solid ${tokens.border}`, borderRadius: 8, width: "100%", background: tokens.surface, color: tokens.text }}>
                {THEME_TAGS.map(t => <option key={t} value={t}>{THEME_STYLE[t].label}</option>)}
              </select>
            </div>
            <Input label="Suggested response" value={editResponse} onChange={setEditResponse} disabled={editSaving} />
            {editError && <p style={{ fontSize: 12, color: tokens.danger, margin: 0 }}>{editError}</p>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button variant="secondary" onClick={() => setEditRow(null)} disabled={editSaving}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveEdit} disabled={editSaving}>{editSaving ? "Saving…" : "Save changes"}</Button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}
      <Footer />
    </div>
  );
}
