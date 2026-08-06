import { useState } from "react";
import { useTheme } from "../ThemeContext";

/**
 * CopyReplyButton
 *
 * A small inline button that copies `text` to the clipboard and shows a
 * brief "Copied" confirmation. Used next to suggested-response text in
 * Classify and History so staff can paste a reply straight into
 * Google/Booking.com without manually selecting the text.
 *
 * @param {object} props
 * @param {string} props.text - The text to copy.
 */
export default function CopyReplyButton({ text }) {
  const { tokens } = useTheme();
  const [copied, setCopied] = useState(false);

  async function handleCopy(e) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers or non-HTTPS contexts where the Clipboard API is unavailable.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy reply to clipboard"
      style={{
        display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0,
        fontSize: 11, fontWeight: 600, padding: "2px 7px", marginLeft: 6,
        cursor: "pointer", border: `1px solid ${copied ? tokens.success : tokens.border}`,
        borderRadius: 6, background: tokens.surface,
        color: copied ? tokens.success : tokens.textFaint,
        transition: "color 0.15s ease, border-color 0.15s ease",
      }}
    >
      {copied ? (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          Copied
        </>
      ) : (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          Copy
        </>
      )}
    </button>
  );
}
