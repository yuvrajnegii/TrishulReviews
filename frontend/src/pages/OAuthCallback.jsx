import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useTheme } from "../ThemeContext";

export default function OAuthCallback() {
  const { loginWithToken, isAuthenticated } = useAuth();
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name  = params.get("name");
    const email = params.get("email");
    const id    = params.get("id");

    if (token && name && email && id) {
      loginWithToken({ token, user: { id: Number(id), name, email } });
      setTried(true);
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  useEffect(() => {
    if (tried && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [tried, isAuthenticated]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: tokens.bg,
    }}>
      <p style={{ color: tokens.textMuted, fontSize: 15 }}>Signing you in…</p>
    </div>
  );
}
