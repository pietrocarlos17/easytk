// ===== Product gallery (thumbs + dots + swipe) =====
const thumbs = document.querySelectorAll('.thumb[data-img]');
const mainPhoto = document.querySelector('.main-photo');
const galDots = document.querySelectorAll('.gallery-dots .gd');
const galSources = Array.from(thumbs).map(t => t.dataset.src);
let galIdx = 0;

function setGallery(i) {
  if (!galSources.length) return;
  galIdx = (i + galSources.length) % galSources.length;
  if (mainPhoto && galSources[galIdx]) mainPhoto.src = galSources[galIdx];
  thumbs.forEach((t, k) => t.classList.toggle('active', k === galIdx));
  galDots.forEach((d, k) => d.classList.toggle('active', k === galIdx));
}

thumbs.forEach((t, i) => t.addEventListener('click', () => setGallery(i)));
galDots.forEach((d, i) => d.addEventListener('click', () => setGallery(i)));

const galNext = document.querySelector('.gallery-next');
if (galNext) galNext.addEventListener('click', () => setGallery(galIdx + 1));
const galPrev = document.querySelector('.gallery-prev');
if (galPrev) galPrev.addEventListener('click', () => setGallery(galIdx - 1));
const thumbUp = document.querySelector('.thumb-up');
const thumbDown = document.querySelector('.thumb-down');
if (thumbUp) thumbUp.addEventListener('click', () => setGallery(galIdx - 1));
if (thumbDown) thumbDown.addEventListener('click', () => setGallery(galIdx + 1));

// swipe (touch) + drag (mouse) on the main image to change photo
const mainImage = document.querySelector('.main-image');
if (mainImage) {
  let startX = null, active = false;
  const begin = x => { startX = x; active = true; };
  const finish = x => {
    if (!active || startX === null) return;
    const dx = x - startX;
    if (Math.abs(dx) > 40) setGallery(galIdx + (dx < 0 ? 1 : -1));
    active = false; startX = null;
  };
  mainImage.addEventListener('touchstart', e => begin(e.changedTouches[0].clientX), { passive: true });
  mainImage.addEventListener('touchend', e => finish(e.changedTouches[0].clientX), { passive: true });
  mainImage.addEventListener('mousedown', e => { e.preventDefault(); begin(e.clientX); });
  window.addEventListener('mouseup', e => finish(e.clientX));
}

// Read more
const desc = document.querySelector('.description');
const readMore = document.querySelector('.read-more');
readMore.addEventListener('click', () => {
  desc.classList.toggle('open');
  readMore.textContent = desc.classList.contains('open') ? 'Read less' : 'Read more';
});

// Color swatches
const swatches = document.querySelectorAll('.swatch');
const colorNames = ['Blue', 'Frosted Green', 'Cream', 'Purple', 'Nude', 'Pink'];
const colorLabel = document.querySelector('.color-label span');
swatches.forEach((s, i) => s.addEventListener('click', () => {
  swatches.forEach(x => x.classList.remove('active'));
  s.classList.add('active');
  colorLabel.textContent = colorNames[i];
}));


// Accordions
document.querySelectorAll('.accordion').forEach(acc => {
  acc.querySelector('.acc-head').addEventListener('click', () => {
    acc.classList.toggle('open');
  });
});

// Tabs act as scroll anchors (both sections stay visible)
const tabs = document.querySelectorAll('.tab');
const tabsBar = document.querySelector('.tabs');
const tabTargets = {
  highlights: document.querySelector('.results'),
  reviews: document.querySelector('.reviews')
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tabTargets[tab.dataset.panel];
    if (!target) return;
    const offset = tabsBar.offsetHeight + 10;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// Highlight the active tab based on scroll position
function updateActiveTab() {
  const marker = window.scrollY + tabsBar.offsetHeight + 60;
  const reviewsTop = tabTargets.reviews.getBoundingClientRect().top + window.scrollY;
  const active = marker >= reviewsTop ? 'reviews' : 'highlights';
  tabs.forEach(t => t.classList.toggle('active', t.dataset.panel === active));
}
window.addEventListener('scroll', updateActiveTab, { passive: true });
updateActiveTab();

// Review photo lightbox
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = document.getElementById('lbImg');
  const lbClose = lightbox.querySelector('.lb-close');
  const lbPrev = lightbox.querySelector('.lb-prev');
  const lbNext = lightbox.querySelector('.lb-next');
  let group = [];
  let idx = 0;

  function show(i) {
    idx = (i + group.length) % group.length;
    lbImg.src = group[idx];
  }
  function openLightbox(imgEl) {
    const row = imgEl.closest('.review-images');
    group = Array.from(row.querySelectorAll('img.rp')).map(im => im.getAttribute('src'));
    idx = group.indexOf(imgEl.getAttribute('src'));
    lbImg.src = group[idx];
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.review-images img.rp').forEach(im => {
    im.addEventListener('click', () => openLightbox(im));
  });
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => show(idx - 1));
  lbNext.addEventListener('click', () => show(idx + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
}

// Trending carousel arrows
(function () {
  const row = document.querySelector('.ugc-row');
  const prev = document.querySelector('.ugc-prev');
  const next = document.querySelector('.ugc-next');
  if (!row || !prev || !next) return;
  function step() {
    const card = row.querySelector('.ugc-card');
    const gap = 16;
    return card ? card.getBoundingClientRect().width + gap : row.clientWidth * 0.8;
  }
  function update() {
    prev.disabled = row.scrollLeft <= 4;
    next.disabled = row.scrollLeft >= row.scrollWidth - row.clientWidth - 4;
  }
  prev.addEventListener('click', () => row.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
  next.addEventListener('click', () => row.scrollBy({ left: step() * 2, behavior: 'smooth' }));
  row.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ===== Reviews: incremental view-more + search/filters =====
(function () {
  const viewMoreBtn = document.getElementById('viewMoreBtn');
  const moreReviews = document.getElementById('moreReviews');
  const searchInput = document.querySelector('.search-box input');
  const reviewItems = Array.from(document.querySelectorAll('.review-item'));
  const noResults = document.querySelector('.no-results');
  const dds = document.querySelectorAll('.filter-dd');
  if (!reviewItems.length) return;

  // container always rendered; individual extra items are toggled one at a time
  if (moreReviews) moreReviews.classList.add('open');
  const extra = moreReviews ? Array.from(moreReviews.querySelectorAll('.review-item')) : [];
  const state = { q: '', rating: 'all', locale: 'all' };
  let revealed = 0;

  function filtersActive() {
    return state.q !== '' || state.rating !== 'all' || state.locale !== 'all';
  }
  function matches(it) {
    const text = it.textContent.toLowerCase();
    const r = it.dataset.rating;
    const loc = it.dataset.locale || 'en_US';
    return (state.q === '' || text.includes(state.q)) &&
      (state.rating === 'all' || r === state.rating) &&
      (state.locale === 'all' || loc === state.locale);
  }
  function render() {
    if (filtersActive()) {
      let shown = 0;
      reviewItems.forEach(it => { const m = matches(it); it.style.display = m ? '' : 'none'; if (m) shown++; });
      if (viewMoreBtn) viewMoreBtn.style.display = 'none';
      if (noResults) noResults.style.display = shown === 0 ? 'block' : 'none';
    } else {
      reviewItems.forEach(it => { if (!extra.includes(it)) it.style.display = ''; });
      extra.forEach((it, i) => { it.style.display = i < revealed ? '' : 'none'; });
      if (noResults) noResults.style.display = 'none';
      if (viewMoreBtn) {
        viewMoreBtn.style.display = extra.length ? '' : 'none';
        viewMoreBtn.textContent = revealed >= extra.length ? 'Hide reviews' : 'View more reviews';
      }
    }
  }

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
      if (revealed >= extra.length) {
        // all shown -> collapse back to the initial state
        revealed = 0;
        render();
        const list = document.querySelector('.review-list');
        if (list) window.scrollTo({ top: list.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
      } else {
        revealed++;
        render();
      }
    });
  }

  function applyFilters() { render(); }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.q = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

  dds.forEach(dd => {
    const toggle = dd.querySelector('.dropdown');
    const label = dd.querySelector('.dd-label');
    const baseLabel = label.textContent;
    const key = dd.dataset.filter; // 'rating' | 'locale'

    toggle.addEventListener('click', e => {
      e.stopPropagation();
      dds.forEach(o => { if (o !== dd) o.classList.remove('open'); });
      dd.classList.toggle('open');
    });

    dd.querySelectorAll('.dd-menu li').forEach(li => {
      li.addEventListener('click', () => {
        dd.querySelectorAll('.dd-menu li').forEach(x => x.classList.remove('active'));
        li.classList.add('active');
        state[key] = li.dataset.value;
        label.textContent = li.dataset.value === 'all' ? baseLabel : li.textContent;
        dd.classList.remove('open');
        applyFilters();
      });
    });
  });

  document.addEventListener('click', () => dds.forEach(o => o.classList.remove('open')));

  render();
})();

// Star rating input (Review this Product)
document.querySelectorAll('.rate-stars button').forEach((btn, i, all) => {
  btn.addEventListener('click', () => {
    all.forEach((b, j) => b.textContent = j <= i ? '★' : '☆');
  });
});

// ===== Hamburger menu =====
(function () {
  const drawer = document.getElementById('menuDrawer');
  const overlay = document.getElementById('menuOverlay');
  const toggle = document.querySelector('.hi-menu');
  const closeBtn = document.getElementById('menuClose');
  if (!drawer || !toggle) return;

  function open() { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); overlay.hidden = false; document.body.style.overflow = 'hidden'; }
  function close() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); overlay.hidden = true; document.body.style.overflow = ''; }

  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); });

  drawer.querySelectorAll('.menu-nav a').forEach(a => {
    a.addEventListener('click', e => {
      const target = a.dataset.scroll;
      if (target) {
        e.preventDefault();
        let el = null;
        if (target === 'top') el = document.body;
        else if (target === 'highlights') el = document.querySelector('.results');
        else if (target === 'reviews') el = document.querySelector('.reviews');
        if (el) {
          const y = target === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
      close();
    });
  });
})();

// ===== Cart =====
(function () {
  const PRODUCT = {
    name: 'Shark CryoGlow™ LED Face Mask',
    price: 79,
    old: 250,
    img: 'images/gallery/g1.jpg'
  };
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const subtotalEl = document.getElementById('cartSubtotal');
  const countEls = document.querySelectorAll('.cart-count');
  const cartBtn = document.querySelector('.hi-cart');
  const closeBtn = document.getElementById('cartClose');
  if (!drawer) return;

  let qty = 0;
  const money = n => '£' + n.toFixed(2);

  function render() {
    countEls.forEach(c => c.textContent = qty);
    if (qty === 0) {
      body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML =
      '<div class="cart-item">' +
        '<img src="' + PRODUCT.img + '" alt="" />' +
        '<div class="cart-item-info">' +
          '<p class="cart-item-name">' + PRODUCT.name + '</p>' +
          '<p class="cart-item-price"><s>' + money(PRODUCT.old) + '</s> ' + money(PRODUCT.price) + '</p>' +
          '<span class="cart-qty"><button data-act="dec" aria-label="Decrease">−</button><span>' + qty + '</span><button data-act="inc" aria-label="Increase">+</button></span>' +
        '</div>' +
        '<button class="cart-item-remove" data-act="remove">Remove</button>' +
      '</div>';
    subtotalEl.textContent = money(PRODUCT.price * qty);
  }

  function open() { render(); drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); overlay.hidden = false; document.body.style.overflow = 'hidden'; }
  function close() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); overlay.hidden = true; document.body.style.overflow = ''; }

  function trackAddToCart() {
    try { if (window.fbq) fbq('track', 'AddToCart', { content_name: PRODUCT.name, content_type: 'product', value: PRODUCT.price, currency: 'GBP' }); } catch (e) {}
    try { if (window.ttq) ttq.track('AddToCart', { content_name: PRODUCT.name, content_type: 'product', value: PRODUCT.price, currency: 'GBP' }); } catch (e) {}
  }
  document.querySelectorAll('.add-to-cart:not(.cart-checkout)').forEach(btn => {
    btn.addEventListener('click', () => { qty++; open(); trackAddToCart(); });
  });
  if (cartBtn) cartBtn.addEventListener('click', () => { open(); });
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); });

  body.addEventListener('click', e => {
    const act = e.target.dataset.act;
    if (!act) return;
    if (act === 'inc') qty++;
    else if (act === 'dec') qty = Math.max(0, qty - 1);
    else if (act === 'remove') qty = 0;
    render();
  });

  // ===== Ciclo de checkout entre lojas (London time) =====
  // Hoje (sáb 2026-06-20) → atonastore. A partir de domingo 2026-06-21 00:00 London:
  // alterna a cada 2h. Slots: 00-02 atona, 02-04 vellast, 04-06 atona, ...
  function pickCheckoutUrl(q) {
    var ATONA   = 'https://atonastore.com/cart/59928823464270:'   + q;
    var VELLAST = 'https://vellastbeauty.com/cart/53277410984233:' + q;
    // Pré-ciclo: até domingo 21/06/2026 00:00 London (BST = UTC+1) = 20/06 23:00 UTC
    var cycleStart = Date.UTC(2026, 5, 20, 23, 0, 0);
    if (Date.now() < cycleStart) return ATONA;
    // Hora atual em London
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London', hour: '2-digit', hour12: false
    }).formatToParts(new Date());
    var hour = 0;
    for (var i = 0; i < parts.length; i++) if (parts[i].type === 'hour') { hour = parseInt(parts[i].value, 10); break; }
    if (hour === 24) hour = 0;
    var slot = Math.floor(hour / 2); // 0..11 ao longo do dia
    return (slot % 2 === 0) ? ATONA : VELLAST;
  }

  const checkout = document.querySelector('.cart-checkout');
  if (checkout) checkout.addEventListener('click', () => {
    const q = Math.max(1, qty);
    try { if (window.fbq) fbq('track', 'InitiateCheckout', { content_name: PRODUCT.name, value: PRODUCT.price * q, currency: 'GBP', num_items: q }); } catch (e) {}
    try { if (window.ttq) ttq.track('InitiateCheckout', { content_name: PRODUCT.name, value: PRODUCT.price * q, currency: 'GBP', quantity: q }); } catch (e) {}
    window.location.href = pickCheckoutUrl(q);
  });

  render();
})();
