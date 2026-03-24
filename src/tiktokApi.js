/**
 * TikTok Ads API — Client
 *
 * Todas as chamadas passam pelo backend local (http://localhost:4000)
 * para manter o App Secret seguro fora do frontend.
 *
 * O access_token é enviado via header Authorization: Bearer <token>
 * em vez de query string, por segurança.
 *
 * Antes de usar:
 *   1. cd server && npm install && node server.js
 *   2. Preencha server/.env com suas credenciais
 */

const BACKEND = process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:4000" : "https://easytk-production.up.railway.app");

function getSessionToken() {
  return localStorage.getItem("session_token") || "";
}

function authHeaders(accessToken) {
  const headers = { "Content-Type": "application/json" };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  const session = getSessionToken();
  if (session) {
    headers["X-Session-Token"] = session;
  }
  return headers;
}

async function call(path, accessToken) {
  const res = await fetch(`${BACKEND}${path}`, {
    headers: authHeaders(accessToken),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro desconhecido");
  return data;
}

async function post(path, accessToken, body) {
  const res = await fetch(`${BACKEND}${path}`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro desconhecido");
  return data;
}

// ─── AUTH ──────────────────────────────────────────────────────────────────────

export async function register(name, email, password) {
  return post("/auth/register", null, { name, email, password });
}

export async function login(email, password) {
  return post("/auth/login", null, { email, password });
}

export async function logout() {
  const session = getSessionToken();
  const res = await fetch(`${BACKEND}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Session-Token": session },
  });
  return res.json();
}

export async function getMe() {
  const session = getSessionToken();
  if (!session) return null;
  const res = await fetch(`${BACKEND}/auth/me`, {
    headers: { "X-Session-Token": session },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user || null;
}

// ─── OAUTH ────────────────────────────────────────────────────────────────────

export async function getAuthUrl() {
  const data = await call("/auth/url");
  return data.url;
}

export async function exchangeToken(authCode) {
  return post("/auth/token", null, { auth_code: authCode });
}

// ─── BUSINESS CENTERS ─────────────────────────────────────────────────────────

export async function getBCs(accessToken) {
  const data = await call("/api/bc", accessToken);
  if (data.code !== 0) throw new Error(data.message);
  return data.data?.list || [];
}

export async function getBCAccounts(accessToken, bcId) {
  const data = await call(`/api/bc/accounts?bc_id=${encodeURIComponent(bcId)}`, accessToken);
  if (data.code !== 0) throw new Error(data.message);
  return data.data?.list || [];
}

// ─── CAMPANHAS ────────────────────────────────────────────────────────────────

export async function getCampaigns(accessToken, advertiserId) {
  const data = await call(`/api/campaigns?advertiser_id=${encodeURIComponent(advertiserId)}`, accessToken);
  if (data.code !== 0) throw new Error(data.message);
  return data.data?.list || [];
}

export async function createCampaign(accessToken, advertiserId, payload) {
  const data = await post("/api/campaigns/create", accessToken, {
    advertiser_id: advertiserId,
    ...payload,
  });
  if (data.code !== 0) throw new Error(data.message);
  return data.data;
}

export async function updateCampaignStatus(accessToken, advertiserId, campaignIds, status) {
  const data = await post("/api/campaigns/status", accessToken, {
    advertiser_id: advertiserId,
    campaign_ids: campaignIds,
    operation_status: status,
  });
  if (data.code !== 0) throw new Error(data.message);
  return data.data;
}

// ─── GRUPOS DE ANÚNCIOS ───────────────────────────────────────────────────────

export async function getAdGroups(accessToken, advertiserId, campaignId = "") {
  let path = `/api/adgroups?advertiser_id=${encodeURIComponent(advertiserId)}`;
  if (campaignId) path += `&campaign_id=${encodeURIComponent(campaignId)}`;
  const data = await call(path, accessToken);
  if (data.code !== 0) throw new Error(data.message);
  return data.data?.list || [];
}

export async function updateAdGroup(accessToken, advertiserId, adgroupId, updates) {
  const data = await post("/api/adgroups/update", accessToken, {
    advertiser_id: advertiserId,
    adgroup_id: adgroupId,
    ...updates,
  });
  if (data.code !== 0) throw new Error(data.message);
  return data.data;
}

// ─── ANÚNCIOS ─────────────────────────────────────────────────────────────────

export async function getAds(accessToken, advertiserId, adgroupId = "") {
  let path = `/api/ads?advertiser_id=${encodeURIComponent(advertiserId)}`;
  if (adgroupId) path += `&adgroup_id=${encodeURIComponent(adgroupId)}`;
  const data = await call(path, accessToken);
  if (data.code !== 0) throw new Error(data.message);
  return data.data?.list || [];
}

// ─── RELATÓRIOS ───────────────────────────────────────────────────────────────

export async function getReport(accessToken, advertiserId, startDate, endDate) {
  const data = await call(
    `/api/report?advertiser_id=${encodeURIComponent(advertiserId)}` +
    `&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`,
    accessToken
  );
  if (data.code !== 0) throw new Error(data.message);
  return data.data?.list || [];
}

// ─── SALDO ────────────────────────────────────────────────────────────────────

export async function getBalance(accessToken, advertiserId) {
  const data = await call(`/api/balance?advertiser_id=${encodeURIComponent(advertiserId)}`, accessToken);
  if (data.code !== 0) throw new Error(data.message);
  return data.data;
}
