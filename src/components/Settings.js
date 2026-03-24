import { useT } from "../i18n";

export default function Settings({ config, connected, onConnect, onDisconnect, user }) {
  const { t, lang, setLang } = useT();

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Configurações</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 28px" }}>Gerencie sua conta e preferências</p>

      {/* Conta do usuário */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, maxWidth: 520, marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 16px" }}>Conta</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", background: "#fe2c55",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0
          }}>
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111" }}>{user?.name || "Usuário"}</p>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{user?.email || ""}</p>
          </div>
        </div>
      </div>

      {/* Conexão TikTok */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, maxWidth: 520, marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 16px" }}>Conta TikTok Ads</h2>

        {connected ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a" }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "#16a34a" }}>Conectado</span>
            </div>
            {config.advertiserId && (
              <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6b7280" }}>
                Advertiser ID: <strong style={{ color: "#111" }}>{config.advertiserId}</strong>
              </p>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onConnect} style={{
                padding: "10px 18px", borderRadius: 8, border: "1px solid #e5e7eb",
                background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer"
              }}>
                Reconectar
              </button>
              {onDisconnect && (
                <button onClick={onDisconnect} style={{
                  padding: "10px 18px", borderRadius: 8, border: "1px solid #fecaca",
                  background: "#fef2f2", color: "#dc2626", fontSize: 13, fontWeight: 500, cursor: "pointer"
                }}>
                  Desconectar
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#d1d5db" }} />
              <span style={{ fontSize: 13, color: "#6b7280" }}>Não conectado</span>
            </div>
            <button onClick={onConnect} style={{
              padding: "11px 20px", borderRadius: 8, border: "none",
              background: "#fe2c55", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
              Conectar com TikTok
            </button>
          </div>
        )}
      </div>

      {/* Idioma */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, maxWidth: 520 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 16px" }}>Idioma</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ key: "pt", label: "Português" }, { key: "en", label: "English" }].map(l => (
            <button key={l.key} onClick={() => setLang(l.key)} style={{
              padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
              border: lang === l.key ? "2px solid #fe2c55" : "1px solid #e5e7eb",
              background: lang === l.key ? "#fff5f6" : "#fff",
              color: lang === l.key ? "#fe2c55" : "#374151",
            }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
