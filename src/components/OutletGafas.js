import { useState, useMemo, useEffect, useRef } from "react";

const PRODUCTS = [
  { id: 1,  name: "Deportivo Performance Wrap",   category: "deportivo", shape: "wrap",
    colors: [
      "#0a0a0a",
      { hex: "#ffffff", hex2: "#dc2626", label: "Blanco / Rojo",
        images: ["/products/1-white-red/01.jpg","/products/1-white-red/02.jpg","/products/1-white-red/03.jpg","/products/1-white-red/04.jpg","/products/1-white-red/05.jpg"] },
      { hex: "#0a0a0a", label: "Negro / Multicolor",
        swatch: "linear-gradient(90deg, #0a0a0a 0%, #0a0a0a 50%, #ff4d6d 50%, #ffba08 62%, #06ffa5 75%, #00bbf9 87%, #c77dff 100%)",
        images: ["/products/1-black-multicolor/01.jpg","/products/1-black-multicolor/02.jpg","/products/1-black-multicolor/03.jpg","/products/1-black-multicolor/04.jpg","/products/1-black-multicolor/05.jpg"] },
    ],
    price: 129, oldPrice: null,
    images: ["/products/1/01.jpg","/products/1/02.jpg","/products/1/03.jpg","/products/1/04.jpg","/products/1/05.jpg"] },
  { id: 2,  name: "Cuadrado Clásico Mate",        category: "casual",    shape: "square",
    colors: [
      "#0a0a0a",
      { hex: "#0a0a0a", label: "Negro / Azul-Rojo",
        swatch: "linear-gradient(90deg, #0a0a0a 0%, #0a0a0a 50%, #1e3a8a 50%, #7c1d6f 75%, #dc2626 100%)",
        images: ["/products/2-1/01.jpg","/products/2-1/02.jpg","/products/2-1/03.jpg","/products/2-1/04.jpg","/products/2-1/05.jpg"] },
      { hex: "#0a0a0a", hex2: "#ef4444", label: "Negro / Rojo claro",
        images: ["/products/2-2/01.jpg","/products/2-2/02.jpg","/products/2-2/03.jpg","/products/2-2/04.jpg","/products/2-2/05.jpg"] },
    ],
    price: 89,  oldPrice: 119,
    images: ["/products/2/01.jpg","/products/2/02.jpg","/products/2/03.jpg","/products/2/04.jpg","/products/2/05.jpg"] },
  { id: 3,  name: "Aviador Lente Espejada",       category: "casual",    shape: "aviator",
    colors: [
      { hex: "#60a5fa", hex2: "#0a0a0a", label: "Azul claro / Negro",
        images: ["/products/03/01.jpg","/products/03/02.jpg","/products/03/03.jpg","/products/03/04.jpg","/products/03/05.jpg"] },
      { hex: "#0a0a0a", label: "Negro",
        images: ["/products/03-01/01.jpg","/products/03-01/02.jpg","/products/03-01/03.jpg","/products/03-01/04.jpg","/products/03-01/05.jpg"] },
      { hex: "#ffffff", label: "Blanco / Multicolor",
        swatch: "linear-gradient(90deg, #ffffff 0%, #ffffff 50%, #ec4899 55%, #a855f7 66%, #f97316 78%, #ef4444 89%, #fbbf24 100%)",
        images: ["/products/03-2/01.jpg","/products/03-2/02.jpg","/products/03-2/03.jpg","/products/03-2/04.jpg","/products/03-2/05.jpg"] },
    ],
    price: 99,  oldPrice: null },
  { id: 4,  name: "Wraparound Ciclista Pro",      category: "deportivo", shape: "wrap",
    colors: [
      { hex: "#0a0a0a", label: "Negro / Rosa-Amarillo",
        swatch: "linear-gradient(90deg, #0a0a0a 0%, #0a0a0a 50%, #ec4899 55%, #f97316 78%, #fbbf24 100%)",
        images: ["/products/04/01.jpg","/products/04/02.jpg","/products/04/03.jpg","/products/04/04.jpg","/products/04/05.jpg"] },
      { hex: "#ffffff", label: "Blanco / Rosa-Amarillo",
        swatch: "linear-gradient(90deg, #ffffff 0%, #ffffff 50%, #ec4899 55%, #f97316 78%, #fbbf24 100%)",
        images: ["/products/04-01/01.jpg","/products/04-01/02.jpg","/products/04-01/03.jpg","/products/04-01/04.jpg","/products/04-01/05.jpg"] },
      { hex: "#0a0a0a", label: "Negro / Rosas",
        swatch: "linear-gradient(90deg, #0a0a0a 0%, #0a0a0a 50%, #fbcfe8 55%, #f472b6 70%, #ec4899 85%, #be185d 100%)",
        images: ["/products/04-02/01.jpg","/products/04-02/02.jpg","/products/04-02/03.jpg","/products/04-02/04.jpg","/products/04-02/05.jpg"] },
    ],
    price: 145, oldPrice: null },
  { id: 5,  name: "Redondo Casual Carey",         category: "casual",    shape: "round",   colors: ["#78350f","#0a0a0a","#3f3f46","#7c2d12","#451a03"],   price: 85,  oldPrice: null },
  { id: 6,  name: "Mini Cuadrado Translúcido",    category: "casual",    shape: "square",  colors: ["#e5e7eb","#0a0a0a","#dbeafe","#fef3c7","#fecaca","#d1fae5","#f3e8ff"], price: 79, oldPrice: 99 },
  { id: 7,  name: "Performance Lente Polarizada", category: "deportivo", shape: "wrap",    colors: ["#0a0a0a","#1f2937","#7f1d1d","#1e3a8a"],             price: 119, oldPrice: null },
  { id: 8,  name: "Aviador Slim Premium",         category: "casual",    shape: "aviator", colors: ["#0a0a0a","#9ca3af","#fbbf24"],                       price: 109, oldPrice: 129 },
  { id: 9,  name: "Deportivo Running Blanco",     category: "deportivo", shape: "wrap",    colors: ["#ffffff","#0a0a0a","#ef4444"],                       price: 139, oldPrice: null },
  { id: 10, name: "Rectangular Slim Negro",       category: "casual",    shape: "casual",  colors: ["#0a0a0a","#1f2937","#3f3f46","#78350f","#7c2d12","#451a03"], price: 92, oldPrice: null },
  { id: 11, name: "Deportivo Lente Iridium",      category: "deportivo", shape: "wrap",    colors: ["#0a0a0a","#1e3a8a","#7c2d12","#14532d"],             price: 155, oldPrice: null },
  { id: 12, name: "Cuadrado Premium Marrón",      category: "casual",    shape: "square",  colors: ["#78350f","#0a0a0a","#3f3f46","#7c2d12","#451a03"],   price: 135, oldPrice: null },
];

const CATEGORIES = {
  deportivo: { slug: "deportivo", label: "Deportivo", title: "Gafas deportivas",
    subtitle: "Para entrenar, pedalear y rendir bajo cualquier ritmo." },
  casual:    { slug: "casual",    label: "Casual",    title: "Gafas casuales",
    subtitle: "Estilo atemporal para llevar de la mañana al café." },
};

const PROVINCIAS = [
  "Álava","Albacete","Alicante","Almería","Asturias","Ávila","Badajoz","Baleares","Barcelona","Burgos",
  "Cáceres","Cádiz","Cantabria","Castellón","Ceuta","Ciudad Real","Córdoba","A Coruña","Cuenca","Girona",
  "Granada","Guadalajara","Guipúzcoa","Huelva","Huesca","Jaén","León","Lleida","Lugo","Madrid",
  "Málaga","Melilla","Murcia","Navarra","Ourense","Palencia","Las Palmas","Pontevedra","La Rioja",
  "Salamanca","Segovia","Sevilla","Soria","Tarragona","Santa Cruz de Tenerife","Teruel","Toledo",
  "Valencia","Valladolid","Vizcaya","Zamora","Zaragoza",
];

const COLOR_NAMES = {
  "#0a0a0a": "Negro", "#1f2937": "Gris oscuro", "#3f3f46": "Antracita",
  "#dc2626": "Rojo", "#0ea5e9": "Azul cielo", "#16a34a": "Verde",
  "#78350f": "Marrón", "#fbbf24": "Dorado", "#9ca3af": "Plata",
  "#ef4444": "Rojo coral", "#22c55e": "Verde lima", "#3b82f6": "Azul",
  "#ffffff": "Blanco", "#7c2d12": "Marrón oscuro", "#451a03": "Marrón intenso",
  "#e5e7eb": "Gris claro", "#dbeafe": "Azul pastel", "#fef3c7": "Amarillo pastel",
  "#fecaca": "Rosa pastel", "#d1fae5": "Verde pastel", "#f3e8ff": "Lila pastel",
  "#1e3a8a": "Azul marino", "#7f1d1d": "Burdeos", "#14532d": "Verde bosque",
};
// Color helpers — colors can be a simple hex string or an object { hex, hex2?, label?, images? }
const colorHex = (c) => (typeof c === "string" ? c : c?.hex);
const colorHex2 = (c) => (typeof c === "object" && c?.hex2) ? c.hex2 : null;
const colorVariantImages = (c) => (typeof c === "object" && c?.images?.length) ? c.images : null;
const currentImages = (product, c) => colorVariantImages(c) || product.images || [];

const colorName = (c) => {
  if (typeof c === "string") return COLOR_NAMES[c] || c;
  if (c?.label) return c.label;
  if (c?.hex2) {
    const n1 = COLOR_NAMES[c.hex] || c.hex;
    const n2 = COLOR_NAMES[c.hex2] || c.hex2;
    return `${n1} / ${n2}`;
  }
  return COLOR_NAMES[c?.hex] || c?.hex || "";
};

const fmtEUR = (v) => v.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

function parseRoute(pathname) {
  const m = pathname.match(/^\/outlet-gafas\/producto\/(\d+)/);
  if (m) return { view: "detail", productId: parseInt(m[1], 10), category: null };
  const c = pathname.match(/^\/outlet-gafas\/categoria\/(deportivo|casual)/);
  if (c) return { view: "list", productId: null, category: c[1] };
  if (/^\/outlet-gafas\/mas-vendidas/.test(pathname)) return { view: "list", productId: null, category: null };
  return { view: "home", productId: null, category: null };
}

/* ------------------------------- Shape ----------------------------------- */

function Shape({ kind, color = "#111", scale = 1 }) {
  const common = { viewBox: "0 0 240 100", width: `${70 * scale}%`, style: { maxWidth: 240 * scale, display: "block" } };
  const stroke = "rgba(0,0,0,0.35)";
  const sw = 1.2;
  switch (kind) {
    case "wrap":
      return (
        <svg {...common}>
          <path d="M 12 50 Q 12 22 56 24 L 184 24 Q 228 22 228 50 Q 228 78 184 76 L 56 76 Q 12 78 12 50 Z" fill={color} stroke={stroke} strokeWidth={sw}/>
          <ellipse cx="60" cy="42" rx="18" ry="3" fill="#ffffff" fillOpacity="0.18"/>
          <ellipse cx="170" cy="42" rx="18" ry="3" fill="#ffffff" fillOpacity="0.18"/>
        </svg>
      );
    case "aviator":
      return (
        <svg {...common}>
          <path d="M 22 32 L 108 30 Q 116 32 108 54 L 88 76 Q 66 80 46 70 Q 28 60 22 38 Z" fill={color} stroke={stroke} strokeWidth={sw}/>
          <path d="M 132 30 L 218 32 Q 220 38 192 64 Q 174 78 154 72 Q 134 64 128 50 Q 126 36 132 30 Z" fill={color} stroke={stroke} strokeWidth={sw}/>
          <line x1="108" y1="36" x2="132" y2="36" stroke={color} strokeWidth="3"/>
          <ellipse cx="65" cy="42" rx="20" ry="3" fill="#ffffff" fillOpacity="0.18"/>
          <ellipse cx="175" cy="42" rx="20" ry="3" fill="#ffffff" fillOpacity="0.18"/>
        </svg>
      );
    case "round":
      return (
        <svg {...common}>
          <circle cx="68" cy="50" r="34" fill={color} stroke={stroke} strokeWidth={sw}/>
          <circle cx="172" cy="50" r="34" fill={color} stroke={stroke} strokeWidth={sw}/>
          <line x1="102" y1="50" x2="138" y2="50" stroke={color} strokeWidth="3"/>
          <ellipse cx="60" cy="42" rx="14" ry="3" fill="#ffffff" fillOpacity="0.18"/>
          <ellipse cx="164" cy="42" rx="14" ry="3" fill="#ffffff" fillOpacity="0.18"/>
        </svg>
      );
    case "square":
      return (
        <svg {...common}>
          <rect x="22" y="26" width="92" height="52" rx="10" fill={color} stroke={stroke} strokeWidth={sw}/>
          <rect x="126" y="26" width="92" height="52" rx="10" fill={color} stroke={stroke} strokeWidth={sw}/>
          <line x1="114" y1="38" x2="126" y2="38" stroke={color} strokeWidth="3"/>
          <ellipse cx="60" cy="40" rx="22" ry="3" fill="#ffffff" fillOpacity="0.18"/>
          <ellipse cx="164" cy="40" rx="22" ry="3" fill="#ffffff" fillOpacity="0.18"/>
        </svg>
      );
    case "casual":
    default:
      return (
        <svg {...common}>
          <path d="M 22 28 L 110 26 Q 116 28 110 68 Q 102 76 38 72 Q 22 64 22 28 Z" fill={color} stroke={stroke} strokeWidth={sw}/>
          <path d="M 130 26 L 218 28 Q 218 64 202 72 Q 138 76 130 68 Q 126 28 130 26 Z" fill={color} stroke={stroke} strokeWidth={sw}/>
          <line x1="110" y1="36" x2="130" y2="36" stroke={color} strokeWidth="3"/>
          <ellipse cx="62" cy="40" rx="22" ry="3" fill="#ffffff" fillOpacity="0.18"/>
          <ellipse cx="170" cy="40" rx="22" ry="3" fill="#ffffff" fillOpacity="0.18"/>
        </svg>
      );
  }
}

// Alternate views for the product gallery
function ShapeAlt({ kind, color, view }) {
  if (view === 0) return <Shape kind={kind} color={color} />;
  if (view === 1) {
    // side profile — show one lens larger
    return (
      <svg viewBox="0 0 240 100" width="70%" style={{ maxWidth: 240, display: "block" }}>
        <g transform="translate(40, 0)">
          <rect x="20" y="20" width="100" height="60" rx="14" fill={color} stroke="rgba(0,0,0,0.35)" strokeWidth="1.2"/>
          <rect x="120" y="38" width="80" height="6" rx="3" fill={color} />
          <ellipse cx="60" cy="36" rx="22" ry="4" fill="#ffffff" fillOpacity="0.18"/>
        </g>
      </svg>
    );
  }
  if (view === 2) {
    // folded
    return (
      <svg viewBox="0 0 240 100" width="60%" style={{ maxWidth: 200, display: "block" }}>
        <rect x="50" y="38" width="140" height="22" rx="11" fill={color} stroke="rgba(0,0,0,0.35)" strokeWidth="1.2"/>
        <rect x="50" y="36" width="40" height="4" fill={color} />
        <rect x="150" y="36" width="40" height="4" fill={color} />
      </svg>
    );
  }
  // detail / zoom on lens
  return (
    <svg viewBox="0 0 240 100" width="80%" style={{ maxWidth: 280, display: "block" }}>
      <rect x="40" y="14" width="160" height="72" rx="14" fill={color} stroke="rgba(0,0,0,0.35)" strokeWidth="1.2"/>
      <ellipse cx="100" cy="34" rx="40" ry="6" fill="#ffffff" fillOpacity="0.22"/>
      <ellipse cx="160" cy="60" rx="20" ry="4" fill="#ffffff" fillOpacity="0.12"/>
    </svg>
  );
}

/* ------------------------------- Swatch ---------------------------------- */

function Swatch({ color, active, onHover, size = 18 }) {
  const hex = colorHex(color);
  const hex2 = colorHex2(color);
  const customSwatch = typeof color === "object" && color?.swatch;
  const bg = customSwatch
    ? customSwatch
    : hex2
      ? `linear-gradient(90deg, ${hex} 0%, ${hex} 50%, ${hex2} 50%, ${hex2} 100%)`
      : hex;
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(color)}
      onClick={(e) => { e.stopPropagation(); onHover(color); }}
      onFocus={() => onHover(color)}
      style={{
        width: size, height: size, borderRadius: "50%",
        padding: 0, background: bg,
        border: active ? "1.5px solid #111" : "1px solid rgba(0,0,0,0.18)",
        outline: active ? "2px solid rgba(17,17,17,0.15)" : "none",
        outlineOffset: 1,
        cursor: "pointer",
        transition: "transform 0.15s ease",
        transform: active ? "scale(1.08)" : "scale(1)",
      }}
      aria-label={`Color ${colorName(color)}`}
      title={colorName(color)}
    />
  );
}

/* ----------------------------- ProductCard ------------------------------- */

function ProductCard({ p, onSelect }) {
  const [hover, setHover] = useState(false);
  const [activeColor, setActiveColor] = useState(p.colors[0]);

  const imgs = currentImages(p, activeColor);

  const onLeave = () => {
    setHover(false);
    setActiveColor(p.colors[0]);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      onClick={() => onSelect(p)}
      style={{ cursor: "pointer", background: "#fff" }}
    >
      <div style={{
        position: "relative",
        background: "#f5f5f5",
        aspectRatio: "1 / 1",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: imgs.length ? 16 : 32, overflow: "hidden",
      }}>
        <div style={{
          transform: hover ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.35s ease",
          width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center",
        }}>
          {imgs.length ? (
            <img
              src={hover && imgs[1] ? imgs[1] : imgs[0]}
              alt={p.name}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", mixBlendMode: "multiply" }}
            />
          ) : (
            <Shape kind={p.shape} color={colorHex(activeColor)} />
          )}
        </div>

        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 14,
          display: "flex", justifyContent: "center", gap: 8,
          opacity: hover ? 1 : 0,
          transform: hover ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.22s ease, transform 0.22s ease",
          pointerEvents: hover ? "auto" : "none",
        }}>
          {p.colors.map((c, i) => (
            <Swatch key={i} color={c} active={c === activeColor} onHover={setActiveColor} />
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 0 0" }}>
        <div style={{ fontSize: 13, color: "#111", lineHeight: 1.4 }}>{p.name}</div>
        <div style={{ fontSize: 12, color: "#737373", marginTop: 4 }}>
          {p.colors.length} {p.colors.length === 1 ? "color" : "colores"}
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "baseline" }}>
          {p.oldPrice && (
            <span style={{ fontSize: 12, color: "#a3a3a3", textDecoration: "line-through" }}>{fmtEUR(p.oldPrice)}</span>
          )}
          <span style={{ fontSize: 13, color: "#111" }}>{fmtEUR(p.price)}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- ProductDetail ------------------------------ */

function InfoBlock({ title, children, icon }) {
  return (
    <div style={{ borderTop: "1px solid #ececec", padding: "32px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#fce7f3", color: "#be185d",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700,
        }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111" }}>{title}</h3>
      </div>
      <div style={{ fontSize: 14, color: "#404040", lineHeight: 1.7, paddingLeft: 48 }}>
        {children}
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
      <span style={{ color: "#737373" }}>{label}</span>
      <span style={{ color: "#111", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function ProductDetail({ product, onOrder, onTryOn, navigate }) {
  const [activeColor, setActiveColor] = useState(product.colors[0]);
  const [activeView, setActiveView] = useState(0);
  const [qty, setQty] = useState(1);

  const imgs = currentImages(product, activeColor);

  // Reset gallery view when switching color variant (different image count)
  useEffect(() => { setActiveView(0); }, [activeColor]);

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ padding: "24px 48px 0", fontSize: 12, color: "#737373" }}>
        <span onClick={() => navigate("/outlet-gafas")} style={{ cursor: "pointer" }}>Inicio</span>
        <span style={{ margin: "0 6px" }}>/</span>
        <span onClick={() => navigate("/outlet-gafas")} style={{ cursor: "pointer" }}>Gafas de sol</span>
        <span style={{ margin: "0 6px" }}>/</span>
        <span onClick={() => navigate("/outlet-gafas")} style={{ cursor: "pointer" }}>Más vendidas</span>
        <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: "#111" }}>{product.name}</span>
      </div>

      {/* Two-column hero */}
      <div style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
        gap: 48, padding: "20px 48px 40px",
      }}>
        {/* Gallery */}
        <div>
          <div style={{
            background: "#f5f5f5",
            aspectRatio: "1 / 1",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: imgs.length ? 24 : 64, borderRadius: 4,
            overflow: "hidden",
          }}>
            {imgs.length ? (
              <img
                src={imgs[activeView] || imgs[0]}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", mixBlendMode: "multiply" }}
              />
            ) : (
              <ShapeAlt kind={product.shape} color={colorHex(activeColor)} view={activeView} />
            )}
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${imgs.length || 4}, 1fr)`,
            gap: 10, marginTop: 12,
          }}>
            {Array.from({ length: imgs.length || 4 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveView(i)}
                style={{
                  background: "#f5f5f5",
                  aspectRatio: "1 / 1",
                  border: activeView === i ? "2px solid #111" : "2px solid transparent",
                  cursor: "pointer", padding: imgs.length ? 6 : 8,
                  borderRadius: 4, overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                aria-label={`Vista ${i + 1}`}
              >
                {imgs[i] ? (
                  <img
                    src={imgs[i]}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", mixBlendMode: "multiply" }}
                  />
                ) : (
                  <ShapeAlt kind={product.shape} color={colorHex(activeColor)} view={i} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Buy panel */}
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#be185d", letterSpacing: 1.5, textTransform: "uppercase" }}>
            Outlet Gafas
          </div>
          <h1 style={{ margin: "10px 0 6px", fontSize: 32, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.15, color: "#111" }}>
            {product.name}
          </h1>
          <div style={{ fontSize: 13, color: "#737373" }}>Ref. OG-{String(product.id).padStart(4, "0")}</div>

          <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", gap: 12 }}>
            {product.oldPrice && (
              <span style={{ fontSize: 16, color: "#a3a3a3", textDecoration: "line-through" }}>{fmtEUR(product.oldPrice)}</span>
            )}
            <span style={{ fontSize: 30, fontWeight: 700, color: "#111" }}>{fmtEUR(product.price)}</span>
            {product.oldPrice && (
              <span style={{
                background: "#fce7f3", color: "#be185d", padding: "4px 10px",
                fontSize: 11, fontWeight: 700, borderRadius: 999, letterSpacing: 0.4,
              }}>
                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#737373", marginTop: 6 }}>
            IVA incluido. Envío contra reembolso a toda España.
          </div>

          {/* Color */}
          <div style={{ marginTop: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
                Color: <span style={{ fontWeight: 400, color: "#525252" }}>{colorName(activeColor)}</span>
              </span>
              <span style={{ fontSize: 12, color: "#737373" }}>{product.colors.length} disponibles</span>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {product.colors.map((c, i) => (
                <Swatch key={i} color={c} active={c === activeColor} onHover={setActiveColor} size={28} />
              ))}
            </div>
          </div>

          {/* Qty */}
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 10 }}>Cantidad</div>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #d4d4d4", borderRadius: 999, overflow: "hidden", width: "fit-content" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 44, height: 44, border: 0, background: "#fff", cursor: "pointer", fontSize: 16 }}>−</button>
              <div style={{ width: 52, textAlign: "center", fontSize: 15, fontWeight: 600 }}>{qty}</div>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} style={{ width: 44, height: 44, border: 0, background: "#fff", cursor: "pointer", fontSize: 16 }}>+</button>
            </div>
          </div>

          {/* Try-on */}
          <button
            onClick={() => onTryOn(product, activeColor)}
            style={{
              marginTop: 28, width: "100%",
              background: "#fff", color: "#0a0a0a",
              border: "1.5px solid #0a0a0a", padding: "14px",
              borderRadius: 999, fontSize: 13, fontWeight: 700,
              letterSpacing: 0.4, cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6V4h8v2"/>
            </svg>
            Probar virtualmente con tu cámara
          </button>

          {/* CTA */}
          <button
            onClick={() => onOrder(product, activeColor, qty)}
            style={{
              marginTop: 12, width: "100%",
              background: "#7f1d1d",
              color: "#fff", border: 0, padding: "16px",
              borderRadius: 999, fontSize: 15, fontWeight: 700,
              letterSpacing: 0.4, cursor: "pointer",
              boxShadow: "0 6px 18px rgba(127, 29, 29, 0.35)",
            }}
          >
            Hacer pedido contra reembolso · {fmtEUR(product.price * qty)}
          </button>

          {/* Benefits */}
          <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0", fontSize: 13, color: "#404040" }}>
            <li style={{ padding: "8px 0", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
              Pago al recibir en efectivo, sin adelanto
            </li>
            <li style={{ padding: "8px 0", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
              Envío gratis a toda España en 24-72 h
            </li>
            <li style={{ padding: "8px 0", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
              Devolución gratuita durante 30 días
            </li>
            <li style={{ padding: "8px 0", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
              Garantía de 2 años contra defectos de fabricación
            </li>
          </ul>
        </div>
      </div>

      {/* Info sections */}
      <div style={{ padding: "0 48px 64px", maxWidth: 1100 }}>
        <InfoBlock title="Material y construcción" icon="✦">
          <p style={{ margin: "0 0 12px" }}>
            Montura fabricada en <b>O-Matter™ compatible</b> — termoplástico de alta tenacidad, ligero y resistente al
            estrés mecánico. Bisagras metálicas reforzadas con tornillería de acero inoxidable y plaquetas nasales
            ergonómicas de Unobtainium® compatible que aumentan la sujeción con el sudor.
          </p>
          <div style={{ marginTop: 12 }}>
            <Spec label="Material de la montura" value="O-Matter™ compatible (TR-90)" />
            <Spec label="Material de las lentes" value="Plutonite® compatible (PC alta densidad)" />
            <Spec label="Bisagras" value="Acero inoxidable 304" />
            <Spec label="Plaquetas" value="Unobtainium® compatible (TPE)" />
            <Spec label="Peso" value="28 g" />
          </div>
        </InfoBlock>

        <InfoBlock title="Calidad óptica" icon="◎">
          <p style={{ margin: "0 0 12px" }}>
            Lentes con tecnología <b>HDPolarized</b> y filtro <b>UV400</b> que bloquea el 100% de la radiación UVA,
            UVB y UVC hasta 400 nm. Tratamiento antirreflejo, hidrofóbico y oleofóbico en ambas caras para una
            visión nítida bajo sol intenso o lluvia.
          </p>
          <div style={{ marginTop: 12 }}>
            <Spec label="Protección UV" value="UV400 (100% UVA/UVB/UVC)" />
            <Spec label="Categoría de filtro" value="3 — sol intenso" />
            <Spec label="Polarización" value="HDPolarized 99% eficiencia" />
            <Spec label="Tratamientos" value="Antirreflejo · Hidrofóbico · Oleofóbico" />
            <Spec label="Distorsión óptica" value="< 0,06 dioptrías (norma ANSI Z80.3)" />
          </div>
        </InfoBlock>

        <InfoBlock title="Durabilidad y resistencia" icon="◈">
          <p style={{ margin: "0 0 12px" }}>
            Lentes con resistencia balística <b>ANSI Z87.1+</b>: superan ensayos de impacto a alta velocidad
            (proyectil de 6,35 mm a 46 m/s) sin fragmentación. La montura conserva su geometría tras 1.000 ciclos
            de torsión a -20 °C y +60 °C.
          </p>
          <div style={{ marginTop: 12 }}>
            <Spec label="Resistencia al impacto" value="ANSI Z87.1+ (alta velocidad)" />
            <Spec label="Resistencia al rayado" value="Recubrimiento de cuarzo (3H lápiz)" />
            <Spec label="Rango térmico" value="-20 °C a +60 °C" />
            <Spec label="Resistencia al sudor y agua salada" value="Sí, sin corrosión" />
            <Spec label="Ciclos de plegado probados" value="10.000+" />
          </div>
        </InfoBlock>

        <InfoBlock title="Garantía y soporte" icon="✓">
          <p style={{ margin: 0 }}>
            <b>2 años de garantía</b> contra defectos de fabricación desde la fecha de entrega. Incluye reposición
            de plaquetas, bisagras y tornillería. <b>Devolución gratuita</b> dentro de los primeros 30 días si el
            producto no cumple tus expectativas — sin preguntas. Atención al cliente en español de lunes a sábado.
          </p>
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { t: "2 años", s: "Garantía de fabricación" },
              { t: "30 días", s: "Devolución gratuita" },
              { t: "L–S 9–20h", s: "Atención al cliente" },
            ].map((b, i) => (
              <div key={i} style={{ background: "#fafafa", borderRadius: 10, padding: "16px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#be185d" }}>{b.t}</div>
                <div style={{ fontSize: 12, color: "#525252", marginTop: 4 }}>{b.s}</div>
              </div>
            ))}
          </div>
        </InfoBlock>
      </div>
    </>
  );
}

/* ----------------------------- OrderModal -------------------------------- */

const inputStyle = {
  width: "100%", padding: "10px 12px",
  border: "1px solid #d4d4d4", borderRadius: 6,
  fontSize: 13, color: "#111", background: "#fff",
  fontFamily: "inherit", boxSizing: "border-box",
};

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: "#525252", marginBottom: 6,
  textTransform: "uppercase", letterSpacing: 0.6,
};

function Field({ label, required, children }) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{label} {required && <span style={{ color: "#e11d48" }}>*</span>}</span>
      {children}
    </label>
  );
}

function OrderModal({ product, color, qty: initialQty = 1, onClose }) {
  const [qty, setQty] = useState(initialQty);
  const [activeColor, setActiveColor] = useState(color);
  const imgs = currentImages(product, activeColor);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nombre: "", telefono: "", email: "",
    direccion: "", ciudad: "", cp: "", provincia: "",
    notas: "",
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const total = product.price * qty;
  const submit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,15,15,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, padding: 20, overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 14,
          width: "100%", maxWidth: 920, maxHeight: "92vh", overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)", position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: "absolute", top: 14, right: 14,
            width: 34, height: 34, borderRadius: "50%",
            border: 0, background: "#f5f5f5", cursor: "pointer",
            fontSize: 18, color: "#111", zIndex: 1,
          }}
        >×</button>

        {submitted ? (
          <div style={{ padding: "56px 40px", textAlign: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "#fce7f3", color: "#be185d",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 32,
            }}>✓</div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111" }}>¡Pedido recibido!</h2>
            <p style={{ marginTop: 12, color: "#525252", fontSize: 14, lineHeight: 1.6 }}>
              Gracias, <b>{form.nombre || "cliente"}</b>. Te contactaremos al <b>{form.telefono}</b> en las próximas 24 horas
              para confirmar la entrega contra reembolso de tu <b>{product.name}</b>.
            </p>
            <div style={{
              marginTop: 24, padding: 16, background: "#fafafa",
              borderRadius: 10, fontSize: 13, color: "#404040",
              textAlign: "left", maxWidth: 420, margin: "24px auto 0",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>Producto</span><b>{product.name}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>Color</span><b>{colorName(activeColor)}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>Cantidad</span><b>{qty}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>Total a pagar al recibir</span><b>{fmtEUR(total)}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Envío a</span><b>{form.ciudad}, {form.provincia}</b>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                marginTop: 28, background: "#111", color: "#fff",
                border: 0, padding: "12px 32px", borderRadius: 999,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >Volver a la tienda</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)", gap: 0 }}>
            <div style={{
              background: "#f5f5f5",
              padding: imgs.length ? "32px 24px" : "48px 32px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: 280, overflow: "hidden",
            }}>
              <div style={{
                width: "100%",
                display: "flex", justifyContent: "center", alignItems: "center",
                marginBottom: 24,
              }}>
                {imgs.length ? (
                  <img
                    src={imgs[0]}
                    alt={product.name}
                    style={{ width: "100%", maxHeight: 220, objectFit: "contain", display: "block", mixBlendMode: "multiply" }}
                  />
                ) : (
                  <Shape kind={product.shape} color={colorHex(activeColor)} />
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
                {product.colors.map((c, i) => (
                  <Swatch key={i} color={c} active={c === activeColor} onHover={setActiveColor} size={22} />
                ))}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>{product.name}</div>
                <div style={{ fontSize: 12, color: "#737373", marginTop: 4 }}>Color: {colorName(activeColor)}</div>
                <div style={{ marginTop: 12, display: "flex", gap: 10, justifyContent: "center", alignItems: "baseline" }}>
                  {product.oldPrice && (
                    <span style={{ fontSize: 14, color: "#a3a3a3", textDecoration: "line-through" }}>{fmtEUR(product.oldPrice)}</span>
                  )}
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>{fmtEUR(product.price)}</span>
                </div>
              </div>
              <div style={{ marginTop: 28, width: "100%", maxWidth: 320, background: "#fff", borderRadius: 10, padding: 14, fontSize: 12, color: "#404040" }}>
                <div style={{ fontWeight: 700, color: "#111", marginBottom: 8, fontSize: 13 }}>Pago contra reembolso</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}><span style={{ color: "#16a34a" }}>✓</span> Sin pago anticipado</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}><span style={{ color: "#16a34a" }}>✓</span> Pago al recibir en efectivo</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}><span style={{ color: "#16a34a" }}>✓</span> Envío a toda España en 24-72 h</div>
                <div style={{ display: "flex", gap: 8 }}><span style={{ color: "#16a34a" }}>✓</span> Devolución gratuita en 30 días</div>
              </div>
            </div>

            <form onSubmit={submit} style={{ padding: "40px 36px" }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111" }}>Hacer pedido</h2>
              <p style={{ marginTop: 6, marginBottom: 22, fontSize: 13, color: "#737373" }}>
                Rellena tus datos. Te llamamos para confirmar el envío contra reembolso.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Nombre y apellidos" required>
                    <input type="text" required value={form.nombre} onChange={set("nombre")} style={inputStyle} placeholder="María García López" />
                  </Field>
                </div>
                <Field label="Teléfono móvil" required>
                  <input type="tel" required value={form.telefono} onChange={set("telefono")} style={inputStyle} placeholder="+34 612 345 678" />
                </Field>
                <Field label="Email" required>
                  <input type="email" required value={form.email} onChange={set("email")} style={inputStyle} placeholder="tucorreo@ejemplo.es" />
                </Field>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Dirección" required>
                    <input type="text" required value={form.direccion} onChange={set("direccion")} style={inputStyle} placeholder="Calle Gran Vía, 25, 3º B" />
                  </Field>
                </div>
                <Field label="Ciudad" required>
                  <input type="text" required value={form.ciudad} onChange={set("ciudad")} style={inputStyle} placeholder="Madrid" />
                </Field>
                <Field label="Código postal" required>
                  <input type="text" required value={form.cp} onChange={set("cp")} style={inputStyle} placeholder="28013" pattern="\d{5}" maxLength={5} />
                </Field>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Provincia" required>
                    <select required value={form.provincia} onChange={set("provincia")} style={inputStyle}>
                      <option value="">Selecciona tu provincia…</option>
                      {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Cantidad">
                    <div style={{ display: "flex", alignItems: "center", gap: 0, width: "fit-content", border: "1px solid #d4d4d4", borderRadius: 6, overflow: "hidden" }}>
                      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 38, height: 38, border: 0, background: "#fafafa", cursor: "pointer", fontSize: 16 }}>−</button>
                      <div style={{ width: 48, textAlign: "center", fontSize: 14, fontWeight: 600 }}>{qty}</div>
                      <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} style={{ width: 38, height: 38, border: 0, background: "#fafafa", cursor: "pointer", fontSize: 16 }}>+</button>
                    </div>
                  </Field>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Notas para la entrega (opcional)">
                    <textarea value={form.notas} onChange={set("notas")} rows={2} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} placeholder="Horario preferido, indicaciones del portal…" />
                  </Field>
                </div>
              </div>
              <div style={{ marginTop: 22, padding: "14px 16px", background: "#fafafa", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <span style={{ color: "#525252" }}>Total contra reembolso ({qty} {qty === 1 ? "unidad" : "unidades"})</span>
                <b style={{ fontSize: 18, color: "#111" }}>{fmtEUR(total)}</b>
              </div>
              <button
                type="submit"
                style={{
                  marginTop: 18, width: "100%",
                  background: "#7f1d1d",
                  color: "#fff", border: 0, padding: "14px",
                  borderRadius: 999, fontSize: 14, fontWeight: 700,
                  letterSpacing: 0.4, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(127, 29, 29, 0.35)",
                }}
              >Confirmar pedido contra reembolso</button>
              <p style={{ marginTop: 12, fontSize: 11, color: "#a3a3a3", textAlign: "center" }}>
                Al confirmar aceptas nuestra política de privacidad. No realizamos cargos hasta la entrega.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ TryOnModal ------------------------------- */

const MEDIAPIPE_VERSION = "0.10.14";
const THREE_VERSION = "0.160.0";

async function loadThreeJS() {
  if (window.__THREE) return window.__THREE;
  if (window.__THREE_promise) return window.__THREE_promise;
  window.__THREE_promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import * as THREE from "https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/build/three.module.js";
      window.__THREE = THREE;
      window.dispatchEvent(new Event("three-ready"));
    `;
    script.onerror = () => reject(new Error("three-load-failed"));
    const onReady = () => {
      window.removeEventListener("three-ready", onReady);
      resolve(window.__THREE);
    };
    window.addEventListener("three-ready", onReady);
    setTimeout(() => reject(new Error("timeout-three")), 20000);
    document.head.appendChild(script);
  });
  return window.__THREE_promise;
}

function build3DGlasses(THREE) {
  const root = new THREE.Group();
  root.matrixAutoUpdate = false; // matrix is controlled by face tracker
  const wearable = new THREE.Group();
  // Offset glasses relative to face origin so they sit at the eyes/nose bridge
  wearable.position.set(0, -0.2, 3.2);
  root.add(wearable);

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a, metalness: 0.6, roughness: 0.28,
  });
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0x101010, metalness: 0.7, roughness: 0.12,
    transparent: true, opacity: 0.82,
  });

  // Two flattened ellipsoids → wraparound lenses
  const sphere = new THREE.SphereGeometry(1, 28, 18);
  const leftLens = new THREE.Mesh(sphere, lensMat);
  leftLens.scale.set(2.8, 1.8, 0.55);
  leftLens.position.set(-2.6, 0, 0.3);
  leftLens.rotation.y = -0.32;
  wearable.add(leftLens);

  const rightLens = new THREE.Mesh(sphere, lensMat);
  rightLens.scale.set(2.8, 1.8, 0.55);
  rightLens.position.set(2.6, 0, 0.3);
  rightLens.rotation.y = 0.32;
  wearable.add(rightLens);

  // Top frame strip (gives the "sport" silhouette over the lenses)
  const topBar = new THREE.Mesh(
    new THREE.BoxGeometry(11, 0.35, 0.4),
    frameMat
  );
  topBar.position.set(0, 1.5, -0.1);
  topBar.rotation.x = -0.05;
  // Slight curve via shearing the geometry
  topBar.geometry.translate(0, 0, 0);
  wearable.add(topBar);

  // Bridge (small connector between lenses)
  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.45, 0.45),
    frameMat
  );
  bridge.position.set(0, 0.3, 0.3);
  wearable.add(bridge);

  // Arms / temples
  const armGeom = new THREE.BoxGeometry(7, 0.4, 0.4);
  const leftArm = new THREE.Mesh(armGeom, frameMat);
  leftArm.position.set(-6.8, 0.4, -2.8);
  leftArm.rotation.y = -Math.PI / 7;
  wearable.add(leftArm);
  const rightArm = new THREE.Mesh(armGeom, frameMat);
  rightArm.position.set(6.8, 0.4, -2.8);
  rightArm.rotation.y = Math.PI / 7;
  wearable.add(rightArm);

  // Tiny brand chip on each temple (optional accent)
  const chipMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, metalness: 0.5, roughness: 0.4 });
  const lChip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.05), chipMat);
  lChip.position.set(-4.5, 0.5, -0.9);
  wearable.add(lChip);
  const rChip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.05), chipMat);
  rChip.position.set(4.5, 0.5, -0.9);
  wearable.add(rChip);

  root.visible = false; // hidden until first matrix arrives
  return root;
}

async function loadMediapipeLib() {
  if (window.__faceLandmarkerLib) return window.__faceLandmarkerLib;
  if (window.__faceLandmarkerPromise) return window.__faceLandmarkerPromise;

  window.__faceLandmarkerPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import { FaceLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/vision_bundle.mjs";
      window.__faceLandmarkerLib = { FaceLandmarker, FilesetResolver };
      window.dispatchEvent(new Event("mediapipe-ready"));
    `;
    script.onerror = () => reject(new Error("script-load-failed"));
    const onReady = () => {
      window.removeEventListener("mediapipe-ready", onReady);
      resolve(window.__faceLandmarkerLib);
    };
    window.addEventListener("mediapipe-ready", onReady);
    setTimeout(() => reject(new Error("timeout")), 20000);
    document.head.appendChild(script);
  });
  return window.__faceLandmarkerPromise;
}

function TryOnModal({ product, color: initialColor, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const threeCanvasRef = useRef(null);
  const dragRef = useRef(null);
  const rafRef = useRef(null);
  const smoothRef = useRef({ x: null, y: null, sc: null, r: null, yaw: null });
  const landmarkerRef = useRef(null);
  const threeRef = useRef({ renderer: null, scene: null, camera: null, glasses: null, THREE: null });

  const [streamReady, setStreamReady] = useState(false);
  const [error, setError] = useState(null);
  const [activeColor, setActiveColor] = useState(initialColor);
  const [pos, setPos] = useState({ x: 50, y: 38 });
  const [scale, setScale] = useState(0.5);
  const [rotation, setRotation] = useState(0);
  const [snapshot, setSnapshot] = useState(null);

  // Face tracking
  const [faceTrack, setFaceTrack] = useState(true);
  const [trackerStatus, setTrackerStatus] = useState("idle"); // idle|loading|ready|searching|tracking|error
  const [autoTransform, setAutoTransform] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    let stream;
    let cancelled = false;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Tu navegador no soporta el acceso a la cámara.");
      return () => { document.body.style.overflow = ""; };
    }

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    }).then((s) => {
      if (cancelled) { s.getTracks().forEach((t) => t.stop()); return; }
      stream = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(() => {});
          setStreamReady(true);
        };
      }
    }).catch((err) => {
      const msg =
        err.name === "NotAllowedError"
          ? "Permiso denegado. Activa el acceso a la cámara desde los ajustes del navegador y vuelve a intentarlo."
          : err.name === "NotFoundError"
          ? "No se detectó ninguna cámara en tu dispositivo."
          : "No se pudo iniciar la cámara. Comprueba que la página está sirviéndose por HTTPS.";
      setError(msg);
    });

    return () => {
      cancelled = true;
      document.body.style.overflow = "";
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Load MediaPipe FaceLandmarker
  useEffect(() => {
    if (!faceTrack) return;
    if (landmarkerRef.current) {
      setTrackerStatus("searching");
      return;
    }
    let cancelled = false;
    setTrackerStatus("loading");

    (async () => {
      try {
        const { FaceLandmarker, FilesetResolver } = await loadMediapipeLib();
        if (cancelled) return;
        const fileset = await FilesetResolver.forVisionTasks(
          `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`
        );
        if (cancelled) return;
        const lm = await FaceLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFacialTransformationMatrixes: true,
        });
        if (cancelled) { lm.close?.(); return; }
        landmarkerRef.current = lm;
        setTrackerStatus("searching");
      } catch (e) {
        if (!cancelled) setTrackerStatus("error");
      }
    })();

    return () => { cancelled = true; };
  }, [faceTrack]);

  // Initialize three.js scene (3D glasses model)
  useEffect(() => {
    if (!faceTrack) return;
    if (threeRef.current.renderer) return;
    let cancelled = false;

    (async () => {
      try {
        const THREE = await loadThreeJS();
        if (cancelled) return;
        const canvas = threeCanvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const cRect = container.getBoundingClientRect();
        const W = cRect.width || 640;
        const H = cRect.height || 480;

        const renderer = new THREE.WebGLRenderer({
          canvas, alpha: true, antialias: true,
          preserveDrawingBuffer: true,
        });
        renderer.setSize(W, H, false);
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        // Camera matches MediaPipe's default vertical FoV (~63°)
        const camera = new THREE.PerspectiveCamera(63, W / H, 1, 2000);
        // MediaPipe matrix outputs face in camera-relative space, camera at origin

        scene.add(new THREE.AmbientLight(0xffffff, 0.65));
        const key = new THREE.DirectionalLight(0xffffff, 0.85);
        key.position.set(2, 3, 5);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xfca5a5, 0.35);
        rim.position.set(-3, 1, -2);
        scene.add(rim);

        const glasses = build3DGlasses(THREE);
        scene.add(glasses);

        threeRef.current = { renderer, scene, camera, glasses, THREE };
      } catch (_) {
        // three.js failed to load — we keep 2D fallback
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [faceTrack]);

  // Detection loop (drives both 2D smoothing and 3D matrix)
  useEffect(() => {
    if (!faceTrack || !streamReady) return;
    if (trackerStatus !== "searching" && trackerStatus !== "tracking") return;

    let lastTime = -1;
    const detect = () => {
      const video = videoRef.current;
      const lm = landmarkerRef.current;
      const three = threeRef.current;

      if (lm && video && video.readyState >= 2 && video.currentTime !== lastTime) {
        lastTime = video.currentTime;
        try {
          const result = lm.detectForVideo(video, performance.now());
          const face = result.faceLandmarks?.[0];
          const matrix = result.facialTransformationMatrixes?.[0]?.data;

          if (face) {
            const left = face[33], right = face[263];

            // Position: midpoint between eyes, mirrored for display
            const midX = 1 - (left.x + right.x) / 2;
            const midY = (left.y + right.y) / 2;

            // Eye-line tilt — compute in un-mirrored coords, normalize to [-π/2, π/2]
            // (the eye line is always roughly horizontal regardless of which index is which side)
            let lineAngle = Math.atan2(right.y - left.y, right.x - left.x);
            if (lineAngle > Math.PI / 2) lineAngle -= Math.PI;
            else if (lineAngle < -Math.PI / 2) lineAngle += Math.PI;
            // Mirrored display reverses rotation direction
            const angle = -lineAngle * (180 / Math.PI);

            // Eye distance → glasses scale.
            // Multiplier compensates for: (a) frame extends past temples (~1.4×),
            // (b) the product photo has ~25% white padding around the frame (~1.3×).
            const ddx = right.x - left.x, ddy = right.y - left.y;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            const newScale = Math.min(2.4, Math.max(0.3, dist * 2.7));

            // Yaw extracted from the face transformation matrix
            const yawDeg = matrix ? Math.atan2(matrix[8], matrix[10]) * (180 / Math.PI) : 0;

            const s = smoothRef.current, T = 0.45;
            const lerp = (a, b) => (a == null ? b : a + (b - a) * T);
            s.x = lerp(s.x, midX * 100); s.y = lerp(s.y, midY * 100);
            s.sc = lerp(s.sc, newScale); s.r = lerp(s.r, angle);
            s.yaw = lerp(s.yaw, yawDeg);
            setAutoTransform({ x: s.x, y: s.y, scale: s.sc, rotation: s.r, yaw: s.yaw });

            if (trackerStatus !== "tracking") setTrackerStatus("tracking");
          } else {
            if (trackerStatus === "tracking") setTrackerStatus("searching");
          }
        } catch (_) {}
      }
      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [faceTrack, streamReady, trackerStatus]);

  // Cleanup landmarker + three.js on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (landmarkerRef.current) {
        try { landmarkerRef.current.close?.(); } catch (_) {}
        landmarkerRef.current = null;
      }
      const t = threeRef.current;
      if (t.renderer) {
        try {
          t.scene?.traverse?.((o) => {
            if (o.geometry) o.geometry.dispose?.();
            if (o.material) {
              if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose?.());
              else o.material.dispose?.();
            }
          });
          t.renderer.dispose?.();
        } catch (_) {}
        threeRef.current = { renderer: null, scene: null, camera: null, glasses: null, THREE: null };
      }
    };
  }, []);

  // Effective transform values (auto if face-tracking, else manual)
  const eff = (faceTrack && autoTransform)
    ? { pos: { x: autoTransform.x, y: autoTransform.y }, scale: autoTransform.scale, rotation: autoTransform.rotation }
    : { pos, scale, rotation };

  const onPointerDown = (e) => {
    if (faceTrack) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX, startY: e.clientY,
      origX: pos.x, origY: pos.y,
      w: rect.width, h: rect.height,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = ((e.clientX - dragRef.current.startX) / dragRef.current.w) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / dragRef.current.h) * 100;
    setPos({
      x: Math.max(0, Math.min(100, dragRef.current.origX + dx)),
      y: Math.max(0, Math.min(100, dragRef.current.origY + dy)),
    });
  };
  const onPointerUp = (e) => {
    dragRef.current = null;
    try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch (_) {}
  };

  const takeSnapshot = async () => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const W = video.videoWidth || 1280;
    const H = video.videoHeight || 720;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    ctx.save();
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, W, H);
    ctx.restore();

    const overlay = container.querySelector(".tryon-overlay");
    const cRect = container.getBoundingClientRect();
    const containerW = cRect.width;
    const containerH = cRect.height;
    const glassesW = containerW * eff.scale;
    const cx = (eff.pos.x / 100) * containerW;
    const cy = (eff.pos.y / 100) * containerH;
    const sx = W / containerW;
    const sy = H / containerH;

    const imgEl = overlay?.querySelector("img");
    const svgEl = overlay?.querySelector("svg");

    if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
      const aspect = imgEl.naturalHeight / imgEl.naturalWidth;
      const glassesH = glassesW * aspect;

      ctx.save();
      ctx.translate(cx * sx, cy * sy);
      ctx.rotate((eff.rotation * Math.PI) / 180);
      ctx.globalCompositeOperation = "multiply";
      ctx.drawImage(imgEl, -(glassesW * sx) / 2, -(glassesH * sy) / 2, glassesW * sx, glassesH * sy);
      ctx.restore();
    } else if (svgEl) {
      const glassesH = glassesW * (100 / 240);
      const svgClone = svgEl.cloneNode(true);
      svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgClone.setAttribute("width", glassesW * sx);
      svgClone.setAttribute("height", glassesH * sy);
      const svgStr = new XMLSerializer().serializeToString(svgClone);
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          ctx.translate(cx * sx, cy * sy);
          ctx.rotate((eff.rotation * Math.PI) / 180);
          ctx.drawImage(img, -(glassesW * sx) / 2, -(glassesH * sy) / 2, glassesW * sx, glassesH * sy);
          ctx.restore();
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        img.src = url;
      });
    }

    setSnapshot(canvas.toDataURL("image/jpeg", 0.92));
  };

  const downloadSnapshot = () => {
    if (!snapshot) return;
    const a = document.createElement("a");
    a.href = snapshot;
    a.download = `outlet-gafas-${product.id}-tryon.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(10,10,10,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: 20, overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0a0a0a", color: "#fff",
          width: "100%", maxWidth: 980, borderRadius: 14,
          overflow: "hidden", position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <button onClick={onClose} aria-label="Cerrar" style={{
          position: "absolute", top: 14, right: 14, zIndex: 10,
          width: 36, height: 36, borderRadius: "50%",
          border: 0, background: "rgba(255,255,255,0.12)", cursor: "pointer",
          color: "#fff", fontSize: 20,
        }}>×</button>

        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #262626" }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: "#fca5a5", textTransform: "uppercase", fontWeight: 600 }}>
            Probador virtual
          </div>
          <h3 style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 700 }}>{product.name}</h3>
        </div>

        {snapshot ? (
          <div style={{ padding: 24 }}>
            <img src={snapshot} alt="Captura" style={{ width: "100%", borderRadius: 10, display: "block" }} />
            <div style={{ display: "flex", gap: 12, marginTop: 18, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setSnapshot(null)} style={{
                background: "transparent", color: "#fff",
                border: "1px solid rgba(255,255,255,0.28)",
                padding: "12px 24px", fontSize: 13, fontWeight: 600,
                borderRadius: 999, cursor: "pointer",
              }}>← Volver al probador</button>
              <button onClick={downloadSnapshot} style={{
                background: "#fff", color: "#0a0a0a", border: 0,
                padding: "12px 26px", fontSize: 13, fontWeight: 700,
                borderRadius: 999, cursor: "pointer",
              }}>Descargar imagen</button>
            </div>
          </div>
        ) : error ? (
          <div style={{ padding: "60px 32px", textAlign: "center" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px" }}>
              <path d="M3 7h3l2-3h8l2 3h3v12H3z"/><circle cx="12" cy="13" r="4"/><line x1="3" y1="3" x2="21" y2="21"/>
            </svg>
            <p style={{ color: "#d4d4d4", fontSize: 14, marginTop: 12, lineHeight: 1.6, maxWidth: 420, marginInline: "auto" }}>
              {error}
            </p>
            <button onClick={onClose} style={{
              marginTop: 24, background: "#fff", color: "#0a0a0a",
              border: 0, padding: "12px 26px", borderRadius: 999,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>Cerrar</button>
          </div>
        ) : (
          <>
            <div
              ref={containerRef}
              style={{
                position: "relative", aspectRatio: "16 / 12",
                background: "#0a0a0a", overflow: "hidden",
                userSelect: "none",
              }}
            >
              <video
                ref={videoRef}
                muted playsInline autoPlay
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transform: "scaleX(-1)",
                }}
              />
              {!streamReady && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: "#a3a3a3", fontSize: 13,
                }}>Iniciando cámara…</div>
              )}
              {/* 3D canvas kept in DOM for potential future use, hidden by default */}
              <canvas
                ref={threeCanvasRef}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  pointerEvents: "none",
                  opacity: 0,
                  display: "none",
                }}
              />

              {/* 2D overlay — used in both auto (yaw-aware src) and manual modes */}
              {streamReady && (() => {
                // In auto mode, pick photo by yaw; in manual, fixed frontal
                const yaw = (faceTrack && autoTransform?.yaw != null) ? autoTransform.yaw : 0;
                const yawAbs = Math.abs(yaw);
                const useFrontal = !faceTrack || yawAbs < 15;
                const imgIdx = useFrontal ? 1 : 0; // 02.jpg frontal, 01.jpg angled
                const flipImg = faceTrack && !useFrontal && yaw < 0;
                const variantImgs = currentImages(product, activeColor);
                const src = variantImgs[imgIdx] || variantImgs[0];

                return (
                  <div
                    className="tryon-overlay"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    style={{
                      position: "absolute",
                      left: `${eff.pos.x}%`, top: `${eff.pos.y}%`,
                      transform: `translate(-50%, -50%) rotate(${eff.rotation}deg)`,
                      width: `${eff.scale * 100}%`,
                      cursor: faceTrack ? "default" : "grab",
                      touchAction: "none",
                      display: "flex", justifyContent: "center",
                      pointerEvents: faceTrack ? "none" : "auto",
                      transition: faceTrack ? "none" : "left 0.1s, top 0.1s",
                    }}
                  >
                    {src ? (
                      <img
                        src={src}
                        alt={product.name}
                        draggable={false}
                        style={{
                          width: "100%", height: "auto", display: "block",
                          mixBlendMode: "multiply",
                          opacity: 0.96,
                          filter: "contrast(0.85) brightness(1.18)",
                          pointerEvents: "none",
                          userSelect: "none",
                          transform: flipImg ? "scaleX(-1)" : "none",
                          transition: "opacity 0.12s ease",
                        }}
                      />
                    ) : (
                      <Shape kind={product.shape} color={colorHex(activeColor)} />
                    )}
                  </div>
                );
              })()}
              {streamReady && faceTrack && (
                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: "rgba(0,0,0,0.65)", color: "#fff",
                  padding: "6px 12px", borderRadius: 999, fontSize: 11,
                  pointerEvents: "none", letterSpacing: 0.3,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontWeight: 600,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background:
                      trackerStatus === "tracking" ? "#16a34a" :
                      trackerStatus === "searching" ? "#fbbf24" :
                      trackerStatus === "loading" ? "#0ea5e9" : "#ef4444",
                    boxShadow: trackerStatus === "tracking"
                      ? "0 0 0 4px rgba(22, 163, 74, 0.25)" : "none",
                    transition: "background 0.2s",
                  }} />
                  {trackerStatus === "loading" && "Cargando IA de detección facial…"}
                  {trackerStatus === "searching" && "Buscando tu rostro…"}
                  {trackerStatus === "tracking" && "Rostro detectado"}
                  {trackerStatus === "error" && "Error · cambia a manual"}
                  {trackerStatus === "idle" && "Iniciando…"}
                </div>
              )}
              {streamReady && !faceTrack && (
                <div style={{
                  position: "absolute", bottom: 12, left: 12,
                  background: "rgba(0,0,0,0.55)", color: "#fff",
                  padding: "6px 10px", borderRadius: 6, fontSize: 11,
                  pointerEvents: "none", letterSpacing: 0.2,
                }}>
                  Arrastra para ajustar · sliders abajo
                </div>
              )}
            </div>

            <div style={{ padding: "20px 24px" }}>
              {/* Mode toggle */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "#171717", padding: 4, borderRadius: 999, width: "fit-content" }}>
                <button
                  onClick={() => setFaceTrack(true)}
                  style={{
                    background: faceTrack ? "#fff" : "transparent",
                    color: faceTrack ? "#0a0a0a" : "#a3a3a3",
                    border: 0, padding: "8px 16px",
                    fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
                    borderRadius: 999, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>
                  Auto · IA
                </button>
                <button
                  onClick={() => setFaceTrack(false)}
                  style={{
                    background: !faceTrack ? "#fff" : "transparent",
                    color: !faceTrack ? "#0a0a0a" : "#a3a3a3",
                    border: 0, padding: "8px 16px",
                    fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
                    borderRadius: 999, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11V5a2 2 0 1 1 4 0v8"/><path d="M5 15c0 4 3 7 7 7s7-3 7-7v-3a2 2 0 1 0-4 0v3"/><path d="M9 13V8a2 2 0 1 0-4 0v7"/></svg>
                  Manual
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#a3a3a3", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>
                  Color: <span style={{ color: "#fff", fontWeight: 400 }}>{colorName(activeColor)}</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.colors.map((c, i) => (
                    <Swatch key={i} color={c} active={c === activeColor} onHover={setActiveColor} size={22} />
                  ))}
                </div>
              </div>

              {!faceTrack && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#a3a3a3", textTransform: "uppercase", marginBottom: 6, display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                      <span>Tamaño</span><span style={{ color: "#737373" }}>{Math.round(scale * 100)}%</span>
                    </div>
                    <input
                      type="range" min="0.2" max="1" step="0.01"
                      value={scale} onChange={(e) => setScale(parseFloat(e.target.value))}
                      style={{ width: "100%", accentColor: "#dc2626" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#a3a3a3", textTransform: "uppercase", marginBottom: 6, display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                      <span>Rotación</span><span style={{ color: "#737373" }}>{rotation}°</span>
                    </div>
                    <input
                      type="range" min="-30" max="30" step="1"
                      value={rotation} onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                      style={{ width: "100%", accentColor: "#dc2626" }}
                    />
                  </div>
                </div>
              )}

              {faceTrack && (
                <p style={{ fontSize: 12, color: "#a3a3a3", margin: "8px 0 0", lineHeight: 1.6 }}>
                  {trackerStatus === "loading" && "Cargando el modelo de detección facial (~5 MB, solo la primera vez)…"}
                  {trackerStatus === "searching" && "Mira a la cámara con el rostro centrado y bien iluminado."}
                  {trackerStatus === "tracking" && "Los lentes siguen tu rostro automáticamente. Inclina la cabeza para probar."}
                  {trackerStatus === "error" && "No se pudo cargar el modelo. Cambia a modo Manual para continuar."}
                  {trackerStatus === "idle" && "Preparando seguimiento…"}
                </p>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                {!faceTrack ? (
                  <button
                    onClick={() => { setPos({ x: 50, y: 38 }); setScale(0.5); setRotation(0); }}
                    style={{
                      background: "transparent", color: "#a3a3a3",
                      border: "1px solid rgba(255,255,255,0.18)",
                      padding: "10px 18px", fontSize: 12, fontWeight: 500,
                      borderRadius: 999, cursor: "pointer",
                    }}
                  >Restablecer</button>
                ) : <span />}
                <button
                  onClick={takeSnapshot}
                  disabled={!streamReady}
                  style={{
                    background: "#7f1d1d", color: "#fff",
                    border: 0, padding: "12px 26px",
                    fontSize: 13, fontWeight: 700, borderRadius: 999,
                    cursor: streamReady ? "pointer" : "not-allowed",
                    opacity: streamReady ? 1 : 0.5,
                    boxShadow: "0 4px 14px rgba(127, 29, 29, 0.4)",
                  }}
                >Capturar imagen</button>
              </div>

              <p style={{ marginTop: 18, fontSize: 10, color: "#737373", textAlign: "center", lineHeight: 1.6 }}>
                La cámara y la detección facial se ejecutan solo en tu dispositivo. No guardamos ni transmitimos las imágenes.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Icons --------------------------------- */

const TruckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="12" height="9" rx="1"/><path d="M15 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>
  </svg>
);
const WalletIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18"/><circle cx="16" cy="14" r="1.2"/>
  </svg>
);
const ReturnIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 5 6v6c0 4.4 2.9 8.5 7 9 4.1-.5 7-4.6 7-9V6Z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

/* ----------------------------- CategoryCard ------------------------------ */

function CategoryCard({ tone, label, title, subtitle, cta, image, background, onClick }) {
  const isDark = tone === "dark";
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        background, color: isDark ? "#fff" : "#0a0a0a",
        minHeight: 420, padding: "56px 48px",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        alignItems: "center", gap: 24,
        cursor: "pointer", overflow: "hidden",
        borderRadius: 4,
      }}
    >
      <div>
        <div style={{
          fontSize: 11, letterSpacing: 3, fontWeight: 600,
          color: isDark ? "#fca5a5" : "#737373",
          textTransform: "uppercase", marginBottom: 12,
        }}>{label}</div>
        <h3 style={{
          margin: 0, fontSize: 28, fontWeight: 700,
          letterSpacing: -0.3, lineHeight: 1.2,
        }}>{title}</h3>
        <p style={{
          fontSize: 14, lineHeight: 1.6, marginTop: 16, maxWidth: 320,
          color: isDark ? "#a3a3a3" : "#525252",
        }}>{subtitle}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          style={{
            marginTop: 24,
            background: isDark ? "#fff" : "#0a0a0a",
            color: isDark ? "#0a0a0a" : "#fff",
            border: 0, padding: "12px 26px",
            fontSize: 13, fontWeight: 600,
            borderRadius: 999, cursor: "pointer",
          }}
        >{cta}</button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {isDark ? (
          <div style={{
            background: "radial-gradient(circle at 50% 50%, #fff 0%, #f5f5f5 55%, transparent 75%)",
            width: "100%", aspectRatio: "1 / 1", maxWidth: 320,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%",
          }}>
            <img
              src={image}
              alt={title}
              style={{
                width: "92%", height: "auto",
                objectFit: "contain", display: "block",
                mixBlendMode: "multiply",
                filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.25))",
              }}
            />
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            style={{
              width: "100%", maxWidth: 360,
              height: "auto", objectFit: "contain", display: "block",
              mixBlendMode: "multiply",
              filter: "drop-shadow(0 12px 22px rgba(0,0,0,0.12))",
            }}
          />
        )}
      </div>
    </div>
  );
}

/* -------------------------------- HomeView ------------------------------- */

function HomeView({ navigate }) {
  const bestsellers = PRODUCTS.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section style={{ background: "#0a0a0a", color: "#fafafa", overflow: "hidden" }}>
        <div style={{
          maxWidth: 1440, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1.1fr 1fr",
          minHeight: 560,
        }}>
          <div style={{ padding: "100px 64px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#fca5a5", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>
              Outlet · Temporada 2026
            </div>
            <h1 style={{ fontSize: 54, fontWeight: 800, letterSpacing: -1, lineHeight: 1.05, margin: 0 }}>
              Gafas de alta gama,<br/>sin pagar de adelantado.
            </h1>
            <p style={{ fontSize: 16, color: "#a3a3a3", lineHeight: 1.65, marginTop: 24, maxWidth: 460 }}>
              Pago contra reembolso en toda España. Lentes UV400, monturas resistentes
              y entrega en 24-72 h. Devolución gratuita durante 30 días.
            </p>
            <div style={{ marginTop: 36 }}>
              <button
                onClick={() => navigate("/outlet-gafas/mas-vendidas")}
                style={{
                  background: "#7f1d1d", color: "#fff", border: 0,
                  padding: "16px 32px", fontSize: 14, fontWeight: 700,
                  letterSpacing: 0.4, borderRadius: 999, cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(127, 29, 29, 0.45)",
                }}
              >Ver más vendidas</button>
            </div>
          </div>

          <div style={{
            background: "radial-gradient(circle at 55% 45%, #1f2937, #0a0a0a 70%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", minHeight: 380, padding: 40,
          }}>
            <div style={{
              background: "radial-gradient(circle at 50% 50%, #ffffff 0%, #f5f5f5 55%, transparent 78%)",
              width: "82%", aspectRatio: "1 / 1", maxWidth: 460,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "50%",
              transform: "rotate(-4deg)",
            }}>
              <img
                src="/products/1/01.jpg"
                alt="Outlet Gafas — más vendidas"
                style={{
                  width: "94%", height: "auto",
                  objectFit: "contain", display: "block",
                  mixBlendMode: "multiply",
                  filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.35))",
                  transform: "rotate(4deg)",
                }}
              />
            </div>
            <div style={{
              position: "absolute", top: 32, right: 32,
              fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2.5, fontWeight: 600,
            }}>UV400 · ANSI Z87.1+</div>
            <div style={{
              position: "absolute", bottom: 32, right: 32,
              fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2.5, fontWeight: 600,
            }}>HDPolarized</div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ borderBottom: "1px solid #ececec", padding: "28px 48px" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24,
        }}>
          {[
            { Icon: TruckIcon,  label: "Envío gratis",        sub: "A toda España" },
            { Icon: WalletIcon, label: "Contra reembolso",    sub: "Paga al recibir" },
            { Icon: ReturnIcon, label: "Devolución 30 días",  sub: "Sin preguntas" },
            { Icon: ShieldIcon, label: "Garantía 2 años",     sub: "Defectos cubiertos" },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <b.Icon />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{b.label}</div>
                <div style={{ fontSize: 12, color: "#737373" }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers preview */}
      <section style={{ padding: "64px 48px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: 32, flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#737373", textTransform: "uppercase", fontWeight: 600 }}>
              Más vendidas
            </div>
            <h2 style={{ margin: "10px 0 0", fontSize: 32, fontWeight: 700, letterSpacing: -0.3 }}>
              Las favoritas de la temporada
            </h2>
          </div>
          <button
            onClick={() => navigate("/outlet-gafas/mas-vendidas")}
            style={{
              background: "none", border: 0, color: "#111",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              borderBottom: "1px solid #111", padding: "4px 0",
            }}
          >Ver todas →</button>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24,
        }}>
          {bestsellers.map((p) => (
            <ProductCard key={p.id} p={p} onSelect={(prod) => navigate(`/outlet-gafas/producto/${prod.id}`)} />
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section style={{ padding: "16px 48px 64px" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#737373", textTransform: "uppercase", fontWeight: 600 }}>
            Categorías
          </div>
          <h2 style={{ margin: "10px 0 0", fontSize: 32, fontWeight: 700, letterSpacing: -0.3 }}>
            Encuentra tu estilo
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <CategoryCard
            tone="dark"
            label="Deportivo"
            title="Para entrenar y rendir"
            subtitle="Wraparound envolventes, lentes antirreflejo y agarre con sudor."
            cta="Ver deportivas"
            image="/products/04/02.jpg"
            background="linear-gradient(135deg, #1f2937, #0a0a0a)"
            onClick={() => navigate("/outlet-gafas/categoria/deportivo")}
          />
          <CategoryCard
            tone="light"
            label="Casual"
            title="Para cada día"
            subtitle="Monturas atemporales en acetato y TR-90, polarizadas o transparentes."
            cta="Ver casuales"
            image="/products/03/02.jpg"
            background="#f5f5f5"
            onClick={() => navigate("/outlet-gafas/categoria/casual")}
          />
        </div>
      </section>

      {/* Quality features */}
      <section style={{ borderTop: "1px solid #ececec", padding: "64px 48px", background: "#fafafa" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#737373", textTransform: "uppercase", fontWeight: 600 }}>
            Por qué Outlet Gafas
          </div>
          <h2 style={{ margin: "10px 0 0", fontSize: 30, fontWeight: 700, letterSpacing: -0.3 }}>
            Calidad de primera línea, precio outlet
          </h2>
        </div>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28,
        }}>
          {[
            { t: "UV400 + Polarización", d: "Bloqueo del 100% de UVA/UVB/UVC y reducción del 99% de los reflejos. Visión nítida bajo sol intenso, nieve o agua." },
            { t: "Construcción premium", d: "Monturas en TR-90 compatible y bisagras de acero inoxidable 304. Probadas en 10.000+ ciclos de plegado." },
            { t: "Resistencia balística", d: "Lentes que superan la norma ANSI Z87.1+ — impacto de alta velocidad sin astillarse ni fragmentarse." },
          ].map((q, i) => (
            <div key={i} style={{ background: "#fff", padding: 28, borderRadius: 10 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#7f1d1d", letterSpacing: -0.5 }}>0{i + 1}</div>
              <h4 style={{ margin: "12px 0 8px", fontSize: 16, fontWeight: 700 }}>{q.t}</h4>
              <p style={{ margin: 0, fontSize: 13, color: "#525252", lineHeight: 1.65 }}>{q.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background: "#0a0a0a", color: "#fff", padding: "56px 48px", textAlign: "center" }}>
        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Únete al outlet</h3>
        <p style={{ margin: "10px auto 28px", fontSize: 14, color: "#a3a3a3", maxWidth: 480 }}>
          Recibe ofertas exclusivas, lanzamientos y un -10% en tu primer pedido contra reembolso.
        </p>
        <form onSubmit={(e) => e.preventDefault()} style={{
          display: "flex", maxWidth: 460, margin: "0 auto", gap: 8, flexWrap: "wrap", justifyContent: "center",
        }}>
          <input
            type="email" placeholder="Tu correo electrónico"
            style={{
              flex: 1, minWidth: 240, padding: "14px 18px", borderRadius: 999,
              border: "1px solid #404040", background: "#171717",
              color: "#fff", fontSize: 13, outline: "none",
            }}
          />
          <button type="submit" style={{
            background: "#fff", color: "#0a0a0a", border: 0,
            padding: "14px 26px", borderRadius: 999, fontSize: 13,
            fontWeight: 700, cursor: "pointer",
          }}>Suscribirme</button>
        </form>
      </section>
    </>
  );
}

/* ------------------------------ ListingView ------------------------------ */

function ListingView({ onSelectProduct, navigate, category }) {
  const [sort, setSort] = useState("relevance");
  const meta = category ? CATEGORIES[category] : null;

  const sortedProducts = useMemo(() => {
    const filtered = category ? PRODUCTS.filter((p) => p.category === category) : [...PRODUCTS];
    const copy = [...filtered];
    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
    return copy;
  }, [sort, category]);

  const selectStyle = {
    border: 0, background: "transparent", fontSize: 13, color: "#111",
    cursor: "pointer", padding: "8px 22px 8px 0",
    appearance: "none", WebkitAppearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='none' stroke='%23111' stroke-width='1.4' d='M1 1l4 4 4-4'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 4px center",
  };

  return (
    <>
      <div style={{ padding: "28px 48px 6px", fontSize: 12, color: "#737373" }}>
        <span onClick={() => navigate("/outlet-gafas")} style={{ cursor: "pointer" }}>Inicio</span>
        <span style={{ margin: "0 6px" }}>/</span>
        Gafas de sol <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: "#111" }}>{meta ? meta.label : "Más vendidas"}</span>
      </div>
      <div style={{ padding: "0 48px 4px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.3, margin: "12px 0 0", lineHeight: 1.1 }}>
          {meta ? meta.title : "Más vendidas"}
        </h1>
        {meta && (
          <p style={{ fontSize: 14, color: "#525252", marginTop: 8, marginBottom: 0, maxWidth: 600 }}>
            {meta.subtitle}
          </p>
        )}
        <div style={{ fontSize: 11, fontStyle: "italic", color: "#a3a3a3", marginTop: 10 }}>
          "Estilo similar a: Oakley®" — referencia estética. Sin vínculo con la marca Oakley/Luxottica.
        </div>
      </div>

      <div style={{ padding: "28px 48px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {["Forma", "Lente", "Color", "Precio"].map((label) => (
            <button key={label} style={{
              background: "#fff", border: "1px solid #d4d4d4",
              padding: "9px 16px", fontSize: 13, color: "#111",
              cursor: "pointer", borderRadius: 999,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              {label}
              <svg width="10" height="6" viewBox="0 0 10 6"><path fill="none" stroke="#111" strokeWidth="1.4" d="M1 1l4 4 4-4"/></svg>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#737373" }}>{sortedProducts.length} productos</span>
          <span style={{ width: 1, height: 16, background: "#e5e5e5" }} />
          <label style={{ fontSize: 12, color: "#737373", display: "inline-flex", alignItems: "center", gap: 6 }}>
            Ordenar por
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={selectStyle}>
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="newest">Más recientes</option>
            </select>
          </label>
        </div>
      </div>

      <section style={{ padding: "8px 48px 64px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px 24px" }}>
        {sortedProducts.map((p) => (
          <ProductCard key={p.id} p={p} onSelect={onSelectProduct} />
        ))}
      </section>
    </>
  );
}

/* ------------------------------ OutletGafas ------------------------------ */

export default function OutletGafas() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  const [orderTarget, setOrderTarget] = useState(null);
  const [tryOnTarget, setTryOnTarget] = useState(null);

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(parseRoute(path));
    window.scrollTo(0, 0);
  };

  const product = route.view === "detail"
    ? PRODUCTS.find((p) => p.id === route.productId)
    : null;

  const renderView = () => {
    if (product) {
      return (
        <ProductDetail
          product={product}
          navigate={navigate}
          onOrder={(p, c, q) => setOrderTarget({ product: p, color: c, qty: q })}
          onTryOn={(p, c) => setTryOnTarget({ product: p, color: c })}
        />
      );
    }
    if (route.view === "list") {
      return (
        <ListingView
          navigate={navigate}
          category={route.category}
          onSelectProduct={(p) => navigate(`/outlet-gafas/producto/${p.id}`)}
        />
      );
    }
    return <HomeView navigate={navigate} />;
  };

  return (
    <div style={{
      background: "#fff", minHeight: "100vh",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      color: "#111",
    }}>
      <div style={{
        background: "#0a0a0a", color: "#fafafa", textAlign: "center",
        padding: "9px 16px", fontSize: 11, letterSpacing: 1.4, fontWeight: 500,
      }}>
        ENVÍO GRATIS · PAGO CONTRA REEMBOLSO · DEVOLUCIÓN EN 30 DÍAS
      </div>

      <header style={{
        background: "#ffffff",
        borderBottom: "1px solid #ececec",
        padding: "20px 48px",
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "saturate(180%) blur(8px)",
      }}>
        <nav style={{ display: "flex", gap: 26, fontSize: 13, fontWeight: 500, color: "#111" }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate("/outlet-gafas"); }}
            style={{ color: "#111", textDecoration: "none", letterSpacing: 0.3 }}
          >
            Inicio
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate("/outlet-gafas/mas-vendidas"); }}
            style={{ color: "#111", textDecoration: "none", letterSpacing: 0.3 }}
          >
            Más vendidas
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate("/outlet-gafas/categoria/deportivo"); }}
            style={{ color: "#111", textDecoration: "none", letterSpacing: 0.3 }}
          >
            Deportivo
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate("/outlet-gafas/categoria/casual"); }}
            style={{ color: "#111", textDecoration: "none", letterSpacing: 0.3 }}
          >
            Casual
          </a>
        </nav>

        <div
          onClick={() => navigate("/outlet-gafas")}
          style={{
            fontWeight: 800, fontSize: 18, letterSpacing: 4,
            color: "#0a0a0a", cursor: "pointer",
            textAlign: "center", userSelect: "none",
          }}
        >
          OUTLET&nbsp;GAFAS
        </div>

        <div style={{ display: "flex", gap: 20, color: "#111", justifySelf: "end", alignItems: "center" }}>
          <button aria-label="Buscar" style={{ background: "none", border: 0, padding: 6, cursor: "pointer", color: "#111", display: "flex" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </button>
          <button aria-label="Mi cuenta" style={{ background: "none", border: 0, padding: 6, cursor: "pointer", color: "#111", display: "flex" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
          </button>
          <button aria-label="Pedidos" style={{ background: "none", border: 0, padding: 6, cursor: "pointer", color: "#111", display: "flex", position: "relative" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14l-1.2 12.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
            <span style={{ position: "absolute", top: 2, right: 0, background: "#0a0a0a", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 999, padding: "1px 5px", lineHeight: 1.2 }}>0</span>
          </button>
        </div>
      </header>

      {renderView()}

      <footer style={{
        borderTop: "1px solid #ececec",
        padding: "32px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
        fontSize: 12, color: "#737373",
      }}>
        <div>© 2026 Outlet Gafas · Envíos a toda España</div>
        <div style={{ display: "flex", gap: 22 }}>
          <a href="#" style={{ color: "#737373", textDecoration: "none" }}>Atención al cliente</a>
          <a href="#" style={{ color: "#737373", textDecoration: "none" }}>Cambios</a>
          <a href="#" style={{ color: "#737373", textDecoration: "none" }}>Envío</a>
          <a href="#" style={{ color: "#737373", textDecoration: "none" }}>Política de privacidad</a>
        </div>
      </footer>

      {orderTarget && (
        <OrderModal
          product={orderTarget.product}
          color={orderTarget.color}
          qty={orderTarget.qty}
          onClose={() => setOrderTarget(null)}
        />
      )}

      {tryOnTarget && (
        <TryOnModal
          product={tryOnTarget.product}
          color={tryOnTarget.color}
          onClose={() => setTryOnTarget(null)}
        />
      )}
    </div>
  );
}
