/**
 * TikTok Ads Manager — Backend local
 * Roda em http://localhost:4000
 *
 * Responsabilidades:
 *  - Fluxo OAuth: gerar URL de auth e trocar auth_code por access_token
 *  - Proxy para a TikTok Ads API (mantém App Secret seguro no backend)
 *
 * Instalar dependências:
 *   cd server && npm install
 *
 * Rodar:
 *   node server.js
 */

require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const http = require("http");
const https = require("https");
const db = require("./db");

const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000";

const APP_ID = process.env.TIKTOK_APP_ID;
const APP_SECRET = process.env.TIKTOK_APP_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3000/callback";

// ─── Helpers ────────────────────────────────────────────────────────────────

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Session-Token");
}

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error("JSON inválido")); }
    });
  });
}

function getAccessToken(req) {
  const auth = req.headers["authorization"];
  if (auth && auth.startsWith("Bearer ")) {
    return auth.slice(7).trim();
  }
  // Fallback: query string (retrocompatibilidade)
  const url = new URL(req.url, `http://${req.headers.host}`);
  return url.searchParams.get("access_token") || null;
}

function parseRequest(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  return { url, pathname: url.pathname, params: url.searchParams };
}

function sanitizeId(value) {
  if (!value) return null;
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "");
}

// ─── Proxy para TikTok API ────────────────────────────────────────────────────

function proxyToTikTok(method, path, accessToken, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "business-api.tiktok.com",
      path: `/open_api/v1.3${path}`,
      method,
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
    };

    const req = https.request(options, res => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error("Resposta inválida da API TikTok")); }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ─── Middleware: require access token ─────────────────────────────────────────

function requireToken(req, res) {
  const token = getAccessToken(req);
  if (!token) {
    json(res, 401, { error: "access_token obrigatório. Envie via header Authorization: Bearer <token>" });
    return null;
  }
  return token;
}

// ─── Middleware: require user session ─────────────────────────────────────────

function getSessionToken(req) {
  const auth = req.headers["x-session-token"];
  return auth || null;
}

function requireSession(req, res) {
  const token = getSessionToken(req);
  const user = db.validateSession(token);
  if (!user) {
    json(res, 401, { error: "Sessão inválida. Faça login novamente." });
    return null;
  }
  return user;
}

// ─── Rotas ───────────────────────────────────────────────────────────────────

async function handleRequest(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const { pathname, params } = parseRequest(req);

  // ── POST /auth/register ─────────────────────────────────────────────────
  if (req.method === "POST" && pathname === "/auth/register") {
    const body = await readBody(req);
    if (!body.name || !body.email || !body.password) {
      return json(res, 400, { error: "name, email e password obrigatórios" });
    }
    if (body.password.length < 6) {
      return json(res, 400, { error: "Senha deve ter no mínimo 6 caracteres" });
    }
    const user = db.createUser(body.name, body.email, body.password);
    if (!user) {
      return json(res, 409, { error: "Este email já está cadastrado" });
    }
    const token = db.createSession(user.id);
    return json(res, 201, { token, user: { id: user.id, name: user.name, email: user.email } });
  }

  // ── POST /auth/login ───────────────────────────────────────────────────
  if (req.method === "POST" && pathname === "/auth/login") {
    const body = await readBody(req);
    if (!body.email || !body.password) {
      return json(res, 400, { error: "email e password obrigatórios" });
    }
    const user = db.findUserByEmail(body.email);
    if (!user || !db.verifyPassword(body.password, user.password_hash)) {
      return json(res, 401, { error: "Email ou senha incorretos" });
    }
    const token = db.createSession(user.id);
    return json(res, 200, { token, user: { id: user.id, name: user.name, email: user.email } });
  }

  // ── POST /auth/logout ──────────────────────────────────────────────────
  if (req.method === "POST" && pathname === "/auth/logout") {
    const token = getSessionToken(req);
    if (token) db.deleteSession(token);
    return json(res, 200, { ok: true });
  }

  // ── GET /auth/me ───────────────────────────────────────────────────────
  if (req.method === "GET" && pathname === "/auth/me") {
    const user = requireSession(req, res);
    if (!user) return;
    return json(res, 200, { user });
  }

  // ── All /api/* routes require session ──────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const user = requireSession(req, res);
    if (!user) return;
  }

  // ── GET /health ───────────────────────────────────────────────────────────
  if (req.method === "GET" && pathname === "/health") {
    return json(res, 200, { status: "ok" });
  }

  // ── GET /auth/url ─────────────────────────────────────────────────────────
  if (req.method === "GET" && pathname === "/auth/url") {
    if (!APP_ID) return json(res, 500, { error: "TIKTOK_APP_ID não configurado no .env" });
    const authUrl =
      `https://business-api.tiktok.com/portal/auth` +
      `?app_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=tiktok_ads_manager`;
    return json(res, 200, { url: authUrl });
  }

  // ── POST /auth/token ───────────────────────────────────────────────────────
  if (req.method === "POST" && pathname === "/auth/token") {
    const body = await readBody(req);
    if (!body.auth_code) return json(res, 400, { error: "auth_code obrigatório" });

    const tikRes = await proxyToTikTok("POST", "/oauth2/access_token/", "", {
      app_id: APP_ID,
      secret: APP_SECRET,
      auth_code: body.auth_code,
    });

    if (tikRes.code !== 0) return json(res, 400, { error: tikRes.message });

    return json(res, 200, {
      access_token: tikRes.data.access_token,
      advertiser_ids: tikRes.data.advertiser_ids,
    });
  }

  // ── GET /api/bc ────────────────────────────────────────────────────────────
  if (req.method === "GET" && pathname === "/api/bc") {
    const token = requireToken(req, res);
    if (!token) return;
    const tikRes = await proxyToTikTok("GET", `/bc/get/?page_size=50`, token);
    return json(res, 200, tikRes);
  }

  // ── GET /api/bc/accounts ──────────────────────────────────────────────────
  if (req.method === "GET" && pathname === "/api/bc/accounts") {
    const token = requireToken(req, res);
    if (!token) return;
    const bcId = sanitizeId(params.get("bc_id"));
    if (!bcId) return json(res, 400, { error: "bc_id obrigatório" });
    const tikRes = await proxyToTikTok("GET", `/bc/advertiser/get/?bc_id=${bcId}&page_size=50`, token);
    return json(res, 200, tikRes);
  }

  // ── GET /api/campaigns ────────────────────────────────────────────────────
  if (req.method === "GET" && pathname === "/api/campaigns") {
    const token = requireToken(req, res);
    if (!token) return;
    const advertiserId = sanitizeId(params.get("advertiser_id"));
    if (!advertiserId) return json(res, 400, { error: "advertiser_id obrigatório" });
    const tikRes = await proxyToTikTok("GET", `/campaign/get/?advertiser_id=${advertiserId}&page_size=100`, token);
    return json(res, 200, tikRes);
  }

  // ── POST /api/campaigns/create ────────────────────────────────────────────
  if (req.method === "POST" && pathname === "/api/campaigns/create") {
    const token = requireToken(req, res);
    if (!token) return;
    const body = await readBody(req);
    if (!body.advertiser_id) return json(res, 400, { error: "advertiser_id obrigatório no body" });
    const tikRes = await proxyToTikTok("POST", `/campaign/create/`, token, body);
    return json(res, 200, tikRes);
  }

  // ── POST /api/campaigns/status ────────────────────────────────────────────
  if (req.method === "POST" && pathname === "/api/campaigns/status") {
    const token = requireToken(req, res);
    if (!token) return;
    const body = await readBody(req);
    if (!body.advertiser_id || !body.campaign_ids) {
      return json(res, 400, { error: "advertiser_id e campaign_ids obrigatórios no body" });
    }
    const tikRes = await proxyToTikTok("POST", `/campaign/status/update/`, token, body);
    return json(res, 200, tikRes);
  }

  // ── GET /api/adgroups ─────────────────────────────────────────────────────
  if (req.method === "GET" && pathname === "/api/adgroups") {
    const token = requireToken(req, res);
    if (!token) return;
    const advertiserId = sanitizeId(params.get("advertiser_id"));
    if (!advertiserId) return json(res, 400, { error: "advertiser_id obrigatório" });
    let path = `/adgroup/get/?advertiser_id=${advertiserId}&page_size=100`;
    const campaignId = sanitizeId(params.get("campaign_id"));
    if (campaignId) path += `&filtering=${encodeURIComponent(JSON.stringify({ campaign_ids: [campaignId] }))}`;
    const tikRes = await proxyToTikTok("GET", path, token);
    return json(res, 200, tikRes);
  }

  // ── POST /api/adgroups/update ─────────────────────────────────────────────
  if (req.method === "POST" && pathname === "/api/adgroups/update") {
    const token = requireToken(req, res);
    if (!token) return;
    const body = await readBody(req);
    if (!body.advertiser_id || !body.adgroup_id) {
      return json(res, 400, { error: "advertiser_id e adgroup_id obrigatórios no body" });
    }
    const tikRes = await proxyToTikTok("POST", `/adgroup/update/`, token, body);
    return json(res, 200, tikRes);
  }

  // ── GET /api/ads ──────────────────────────────────────────────────────────
  if (req.method === "GET" && pathname === "/api/ads") {
    const token = requireToken(req, res);
    if (!token) return;
    const advertiserId = sanitizeId(params.get("advertiser_id"));
    if (!advertiserId) return json(res, 400, { error: "advertiser_id obrigatório" });
    let path = `/ad/get/?advertiser_id=${advertiserId}&page_size=100`;
    const adgroupId = sanitizeId(params.get("adgroup_id"));
    if (adgroupId) path += `&filtering=${encodeURIComponent(JSON.stringify({ adgroup_ids: [adgroupId] }))}`;
    const tikRes = await proxyToTikTok("GET", path, token);
    return json(res, 200, tikRes);
  }

  // ── GET /api/report ───────────────────────────────────────────────────────
  if (req.method === "GET" && pathname === "/api/report") {
    const token = requireToken(req, res);
    if (!token) return;
    const advertiserId = sanitizeId(params.get("advertiser_id"));
    const startDate = params.get("start_date");
    const endDate = params.get("end_date");
    if (!advertiserId || !startDate || !endDate) {
      return json(res, 400, { error: "advertiser_id, start_date e end_date obrigatórios" });
    }
    // Validar formato de data YYYY-MM-DD
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRe.test(startDate) || !dateRe.test(endDate)) {
      return json(res, 400, { error: "Datas devem estar no formato YYYY-MM-DD" });
    }
    const tikRes = await proxyToTikTok("GET",
      `/report/integrated/get/?advertiser_id=${advertiserId}` +
      `&report_type=BASIC&data_level=AUCTION_ADVERTISER` +
      `&dimensions=${encodeURIComponent(JSON.stringify(["stat_time_day"]))}` +
      `&metrics=${encodeURIComponent(JSON.stringify(["spend", "impressions", "clicks", "ctr", "cpc", "cpm", "conversions"]))}` +
      `&start_date=${startDate}&end_date=${endDate}&page_size=100`,
      token
    );
    return json(res, 200, tikRes);
  }

  // ── GET /api/balance ──────────────────────────────────────────────────────
  if (req.method === "GET" && pathname === "/api/balance") {
    const token = requireToken(req, res);
    if (!token) return;
    const advertiserId = sanitizeId(params.get("advertiser_id"));
    if (!advertiserId) return json(res, 400, { error: "advertiser_id obrigatório" });
    const tikRes = await proxyToTikTok("GET", `/advertiser/balance/get/?advertiser_id=${advertiserId}`, token);
    return json(res, 200, tikRes);
  }

  // 404
  return json(res, 404, { error: "Rota não encontrada" });
}

// ─── Start ────────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (err) {
    console.error("Erro:", err.message);
    json(res, 500, { error: "Erro interno do servidor" });
  }
});

server.listen(PORT, () => {
  console.log(`\n✅ Backend rodando em http://localhost:${PORT}`);
  console.log(`   App ID:   ${APP_ID || "⚠ não configurado"}`);
  console.log(`   Secret:   ${APP_SECRET ? "***configurado***" : "⚠ não configurado"}`);
  console.log(`   Redirect: ${REDIRECT_URI}\n`);
});
