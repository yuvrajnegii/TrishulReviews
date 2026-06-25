import { NavLink } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import { Button } from "./ui";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/classify", label: "Classify" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { mode, toggle, tokens } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header style={{
      background: tokens.surface,
      borderBottom: `1px solid ${tokens.border}`,
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <div style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "0.8rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: tokens.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tokens.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.01em", margin: 0, color: tokens.text, lineHeight: 1.2 }}>TrishulReviews</p>
            <p style={{ fontSize: 10.5, color: tokens.textFaint, margin: 0, lineHeight: 1.2 }}>Trishul Eco-Homestays</p>
          </div>
        </div>

        {/* Nav links — wraps on small screens instead of overflowing */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <nav style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                style={({ isActive }) => ({
                  fontSize: 13,
                  padding: "6px 13px",
                  borderRadius: 7,
                  textDecoration: "none",
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? tokens.accentSoft : "transparent",
                  color: isActive ? tokens.accent : tokens.textMuted,
                  whiteSpace: "nowrap",
                  transition: "background 0.15s ease, color 0.15s ease",
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {user && (
            <span style={{
              fontSize: 12, fontWeight: 500, color: tokens.textMuted, whiteSpace: "nowrap",
              marginLeft: 6, paddingLeft: 12, borderLeft: `1px solid ${tokens.border}`,
            }}>
              Hi, {user.name.split(" ")[0]}
            </span>
          )}

          <button
            onClick={toggle}
            aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
            style={{
              width: 32, height: 32, borderRadius: 8, marginLeft: 4,
              border: `1px solid ${tokens.border}`, background: tokens.surface,
              color: tokens.textMuted, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 0.15s ease, color 0.15s ease",
            }}
          >
            {mode === "light" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" /></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4.5" /><path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8" /></svg>
            )}
          </button>

          {user && (
            <Button variant="secondary" size="sm" onClick={logout}>
              Log out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
