import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider, useAuth } from "./AuthContext";
import Home from "./pages/Home";
import Classify from "./pages/Classify";
import History from "./pages/History";
import About from "./pages/About";
import UiShowcase from "./pages/UiShowcase";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function Gate() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"

  if (!isAuthenticated) {
    return mode === "login"
      ? <Login onSwitchToSignup={() => setMode("signup")} />
      : <Signup onSwitchToLogin={() => setMode("login")} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classify" element={<Classify />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
        <Route path="/ui-showcase" element={<UiShowcase />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </ThemeProvider>
  );
}
