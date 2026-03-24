import { statusBadge, EmptyState } from "./shared";
import { useT } from "../i18n";

export default function AdGroups({ adGroups, setAdGroups, campaigns, connected, onGoToSettings }) {
  const { t } = useT();
  const a = (key) => t(`adgroups.${key}`);

  const toggleStatus = (id) => {
    setAdGroups(prev => prev.map(ag =>
      ag.adgroup_id === id ? { ...ag, status: ag.status === "ENABLE" ? "DISABLE" : "ENABLE" } : ag
    ));
  };

  const updateBudget = (id, val) => {
    setAdGroups(prev => prev.map(ag =>
      ag.adgroup_id === id ? { ...ag, budget: Number(val) } : ag
    ));
  };

  const updateBid = (id, val) => {
    setAdGroups(prev => prev.map(ag =>
      ag.adgroup_id === id ? { ...ag, bid: Number(val) } : ag
    ));
  };

  if (!connected || adGroups.length === 0) {
    return (
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>{a("title")}</h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 24px" }}>{a("subtitle")}</p>
        <EmptyState t={t} onGoToSettings={onGoToSettings} />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>{a("title")}</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 24px" }}>{a("subtitle")}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {adGroups.map(ag => {
          const camp = campaigns.find(c => c.campaign_id === ag.campaign_id);
          return (
            <div key={ag.adgroup_id} style={{
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14 }}>{ag.adgroup_name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>{a("campaign")}: {camp?.campaign_name || "—"}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {statusBadge(ag.status, t)}
                  <button onClick={() => toggleStatus(ag.adgroup_id)} style={{
                    background: ag.status === "ENABLE" ? "#fef2f2" : "#f0fdf4",
                    color: ag.status === "ENABLE" ? "#dc2626" : "#16a34a",
                    border: "none", borderRadius: 6, padding: "5px 10px",
                    fontSize: 12, fontWeight: 500, cursor: "pointer"
                  }}>
                    {ag.status === "ENABLE" ? t("pause") : t("activate")}
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                  <span style={{ color: "#6b7280", fontWeight: 500 }}>{a("dailyBudget")}</span>
                  <input type="number" value={ag.budget} onChange={e => updateBudget(ag.adgroup_id, e.target.value)}
                    style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, width: 130 }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                  <span style={{ color: "#6b7280", fontWeight: 500 }}>{a("bid")}</span>
                  <input type="number" step="0.01" value={ag.bid} onChange={e => updateBid(ag.adgroup_id, e.target.value)}
                    style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, width: 100 }} />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
