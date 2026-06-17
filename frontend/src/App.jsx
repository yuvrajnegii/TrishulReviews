import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Home from "./pages/Home";
import Classify from "./pages/Classify";
import History from "./pages/History";
import About from "./pages/About";
import UiShowcase from "./pages/UiShowcase";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classify" element={<Classify />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/ui-showcase" element={<UiShowcase />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
