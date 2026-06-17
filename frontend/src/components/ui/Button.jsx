import { useTheme } from "../../ThemeContext";

/**
 * Button
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Button label/content.
 * @param {() => void} [props.onClick] - Click handler.
 * @param {"primary"|"secondary"|"danger"} [props.variant="primary"] - Visual style.
 * @param {"sm"|"md"} [props.size="md"] - Size of the button.
 * @param {boolean} [props.disabled=false] - Disables the button and dims it.
 * @param {"button"|"submit"} [props.type="button"] - Native button type.
 */
export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
}) {
  const { tokens } = useTheme();

  const palette = {
    primary:   { bg: tokens.accent, text: tokens.accentText, border: tokens.accent },
    secondary: { bg: tokens.surface, text: tokens.text, border: tokens.border },
    danger:    { bg: tokens.dangerBg, text: tokens.danger, border: tokens.danger },
  }[variant];

  const sizing = {
    sm: { padding: "4px 10px", fontSize: 12 },
    md: { padding: "9px 20px", fontSize: 14 },
  }[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...sizing,
        fontWeight: 600,
        borderRadius: 8,
        border: `1px solid ${palette.border}`,
        background: disabled ? tokens.border : palette.bg,
        color: disabled ? tokens.textFaint : palette.text,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}
