import { useTheme } from "../../ThemeContext";

/**
 * Input
 *
 * @param {object} props
 * @param {string} [props.label] - Optional label rendered above the field.
 * @param {string} props.value - Current input value (controlled).
 * @param {(value: string) => void} props.onChange - Called with the new string value on change.
 * @param {string} [props.placeholder] - Placeholder text.
 * @param {"text"|"email"|"password"|"number"} [props.type="text"] - Native input type.
 * @param {string} [props.error] - Error message shown below the field; also reddens the border.
 * @param {boolean} [props.disabled=false] - Disables the field.
 */
export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  disabled = false,
}) {
  const { tokens } = useTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 600, color: tokens.textMuted }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        style={{
          fontSize: 13,
          padding: "8px 12px",
          borderRadius: 8,
          border: `1px solid ${error ? tokens.danger : tokens.border}`,
          background: disabled ? tokens.border : tokens.surface,
          color: tokens.text,
          outline: "none",
          fontFamily: "inherit",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <span style={{ fontSize: 11, color: tokens.danger }}>{error}</span>
      )}
    </div>
  );
}
