import { useState } from "react";
import { statusBadge, EmptyState, DateRangePicker } from "./shared";
import { useT } from "../i18n";
import * as api from "../tiktokApi";

const OBJECTIVES = [
  {
    category: "Reconhecimento",
    color: "#6366f1",
    items: [
      { value: "REACH", label: "Alcance", icon: "👥", desc: "Maximize o número de pessoas que veem seu anúncio" },
    ],
  },
  {
    category: "Consideração",
    color: "#0ea5e9",
    items: [
      { value: "TRAFFIC", label: "Tráfego", icon: "🔗", desc: "Direcione pessoas para seu site ou app" },
      { value: "VIDEO_VIEWS", label: "Views de Vídeo", icon: "▶️", desc: "Maximize visualizações do seu vídeo" },
      { value: "LEAD_GENERATION", label: "Geração de Leads", icon: "📋", desc: "Colete leads diretamente no TikTok" },
      { value: "ENGAGEMENT", label: "Interação da Comunidade", icon: "💬", desc: "Aumente curtidas, comentários e seguidores" },
    ],
  },
  {
    category: "Conversão",
    color: "#10b981",
    items: [
      { value: "APP_PROMOTION", label: "Promoção de App", icon: "📱", desc: "Instale ou engaje usuários no seu app" },
      { value: "WEB_CONVERSIONS", label: "Conversões no Site", icon: "🛒", desc: "Gere conversões valiosas no seu site" },
      { value: "PRODUCT_SALES", label: "Vendas de Catálogo", icon: "🏷️", desc: "Venda produtos do seu catálogo TikTok Shop" },
    ],
  },
];

const SPECIAL_INDUSTRIES = [
  { value: "HOUSING", label: "Habitação" },
  { value: "EMPLOYMENT", label: "Emprego" },
  { value: "CREDIT", label: "Crédito" },
  { value: "SOCIAL_ISSUES_ELECTIONS_POLITICS", label: "Questões sociais / Eleições / Política" },
];

const EMPTY_FORM = {
  campaign_name: "",
  objective_type: "",
  budget_mode: "BUDGET_MODE_DAY",
  budget: "",
  special_industries: [],
  cbo: false,
};

export default function Campaigns({ campaigns, setCampaigns, connected, onGoToSettings, dateRange, onDateChange, config, showToast }) {
  const { t } = useT();
  const c = (key) => t(`campaigns.${key}`);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);

  const filteredCampaigns = dateRange
    ? campaigns.filter(camp => {
        if (!camp.create_time) return true;
        return camp.create_time >= dateRange.startDate && camp.create_time <= dateRange.endDate;
      })
    : campaigns;

  const toggleStatus = (id) => {
    setCampaigns(prev => prev.map(camp =>
      camp.campaign_id === id ? { ...camp, status: camp.status === "ENABLE" ? "DISABLE" : "ENABLE" } : camp
    ));
  };

  const duplicateCampaign = (id) => {
    const original = campaigns.find(c => c.campaign_id === id);
    if (!original) return;
    setCampaigns(prev => [{
      ...original,
      campaign_id: String(Date.now()),
      campaign_name: `Cópia de ${original.campaign_name}`,
      status: "DISABLE",
      create_time: new Date().toISOString().split("T")[0],
    }, ...prev]);
  };

  const openModal = () => { setForm(EMPTY_FORM); setStep(1); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleCreate = async () => {
    if (!form.campaign_name || !form.objective_type) return;
    if (form.budget_mode !== "BUDGET_MODE_INFINITE" && !form.budget) return;

    setCreating(true);
    try {
      const payload = {
        campaign_name: form.campaign_name,
        objective_type: form.objective_type,
        budget_mode: form.budget_mode,
        ...(form.budget_mode !== "BUDGET_MODE_INFINITE" && { budget: Number(form.budget) }),
        ...(form.special_industries.length > 0 && { special_industries: form.special_industries }),
        ...(form.cbo && { campaign_budget_optimize_on: true }),
      };

      // Se tiver accessToken real, cria no TikTok
      if (config?.accessToken && config?.advertiserId) {
        const result = await api.createCampaign(config.accessToken, config.advertiserId, payload);
        const newCampaign = {
          campaign_id: result.campaign_id || String(Date.now()),
          campaign_name: form.campaign_name,
          status: "DISABLE",
          budget: form.budget_mode === "BUDGET_MODE_INFINITE" ? 0 : Number(form.budget),
          budget_mode: form.budget_mode,
          objective_type: form.objective_type,
          create_time: new Date().toISOString().split("T")[0],
        };
        setCampaigns(prev => [newCampaign, ...prev]);
        showToast?.("Campanha criada no TikTok Ads!");
      } else {
        // Modo demo — salva só localmente
        setCampaigns(prev => [{
          campaign_id: String(Date.now()),
          campaign_name: form.campaign_name,
          status: "DISABLE",
          budget: form.budget_mode === "BUDGET_MODE_INFINITE" ? 0 : Number(form.budget),
          budget_mode: form.budget_mode,
          objective_type: form.objective_type,
          create_time: new Date().toISOString().split("T")[0],
        }, ...prev]);
        showToast?.("Campanha criada localmente (modo demo)");
      }
      closeModal();
    } catch (err) {
      showToast?.(`Erro ao criar campanha: ${err.message}`, "error");
    } finally {
      setCreating(false);
    }
  };

  const toggleIndustry = (val) => {
    setForm(f => ({
      ...f,
      special_industries: f.special_industries.includes(val)
        ? f.special_industries.filter(v => v !== val)
        : [...f.special_industries, val],
    }));
  };

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
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{c("title")}</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>{c("subtitle")(filteredCampaigns.length)}</p>
        </div>
        <button onClick={openModal} style={{
          background: "#fe2c55", color: "#fff", border: "none", borderRadius: 8,
          padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer"
        }}>{c("newCampaign")}</button>
      </div>

      {/* Date range */}
      {dateRange && onDateChange && <DateRangePicker value={dateRange} onChange={onDateChange} />}

      {/* Table */}
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
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  {camp.budget_mode === "BUDGET_MODE_INFINITE" ? "Sem limite" : `R$ ${camp.budget.toLocaleString("pt-BR")}`}
                </td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{camp.create_time}</td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>{statusBadge(camp.status, t)}</td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    <button onClick={() => toggleStatus(camp.campaign_id)} style={{
                      background: camp.status === "ENABLE" ? "#fef2f2" : "#f0fdf4",
                      color: camp.status === "ENABLE" ? "#dc2626" : "#16a34a",
                      border: "none", borderRadius: 6, padding: "5px 10px",
                      fontSize: 12, fontWeight: 500, cursor: "pointer"
                    }}>
                      {camp.status === "ENABLE" ? t("pause") : t("activate")}
                    </button>
                    <button onClick={() => duplicateCampaign(camp.campaign_id)} style={{
                      background: "#f0f9ff", color: "#0369a1",
                      border: "none", borderRadius: 6, padding: "5px 10px",
                      fontSize: 12, fontWeight: 500, cursor: "pointer"
                    }}>
                      Duplicar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640,
            maxHeight: "90vh", overflowY: "auto", padding: 32, position: "relative"
          }}>
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Nova Campanha</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
                  {step === 1 ? "Passo 1 de 2 — Escolha o objetivo" : "Passo 2 de 2 — Configurações da campanha"}
                </p>
              </div>
              <button onClick={closeModal} style={{
                background: "transparent", border: "none", fontSize: 20,
                cursor: "pointer", color: "#6b7280", lineHeight: 1
              }}>✕</button>
            </div>

            {/* Step indicator */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              {[1, 2].map(s => (
                <div key={s} style={{
                  flex: 1, height: 4, borderRadius: 4,
                  background: s <= step ? "#fe2c55" : "#e5e7eb"
                }} />
              ))}
            </div>

            {/* ── Step 1: Objetivo ── */}
            {step === 1 && (
              <div>
                {OBJECTIVES.map(group => (
                  <div key={group.category} style={{ marginBottom: 24 }}>
                    <p style={{
                      margin: "0 0 10px", fontSize: 11, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.07em",
                      color: group.color
                    }}>{group.category}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {group.items.map(obj => (
                        <button key={obj.value} onClick={() => setForm(f => ({ ...f, objective_type: obj.value }))}
                          style={{
                            display: "flex", alignItems: "center", gap: 14,
                            padding: "14px 16px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                            border: form.objective_type === obj.value ? `2px solid ${group.color}` : "1px solid #e5e7eb",
                            background: form.objective_type === obj.value ? `${group.color}08` : "#fff",
                            transition: "all .15s"
                          }}>
                          <span style={{ fontSize: 22 }}>{obj.icon}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#111" }}>{obj.label}</p>
                            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{obj.desc}</p>
                          </div>
                          {form.objective_type === obj.value && (
                            <div style={{
                              marginLeft: "auto", width: 20, height: 20, borderRadius: "50%",
                              background: group.color, display: "flex", alignItems: "center",
                              justifyContent: "center", color: "#fff", fontSize: 11, flexShrink: 0
                            }}>✓</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => { if (form.objective_type) setStep(2); }}
                  disabled={!form.objective_type}
                  style={{
                    width: "100%", padding: 14, borderRadius: 10, border: "none",
                    background: form.objective_type ? "#fe2c55" : "#e5e7eb",
                    color: form.objective_type ? "#fff" : "#9ca3af",
                    fontSize: 14, fontWeight: 600, cursor: form.objective_type ? "pointer" : "not-allowed",
                    marginTop: 8
                  }}>
                  Continuar →
                </button>
              </div>
            )}

            {/* ── Step 2: Configurações ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Nome */}
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Nome da campanha *</span>
                  <input
                    autoFocus
                    placeholder="ex: Black Friday 2025 — Conversões"
                    value={form.campaign_name}
                    onChange={e => setForm(f => ({ ...f, campaign_name: e.target.value }))}
                    style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }}
                  />
                </label>

                {/* Orçamento */}
                <div>
                  <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#374151" }}>Tipo de orçamento *</p>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    {[
                      { value: "BUDGET_MODE_DAY", label: "Diário" },
                      { value: "BUDGET_MODE_TOTAL", label: "Total (Lifetime)" },
                      { value: "BUDGET_MODE_INFINITE", label: "Sem limite" },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => setForm(f => ({ ...f, budget_mode: opt.value, budget: "" }))}
                        style={{
                          flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 12, fontWeight: 500,
                          cursor: "pointer",
                          border: form.budget_mode === opt.value ? "2px solid #fe2c55" : "1px solid #e5e7eb",
                          background: form.budget_mode === opt.value ? "#fff5f6" : "#fff",
                          color: form.budget_mode === opt.value ? "#fe2c55" : "#374151",
                        }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {form.budget_mode !== "BUDGET_MODE_INFINITE" && (
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 13, color: "#6b7280" }}>
                        Valor {form.budget_mode === "BUDGET_MODE_DAY" ? "diário" : "total"} (R$) *
                      </span>
                      <input
                        type="number" placeholder="ex: 100"
                        value={form.budget}
                        onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                        style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }}
                      />
                    </label>
                  )}
                </div>

                {/* CBO */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 16px", border: "1px solid #e5e7eb", borderRadius: 10
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111" }}>Otimização de orçamento da campanha (CBO)</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>O TikTok distribui o orçamento automaticamente entre os grupos de anúncios</p>
                  </div>
                  <div
                    onClick={() => setForm(f => ({ ...f, cbo: !f.cbo }))}
                    style={{
                      width: 44, height: 24, borderRadius: 12, cursor: "pointer", flexShrink: 0, marginLeft: 16,
                      background: form.cbo ? "#fe2c55" : "#d1d5db", position: "relative", transition: "background .2s"
                    }}>
                    <div style={{
                      position: "absolute", top: 2, left: form.cbo ? 22 : 2,
                      width: 20, height: 20, borderRadius: "50%", background: "#fff",
                      transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }} />
                  </div>
                </div>

                {/* Categorias especiais */}
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#374151" }}>Categorias especiais de anúncio</p>
                  <p style={{ margin: "0 0 10px", fontSize: 12, color: "#6b7280" }}>Selecione se seu anúncio pertence a alguma categoria regulada</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {SPECIAL_INDUSTRIES.map(ind => (
                      <label key={ind.value} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={form.special_industries.includes(ind.value)}
                          onChange={() => toggleIndustry(ind.value)}
                          style={{ width: 16, height: 16, accentColor: "#fe2c55" }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>{ind.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Aviso modo demo */}
                {(!config?.accessToken || !config?.advertiserId) && (
                  <div style={{ padding: "10px 14px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, fontSize: 12, color: "#92400e" }}>
                    ⚠️ Modo demo — a campanha será salva apenas localmente. Conecte sua conta TikTok para criar no Ads Manager.
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button onClick={() => setStep(1)} disabled={creating} style={{
                    flex: 1, padding: 12, borderRadius: 8,
                    border: "1px solid #e5e7eb", background: "#fff",
                    color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer"
                  }}>← Voltar</button>
                  <button
                    onClick={handleCreate}
                    disabled={creating || !form.campaign_name || (form.budget_mode !== "BUDGET_MODE_INFINITE" && !form.budget)}
                    style={{
                      flex: 2, padding: 12, borderRadius: 8, border: "none",
                      background: (!creating && form.campaign_name && (form.budget_mode === "BUDGET_MODE_INFINITE" || form.budget)) ? "#fe2c55" : "#e5e7eb",
                      color: (!creating && form.campaign_name && (form.budget_mode === "BUDGET_MODE_INFINITE" || form.budget)) ? "#fff" : "#9ca3af",
                      fontSize: 14, fontWeight: 600,
                      cursor: (!creating && form.campaign_name && (form.budget_mode === "BUDGET_MODE_INFINITE" || form.budget)) ? "pointer" : "not-allowed"
                    }}>
                    {creating ? "Criando..." : (config?.accessToken ? "Criar no TikTok Ads →" : "Criar campanha")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
