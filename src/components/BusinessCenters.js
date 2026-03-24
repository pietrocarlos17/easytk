import { useState } from "react";
import { statusBadge } from "./shared";
import { useT } from "../i18n";

export default function BusinessCenters({ bcs, setBcs, showToast }) {
  const { t } = useT();
  const b = (key) => t(`bc.${key}`);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ bc_name: "", bc_id: "", access_token: "" });
  const [loading, setLoading] = useState(false);
  const [expandedBCs, setExpandedBCs] = useState({});
  const [removingId, setRemovingId] = useState(null);

  const toggleBC = (id) => setExpandedBCs(p => ({ ...p, [id]: !p[id] }));

  const handleLink = async () => {
    if (!form.bc_name || !form.bc_id || !form.access_token) {
      showToast(b("fillAll"), "error");
      return;
    }
    if (bcs.find(x => x.bc_id === form.bc_id)) {
      showToast(b("alreadyLinked"), "error");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const ts = Date.now();
    const newBC = {
      bc_id: form.bc_id,
      bc_name: form.bc_name,
      access_token: form.access_token,
      linked_at: new Date().toLocaleDateString("pt-BR"),
      accounts: [
        { advertiser_id: `ADV-${ts}-1`, name: `${form.bc_name} — Conta Principal`, status: "ENABLE", balance: 1200.00, daily_spend: 98.40 },
        { advertiser_id: `ADV-${ts}-2`, name: `${form.bc_name} — Conta Secundária`, status: "ENABLE", balance: 340.50, daily_spend: 45.20 },
      ],
    };
    setBcs(prev => [...prev, newBC]);
    setExpandedBCs(p => ({ ...p, [form.bc_id]: true }));
    showToast(b("linkSuccess")(form.bc_name));
    setForm({ bc_name: "", bc_id: "", access_token: "" });
    setShowModal(false);
    setLoading(false);
  };

  const handleRemove = (bcId) => {
    setBcs(prev => prev.filter(x => x.bc_id !== bcId));
    setRemovingId(null);
    showToast(b("unlinkSuccess"));
  };

  const daysLeft = (acc) => acc.daily_spend > 0 ? Math.floor(acc.balance / acc.daily_spend) : null;
  const alertC = (days) => days === null
    ? { bg: "#f9fafb", fg: "#9ca3af", border: "#e5e7eb", label: "Sem gasto" }
    : days <= 3 ? { bg: "#fef2f2", fg: "#dc2626", border: "#fecaca", label: `~${days}d · Crítico` }
    : days <= 7 ? { bg: "#fffbeb", fg: "#d97706", border: "#fde68a", label: `~${days}d · Atenção` }
    : { bg: "#f0fdf4", fg: "#16a34a", border: "#bbf7d0", label: `~${days}d · OK` };

  const totalAccounts = bcs.reduce((s, x) => s + x.accounts.length, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{b("title")}</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            {bcs.length === 0
              ? b("noBCYet")
              : b("summary")(bcs.length, totalAccounts)}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: "#fe2c55", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          {b("linkBC")}
        </button>
      </div>

      {showModal && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 15 }}>{b("linkTitle")}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>{b("linkSubtitle")}</p>
            </div>
            <button onClick={() => { setShowModal(false); setForm({ bc_name: "", bc_id: "", access_token: "" }); }}
              style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>×</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 520 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>{b("bcName")} <span style={{ color: "#fe2c55" }}>*</span></span>
              <input placeholder={b("bcNamePlaceholder")} value={form.bc_name}
                onChange={e => setForm(p => ({ ...p, bc_name: e.target.value }))}
                style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }} />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>{b("bcId")} <span style={{ color: "#fe2c55" }}>*</span></span>
              <input placeholder={b("bcIdPlaceholder")} value={form.bc_id}
                onChange={e => setForm(p => ({ ...p, bc_id: e.target.value }))}
                style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }} />
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{b("bcIdHelp")}</span>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>{b("accessToken")} <span style={{ color: "#fe2c55" }}>*</span></span>
              <input type="password" placeholder={b("accessTokenPlaceholder")} value={form.access_token}
                onChange={e => setForm(p => ({ ...p, access_token: e.target.value }))}
                style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }} />
              <span style={{ fontSize: 11, color: "#9ca3af" }}>
                {b("accessTokenHelp")}{" "}
                <code style={{ background: "#f3f4f6", padding: "1px 4px", borderRadius: 4 }}>bc.read</code>
              </span>
            </label>

            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "10px 14px" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#1e40af" }}>
                {b("apiNote")}{" "}
                <code style={{ background: "#dbeafe", padding: "1px 4px", borderRadius: 3 }}>GET /advertiser/list/?bc_id=...</code>{" "}
                {b("apiNoteEnd")}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleLink} disabled={loading}
                style={{ background: loading ? "#9ca3af" : "#0f0f0f", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? b("connecting") : b("link")}
              </button>
              <button onClick={() => { setShowModal(false); setForm({ bc_name: "", bc_id: "", access_token: "" }); }}
                style={{ background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 16px", fontSize: 13, cursor: "pointer" }}>
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {bcs.length === 0 && !showModal && (
        <div style={{ background: "#fff", border: "2px dashed #e5e7eb", borderRadius: 12, padding: "56px 24px", textAlign: "center" }}>
          <div style={{ width: 52, height: 52, background: "#fff0f3", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24, color: "#fe2c55" }}>◉</div>
          <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#111" }}>{b("emptyTitle")}</p>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#9ca3af", maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
            {b("emptyDesc")}
          </p>
          <button onClick={() => setShowModal(true)}
            style={{ background: "#fe2c55", color: "#fff", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {b("linkFirst")}
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {bcs.map(bc => {
          const isOpen = !!expandedBCs[bc.bc_id];
          const totalBal = bc.accounts.reduce((s, a) => s + a.balance, 0);
          const activeAcc = bc.accounts.filter(a => a.status === "ENABLE").length;

          return (
            <div key={bc.bc_id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderLeft: "4px solid #fe2c55", background: isOpen ? "#fff7f8" : "#fff" }}>
                <button onClick={() => toggleBC(bc.bc_id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 11, padding: 4, display: "flex", alignItems: "center" }}>
                  <span style={{ display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.15s" }}>▶</span>
                </button>

                <div style={{ width: 38, height: 38, background: "#fff0f3", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fe2c55", flexShrink: 0 }}>◉</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#0f0f0f" }}>{bc.bc_name}</p>
                    <span style={{ fontSize: 11, fontWeight: 500, background: "#f0fdf4", color: "#16a34a", padding: "2px 8px", borderRadius: 10, border: "1px solid #bbf7d0" }}>{b("connected")}</span>
                  </div>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
                    BC ID: <span style={{ fontFamily: "monospace", color: "#6b7280" }}>{bc.bc_id}</span>
                    {" · "}{b("linkedAt")} {bc.linked_at}
                    {" · "}{bc.accounts.length} {b("adAccounts")}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 20, alignItems: "center", flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{b("totalBalance")}</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111" }}>
                      R$ {totalBal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{b("activeAccounts")}</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#10b981" }}>{activeAcc}/{bc.accounts.length}</p>
                  </div>

                  {removingId === bc.bc_id ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleRemove(bc.bc_id)}
                        style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        {t("confirm")}
                      </button>
                      <button onClick={() => setRemovingId(null)}
                        style={{ background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
                        {t("cancel")}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setRemovingId(bc.bc_id)}
                      style={{ background: "transparent", color: "#9ca3af", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>
                      {b("unlink")}
                    </button>
                  )}
                </div>
              </div>

              {isOpen && (
                <div style={{ borderTop: "1px solid #f3f4f6" }}>
                  <div style={{ padding: "10px 20px 8px 60px", background: "#f9fafb", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{b("adAccountsHeader")}</span>
                    <span style={{ fontSize: 11, background: "#e5e7eb", color: "#6b7280", padding: "1px 7px", borderRadius: 8 }}>{bc.accounts.length}</span>
                  </div>

                  {bc.accounts.length === 0 ? (
                    <p style={{ padding: "16px 60px", fontSize: 13, color: "#9ca3af", fontStyle: "italic" }}>{b("noAccountsFound")}</p>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ borderTop: "1px solid #f3f4f6" }}>
                          <th style={{ padding: "8px 16px 8px 60px", textAlign: "left", fontWeight: 600, color: "#9ca3af", fontSize: 11, background: "#f9fafb" }}>{b("account")}</th>
                          <th style={{ padding: "8px 16px", textAlign: "right", fontWeight: 600, color: "#9ca3af", fontSize: 11, background: "#f9fafb" }}>{t("balance")}</th>
                          <th style={{ padding: "8px 16px", textAlign: "right", fontWeight: 600, color: "#9ca3af", fontSize: 11, background: "#f9fafb" }}>{b("dailySpend")}</th>
                          <th style={{ padding: "8px 16px", textAlign: "center", fontWeight: 600, color: "#9ca3af", fontSize: 11, background: "#f9fafb" }}>{t("status")}</th>
                          <th style={{ padding: "8px 16px", textAlign: "center", fontWeight: 600, color: "#9ca3af", fontSize: 11, background: "#f9fafb" }}>{b("remainingBalance")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bc.accounts.map((acc, i) => {
                          const days = daysLeft(acc);
                          const ac = alertC(days);
                          return (
                            <tr key={acc.advertiser_id} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                              <td style={{ padding: "13px 16px 13px 60px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#3b82f6", flexShrink: 0 }}>
                                    {acc.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p style={{ margin: "0 0 2px", fontWeight: 600, color: "#111" }}>{acc.name}</p>
                                    <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>{acc.advertiser_id}</p>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: "13px 16px", textAlign: "right", fontWeight: 700, color: "#111" }}>
                                R$ {acc.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: "13px 16px", textAlign: "right", color: "#6b7280" }}>
                                {acc.daily_spend > 0 ? `R$ ${acc.daily_spend.toFixed(2)}` : "—"}
                              </td>
                              <td style={{ padding: "13px 16px", textAlign: "center" }}>
                                {statusBadge(acc.status, t)}
                              </td>
                              <td style={{ padding: "13px 16px", textAlign: "center" }}>
                                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: ac.bg, color: ac.fg, border: `1px solid ${ac.border}` }}>
                                  {ac.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
