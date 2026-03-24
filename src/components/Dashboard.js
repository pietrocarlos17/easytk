import { MetricCard, statusBadge, EmptyState, DateRangePicker } from "./shared";
import { useT } from "../i18n";

export default function Dashboard({ campaigns, metrics, connected, onGoToSettings, dateRange, onDateChange }) {
  const { t } = useT();
  const d = (key) => t(`dashboard.${key}`);

  if (!connected || !metrics) {
    return (
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>{d("title")}</h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 16px" }}>{d("subtitle")}</p>
        <EmptyState t={t} onGoToSettings={onGoToSettings} />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>{d("title")}</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 12px" }}>
        {dateRange ? `${dateRange.startDate} → ${dateRange.endDate}` : d("subtitle")}
      </p>
      {dateRange && onDateChange && (
        <DateRangePicker value={dateRange} onChange={onDateChange} />
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <MetricCard label={d("impressions")} value={metrics.impressions} color="#6366f1" />
        <MetricCard label={d("clicks")} value={metrics.clicks} color="#0ea5e9" />
        <MetricCard label={d("spend")} value={metrics.spend} prefix="R$ " color="#f59e0b" />
        <MetricCard label={d("conversions")} value={metrics.conversions} color="#10b981" />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
        <MetricCard label={d("ctr")} value={metrics.ctr} suffix="%" color="#8b5cf6" />
        <MetricCard label={d("cpc")} value={metrics.cpc} prefix="R$ " color="#ec4899" />
        <MetricCard label={d("cpm")} value={metrics.cpm} prefix="R$ " color="#14b8a6" />
        <MetricCard label={d("roas")} value={metrics.roas} suffix="x" color="#f97316" />
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>{d("activeCampaigns")}</h2>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>{t("name")}</th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>{t("objective")}</th>
              <th style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "#374151" }}>{t("budget")}</th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: "#374151" }}>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.filter(c => c.status === "ENABLE").map((c, i) => (
              <tr key={c.campaign_id} style={{ borderBottom: i < campaigns.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <td style={{ padding: "12px 16px", fontWeight: 500 }}>{c.campaign_name}</td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.objective_type}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>R$ {c.budget.toLocaleString("pt-BR")}</td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>{statusBadge(c.status, t)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
