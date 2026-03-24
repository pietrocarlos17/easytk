export const mockCampaigns = [
  { campaign_id: "1", campaign_name: "Campanha Black Friday", status: "ENABLE", budget: 1500, objective_type: "CONVERSIONS", create_time: "2024-11-01" },
  { campaign_id: "2", campaign_name: "Branding Verão 2025", status: "DISABLE", budget: 800, objective_type: "REACH", create_time: "2024-10-15" },
  { campaign_id: "3", campaign_name: "App Install - Promoção", status: "ENABLE", budget: 3000, objective_type: "APP_INSTALL", create_time: "2024-11-10" },
];

export const mockMetrics = {
  impressions: 482300,
  clicks: 12840,
  spend: 2341.75,
  conversions: 348,
  ctr: 2.66,
  cpc: 0.18,
  cpm: 4.85,
  roas: 4.2,
};

export const mockAdGroups = [
  { adgroup_id: "ag1", campaign_id: "1", adgroup_name: "Grupo 18-34 BR", status: "ENABLE", budget: 500, bid: 0.15 },
  { adgroup_id: "ag2", campaign_id: "1", adgroup_name: "Grupo Retargeting", status: "ENABLE", budget: 300, bid: 0.20 },
  { adgroup_id: "ag3", campaign_id: "3", adgroup_name: "Lookalike Clientes", status: "DISABLE", budget: 1000, bid: 0.12 },
];

export const mockBCTree = [
  {
    bc_id: "BC001", bc_name: "Business Center Principal",
    balance: 8420.50, credit_line: 15000, available_credit: 6579.50,
    invoices_unpaid: 0, avg_daily_spend: 312.40,
    accounts: [
      {
        advertiser_id: "ADV001", name: "Conta E-commerce BR",
        balance: 1200.00, status: "ENABLE", daily_spend: 145.20,
        campaigns: [
          {
            campaign_id: "C001", campaign_name: "Black Friday 2025",
            status: "ENABLE", budget: 3000, objective_type: "CONVERSIONS", spend: 1240.50,
            adgroups: [
              {
                adgroup_id: "AG001", adgroup_name: "18-34 SP/RJ", status: "ENABLE", budget: 1000, bid: 0.18, spend: 620.10,
                ads: [
                  { ad_id: "AD001", ad_name: "Vídeo Produto A", status: "ENABLE", spend: 320.00, impressions: 48200, clicks: 1240 },
                  { ad_id: "AD002", ad_name: "Vídeo Produto B", status: "ENABLE", spend: 300.10, impressions: 39800, clicks: 980 },
                ],
              },
              {
                adgroup_id: "AG002", adgroup_name: "Retargeting Visitantes", status: "ENABLE", budget: 500, bid: 0.25, spend: 620.40,
                ads: [
                  { ad_id: "AD003", ad_name: "Remarketing Carrinho", status: "ENABLE", spend: 620.40, impressions: 22100, clicks: 1850 },
                ],
              },
            ],
          },
          {
            campaign_id: "C002", campaign_name: "Branding Q1",
            status: "DISABLE", budget: 800, objective_type: "REACH", spend: 412.30,
            adgroups: [
              {
                adgroup_id: "AG003", adgroup_name: "Broad Audience BR", status: "DISABLE", budget: 800, bid: 0.10, spend: 412.30,
                ads: [
                  { ad_id: "AD004", ad_name: "Institucional 15s", status: "DISABLE", spend: 412.30, impressions: 180000, clicks: 920 },
                ],
              },
            ],
          },
        ],
      },
      {
        advertiser_id: "ADV002", name: "Conta App Install",
        balance: 340.75, status: "ENABLE", daily_spend: 89.60,
        campaigns: [
          {
            campaign_id: "C003", campaign_name: "App Install - Android",
            status: "ENABLE", budget: 2000, objective_type: "APP_INSTALL", spend: 880.20,
            adgroups: [
              {
                adgroup_id: "AG004", adgroup_name: "Lookalike Instaladores", status: "ENABLE", budget: 1000, bid: 0.12, spend: 540.00,
                ads: [
                  { ad_id: "AD005", ad_name: "Demo App v1", status: "ENABLE", spend: 280.00, impressions: 62000, clicks: 3100 },
                  { ad_id: "AD006", ad_name: "Demo App v2", status: "ENABLE", spend: 260.00, impressions: 58000, clicks: 2900 },
                ],
              },
              {
                adgroup_id: "AG005", adgroup_name: "Interesse Tecnologia", status: "ENABLE", budget: 1000, bid: 0.11, spend: 340.20,
                ads: [
                  { ad_id: "AD007", ad_name: "Review UGC", status: "ENABLE", spend: 340.20, impressions: 71000, clicks: 2800 },
                ],
              },
            ],
          },
        ],
      },
      {
        advertiser_id: "ADV003", name: "Conta Branding",
        balance: 80.00, status: "ENABLE", daily_spend: 77.60,
        campaigns: [
          {
            campaign_id: "C004", campaign_name: "Awareness Verão",
            status: "ENABLE", budget: 500, objective_type: "VIDEO_VIEWS", spend: 310.80,
            adgroups: [
              {
                adgroup_id: "AG006", adgroup_name: "Jovens 18-24", status: "ENABLE", budget: 500, bid: 0.08, spend: 310.80,
                ads: [
                  { ad_id: "AD008", ad_name: "Clip Verão 30s", status: "ENABLE", spend: 310.80, impressions: 290000, clicks: 4100 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    bc_id: "BC002", bc_name: "BC Agência Cliente XYZ",
    balance: 1150.00, credit_line: 5000, available_credit: 3850.00,
    invoices_unpaid: 980.00, avg_daily_spend: 95.30,
    accounts: [
      {
        advertiser_id: "ADV004", name: "XYZ - Campanha Verão",
        balance: 650.00, status: "ENABLE", daily_spend: 55.30,
        campaigns: [
          {
            campaign_id: "C005", campaign_name: "Verão XYZ - Conversões",
            status: "ENABLE", budget: 1200, objective_type: "CONVERSIONS", spend: 540.00,
            adgroups: [
              {
                adgroup_id: "AG007", adgroup_name: "Mulheres 25-44", status: "ENABLE", budget: 600, bid: 0.20, spend: 540.00,
                ads: [
                  { ad_id: "AD009", ad_name: "Coleção Verão A", status: "ENABLE", spend: 310.00, impressions: 41000, clicks: 1600 },
                  { ad_id: "AD010", ad_name: "Coleção Verão B", status: "ENABLE", spend: 230.00, impressions: 34000, clicks: 1200 },
                ],
              },
            ],
          },
        ],
      },
      {
        advertiser_id: "ADV005", name: "XYZ - Retargeting",
        balance: 500.00, status: "DISABLE", daily_spend: 0,
        campaigns: [
          {
            campaign_id: "C006", campaign_name: "Retargeting XYZ",
            status: "DISABLE", budget: 500, objective_type: "CONVERSIONS", spend: 198.40,
            adgroups: [
              {
                adgroup_id: "AG008", adgroup_name: "Visitantes 7d", status: "DISABLE", budget: 500, bid: 0.30, spend: 198.40,
                ads: [
                  { ad_id: "AD011", ad_name: "Oferta Especial", status: "DISABLE", spend: 198.40, impressions: 18500, clicks: 920 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    bc_id: "BC003", bc_name: "BC Loja Direta",
    balance: 320.00, credit_line: 2000, available_credit: 1680.00,
    invoices_unpaid: 0, avg_daily_spend: 48.20,
    accounts: [
      {
        advertiser_id: "ADV006", name: "Loja Direta - Principal",
        balance: 320.00, status: "ENABLE", daily_spend: 48.20,
        campaigns: [
          {
            campaign_id: "C007", campaign_name: "Catálogo Produtos",
            status: "ENABLE", budget: 900, objective_type: "CONVERSIONS", spend: 390.10,
            adgroups: [
              {
                adgroup_id: "AG009", adgroup_name: "Broad Nacional", status: "ENABLE", budget: 900, bid: 0.14, spend: 390.10,
                ads: [
                  { ad_id: "AD012", ad_name: "Carrossel Produtos", status: "ENABLE", spend: 390.10, impressions: 95000, clicks: 3800 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const APPEAL_REASONS = [
  { value: "false_positive", label: "Suspensão incorreta / falso positivo" },
  { value: "policy_misunderstanding", label: "Anúncio não viola nenhuma política" },
  { value: "already_fixed", label: "Problema já foi corrigido" },
  { value: "identity_verified", label: "Identidade / empresa verificada" },
  { value: "payment_issue", label: "Problema de pagamento já resolvido" },
  { value: "other", label: "Outro motivo" },
];
