const Cart = {
  get() {
    return JSON.parse(localStorage.getItem('adds_cart') || '[]');
  },
  save(items) {
    localStorage.setItem('adds_cart', JSON.stringify(items));
    this.updateBadge();
    if (typeof CartDrawer !== 'undefined') CartDrawer.render();
  },
  count() {
    return this.get().reduce((sum, item) => sum + item.qty, 0);
  },
  add(item) {
    const items = this.get();
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push(Object.assign({}, item, { qty: 1 }));
    }
    this.save(items);
  },
  remove(id) {
    this.save(this.get().filter(i => i.id !== id));
  },
  setQty(id, qty) {
    if (qty <= 0) { this.remove(id); return; }
    const items = this.get();
    const item = items.find(i => i.id === id);
    if (item) { item.qty = qty; this.save(items); }
  },
  subtotal() {
    return this.get().reduce((sum, item) => sum + item.price * item.qty, 0);
  },
  updateBadge() {
    const count = this.count();
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

// ── CART DRAWER ──
const CartDrawer = {
  init() {
    if (document.getElementById('cart-drawer')) return;

    const style = document.createElement('style');
    style.textContent = `
      #cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:998;opacity:0;pointer-events:none;transition:opacity .3s}
      #cart-overlay.open{opacity:1;pointer-events:auto}
      #cart-drawer{position:fixed;top:0;right:0;bottom:0;width:min(420px,100vw);background:#fff;z-index:999;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s ease}
      #cart-drawer.open{transform:translateX(0)}
      .cd-header{display:flex;align-items:center;justify-content:space-between;padding:16px;border-bottom:1px solid #e8e8e8;flex-shrink:0}
      .cd-title{font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:.5px}
      .cd-close{background:none;border:none;cursor:pointer;padding:4px;font-size:20px;line-height:1;color:#000;display:flex;align-items:center}
      .cd-body{flex:1;overflow-y:auto}
      .cd-empty{padding:48px 16px;text-align:center}
      .cd-empty h2{font-size:15px;font-weight:700;margin-bottom:8px;text-transform:uppercase}
      .cd-empty p{font-size:13px;color:#767677;margin-bottom:24px}
      .cd-empty a{display:inline-block;background:#000;color:#fff;padding:14px 28px;font-size:13px;font-weight:700;text-transform:uppercase;text-decoration:none}
      .cd-items{padding:0 16px}
      .cd-item{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid #e8e8e8}
      .cd-item-img{flex:0 0 80px;width:80px;aspect-ratio:3/4;background:#f0f0f0;overflow:hidden}
      .cd-item-img img{width:100%;height:100%;object-fit:contain;display:block;background:#fff}
      .cd-item-info{flex:1;display:flex;flex-direction:column;gap:4px;min-width:0}
      .cd-item-name{font-size:12px;font-weight:700;text-transform:uppercase;line-height:1.3}
      .cd-item-meta{font-size:12px;color:#767677}
      .cd-item-price{font-size:13px;font-weight:700;margin-top:auto}
      .cd-item-actions{display:flex;align-items:center;justify-content:space-between;margin-top:8px}
      .cd-qty{display:flex;align-items:center;border:1px solid #e8e8e8}
      .cd-qty-btn{width:32px;height:32px;background:none;border:none;cursor:pointer;font-size:16px;font-weight:300;display:flex;align-items:center;justify-content:center}
      .cd-qty-num{width:28px;text-align:center;font-size:13px;font-weight:600}
      .cd-remove{font-size:11px;color:#767677;text-decoration:underline;background:none;border:none;cursor:pointer;font-family:inherit;text-underline-offset:2px}
      .cd-footer{border-top:1px solid #e8e8e8;padding:16px;flex-shrink:0}
      .cd-row{display:flex;justify-content:space-between;font-size:13px;margin-bottom:10px}
      .cd-row.total{font-weight:700;font-size:15px;margin-top:16px;padding-top:16px;border-top:1px solid #e8e8e8;margin-bottom:0}
      .cd-delivery{font-size:12px;color:#2a7a4b;font-weight:600}
      .cd-checkout{display:block;width:100%;padding:16px;background:#000;color:#fff;border:none;font-size:14px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;font-family:inherit;cursor:pointer;text-align:center;text-decoration:none;margin-top:16px}
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'cart-overlay';
    overlay.addEventListener('click', () => CartDrawer.close());
    document.body.appendChild(overlay);

    const drawer = document.createElement('div');
    drawer.id = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cd-header">
        <span class="cd-title">Your Bag (<span id="cd-count">0</span>)</span>
        <button class="cd-close" aria-label="Close" onclick="CartDrawer.close()">&#x2715;</button>
      </div>
      <div class="cd-body" id="cd-body"></div>
    `;
    document.body.appendChild(drawer);
  },

  fmt(n) { return '£' + n.toFixed(2); },

  render() {
    const body = document.getElementById('cd-body');
    const countEl = document.getElementById('cd-count');
    if (!body) return;

    const items = Cart.get();
    const total = items.reduce((s, i) => s + i.qty, 0);
    if (countEl) countEl.textContent = total;

    if (items.length === 0) {
      body.innerHTML = `
        <div class="cd-empty">
          <h2>Your bag is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <a href="collection.html" onclick="CartDrawer.close()">Shop Collections</a>
        </div>`;
      return;
    }

    const sub = Cart.subtotal();
    body.innerHTML = `
      <div class="cd-items">
        ${items.map(item => `
          <div class="cd-item">
            <div class="cd-item-img">${item.image ? `<img src="${item.image}" alt="${item.name}">` : `<div style="width:100%;height:100%;background:#111;"></div>`}</div>
            <div class="cd-item-info">
              <p class="cd-item-name">${item.name}</p>
              <p class="cd-item-meta">${item.colour} · Size ${item.size}</p>
              <div class="cd-item-actions">
                <div class="cd-qty">
                  <button class="cd-qty-btn" onclick="CartDrawer.changeQty('${item.id}',-1)">−</button>
                  <span class="cd-qty-num">${item.qty}</span>
                  <button class="cd-qty-btn" onclick="CartDrawer.changeQty('${item.id}',1)">+</button>
                </div>
                <button class="cd-remove" onclick="CartDrawer.removeItem('${item.id}')">Remove</button>
              </div>
              <p class="cd-item-price">${this.fmt(item.price * item.qty)}</p>
            </div>
          </div>`).join('')}
      </div>
      <div class="cd-footer">
        <div class="cd-row"><span>Subtotal</span><span>${this.fmt(sub)}</span></div>
        <div class="cd-row"><span>Delivery</span><span class="cd-delivery">Free</span></div>
        <div class="cd-row total"><span>Total</span><span>${this.fmt(sub)}</span></div>
        <a class="cd-checkout" href="#" onclick="CartDrawer.checkout(); return false;">Proceed to Checkout →</a>
      </div>`;
  },

  open() {
    this.render();
    document.getElementById('cart-overlay').classList.add('open');
    document.getElementById('cart-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    document.getElementById('cart-overlay').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
    document.body.style.overflow = '';
  },

  changeQty(id, delta) {
    const item = Cart.get().find(i => i.id === id);
    if (item) Cart.setQty(id, item.qty + delta);
    this.render();
  },

  removeItem(id) {
    Cart.remove(id);
    this.render();
  },

  checkout() {
    const items = Cart.get().filter(function(i) { return i.variantId; });
    if (!items.length) return;
    const parts = items.map(function(i) { return i.variantId + ':' + i.qty; });
    window.location.href = 'https://atonastore.com/cart/' + parts.join(',');
  }
};

document.addEventListener('DOMContentLoaded', function() {
  Cart.updateBadge();
  CartDrawer.init();
});
