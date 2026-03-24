import { useState } from "react";
import { useT } from "../i18n";

export default function Appeal({ campaigns, advertiserId }) {
  const { t } = useT();
  const a = (key) => t(`appeal.${key}`);

  const APPEAL_REASONS = Object.entries(a("reasons")).map(([value, label]) => ({ value, label }));

  const suspended = campaigns.filter(c => c.status === "DISABLE");
  const [selectedCampaign, setSelectedCampaign] = useState("account");
  const [reason, setReason] = useState("false_positive");
  const [detail, setDetail] = useState("");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

  const totalSpend = 2341.75;
  const accountAge = a("accountAgeValue");

  const generateText = () => {
    const reasonLabel = APPEAL_REASONS.find(r => r.value === reason)?.label || "";
    const target = selectedCampaign === "account"
      ? `conta de anunciante (ID: ${advertiserId || "ADV123456"})`
      : `campanha "${campaigns.find(c => c.campaign_id === selectedCampaign)?.campaign_name || ""}" (ID: ${selectedCampaign})`;

    const text = `Prezada equipe de suporte TikTok,

Estou entrando em contato para solicitar a revisão e reativação da minha ${target}.

Motivo da apelação: ${reasonLabel}
${detail ? `\nDetalhes adicionais:\n${detail}\n` : ""}
Informações da conta:
- Advertiser ID: ${advertiserId || "ADV123456"}
- Tempo de conta: ${accountAge}
- Investimento total histórico: R$ ${totalSpend.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
- Campanhas afetadas: ${suspended.length} campanha(s) pausada(s)

Acredito que esta suspensão foi aplicada incorretamente e solicito uma revisão humana do caso. Estou à disposição para fornecer qualquer documentação adicional necessária para comprovar a conformidade com as políticas do TikTok.

Aguardo retorno em até 2 dias úteis, conforme o SLA padrão.

Atenciosamente,
[Seu nome / Empresa]`;

    setGenerated(text);
    setStep(2);
  };

  const copyText = () => {
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{a("title")}</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 24px" }}>
        {a("subtitle")}
      </p>

      <div style={{
        background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10,
        padding: "14px 16px", marginBottom: 24, display: "flex", gap: 10, alignItems: "flex-start"
      }}>
        <span style={{ fontSize: 16, marginTop: 1 }}>&#9888;</span>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#92400e" }}>{a("apiWarningTitle")}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#a16207" }}>
            {a("apiWarningDesc")}
          </p>
        </div>
      </div>

      {/* steps indicator */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28, alignItems: "center" }}>
        {[
          { n: 1, label: a("step1") },
          { n: 2, label: a("step2") },
          { n: 3, label: a("step3") },
        ].map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                background: step >= s.n ? "#0f0f0f" : "#f3f4f6",
                color: step >= s.n ? "#fff" : "#9ca3af",
                flexShrink: 0
              }}>{s.n}</div>
              <span style={{ fontSize: 13, fontWeight: step === s.n ? 600 : 400, color: step >= s.n ? "#111" : "#9ca3af", whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: step > s.n ? "#0f0f0f" : "#e5e7eb", margin: "0 12px" }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, maxWidth: 600 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>{a("whatBlocked")}</span>
              <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)}
                style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, background: "#fff" }}>
                <option value="account">{a("wholeAccount")}</option>
                {suspended.map(c => (
                  <option key={c.campaign_id} value={c.campaign_id}>{c.campaign_name}</option>
                ))}
              </select>
              {suspended.length === 0 && (
                <span style={{ fontSize: 12, color: "#6b7280" }}>{a("noPausedCampaigns")}</span>
              )}
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>{a("appealReason")}</span>
              <select value={reason} onChange={e => setReason(e.target.value)}
                style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, background: "#fff" }}>
                {APPEAL_REASONS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>{a("additionalDetails")} <span style={{ fontWeight: 400, color: "#9ca3af" }}>{a("optional")}</span></span>
              <textarea
                value={detail}
                onChange={e => setDetail(e.target.value)}
                placeholder={a("detailsPlaceholder")}
                rows={4}
                style={{
                  padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8,
                  fontSize: 13, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6
                }}
              />
              <span style={{ fontSize: 11, color: "#9ca3af", alignSelf: "flex-end" }}>{detail.length}/2000 {a("chars")}</span>
            </label>

            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px" }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "#374151" }}>{a("autoDetected")}</p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { label: a("advertiserId"), value: advertiserId || "ADV123456" },
                  { label: a("totalInvestment"), value: "R$ 2.341,75" },
                  { label: a("accountAge"), value: accountAge },
                  { label: a("pausedCampaigns"), value: `${suspended.length}` },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{item.label}</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={generateText} style={{
              background: "#0f0f0f", color: "#fff", border: "none", borderRadius: 8,
              padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 4
            }}>
              {a("generateText")}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{a("reviewTitle")}</p>
              <button onClick={copyText} style={{
                background: copied ? "#dcfce7" : "#f3f4f6",
                color: copied ? "#166534" : "#374151",
                border: "none", borderRadius: 6, padding: "6px 12px",
                fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.2s"
              }}>
                {copied ? a("copied") : a("copyText")}
              </button>
            </div>
            <textarea
              value={generated}
              onChange={e => setGenerated(e.target.value)}
              rows={18}
              style={{
                width: "100%", padding: "12px", border: "1px solid #e5e7eb", borderRadius: 8,
                fontSize: 13, fontFamily: "inherit", lineHeight: 1.7, resize: "vertical",
                boxSizing: "border-box", color: "#111"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{
              background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb",
              borderRadius: 8, padding: "10px 16px", fontSize: 13, cursor: "pointer"
            }}>{a("back")}</button>
            <button onClick={() => setStep(3)} style={{
              background: "#0f0f0f", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", flex: 1
            }}>{a("continueToSend")}</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <p style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600 }}>{a("howToSend")}</p>

            {[
              {
                step: "1",
                title: a("viaAdsManager"),
                desc: a("viaAdsManagerDesc"),
                action: a("openAdsManager"),
                url: "https://ads.tiktok.com/",
                color: "#fe2c55",
              },
              {
                step: "2",
                title: a("viaHelpCenter"),
                desc: a("viaHelpCenterDesc"),
                action: a("openHelpCenter"),
                url: "https://ads.tiktok.com/help/",
                color: "#0ea5e9",
              },
              {
                step: "3",
                title: a("viaEmail"),
                desc: a("viaEmailDesc"),
                action: a("copyEmail"),
                copy: "businessservicesupport@tiktok.com",
                color: "#8b5cf6",
              },
            ].map((item, i) => (
              <div key={i} style={{
                border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px",
                marginBottom: i < 2 ? 12 : 0, display: "flex", gap: 14, alignItems: "flex-start"
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: item.color,
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, flexShrink: 0
                }}>{item.step}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600 }}>{item.title}</p>
                  <p style={{ margin: "0 0 10px", fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{item.desc}</p>
                  <button
                    onClick={() => item.copy
                      ? navigator.clipboard.writeText(item.copy)
                      : window.open(item.url, "_blank")
                    }
                    style={{
                      background: item.color, color: "#fff", border: "none",
                      borderRadius: 6, padding: "6px 14px", fontSize: 12,
                      fontWeight: 600, cursor: "pointer"
                    }}>
                    {item.action} ↗
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#166534" }}>{a("tipsTitle")}</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#15803d", lineHeight: 1.8 }}>
              <li dangerouslySetInnerHTML={{ __html: a("tip1") }} />
              <li dangerouslySetInnerHTML={{ __html: a("tip2") }} />
              <li dangerouslySetInnerHTML={{ __html: a("tip3") }} />
              <li dangerouslySetInnerHTML={{ __html: a("tip4") }} />
            </ul>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(2)} style={{
              background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb",
              borderRadius: 8, padding: "10px 16px", fontSize: 13, cursor: "pointer"
            }}>{a("backToText")}</button>
            <button onClick={() => { setStep(1); setGenerated(""); setDetail(""); }} style={{
              background: "#f3f4f6", color: "#374151", border: "none",
              borderRadius: 8, padding: "10px 16px", fontSize: 13, cursor: "pointer"
            }}>{a("newAppeal")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
