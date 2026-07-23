import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import { Input, Button } from "../components/ui";
import { API_BASE } from "../constants";

export default function Login({ onSwitchToSignup }) {
  const { tokens } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Could not log in. Please try again.");
    }
    setLoading(false);
  }

  function handleGoogleLogin() {
    window.location.href = `${API_BASE}/auth/google`;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: tokens.bg,
        padding: "1.5rem",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: tokens.bg === "#fafaf9" ? 0.5 : 0.2, pointerEvents: "none" }}
      >
        <path d="M -50 650 Q 150 600 300 640 T 650 590 Q 850 560 950 480 T 1100 350" fill="none" stroke={tokens.accent} strokeWidth="1.2" opacity="0.3" />
        <path d="M -50 700 Q 180 660 340 690 T 700 640 Q 880 610 980 530 T 1150 400" fill="none" stroke={tokens.accent} strokeWidth="1.2" opacity="0.2" />
      </svg>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: 16,
          padding: "2.1rem 2rem",
          boxSizing: "border-box",
          position: "relative",
          boxShadow: tokens.bg === "#fafaf9" ? "0 1px 2px rgba(28,27,31,0.04), 0 20px 40px -12px rgba(28,27,31,0.10)" : "0 20px 40px -12px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.6rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: tokens.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tokens.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", margin: 0, color: tokens.text, lineHeight: 1.2 }}>TrishulReviews</p>
            <p style={{ fontSize: 11, color: tokens.textFaint, margin: 0, lineHeight: 1.2 }}>Trishul Eco-Homestays</p>
          </div>
        </div>

        <h1 style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 0.3rem", color: tokens.text }}>Welcome back</h1>
        <p style={{ fontSize: 13.5, color: tokens.textMuted, margin: "0 0 1.6rem", lineHeight: 1.5 }}>
          Log in to continue to your dashboard.
        </p>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, padding: "10px 16px", borderRadius: 9, marginBottom: 16,
            border: `1px solid ${tokens.border}`, background: tokens.surface,
            color: tokens.text, fontSize: 14, fontWeight: 500, cursor: "pointer",
            transition: "background 0.15s ease",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: tokens.border }} />
          <span style={{ fontSize: 12, color: tokens.textFaint }}>or</span>
          <div style={{ flex: 1, height: 1, background: tokens.border }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" disabled={loading} />
          <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" disabled={loading} />
        </div>

        {error && (
          <p style={{ fontSize: 12, color: tokens.danger, marginTop: 12, marginBottom: 0 }}>{error}</p>
        )}

        <div style={{ marginTop: "1.6rem" }}>
          <Button type="submit" disabled={loading} variant="primary" fullWidth>
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </div>

        <p style={{ fontSize: 13, color: tokens.textMuted, marginTop: "1.3rem", marginBottom: 0, textAlign: "center" }}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            style={{ background: "none", border: "none", padding: 0, color: tokens.accent, fontWeight: 600, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}

