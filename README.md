# TikTok Ads Manager — Setup Completo

## Estrutura do projeto

```
tiktok-ads-manager/
├── src/App.jsx          ← Frontend React
├── tiktokApi.js         ← Funções de API (aponta para backend local)
├── server/
│   ├── server.js        ← Backend Node.js (proxy + OAuth)
│   ├── .env             ← Suas credenciais (NUNCA commitar!)
│   └── package.json
└── README.md
```

---

## Passo 1 — Configurar credenciais

Abra `server/.env` e preencha:

```env
TIKTOK_APP_ID=seu_app_id_aqui
TIKTOK_APP_SECRET=seu_app_secret_aqui
REDIRECT_URI=http://localhost:3000/callback
```

Encontre o App ID e Secret em: developers.tiktok.com → My Apps → seu app

---

## Passo 2 — Rodar o backend

```bash
cd server
npm install
node server.js
# ✅ Backend rodando em http://localhost:4000
```

---

## Passo 3 — Rodar o frontend

```bash
# Na raiz do projeto
npm install
npm start
# App em http://localhost:3000
```

---

## Passo 4 — Gerar o Access Token (OAuth)

1. No app, vá em Configurações → clique "Conectar via OAuth"
2. Autorize o acesso no TikTok
3. O app captura o auth_code automaticamente e troca pelo token via backend
4. Todas as chamadas passam a usar dados reais

---

## Testar diretamente no terminal

```bash
# Listar campanhas
curl "http://localhost:4000/api/campaigns?access_token=TOKEN&advertiser_id=ADV_ID"

# Business Centers
curl "http://localhost:4000/api/bc?access_token=TOKEN"

# Contas de uma BC
curl "http://localhost:4000/api/bc/accounts?access_token=TOKEN&bc_id=BC_ID"
```

---

## Rotas do backend

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /auth/url | URL de autorização OAuth |
| POST | /auth/token | Troca auth_code por access_token |
| GET | /api/bc | Lista Business Centers |
| GET | /api/bc/accounts | Contas de anúncio de uma BC |
| GET | /api/campaigns | Lista campanhas |
| POST | /api/campaigns/create | Cria campanha |
| POST | /api/campaigns/status | Atualiza status |
| GET | /api/adgroups | Lista grupos de anúncios |
| POST | /api/adgroups/update | Atualiza grupo |
| GET | /api/ads | Lista anúncios |
| GET | /api/report | Relatório de métricas |
| GET | /api/balance | Saldo de conta |

---

## Segurança

- O App Secret fica APENAS em server/.env — nunca vai ao frontend
- Adicione server/.env ao .gitignore
- Em produção, hospede o backend em um servidor real (Railway, Render, etc.)
