import { useState } from "react";
import { statusBadge, EmptyState, DateRangePicker } from "./shared";
import { useT } from "../i18n";

export default function Campaigns({ campaigns, setCampaigns, connected, onGoToSettings, dateRange, onDateChange }) {
  const { t } = useT();
  const c = (key) => t(`campaigns.${key}`);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ campaign_name: "", budget: "", objective_type: "CONVERSIONS" });

  const toggleStatus = (id) => {
    setCampaigns(prev => prev.map(camp =>
      camp.campaign_id === id ? { ...camp, status: camp.status === "ENABLE" ? "DISABLE" : "ENABLE" } : camp
    ));
  };

  const handleCreate = () => {
    if (!form.campaign_name || !form.budget) return;
    const newCampaign = {
      campaign_id: String(Date.now()),
      campaign_name: form.campaign_name,
      status: "ENABLE",
      budget: Number(form.budget),
      objective_type: form.objective_type,
      create_time: new Date().toISOString().split("T")[0],
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    setShowModal(false);
    setForm({ campaign_name: "", budget: "", objective_type: "CONVERSIONS" });
  };

  const filteredCampaigns = dateRange
    ? campaigns.filter(camp => {
        if (!camp.create_time) return true;
        return camp.create_time >= dateRange.startDate && camp.create_time <= dateRange.endDate;
      })
    : campaigns;

  if (!connected || campaigns.length === 0) {
    return (
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{c("title")}</h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 16px" }}>{c("subtitle")(0)}</p>
        <EmptyState t={t} onGoToSettings={onGoToSettings} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{c("title")}</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>{c("subtitle")(filteredCampaigns.length)}</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          background: "#fe2c55", color: "#fff", border: "none", borderRadius: 8,
          padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer"
        }}>{c("newCampaign")}</button>
      </div>

      {dateRange && onDateChange && (
        <DateRangePicker value={dateRange} onChange={onDateChange} />
      )}

      {showModal && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>{c("createTitle")}</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input
              placeholder={c("namePlaceholder")} value={form.campaign_name}
              onChange={e => setForm(f => ({ ...f, campaign_name: e.target.value }))}
              style={{ flex: "2 1 200px", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }}
            />
            <input
              placeholder={c("budgetPlaceholder")} type="number" value={form.budget}
              onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
              style={{ flex: "1 1 120px", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }}
            />
            <select value={form.objective_type} onChange={e => setForm(f => ({ ...f, objective_type: e.target.value }))}
              style={{ flex: "1 1 160px", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }}>
              <option value="CONVERSIONS">{c("conversions")}</option>
              <option value="REACH">{c("reach")}</option>
              <option value="TRAFFIC">{c("traffic")}</option>
              <option value="APP_INSTALL">{c("appInstall")}</option>
              <option value="VIDEO_VIEWS">{c("videoViews")}</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={handleCreate} style={{
              background: "#0f0f0f", color: "#fff", border: "none", borderRadius: 8,
              padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>{c("create")}</button>
            <button onClick={() => setShowModal(false)} style={{
              background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8,
              padding: "9px 16px", fontSize: 13, cursor: "pointer"
            }}>{t("cancel")}</button>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>{t("name")}</th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>{t("objective")}</th>
              <th style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "#374151" }}>{t("budget")}</th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>{t("createdAt")}</th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: "#374151" }}>{t("status")}</th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: "#374151" }}>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((camp, i) => (
              <tr key={camp.campaign_id} style={{ borderBottom: i < filteredCampaigns.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <td style={{ padding: "12px 16px", fontWeight: 500 }}>{camp.campaign_name}</td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{camp.objective_type}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>R$ {camp.budget.toLocaleString("pt-BR")}</td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{camp.create_time}</td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>{statusBadge(camp.status, t)}</td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <button onClick={() => toggleStatus(camp.campaign_id)} style={{
                    background: camp.status === "ENABLE" ? "#fef2f2" : "#f0fdf4",
                    color: camp.status === "ENABLE" ? "#dc2626" : "#16a34a",
                    border: "none", borderRadius: 6, padding: "5px 10px",
                    fontSize: 12, fontWeight: 500, cursor: "pointer"
                  }}>
                    {camp.status === "ENABLE" ? t("pause") : t("activate")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
