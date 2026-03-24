import { useT } from "../i18n";

export default function Sidebar({ active, onNav, bcs = [], user, onLogout }) {
  const { t, lang, setLang } = useT();

  const items = [
    { id: "dashboard", icon: "◈", label: t("sidebar.dashboard") },
    { id: "campaigns", icon: "⚑", label: t("sidebar.campaigns") },
    { id: "adgroups", icon: "⊞", label: t("sidebar.adgroups") },
    { id: "reports", icon: "◎", label: t("sidebar.reports") },
    { id: "business-centers", icon: "◉", label: t("sidebar.businessCenters"), badge: bcs.length || null },
    // { id: "appeal", icon: "⚐", label: t("sidebar.appeal") },
    { id: "settings", icon: "⚙", label: t("sidebar.settings") },
  ];

  return (
    <aside style={{
      width: 230, background: "#0f0f0f", color: "#fff",
      display: "flex", flexDirection: "column", padding: "24px 0",
      minHeight: "100vh", flexShrink: 0
    }}>
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1f1f1f" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.svg" alt="Easy TKT Manager" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>Easy TK</p>
            <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>Manager</p>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
        {items.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            background: active === item.id ? "#1f1f1f" : "transparent",
            color: active === item.id ? "#fff" : "#9ca3af",
            fontSize: 13, fontWeight: active === item.id ? 600 : 400,
            textAlign: "left", marginBottom: 2, transition: "all 0.15s"
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge ? (
              <span style={{
                fontSize: 10, fontWeight: 700, background: "#fe2c55", color: "#fff",
                padding: "1px 6px", borderRadius: 10, minWidth: 16, textAlign: "center"
              }}>{item.badge}</span>
            ) : null}
          </button>
        ))}

        {bcs.length > 0 && active === "business-centers" && (
          <div style={{ marginTop: 4, paddingLeft: 8 }}>
            {bcs.map(bc => (
              <div key={bc.bc_id} style={{
                padding: "6px 10px", borderRadius: 6, marginBottom: 1,
                borderLeft: "2px solid #fe2c55"
              }}>
                <p style={{ margin: 0, fontSize: 11, color: "#e5e7eb", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bc.bc_name}</p>
                <p style={{ margin: 0, fontSize: 10, color: "#4b5563" }}>{t("sidebar.accounts")(bc.accounts.length)}</p>
              </div>
            ))}
          </div>
        )}
      </nav>
      <div style={{ padding: "12px 20px", borderTop: "1px solid #1f1f1f" }}>
        {/* User info */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", background: "#fe2c55",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0
            }}>{user.name?.charAt(0).toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#e5e7eb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: 10, color: "#4b5563", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
            </div>
          </div>
        )}

        <p style={{ fontSize: 11, color: "#4b5563", margin: "0 0 2px" }}>
          {bcs.length > 0 ? t("sidebar.linkedBCs")(bcs.length) : t("sidebar.noBCLinked")}
        </p>

        {/* Language toggle + Logout */}
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {["pt", "en"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              flex: 1, padding: "5px 0", borderRadius: 6, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              background: lang === l ? "#fe2c55" : "#1f1f1f",
              color: lang === l ? "#fff" : "#6b7280",
              transition: "all 0.15s"
            }}>
              {l === "pt" ? "PT" : "EN"}
            </button>
          ))}
        </div>
        {onLogout && (
          <button onClick={onLogout} style={{
            width: "100%", marginTop: 8, padding: "6px 0", borderRadius: 6,
            border: "1px solid #1f1f1f", background: "transparent",
            color: "#6b7280", fontSize: 11, cursor: "pointer",
            transition: "all 0.15s"
          }}>
            {t("auth.logout")}
          </button>
        )}
      </div>
    </aside>
  );
}
