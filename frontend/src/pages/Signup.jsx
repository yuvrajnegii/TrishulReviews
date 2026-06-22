import { useState } from "react";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import { Input, Button } from "../components/ui";

export default function Signup({ onSwitchToLogin }) {
  const { tokens } = useTheme();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signup({ name: name.trim(), email: email.trim(), password });
    } catch (err) {
      setError(err.message || "Could not create account. Please try again.");
    }
    setLoading(false);
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
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: 14,
          padding: "2rem",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: tokens.accent + "22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tokens.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: tokens.text, lineHeight: 1.2 }}>TrishulReviews</p>
            <p style={{ fontSize: 11, color: tokens.textFaint, margin: 0, lineHeight: 1.2 }}>Trishul Eco-Homestays</p>
          </div>
        </div>

        <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 0.25rem", color: tokens.text }}>Create your account</h1>
        <p style={{ fontSize: 13, color: tokens.textMuted, margin: "0 0 1.5rem", lineHeight: 1.5 }}>
          Sign up to start classifying guest reviews.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input
            label="Full name"
            value={name}
            onChange={setName}
            placeholder="Meena Rawat"
            disabled={loading}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            disabled={loading}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="At least 6 characters"
            disabled={loading}
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {error && (
          <p style={{ fontSize: 12, color: tokens.danger, marginTop: 12, marginBottom: 0 }}>{error}</p>
        )}

        <div style={{ marginTop: "1.5rem" }}>
          <Button type="submit" disabled={loading} variant="primary">
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </div>

        <p style={{ fontSize: 13, color: tokens.textMuted, marginTop: "1.25rem", marginBottom: 0, textAlign: "center" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: tokens.accent,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}
