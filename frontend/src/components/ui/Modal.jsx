import { useTheme } from "../../ThemeContext";

/**
 * Modal
 *
 * @param {object} props
 * @param {boolean} props.open - Whether the modal is visible.
 * @param {() => void} props.onClose - Called when the backdrop or close button is clicked.
 * @param {string} [props.title] - Optional title shown in the modal header.
 * @param {React.ReactNode} props.children - Modal body content.
 */
export default function Modal({ open, onClose, title, children }) {
  const { tokens } = useTheme();

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", zIndex: 100,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: tokens.surface, color: tokens.text,
          border: `1px solid ${tokens.border}`,
          borderRadius: 12, padding: "1.25rem",
          width: "100%", maxWidth: 420,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          {title && <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h2>}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 18, color: tokens.textFaint, lineHeight: 1, padding: 0,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.6, color: tokens.textMuted }}>
          {children}
        </div>
      </div>
    </div>
  );
}
