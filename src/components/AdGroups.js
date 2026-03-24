import { useState } from "react";
import { statusBadge, EmptyState } from "./shared";
import { useT } from "../i18n";
import * as api from "../tiktokApi";

// ── Constantes TikTok ──────────────────────────────────────────────────────

const PLACEMENTS = [
  { value: "TIKTOK", label: "TikTok" },
  { value: "PANGLE", label: "Pangle" },
  { value: "GLOBAL_APP_BUNDLE", label: "Global App Bundle" },
];

const AGE_GROUPS = [
  { value: "AGE_13_17", label: "13–17" },
  { value: "AGE_18_24", label: "18–24" },
  { value: "AGE_25_34", label: "25–34" },
  { value: "AGE_35_44", label: "35–44" },
  { value: "AGE_45_54", label: "45–54" },
  { value: "AGE_55_100", label: "55+" },
];

const LOCATIONS = [
  { id: "6252001", label: "🇧🇷 Brasil" },
  { id: "6251999", label: "🇺🇸 Estados Unidos" },
  { id: "6255149", label: "🇬🇧 Reino Unido" },
  { id: "6255148", label: "🇪🇺 Europa" },
  { id: "2077456", label: "🇦🇺 Austrália" },
  { id: "6251986", label: "🇨🇦 Canadá" },
  { id: "3996063", label: "🇲🇽 México" },
  { id: "3865483", label: "🇦🇷 Argentina" },
];

const LANGUAGES = [
  { value: "pt", label: "Português" },
  { value: "en", label: "Inglês" },
  { value: "es", label: "Espanhol" },
  { value: "fr", label: "Francês" },
  { value: "de", label: "Alemão" },
  { value: "ja", label: "Japonês" },
  { value: "ko", label: "Coreano" },
];

const OPTIMIZATION_GOALS = [
  { value: "CLICK", label: "Cliques (CPC)", desc: "Maximize os cliques no anúncio" },
  { value: "CONVERT", label: "Conversões", desc: "Otimize para ações no site/app" },
  { value: "SHOW", label: "Alcance / Impressões", desc: "Maximize quem vê seu anúncio" },
  { value: "VIDEO_VIEW", label: "Views de Vídeo", desc: "Maximize visualizações do vídeo" },
  { value: "LEAD_GENERATION", label: "Geração de Leads", desc: "Formulários preenchidos no TikTok" },
  { value: "APP_INSTALL", label: "Instalações de App", desc: "Maximize instalações do seu app" },
  { value: "ENGAGED_VIEW", label: "Engajamento com Vídeo", desc: "Curtidas, comentários, compartilhamentos" },
];

const BID_TYPES = [
  { value: "BID_TYPE_NO_BID", label: "Custo mínimo", desc: "TikTok otimiza automaticamente o menor custo" },
  { value: "BID_TYPE_CUSTOM", label: "Lance personalizado", desc: "Defina um valor máximo de CPC/CPM" },
  { value: "BID_TYPE_OCPM", label: "oCPM", desc: "Lance por mil impressões otimizadas" },
  { value: "BID_TYPE_OCPC", label: "oCPC", desc: "Lance por clique otimizado" },
];

const BILLING_EVENTS = [
  { value: "CPC", label: "CPC — Custo por Clique" },
  { value: "CPM", label: "CPM — Custo por Mil Impressões" },
  { value: "CPV", label: "CPV — Custo por Visualização" },
  { value: "OCPM", label: "oCPM — CPM Otimizado" },
];

const EMPTY_FORM = {
  campaign_id: "",
  adgroup_name: "",
  placement_type: "PLACEMENT_TYPE_AUTOMATIC",
  placements: ["TIKTOK"],
  schedule_type: "SCHEDULE_FROM_NOW",
  schedule_start_time: "",
  schedule_end_time: "",
  budget_mode: "BUDGET_MODE_DAY",
  budget: "",
  age: [],
  gender: "GENDER_UNLIMITED",
  location_ids: [],
  languages: [],
  device_type: [],
  optimization_goal: "CLICK",
  bid_type: "BID_TYPE_NO_BID",
  bid_price: "",
  billing_event: "CPC",
  creative_material_mode: "CUSTOM",
};

const STEPS = ["Básico", "Placement & Agenda", "Público-alvo", "Otimização"];

// ── Toggle helper ──────────────────────────────────────────────────────────
function toggleArr(arr, val) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

// ── Section label ──────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af" }}>{title}</p>
      {children}
    </div>
  );
}

// ── Chip multi-select ──────────────────────────────────────────────────────
function ChipSelect({ options, selected, onToggle, keyField = "value", labelField = "label" }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map(opt => {
        const val = opt[keyField];
        const active = selected.includes(val);
        return (
          <button key={val} onClick={() => onToggle(val)} style={{
            padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
            cursor: "pointer", border: "none", transition: "all .15s",
            background: active ? "#fe2c55" : "#f3f4f6",
            color: active ? "#fff" : "#374151",
          }}>{opt[labelField]}</button>
        );
      })}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AdGroups({ adGroups, setAdGroups, campaigns, connected, onGoToSettings, config, showToast }) {
  const { t } = useT();
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleStatus = (id) => {
    setAdGroups(prev => prev.map(ag =>
      ag.adgroup_id === id ? { ...ag, status: ag.status === "ENABLE" ? "DISABLE" : "ENABLE" } : ag
    ));
  };

  const openModal = () => { setForm(EMPTY_FORM); setStep(0); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const canNext = () => {
    if (step === 0) return form.campaign_id && form.adgroup_name.trim();
    if (step === 1) return form.budget && form.budget_mode;
    if (step === 2) return form.location_ids.length > 0;
    return true;
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const now = new Date();
      const toTikTokTime = (d) => d.toISOString().replace("T", " ").slice(0, 19);

      const payload = {
        campaign_id: form.campaign_id,
        adgroup_name: form.adgroup_name,
        placement_type: form.placement_type,
        ...(form.placement_type === "PLACEMENT_TYPE_NORMAL" && { placements: form.placements }),
        schedule_type: form.schedule_type,
        schedule_start_time: form.schedule_start_time
          ? toTikTokTime(new Date(form.schedule_start_time))
          : toTikTokTime(now),
        ...(form.schedule_end_time && { schedule_end_time: toTikTokTime(new Date(form.schedule_end_time)) }),
        budget_mode: form.budget_mode,
        budget: Number(form.budget),
        location_ids: form.location_ids,
        ...(form.age.length > 0 && { age: form.age }),
        gender: form.gender,
        ...(form.languages.length > 0 && { languages: form.languages }),
        ...(form.device_type.length > 0 && { device_type: form.device_type }),
        optimization_goal: form.optimization_goal,
        bid_type: form.bid_type,
        ...(form.bid_type !== "BID_TYPE_NO_BID" && form.bid_price && { bid_price: Number(form.bid_price) }),
        billing_event: form.billing_event,
        creative_material_mode: form.creative_material_mode,
      };

      if (config?.accessToken && config?.advertiserId) {
        const result = await api.createAdGroup(config.accessToken, config.advertiserId, payload);
        setAdGroups(prev => [{
          adgroup_id: result.adgroup_id || String(Date.now()),
          adgroup_name: form.adgroup_name,
          campaign_id: form.campaign_id,
          status: "DISABLE",
          budget: Number(form.budget),
          bid: Number(form.bid_price) || 0,
        }, ...prev]);
        showToast?.("Grupo de anúncios criado no TikTok Ads!");
      } else {
        setAdGroups(prev => [{
          adgroup_id: String(Date.now()),
          adgroup_name: form.adgroup_name,
          campaign_id: form.campaign_id,
          status: "DISABLE",
          budget: Number(form.budget),
          bid: Number(form.bid_price) || 0,
        }, ...prev]);
        showToast?.("Grupo criado localmente (modo demo)");
      }
      closeModal();
    } catch (err) {
      showToast?.(`Erro: ${err.message}`, "error");
    } finally {
      setCreating(false);
    }
  };

  if (!connected || (adGroups.length === 0 && campaigns.length === 0)) {
    return (
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Grupos de Anúncios</h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 24px" }}>Gerencie orçamentos, targeting e lances</p>
        <EmptyState t={t} onGoToSettings={onGoToSettings} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Grupos de Anúncios</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>{adGroups.length} grupos na conta</p>
        </div>
        <button onClick={openModal} style={{
          background: "#fe2c55", color: "#fff", border: "none", borderRadius: 8,
          padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer"
        }}>+ Novo Grupo</button>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {adGroups.map(ag => {
          const camp = campaigns.find(c => c.campaign_id === ag.campaign_id);
          return (
            <div key={ag.adgroup_id} style={{
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14 }}>{ag.adgroup_name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>{camp?.campaign_name || "—"}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>R$ {ag.budget?.toLocaleString("pt-BR") || "—"}/dia</span>
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
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, width: "100%", maxWidth: 660,
            maxHeight: "92vh", overflowY: "auto", padding: 32, position: "relative"
          }}>
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Novo Grupo de Anúncios</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
                  Passo {step + 1} de {STEPS.length} — {STEPS[step]}
                </p>
              </div>
              <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>✕</button>
            </div>

            {/* Step bar */}
            <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ flex: 1 }}>
                  <div style={{ height: 4, borderRadius: 4, background: i <= step ? "#fe2c55" : "#e5e7eb", marginBottom: 4 }} />
                  <p style={{ margin: 0, fontSize: 10, color: i <= step ? "#fe2c55" : "#9ca3af", fontWeight: 600, textAlign: "center" }}>{s}</p>
                </div>
              ))}
            </div>

            {/* ── Step 0: Básico ── */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Section title="Campanha">
                  <select value={form.campaign_id} onChange={e => f("campaign_id", e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }}>
                    <option value="">Selecione a campanha...</option>
                    {campaigns.map(c => (
                      <option key={c.campaign_id} value={c.campaign_id}>{c.campaign_name}</option>
                    ))}
                  </select>
                </Section>

                <Section title="Nome do Grupo">
                  <input
                    autoFocus
                    placeholder="ex: Público 18-34 São Paulo"
                    value={form.adgroup_name}
                    onChange={e => f("adgroup_name", e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }}
                  />
                </Section>

                <Section title="Modo de criativo">
                  {[
                    { value: "CUSTOM", label: "Personalizado", desc: "Você cria e gerencia os criativos" },
                    { value: "SMART", label: "Smart Creative", desc: "TikTok gera variações automaticamente" },
                    { value: "DYNAMIC_CREATIVE", label: "Criativo Dinâmico", desc: "Combina elementos automaticamente para melhor performance" },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => f("creative_material_mode", opt.value)} style={{
                      display: "flex", gap: 12, alignItems: "center", width: "100%", padding: "12px 14px",
                      marginBottom: 8, borderRadius: 8, cursor: "pointer", textAlign: "left",
                      border: form.creative_material_mode === opt.value ? "2px solid #fe2c55" : "1px solid #e5e7eb",
                      background: form.creative_material_mode === opt.value ? "#fff5f6" : "#fff",
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", border: "2px solid",
                        borderColor: form.creative_material_mode === opt.value ? "#fe2c55" : "#d1d5db",
                        background: form.creative_material_mode === opt.value ? "#fe2c55" : "#fff",
                        flexShrink: 0
                      }} />
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{opt.label}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </Section>
              </div>
            )}

            {/* ── Step 1: Placement & Agenda ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Section title="Placement">
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    {[
                      { value: "PLACEMENT_TYPE_AUTOMATIC", label: "Automático", desc: "TikTok escolhe os melhores placements" },
                      { value: "PLACEMENT_TYPE_NORMAL", label: "Manual", desc: "Escolha onde seu anúncio aparece" },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => f("placement_type", opt.value)} style={{
                        flex: 1, padding: "12px", borderRadius: 8, cursor: "pointer",
                        border: form.placement_type === opt.value ? "2px solid #fe2c55" : "1px solid #e5e7eb",
                        background: form.placement_type === opt.value ? "#fff5f6" : "#fff",
                        color: form.placement_type === opt.value ? "#fe2c55" : "#374151",
                        fontWeight: 500, fontSize: 13
                      }}>
                        <p style={{ margin: "0 0 2px" }}>{opt.label}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", fontWeight: 400 }}>{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                  {form.placement_type === "PLACEMENT_TYPE_NORMAL" && (
                    <ChipSelect options={PLACEMENTS} selected={form.placements} onToggle={v => f("placements", toggleArr(form.placements, v))} />
                  )}
                </Section>

                <Section title="Agendamento">
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    {[
                      { value: "SCHEDULE_FROM_NOW", label: "A partir de agora" },
                      { value: "SCHEDULE_START_END", label: "Datas específicas" },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => f("schedule_type", opt.value)} style={{
                        flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500,
                        border: form.schedule_type === opt.value ? "2px solid #fe2c55" : "1px solid #e5e7eb",
                        background: form.schedule_type === opt.value ? "#fff5f6" : "#fff",
                        color: form.schedule_type === opt.value ? "#fe2c55" : "#374151",
                      }}>{opt.label}</button>
                    ))}
                  </div>
                  {form.schedule_type === "SCHEDULE_START_END" && (
                    <div style={{ display: "flex", gap: 10 }}>
                      <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#6b7280" }}>
                        Início
                        <input type="datetime-local" value={form.schedule_start_time} onChange={e => f("schedule_start_time", e.target.value)}
                          style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 12 }} />
                      </label>
                      <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#6b7280" }}>
                        Fim (opcional)
                        <input type="datetime-local" value={form.schedule_end_time} onChange={e => f("schedule_end_time", e.target.value)}
                          style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 12 }} />
                      </label>
                    </div>
                  )}
                </Section>

                <Section title="Orçamento do Grupo">
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    {[
                      { value: "BUDGET_MODE_DAY", label: "Diário" },
                      { value: "BUDGET_MODE_TOTAL", label: "Total" },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => f("budget_mode", opt.value)} style={{
                        flex: 1, padding: "9px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                        border: form.budget_mode === opt.value ? "2px solid #fe2c55" : "1px solid #e5e7eb",
                        background: form.budget_mode === opt.value ? "#fff5f6" : "#fff",
                        color: form.budget_mode === opt.value ? "#fe2c55" : "#374151",
                      }}>{opt.label}</button>
                    ))}
                  </div>
                  <input type="number" placeholder="Valor em R$" value={form.budget} onChange={e => f("budget", e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                </Section>
              </div>
            )}

            {/* ── Step 2: Público-alvo ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Section title="Localização *">
                  <ChipSelect
                    options={LOCATIONS} selected={form.location_ids}
                    onToggle={v => f("location_ids", toggleArr(form.location_ids, v))}
                    keyField="id" labelField="label"
                  />
                  {form.location_ids.length === 0 && (
                    <p style={{ margin: "8px 0 0", fontSize: 12, color: "#dc2626" }}>Selecione ao menos uma localização</p>
                  )}
                </Section>

                <Section title="Faixa etária (deixe vazio para todas as idades)">
                  <ChipSelect options={AGE_GROUPS} selected={form.age} onToggle={v => f("age", toggleArr(form.age, v))} />
                </Section>

                <Section title="Gênero">
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { value: "GENDER_UNLIMITED", label: "Todos" },
                      { value: "GENDER_MALE", label: "Masculino" },
                      { value: "GENDER_FEMALE", label: "Feminino" },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => f("gender", opt.value)} style={{
                        flex: 1, padding: "9px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                        border: form.gender === opt.value ? "2px solid #fe2c55" : "1px solid #e5e7eb",
                        background: form.gender === opt.value ? "#fff5f6" : "#fff",
                        color: form.gender === opt.value ? "#fe2c55" : "#374151",
                      }}>{opt.label}</button>
                    ))}
                  </div>
                </Section>

                <Section title="Idiomas (deixe vazio para todos)">
                  <ChipSelect options={LANGUAGES} selected={form.languages} onToggle={v => f("languages", toggleArr(form.languages, v))} />
                </Section>

                <Section title="Dispositivos (deixe vazio para todos)">
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { value: "ANDROID", label: "Android" },
                      { value: "IOS", label: "iOS" },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => f("device_type", toggleArr(form.device_type, opt.value))} style={{
                        flex: 1, padding: "9px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                        border: form.device_type.includes(opt.value) ? "2px solid #fe2c55" : "1px solid #e5e7eb",
                        background: form.device_type.includes(opt.value) ? "#fff5f6" : "#fff",
                        color: form.device_type.includes(opt.value) ? "#fe2c55" : "#374151",
                      }}>{opt.label}</button>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* ── Step 3: Otimização ── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Section title="Objetivo de Otimização">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {OPTIMIZATION_GOALS.map(opt => (
                      <button key={opt.value} onClick={() => f("optimization_goal", opt.value)} style={{
                        display: "flex", gap: 12, alignItems: "center", padding: "12px 14px",
                        borderRadius: 8, cursor: "pointer", textAlign: "left",
                        border: form.optimization_goal === opt.value ? "2px solid #fe2c55" : "1px solid #e5e7eb",
                        background: form.optimization_goal === opt.value ? "#fff5f6" : "#fff",
                      }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: "50%", border: "2px solid",
                          borderColor: form.optimization_goal === opt.value ? "#fe2c55" : "#d1d5db",
                          background: form.optimization_goal === opt.value ? "#fe2c55" : "#fff",
                          flexShrink: 0
                        }} />
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111" }}>{opt.label}</p>
                          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Estratégia de Lance">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                    {BID_TYPES.map(opt => (
                      <button key={opt.value} onClick={() => f("bid_type", opt.value)} style={{
                        display: "flex", gap: 12, alignItems: "center", padding: "12px 14px",
                        borderRadius: 8, cursor: "pointer", textAlign: "left",
                        border: form.bid_type === opt.value ? "2px solid #fe2c55" : "1px solid #e5e7eb",
                        background: form.bid_type === opt.value ? "#fff5f6" : "#fff",
                      }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: "50%", border: "2px solid",
                          borderColor: form.bid_type === opt.value ? "#fe2c55" : "#d1d5db",
                          background: form.bid_type === opt.value ? "#fe2c55" : "#fff",
                          flexShrink: 0
                        }} />
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111" }}>{opt.label}</p>
                          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {form.bid_type !== "BID_TYPE_NO_BID" && (
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Valor do lance (R$)</span>
                      <input type="number" step="0.01" placeholder="ex: 0.50" value={form.bid_price}
                        onChange={e => f("bid_price", e.target.value)}
                        style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }} />
                    </label>
                  )}
                </Section>

                <Section title="Evento de Cobrança">
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {BILLING_EVENTS.map(opt => (
                      <button key={opt.value} onClick={() => f("billing_event", opt.value)} style={{
                        padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                        border: form.billing_event === opt.value ? "2px solid #fe2c55" : "1px solid #e5e7eb",
                        background: form.billing_event === opt.value ? "#fff5f6" : "#fff",
                        color: form.billing_event === opt.value ? "#fe2c55" : "#374151",
                      }}>{opt.label}</button>
                    ))}
                  </div>
                </Section>

                {(!config?.accessToken || !config?.advertiserId) && (
                  <div style={{ padding: "10px 14px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, fontSize: 12, color: "#92400e" }}>
                    ⚠️ Modo demo — o grupo será salvo apenas localmente.
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} disabled={creating} style={{
                  flex: 1, padding: 12, borderRadius: 8,
                  border: "1px solid #e5e7eb", background: "#fff",
                  color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer"
                }}>← Voltar</button>
              )}
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} style={{
                  flex: 2, padding: 12, borderRadius: 8, border: "none",
                  background: canNext() ? "#0f0f0f" : "#e5e7eb",
                  color: canNext() ? "#fff" : "#9ca3af",
                  fontSize: 14, fontWeight: 600,
                  cursor: canNext() ? "pointer" : "not-allowed"
                }}>Continuar →</button>
              ) : (
                <button onClick={handleCreate} disabled={creating} style={{
                  flex: 2, padding: 12, borderRadius: 8, border: "none",
                  background: creating ? "#e5e7eb" : "#fe2c55",
                  color: creating ? "#9ca3af" : "#fff",
                  fontSize: 14, fontWeight: 600,
                  cursor: creating ? "not-allowed" : "pointer"
                }}>
                  {creating ? "Criando..." : (config?.accessToken ? "Criar no TikTok Ads →" : "Criar grupo")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
