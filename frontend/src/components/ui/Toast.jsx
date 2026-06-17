import { useEffect } from "react";
import { useTheme } from "../../ThemeContext";

/**
 * Toast
 *
 * A single transient notification, fixed to the bottom-right of the viewport.
 * Auto-dismisses after `duration` ms by calling onClose.
 *
 * @param {object} props
 * @param {string} props.message - Text to display.
 * @param {"success"|"error"|"info"} [props.variant="info"] - Visual style/accent color.
 * @param {() => void} props.onClose - Called when the toast should be removed (auto-timeout or manual close click).
 * @param {number} [props.duration=3000] - Milliseconds before auto-dismiss.
 */
export default function Toast({ message, variant = "info", onClose, duration = 3000 }) {
  const { tokens } = useTheme();

  useEffect(() => {
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  const accent = {
    success: "#639922",
    error: tokens.danger,
    info: tokens.accent,
  }[variant];

  return (
    <div
      role="status"
      style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 200,
        background: tokens.surface, color: tokens.text,
        border: `1px solid ${tokens.border}`, borderLeft: `3px solid ${accent}`,
        borderRadius: 8, padding: "10px 14px",
        fontSize: 13, display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        maxWidth: 320,
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        style={{ background: "none", border: "none", cursor: "pointer", color: tokens.textFaint, fontSize: 16, lineHeight: 1, padding: 0 }}
      >
        ×
      </button>
    </div>
  );
}
