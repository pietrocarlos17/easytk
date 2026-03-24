import { useState } from "react";
import { useT } from "../i18n";
import { mockBCTree } from "../mockData";
import { statusBadge, fmt, alertColor } from "./shared";

function TreeChevron({ open }) {
  return (
    <span style={{
      display: "inline-block", width: 16, height: 16, lineHeight: "16px",
      textAlign: "center", fontSize: 10, color: "#9ca3af",
      transform: open ? "rotate(90deg)" : "rotate(0deg)",
      transition: "transform 0.15s", userSelect: "none"
    }}>▶</span>
  );
}

function AdRow({ ad, depth, t }) {
  const b = (key) => t(`bcBalance.${key}`);
  const ctr = ad.clicks && ad.impressions ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : "0.00";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 12px 8px", marginLeft: depth * 20,
      borderLeft: "2px solid #f3f4f6", marginTop: 2,
      background: "#fafafa", borderRadius: "0 6px 6px 0"
    }}>
      <span style={{ fontSize: 11, color: "#d1d5db", marginRight: 2 }}>◇</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{ad.ad_name}</span>
        <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 6 }}>{ad.ad_id}</span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: "#6b7280" }}>{ad.impressions?.toLocaleString("pt-BR")} {b("imp")}</span>
        <span style={{ fontSize: 11, color: "#6b7280" }}>{ad.clicks?.toLocaleString("pt-BR")} {b("clicksLabel")}</span>
        <span style={{ fontSize: 11, color: "#6b7280" }}>CTR {ctr}%</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#111", minWidth: 70, textAlign: "right" }}>R$ {fmt(ad.spend)}</span>
        {statusBadge(ad.status, t)}
      </div>
    </div>
  );
}

function AdGroupRow({ ag, depth, expanded, onToggle, t }) {
  const b = (key) => t(`bcBalance.${key}`);
  return (
    <div>
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
          padding: "9px 12px", marginLeft: depth * 20,
          borderLeft: "2px solid #e5e7eb", marginTop: 2,
          background: expanded ? "#f5f3ff" : "#fff",
          borderRadius: "0 8px 8px 0",
          transition: "background 0.1s"
        }}
      >
        <TreeChevron open={expanded} />
        <span style={{ fontSize: 11, color: "#8b5cf6", marginRight: 2 }}>▣</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{ag.adgroup_name}</span>
          <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 6 }}>{ag.adgroup_id}</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: "#6b7280" }}>{b("budgetLabel")} R$ {fmt(ag.budget)}</span>
          <span style={{ fontSize: 11, color: "#6b7280" }}>{b("bidLabel")} R$ {ag.bid.toFixed(2)}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#111", minWidth: 70, textAlign: "right" }}>R$ {fmt(ag.spend)}</span>
          {statusBadge(ag.status, t)}
          <span style={{ fontSize: 11, color: "#9ca3af" }}>{b("ads")(ag.ads.length)}</span>
        </div>
      </div>
      {expanded && ag.ads.map(ad => <AdRow key={ad.ad_id} ad={ad} depth={depth + 1} t={t} />)}
    </div>
  );
}

function CampaignRow({ camp, depth, expanded, onToggle, expandedAGs, onToggleAG, t }) {
  const b = (key) => t(`bcBalance.${key}`);
  return (
    <div>
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
          padding: "10px 12px", marginLeft: depth * 20,
          borderLeft: "2px solid #dbeafe", marginTop: 3,
          background: expanded ? "#eff6ff" : "#fff",
          borderRadius: "0 8px 8px 0", transition: "background 0.1s"
        }}
      >
        <TreeChevron open={expanded} />
        <span style={{ fontSize: 11, color: "#3b82f6", marginRight: 2 }}>◆</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1e40af" }}>{camp.campaign_name}</span>
          <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 6 }}>{camp.campaign_id}</span>
          <span style={{ fontSize: 11, color: "#93c5fd", marginLeft: 8, background: "#dbeafe", padding: "1px 6px", borderRadius: 10 }}>{camp.objective_type}</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: "#6b7280" }}>{b("budgetLabel")} R$ {fmt(camp.budget)}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#111", minWidth: 70, textAlign: "right" }}>R$ {fmt(camp.spend)}</span>
          {statusBadge(camp.status, t)}
          <span style={{ fontSize: 11, color: "#9ca3af" }}>{b("groups")(camp.adgroups.length)}</span>
        </div>
      </div>
      {expanded && camp.adgroups.map(ag => (
        <AdGroupRow
          key={ag.adgroup_id} ag={ag} depth={depth + 1}
          expanded={!!expandedAGs[ag.adgroup_id]}
          onToggle={() => onToggleAG(ag.adgroup_id)}
          t={t}
        />
      ))}
    </div>
  );
}

function AccountRow({ acc, depth, expanded, onToggle, expandedCamps, onToggleCamp, expandedAGs, onToggleAG, t }) {
  const b = (key) => t(`bcBalance.${key}`);
  const days = acc.daily_spend > 0 ? Math.floor(acc.balance / acc.daily_spend) : 999;
  const ac = alertColor(days, t);
  return (
    <div>
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
          padding: "11px 14px", marginLeft: depth * 20,
          borderLeft: "2px solid #d1fae5", marginTop: 4,
          background: expanded ? "#ecfdf5" : "#fff",
          borderRadius: "0 10px 10px 0", transition: "background 0.1s"
        }}
      >
        <TreeChevron open={expanded} />
        <span style={{ fontSize: 12, color: "#10b981", marginRight: 2 }}>■</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#064e3b" }}>{acc.name}</span>
          <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 6 }}>{acc.advertiser_id}</span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{b("balanceLabel")}</p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111" }}>R$ {fmt(acc.balance)}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{b("dailySpend")}</p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111" }}>R$ {acc.daily_spend.toFixed(2)}</p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
            background: ac.bg, color: ac.fg, border: `1px solid ${ac.border}`
          }}>{days >= 999 ? t("noSpend") : `~${days}d`}</span>
          {statusBadge(acc.status, t)}
          <span style={{ fontSize: 11, color: "#9ca3af" }}>{b("campaigns")(acc.campaigns.length)}</span>
        </div>
      </div>
      {expanded && acc.campaigns.map(camp => (
        <CampaignRow
          key={camp.campaign_id} camp={camp} depth={depth + 1}
          expanded={!!expandedCamps[camp.campaign_id]}
          onToggle={() => onToggleCamp(camp.campaign_id)}
          expandedAGs={expandedAGs}
          onToggleAG={onToggleAG}
          t={t}
        />
      ))}
    </div>
  );
}

export default function BCBalance() {
  const { t } = useT();
  const b = (key) => t(`bcBalance.${key}`);
  const [bcs] = useState(mockBCTree);
  const [expandedBCs, setExpandedBCs] = useState({});
  const [expandedAccs, setExpandedAccs] = useState({});
  const [expandedCamps, setExpandedCamps] = useState({});
  const [expandedAGs, setExpandedAGs] = useState({});

  const toggle = (map, setMap, key) => setMap(prev => ({ ...prev, [key]: !prev[key] }));

  const expandAll = () => {
    const bcMap = {}, accMap = {}, campMap = {}, agMap = {};
    bcs.forEach(bc => {
      bcMap[bc.bc_id] = true;
      bc.accounts.forEach(acc => {
        accMap[acc.advertiser_id] = true;
        acc.campaigns.forEach(c => {
          campMap[c.campaign_id] = true;
          c.adgroups.forEach(ag => { agMap[ag.adgroup_id] = true; });
        });
      });
    });
    setExpandedBCs(bcMap); setExpandedAccs(accMap);
    setExpandedCamps(campMap); setExpandedAGs(agMap);
  };

  const collapseAll = () => {
    setExpandedBCs({}); setExpandedAccs({});
    setExpandedCamps({}); setExpandedAGs({});
  };

  const totalBalance = bcs.reduce((s, bc) => s + bc.balance, 0);
  const totalAccounts = bcs.reduce((s, bc) => s + bc.accounts.length, 0);
  const totalCampaigns = bcs.reduce((s, bc) => bc.accounts.reduce((s2, a) => s2 + a.campaigns.length, s), 0);
  const totalSpend = bcs.reduce((s, bc) => bc.accounts.reduce((s2, a) => a.campaigns.reduce((s3, c) => s3 + c.spend, s2), s), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{b("title")}</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            {b("summary")(bcs.length, totalAccounts, totalCampaigns)}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={expandAll} style={{ background: "#f3f4f6", border: "none", borderRadius: 7, padding: "8px 12px", fontSize: 12, cursor: "pointer", color: "#374151" }}>{b("expandAll")}</button>
          <button onClick={collapseAll} style={{ background: "#f3f4f6", border: "none", borderRadius: 7, padding: "8px 12px", fontSize: 12, cursor: "pointer", color: "#374151" }}>{b("collapseAll")}</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: b("totalBCBalance"), value: `R$ ${fmt(totalBalance)}`, color: "#10b981" },
          { label: b("totalCampaignSpend"), value: `R$ ${fmt(totalSpend)}`, color: "#f59e0b" },
          { label: b("linkedBCs"), value: bcs.length, color: "#6366f1" },
          { label: b("adAccounts"), value: totalAccounts, color: "#0ea5e9" },
        ].map(c => (
          <div key={c.label} style={{ flex: "1 1 140px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.label}</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
        {[
          { icon: "●", color: "#fe2c55", label: b("legend").bc },
          { icon: "■", color: "#10b981", label: b("legend").account },
          { icon: "◆", color: "#3b82f6", label: b("legend").campaign },
          { icon: "▣", color: "#8b5cf6", label: b("legend").adgroup },
          { icon: "◇", color: "#9ca3af", label: b("legend").ad },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ color: l.color, fontSize: 12 }}>{l.icon}</span>
            <span style={{ fontSize: 11, color: "#6b7280" }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        {bcs.map((bc, bcIdx) => {
          const days = bc.avg_daily_spend > 0 ? Math.floor(bc.balance / bc.avg_daily_spend) : 999;
          const ac = alertColor(days, t);
          const isOpen = !!expandedBCs[bc.bc_id];
          return (
            <div key={bc.bc_id} style={{ borderBottom: bcIdx < bcs.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <div
                onClick={() => toggle(expandedBCs, setExpandedBCs, bc.bc_id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                  padding: "14px 16px",
                  background: isOpen ? "#fff7f8" : "#fff",
                  borderLeft: `4px solid #fe2c55`,
                  transition: "background 0.1s"
                }}
              >
                <TreeChevron open={isOpen} />
                <span style={{ fontSize: 14, color: "#fe2c55" }}>●</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0f0f0f" }}>{bc.bc_name}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}>ID: {bc.bc_id}</span>
                  {bc.invoices_unpaid > 0 && (
                    <span style={{ marginLeft: 10, fontSize: 11, fontWeight: 600, background: "#fef2f2", color: "#dc2626", padding: "2px 7px", borderRadius: 10 }}>
                      {b("invoice")} R$ {fmt(bc.invoices_unpaid)}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center", flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{b("bcBalance")}</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111" }}>R$ {fmt(bc.balance)}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{b("availableCredit")}</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#6366f1" }}>R$ {fmt(bc.available_credit)}</p>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20,
                    background: ac.bg, color: ac.fg, border: `1px solid ${ac.border}`
                  }}>{days >= 999 ? t("noSpend") : `~${days}d · ${ac.label}`}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{b("accounts")(bc.accounts.length)}</span>
                </div>
              </div>

              {isOpen && (
                <div style={{ paddingBottom: 8, paddingLeft: 8, paddingRight: 8 }}>
                  {bc.accounts.length === 0 && (
                    <p style={{ padding: "12px 20px", fontSize: 13, color: "#9ca3af", fontStyle: "italic" }}>{b("noAccountsYet")}</p>
                  )}
                  {bc.accounts.map(acc => (
                    <AccountRow
                      key={acc.advertiser_id} acc={acc} depth={1}
                      expanded={!!expandedAccs[acc.advertiser_id]}
                      onToggle={() => toggle(expandedAccs, setExpandedAccs, acc.advertiser_id)}
                      expandedCamps={expandedCamps}
                      onToggleCamp={(id) => toggle(expandedCamps, setExpandedCamps, id)}
                      expandedAGs={expandedAGs}
                      onToggleAG={(id) => toggle(expandedAGs, setExpandedAGs, id)}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
