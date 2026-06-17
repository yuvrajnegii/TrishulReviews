import { useTheme } from "../../ThemeContext";

/**
 * Loader
 *
 * A small spinning indicator for in-progress states.
 *
 * @param {object} props
 * @param {"sm"|"md"|"lg"} [props.size="md"] - Diameter of the spinner.
 * @param {string} [props.label] - Optional text shown next to the spinner.
 */
export default function Loader({ size = "md", label }) {
  const { tokens } = useTheme();

  const px = { sm: 14, md: 20, lg: 32 }[size];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: px, height: px, borderRadius: "50%",
          border: `2px solid ${tokens.border}`,
          borderTopColor: tokens.accent,
          animation: "ui-loader-spin 0.7s linear infinite",
          display: "inline-block",
        }}
      />
      {label && <span style={{ fontSize: 13, color: tokens.textMuted }}>{label}</span>}
      <style>{`
        @keyframes ui-loader-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
