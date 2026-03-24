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
