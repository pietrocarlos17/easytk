function fmtDate(d) { return d.toISOString().split("T")[0]; }

export function DateRangePicker({ value, onChange }) {
  const today = new Date();
  const presets = [
    { key: "today", label: "Hoje" },
    { key: "yesterday", label: "Ontem" },
    { key: "last7days", label: "Últ. 7d" },
    { key: "last30days", label: "Últ. 30d" },
    { key: "thisMonth", label: "Este mês" },
    { key: "custom", label: "Personalizado" },
  ];

  function applyPreset(key) {
    const todayStr = fmtDate(today);
    if (key === "today") return onChange({ preset: key, startDate: todayStr, endDate: todayStr });
    if (key === "yesterday") {
      const d = new Date(today); d.setDate(d.getDate() - 1); const s = fmtDate(d);
      return onChange({ preset: key, startDate: s, endDate: s });
    }
    if (key === "last7days") {
      const d = new Date(today); d.setDate(d.getDate() - 6);
      return onChange({ preset: key, startDate: fmtDate(d), endDate: todayStr });
    }
    if (key === "last30days") {
      const d = new Date(today); d.setDate(d.getDate() - 29);
      return onChange({ preset: key, startDate: fmtDate(d), endDate: todayStr });
    }
    if (key === "thisMonth") {
      const d = new Date(today.getFullYear(), today.getMonth(), 1);
      return onChange({ preset: key, startDate: fmtDate(d), endDate: todayStr });
    }
    if (key === "custom") return onChange({ ...value, preset: "custom" });
  }

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
      {presets.map(p => (
        <button key={p.key} onClick={() => applyPreset(p.key)} style={{
          padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
          cursor: "pointer", border: "none", transition: "all .15s",
          background: value.preset === p.key ? "#fe2c55" : "#f3f4f6",
          color: value.preset === p.key ? "#fff" : "#374151",
        }}>{p.label}</button>
      ))}
      {value.preset === "custom" && (
        <>
          <input type="date" value={value.startDate} max={value.endDate}
            onChange={e => onChange({ ...value, startDate: e.target.value })}
            style={{ padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 12 }} />
          <span style={{ color: "#6b7280", fontSize: 12 }}>até</span>
          <input type="date" value={value.endDate} min={value.startDate}
            onChange={e => onChange({ ...value, endDate: e.target.value })}
            style={{ padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 12 }} />
        </>
      )}
    </div>
  );
}

export function statusBadge(status, t) {
  const active = status === "ENABLE";
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "2px 8px",
      borderRadius: 20, display: "inline-block",
      background: active ? "#dcfce7" : "#f3f4f6",
      color: active ? "#166534" : "#6b7280"
    }}>
      {active ? (t ? t("active") : "Ativo") : (t ? t("paused") : "Pausado")}
    </span>
  );
}

export function MetricCard({ label, value, prefix = "", suffix = "", color = "#6366f1" }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
      padding: "16px 20px", flex: "1 1 140px", minWidth: 0
    }}>
      <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 700, margin: 0, color }}>{prefix}{typeof value === "number" ? value.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) : value}{suffix}</p>
    </div>
  );
}

export function EmptyState({ t, onGoToSettings }) {
  return (
    <div style={{ background: "#fff", border: "2px dashed #e5e7eb", borderRadius: 12, padding: "64px 24px", textAlign: "center", marginTop: 8 }}>
      <div style={{ width: 52, height: 52, background: "#f3f4f6", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24, color: "#9ca3af" }}>○</div>
      <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#111" }}>{t("emptyTitle")}</p>
      <p style={{ margin: "0 0 24px", fontSize: 13, color: "#9ca3af", maxWidth: 340, marginLeft: "auto", marginRight: "auto" }}>{t("emptyDesc")}</p>
      {onGoToSettings && (
        <button onClick={onGoToSettings} style={{
          background: "#fe2c55", color: "#fff", border: "none", borderRadius: 8,
          padding: "11px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer"
        }}>{t("goToSettings")}</button>
      )}
    </div>
  );
}

export const fmt = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

export function alertColor(days, t) {
  if (days <= 3) return { bg: "#fef2f2", fg: "#dc2626", border: "#fecaca", label: t ? t("critical") : "Crítico" };
  if (days <= 7) return { bg: "#fffbeb", fg: "#d97706", border: "#fde68a", label: t ? t("attention") : "Atenção" };
  return { bg: "#f0fdf4", fg: "#16a34a", border: "#bbf7d0", label: t ? t("ok") : "OK" };
}
