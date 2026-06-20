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

// ===== Contra entrega (COD) – formulário Google Forms =====
(function () {
  // ===== CONFIG: cole aqui os dados do seu Google Form =====
  // 1) Crie um Google Form com perguntas de Texto: Nombre, Teléfono, Departamento, Ciudad, Dirección, Cantidad
  // 2) "Enviar" > link > obtenha os IDs entry.XXXXX (via "obter link pré-preenchido")
  var GOOGLE_FORM_ID = 'PASTE_FORM_ID';   // ex.: 1FAIpQLSxxxxxxxxxxxxxxxx
  var FIELDS = {
    nombre:       'entry.1111111111',
    telefono:     'entry.2222222222',
    departamento: 'entry.3333333333',
    ciudad:       'entry.4444444444',
    direccion:    'entry.5555555555',
    cantidad:     'entry.6666666666'
  };
  var PRICE = 350000; // COP

  // CTA "Ordenar ahora" -> rola suave até o formulário
  document.querySelectorAll('.order-cta').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var el = document.getElementById('pedido');
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      var inp = document.querySelector('#codForm input'); if (inp) setTimeout(function(){ inp.focus(); }, 500);
    });
  });

  var form = document.getElementById('codForm');
  var success = document.getElementById('codSuccess');
  if (!form) return;

  function track(qty) {
    try { if (window.fbq) fbq('track', 'Lead', { content_name: 'Shark CryoGlow', value: PRICE * qty, currency: 'COP', num_items: qty }); } catch (e) {}
    try { if (window.ttq) ttq.track('SubmitForm', { content_name: 'Shark CryoGlow', value: PRICE * qty, currency: 'COP', quantity: qty }); } catch (e) {}
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // valida campos obrigatórios
    var required = form.querySelectorAll('[required]');
    for (var i = 0; i < required.length; i++) {
      if (!required[i].value.trim()) { required[i].focus(); required[i].style.borderColor = '#d6195e'; return; }
    }
    var data = {
      nombre: form.nombre.value, telefono: form.telefono.value,
      departamento: form.departamento.value, ciudad: form.ciudad.value,
      direccion: form.direccion.value, cantidad: form.cantidad.value
    };
    var qty = parseInt(data.cantidad, 10) || 1;

    // envia para o Google Form (se configurado) via iframe oculto, sem sair da página
    if (GOOGLE_FORM_ID && GOOGLE_FORM_ID !== 'PASTE_FORM_ID') {
      var params = new URLSearchParams();
      Object.keys(FIELDS).forEach(function (k) { if (FIELDS[k] && data[k] != null) params.append(FIELDS[k], data[k]); });
      var ifname = 'gfwin';
      var ifr = document.getElementById(ifname);
      if (!ifr) { ifr = document.createElement('iframe'); ifr.name = ifname; ifr.id = ifname; ifr.style.display = 'none'; document.body.appendChild(ifr); }
      var f2 = document.createElement('form');
      f2.action = 'https://docs.google.com/forms/d/e/' + GOOGLE_FORM_ID + '/formResponse';
      f2.method = 'POST'; f2.target = ifname; f2.style.display = 'none';
      params.forEach(function (v, k) { var inp = document.createElement('input'); inp.name = k; inp.value = v; f2.appendChild(inp); });
      document.body.appendChild(f2); f2.submit(); document.body.removeChild(f2);
    } else {
      console.warn('[COD] Google Form ainda não configurado (GOOGLE_FORM_ID/FIELDS). Pedido:', data);
    }

    track(qty);
    form.hidden = true;
    if (success) { success.hidden = false; success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });
})();
