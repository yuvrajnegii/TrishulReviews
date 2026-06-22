import { NavLink } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import { Button } from "./ui";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/classify", label: "Classify" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
  { to: "/ui-showcase", label: "UI Kit" },
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
        padding: "0.85rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: tokens.accent + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tokens.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: tokens.text, lineHeight: 1.2 }}>TrishulReviews</p>
            <p style={{ fontSize: 11, color: tokens.textFaint, margin: 0, lineHeight: 1.2 }}>Trishul Eco-Homestays</p>
          </div>
        </div>

        {/* Nav links — wraps on small screens instead of overflowing */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <nav style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                style={({ isActive }) => ({
                  fontSize: 13,
                  padding: "6px 14px",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? tokens.accent : "transparent",
                  color: isActive ? tokens.accentText : tokens.textMuted,
                  whiteSpace: "nowrap",
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          {user && (
            <span style={{ fontSize: 12, color: tokens.textMuted, whiteSpace: "nowrap" }}>
              Hi, {user.name.split(" ")[0]}
            </span>
          )}
          <Button variant="secondary" size="sm" onClick={toggle}>
            {mode === "light" ? "🌙 Dark" : "☀️ Light"}
          </Button>
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
