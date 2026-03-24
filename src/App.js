import { useState, useEffect, useCallback } from "react";
import * as api from "./tiktokApi";
import { mockCampaigns, mockMetrics, mockAdGroups } from "./mockData";
import { LanguageProvider, useT } from "./i18n";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Campaigns from "./components/Campaigns";
import AdGroups from "./components/AdGroups";
import Reports from "./components/Reports";
import BusinessCenters from "./components/BusinessCenters";
import Settings from "./components/Settings";
import WelcomeScreen from "./components/WelcomeScreen";
import AuthScreen from "./components/AuthScreen";

const ToastBar = ({ toast }) => toast ? (
  <div style={{
    position: "fixed", bottom: 24, right: 24,
    background: toast.type === "error" ? "#dc2626" : "#16a34a",
    color: "#fff", padding: "12px 20px", borderRadius: 10,
    fontSize: 13, fontWeight: 500, zIndex: 9999,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  }}>
    {toast.msg}
  </div>
) : null;

function AppContent() {
  const { t } = useT();

  // Auth state
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // App state
  const [page, setPage] = useState("dashboard");
  const [campaigns, setCampaigns] = useState([]);
  const [adGroups, setAdGroups] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [config, setConfig] = useState({ appId: "", secret: "", accessToken: "", advertiserId: "" });
  const [connected, setConnected] = useState(false);
  const [bcs, setBcs] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const d = new Date(today); d.setDate(d.getDate() - 29);
    return { preset: "last30days", startDate: d.toISOString().split("T")[0], endDate: today.toISOString().split("T")[0] };
  });

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Check existing session on mount
  useEffect(() => {
    api.getMe().then(u => {
      if (u) setUser(u);
      setAuthChecked(true);
    }).catch(() => setAuthChecked(true));
  }, []);

  // Handle login/register
  const handleAuth = async (mode, form) => {
    let result;
    if (mode === "login") {
      result = await api.login(form.email, form.password);
    } else {
      result = await api.register(form.name, form.email, form.password);
    }
    localStorage.setItem("session_token", result.token);
    setUser(result.user);
  };

  // Demo mode
  const handleDemoMode = () => {
    setCampaigns(mockCampaigns);
    setAdGroups(mockAdGroups);
    setMetrics(mockMetrics);
    setConnected(true);
    showToast("Modo demo ativado — dados simulados");
  };

  // Handle logout
  const handleLogout = async () => {
    await api.logout();
    localStorage.removeItem("session_token");
    setUser(null);
    setConnected(false);
    setCampaigns([]);
    setAdGroups([]);
    setMetrics(null);
    setBcs([]);
    setPage("dashboard");
  };

  // Fetch data when connected to TikTok
  const fetchData = useCallback(async () => {
    if (!connected || !config.accessToken || !config.advertiserId) return;

    setLoading(true);
    try {
      const [campaignsData, adGroupsData] = await Promise.all([
        api.getCampaigns(config.accessToken, config.advertiserId),
        api.getAdGroups(config.accessToken, config.advertiserId),
      ]);

      if (campaignsData.length > 0) setCampaigns(campaignsData);
      if (adGroupsData.length > 0) setAdGroups(adGroupsData);

      const startDate = dateRange.startDate;
      const endDate = dateRange.endDate;

      const reportData = await api.getReport(config.accessToken, config.advertiserId, startDate, endDate);
      if (reportData.length > 0) {
        const totals = reportData.reduce((acc, row) => {
          const m = row.metrics || {};
          return {
            impressions: acc.impressions + (Number(m.impressions) || 0),
            clicks: acc.clicks + (Number(m.clicks) || 0),
            spend: acc.spend + (Number(m.spend) || 0),
            conversions: acc.conversions + (Number(m.conversions) || 0),
            ctr: Number(m.ctr) || acc.ctr,
            cpc: Number(m.cpc) || acc.cpc,
            cpm: Number(m.cpm) || acc.cpm,
          };
        }, { impressions: 0, clicks: 0, spend: 0, conversions: 0, ctr: 0, cpc: 0, cpm: 0 });

        totals.roas = totals.spend > 0 ? Number((totals.conversions * 10 / totals.spend).toFixed(2)) : 0;
        setMetrics(totals);
      }

      showToast(t("app.dataLoaded"));
    } catch (err) {
      showToast(t("app.loadError")(err.message), "error");
    } finally {
      setLoading(false);
    }
  }, [connected, config.accessToken, config.advertiserId, dateRange, showToast, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("auth_code");
    if (authCode) {
      window.history.replaceState({}, "", window.location.pathname);
      api.exchangeToken(authCode)
        .then(data => {
          setConfig(prev => ({ ...prev, accessToken: data.access_token }));
          if (data.advertiser_ids?.length > 0) {
            setConfig(prev => ({ ...prev, advertiserId: data.advertiser_ids[0] }));
          }
          setConnected(true);
          showToast(t("app.oauthSuccess"));
          setPage("dashboard");
        })
        .catch(err => showToast(t("app.oauthError")(err.message), "error"));
    }
  }, [showToast, t]);

  const handleOAuthConnect = async () => {
    try {
      const url = await api.getAuthUrl();
      window.location.href = url;
    } catch (err) {
      showToast(t("app.oauthUrlError")(err.message), "error");
    }
  };

  // Loading session check
  if (!authChecked) return null;

  // Step 1: Not logged in → Auth screen
  if (!user) {
    return (
      <>
        <AuthScreen onAuth={handleAuth} showToast={showToast} />
        <ToastBar toast={toast} />
      </>
    );
  }

  // Step 2: Logged in but not connected to TikTok → Welcome screen
  if (!connected) {
    return (
      <>
        <WelcomeScreen onOAuthConnect={handleOAuthConnect} onDemoMode={handleDemoMode} />
        <ToastBar toast={toast} />
      </>
    );
  }

  // Step 3: Connected → Main app
  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard campaigns={campaigns} metrics={metrics} connected={connected} onGoToSettings={() => setPage("settings")} dateRange={dateRange} onDateChange={setDateRange} />;
      case "campaigns": return <Campaigns campaigns={campaigns} setCampaigns={setCampaigns} connected={connected} onGoToSettings={() => setPage("settings")} dateRange={dateRange} onDateChange={setDateRange} />;
      case "adgroups": return <AdGroups adGroups={adGroups} setAdGroups={setAdGroups} campaigns={campaigns} connected={connected} onGoToSettings={() => setPage("settings")} />;
      case "reports": return <Reports metrics={metrics} connected={connected} onGoToSettings={() => setPage("settings")} />;
      case "business-centers": return <BusinessCenters bcs={bcs} setBcs={setBcs} showToast={showToast} />;
      case "settings": return <Settings config={config} setConfig={setConfig} onConnect={handleOAuthConnect} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui, sans-serif", background: "#f9fafb" }}>
      <Sidebar active={page} onNav={setPage} bcs={bcs} user={user} onLogout={handleLogout} />
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        {loading && (
          <div style={{
            background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8,
            padding: "10px 16px", marginBottom: 20, fontSize: 13, color: "#1e40af"
          }}>
            {t("app.loadingApi")}
          </div>
        )}
        {renderPage()}
      </main>
      <ToastBar toast={toast} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
