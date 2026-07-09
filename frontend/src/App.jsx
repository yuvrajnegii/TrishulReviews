import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider, useAuth } from "./AuthContext";
import Home from "./pages/Home";
import Classify from "./pages/Classify";
import History from "./pages/History";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OAuthCallback from "./pages/OAuthCallback";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppRoutes() {
  const [mode, setMode] = useState("login");

  return (
    <Routes>
      <Route path="/login" element={
        mode === "login"
          ? <Login onSwitchToSignup={() => setMode("signup")} />
          : <Signup onSwitchToLogin={() => setMode("login")} />
      } />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/classify" element={
        <ProtectedRoute><Classify /></ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute><History /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
