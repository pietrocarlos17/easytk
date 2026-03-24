import { useState } from "react";
import { useT } from "../i18n";

export default function WelcomeScreen({ onOAuthConnect, loading }) {
  const { t, lang, setLang } = useT();
  const w = (key) => t(`welcome.${key}`);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    await onOAuthConnect();
    setConnecting(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
      fontFamily: "system-ui, sans-serif", position: "relative"
    }}>
      {/* Language toggle */}
      <div style={{ position: "absolute", top: 24, right: 28, display: "flex", gap: 4 }}>
        {["pt", "en"].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 600, textTransform: "uppercase",
            background: lang === l ? "#fe2c55" : "rgba(255,255,255,0.1)",
            color: lang === l ? "#fff" : "#6b7280",
            transition: "all 0.15s"
          }}>
            {l}
          </button>
        ))}
      </div>

      {/* Card */}
      <div style={{
        background: "#fff", borderRadius: 20, padding: "48px 44px", width: "100%",
        maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", textAlign: "center"
      }}>
        {/* Logo */}
        <img src="/logo.svg" alt="Easy TKT Manager" style={{
          width: 72, height: 72, borderRadius: 16, marginBottom: 20
        }} />

        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>
          {w("title")}
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 36px", lineHeight: 1.6 }}>
          {w("subtitle")}
        </p>

        {/* OAuth button */}
        <button onClick={handleConnect} disabled={connecting} style={{
          width: "100%", padding: "16px", borderRadius: 12, border: "none",
          background: connecting ? "#9ca3af" : "#fe2c55", color: "#fff",
          fontSize: 16, fontWeight: 700, cursor: connecting ? "not-allowed" : "pointer",
          transition: "opacity 0.15s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10
        }}>
          <span style={{ fontSize: 20 }}>&#9654;</span>
          {connecting ? w("connecting") : w("connectButton")}
        </button>

        {/* Steps info */}
        <div style={{ marginTop: 28, textAlign: "left" }}>
          {[
            { n: "1", text: w("step1") },
            { n: "2", text: w("step2") },
            { n: "3", text: w("step3") },
          ].map(s => (
            <div key={s.n} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", background: "#f3f4f6",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#6b7280", flexShrink: 0
              }}>{s.n}</div>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
