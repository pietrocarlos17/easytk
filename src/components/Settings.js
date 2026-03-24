import { useT } from "../i18n";

export default function Settings({ config, setConfig, onConnect }) {
  const { t } = useT();
  const s = (key) => t(`settings.${key}`);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>{s("title")}</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 24px" }}>{s("subtitle")}</p>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, maxWidth: 520 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { key: "appId", label: s("appId"), placeholder: "ex: 7123456789012345678" },
            { key: "secret", label: s("appSecret"), placeholder: "ex: abc123...", type: "password" },
            { key: "accessToken", label: s("accessToken"), placeholder: "ex: TOKEN_...", type: "password" },
            { key: "advertiserId", label: s("advertiserId"), placeholder: "ex: 6123456789012345678" },
          ].map(field => (
            <label key={field.key} style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
              <span style={{ fontWeight: 500, color: "#374151" }}>{field.label}</span>
              <input
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={config[field.key] || ""}
                onChange={e => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }}
              />
            </label>
          ))}

          <button onClick={onConnect} style={{
            marginTop: 8, background: "#fe2c55", color: "#fff", border: "none",
            borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer"
          }}>
            {s("connect")}
          </button>
        </div>

        <div style={{ marginTop: 20, padding: 14, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8 }}>
          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#92400e" }}>{s("sandboxTitle")}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#92400e" }}>
            {s("sandboxDesc")} <strong>developers.tiktok.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
