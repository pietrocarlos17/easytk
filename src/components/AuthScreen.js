import { useState } from "react";
import { useT } from "../i18n";

export default function AuthScreen({ onAuth, showToast }) {
  const { t, lang, setLang } = useT();
  const a = (key) => t(`auth.${key}`);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "login") {
      if (!form.email || !form.password) {
        showToast(a("errors.fillAll"), "error");
        return;
      }
    } else {
      if (!form.name || !form.email || !form.password || !form.confirmPassword) {
        showToast(a("errors.fillAll"), "error");
        return;
      }
      if (form.password.length < 6) {
        showToast(a("errors.passwordTooShort"), "error");
        return;
      }
      if (form.password !== form.confirmPassword) {
        showToast(a("errors.passwordMismatch"), "error");
        return;
      }
    }

    setLoading(true);
    try {
      await onAuth(mode, form);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: 10,
    fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box"
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
        background: "#fff", borderRadius: 20, padding: "40px 44px", width: "100%",
        maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", textAlign: "center"
      }}>
        {/* Logo */}
        <img src="/logo.svg" alt="Easy TK Manager" style={{
          width: 64, height: 64, borderRadius: 14, marginBottom: 16
        }} />

        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f0f0f", margin: "0 0 24px" }}>
          Easy TK Manager
        </h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: 10, overflow: "hidden", border: "1px solid #e5e7eb" }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "10px", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              background: mode === m ? "#0f0f0f" : "#f9fafb",
              color: mode === m ? "#fff" : "#6b7280",
              transition: "all 0.15s"
            }}>
              {m === "login" ? a("loginTab") : a("registerTab")}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
          {mode === "register" && (
            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>{a("name")}</span>
              <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="Pietro Carlos" style={inputStyle} />
            </label>
          )}

          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 13 }}>
            <span style={{ fontWeight: 600, color: "#374151" }}>{a("email")}</span>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
              placeholder="email@exemplo.com" style={inputStyle} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 13 }}>
            <span style={{ fontWeight: 600, color: "#374151" }}>{a("password")}</span>
            <input type="password" value={form.password} onChange={e => set("password", e.target.value)}
              placeholder="••••••" style={inputStyle} />
          </label>

          {mode === "register" && (
            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>{a("confirmPassword")}</span>
              <input type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
                placeholder="••••••" style={inputStyle} />
            </label>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "14px", borderRadius: 10, border: "none",
            background: loading ? "#9ca3af" : "#fe2c55", color: "#fff",
            fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            marginTop: 4
          }}>
            {mode === "login" ? a("loginButton") : a("registerButton")}
          </button>
        </form>

        {/* Switch mode */}
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 20, marginBottom: 0 }}>
          {mode === "login" ? a("noAccount") : a("hasAccount")}{" "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{
            background: "none", border: "none", color: "#fe2c55", fontWeight: 600,
            fontSize: 13, cursor: "pointer", textDecoration: "underline", padding: 0
          }}>
            {mode === "login" ? a("registerTab") : a("loginTab")}
          </button>
        </p>
      </div>
    </div>
  );
}
