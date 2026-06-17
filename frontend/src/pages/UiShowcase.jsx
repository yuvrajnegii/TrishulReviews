import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button, Input, Modal, Toast, Loader } from "../components/ui";
import { useTheme } from "../ThemeContext";

export default function UiShowcase() {
  const { tokens } = useTheme();
  const [name, setName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, variant } | null
  const [loading, setLoading] = useState(false);

  function simulateLoad() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({ message: "Action completed.", variant: "success" });
    }, 1500);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: tokens.bg, color: tokens.text }}>
      <Navbar />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1.5rem", width: "100%", boxSizing: "border-box", flex: 1 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 0.4rem" }}>UI component showcase</h1>
        <p style={{ fontSize: 13, color: tokens.textMuted, marginBottom: "2rem" }}>
          Demo page exercising every component in <code>components/ui</code>.
        </p>

        {/* Button */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.75rem" }}>Button</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button variant="primary" onClick={() => setToast({ message: "Primary clicked.", variant: "info" })}>Primary</Button>
            <Button variant="secondary" onClick={() => setToast({ message: "Secondary clicked.", variant: "info" })}>Secondary</Button>
            <Button variant="danger" onClick={() => setToast({ message: "Danger clicked.", variant: "error" })}>Danger</Button>
            <Button variant="primary" size="sm" disabled>Disabled</Button>
          </div>
        </section>

        {/* Input */}
        <section style={{ marginBottom: "2rem", maxWidth: 320 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.75rem" }}>Input</h2>
          <Input
            label="Your name"
            value={name}
            onChange={setName}
            placeholder="Type something…"
            error={name.length > 20 ? "Keep it under 20 characters." : ""}
          />
        </section>

        {/* Modal */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.75rem" }}>Modal</h2>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal</Button>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Example modal">
            This is placeholder modal content. Click outside or the × to close.
          </Modal>
        </section>

        {/* Loader */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.75rem" }}>Loader</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Loader size="sm" />
            <Loader size="md" label="Loading" />
            {loading
              ? <Loader size="lg" />
              : <Button variant="primary" onClick={simulateLoad}>Trigger 1.5s loading</Button>
            }
          </div>
        </section>

        {/* Toast */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: "0.75rem" }}>Toast</h2>
          <p style={{ fontSize: 12, color: tokens.textFaint }}>
            Triggered by the buttons above — appears bottom-right and auto-dismisses.
          </p>
        </section>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
    </div>
  );
}
