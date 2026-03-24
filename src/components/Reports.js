import { MetricCard, EmptyState, DateRangePicker } from "./shared";
import { useT } from "../i18n";

export default function Reports({ metrics, connected, onGoToSettings, dateRange, onDateChange }) {
  const { t } = useT();
  const r = (key) => t(`reports.${key}`);

  if (!connected || !metrics) {
    return (
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>{r("title")}</h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 16px" }}>{r("subtitle")}</p>
        <EmptyState t={t} onGoToSettings={onGoToSettings} />
      </div>
    );
  }

  const rows = [
    { metric: r("impressions"), value: metrics.impressions.toLocaleString("pt-BR"), desc: r("impressionsDesc") },
    { metric: r("clicks"), value: metrics.clicks.toLocaleString("pt-BR"), desc: r("clicksDesc") },
    { metric: r("ctr"), value: `${metrics.ctr}%`, desc: r("ctrDesc") },
    { metric: r("totalSpend"), value: `R$ ${metrics.spend.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, desc: r("totalSpendDesc") },
    { metric: r("cpc"), value: `R$ ${metrics.cpc}`, desc: r("cpcDesc") },
    { metric: r("cpm"), value: `R$ ${metrics.cpm}`, desc: r("cpmDesc") },
    { metric: r("conversions"), value: metrics.conversions.toLocaleString("pt-BR"), desc: r("conversionsDesc") },
    { metric: r("roas"), value: `${metrics.roas}x`, desc: r("roasDesc") },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>{r("title")}</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 12px" }}>
        {dateRange ? `${dateRange.startDate} → ${dateRange.endDate}` : r("subtitle")}
      </p>
      {dateRange && onDateChange && (
        <DateRangePicker value={dateRange} onChange={onDateChange} />
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
        <MetricCard label={t("dashboard.spend")} value={metrics.spend} prefix="R$ " color="#f59e0b" />
        <MetricCard label={t("dashboard.roas")} value={metrics.roas} suffix="x" color="#10b981" />
        <MetricCard label={t("dashboard.conversions")} value={metrics.conversions} color="#6366f1" />
        <MetricCard label={t("dashboard.ctr")} value={metrics.ctr} suffix="%" color="#ec4899" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>{r("metric")}</th>
              <th style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "#374151" }}>{r("value")}</th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>{r("description")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.metric} style={{ borderBottom: i < rows.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <td style={{ padding: "12px 16px", fontWeight: 500 }}>{row.metric}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", color: "#111" }}>{row.value}</td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
