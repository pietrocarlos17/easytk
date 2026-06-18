// Thumbnail selection
const thumbs = document.querySelectorAll('.thumb[data-img]');
const mainGradients = {
  1: 'linear-gradient(135deg,#8fae9f,#6e8f7f)',
  2: 'linear-gradient(135deg,#e8a0a0,#d46b6b)',
  3: 'linear-gradient(135deg,#c9a9e0,#9b6fc4)',
  4: 'linear-gradient(135deg,#e8b0d0,#d480b0)',
  5: 'linear-gradient(135deg,#d8e8f0,#a9d2ec)',
  6: 'linear-gradient(135deg,#c0c0c8,#8a8a92)',
  7: 'linear-gradient(135deg,#d8c0e0,#b48cc4)',
  8: 'linear-gradient(135deg,#e0d0c0,#c0a890)'
};
const mainPhoto = document.querySelector('.main-photo');
thumbs.forEach(t => t.addEventListener('click', () => {
  thumbs.forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  if (mainPhoto && t.dataset.src) mainPhoto.src = t.dataset.src;
}));

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

// Quantity stepper
const qtyValue = document.querySelector('.qty-value');
let qty = 1;
document.querySelector('.minus').addEventListener('click', () => {
  if (qty > 1) qty--;
  qtyValue.textContent = qty;
});
document.querySelector('.plus').addEventListener('click', () => {
  qty++;
  qtyValue.textContent = qty;
});

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

// View more reviews
const viewMoreBtn = document.getElementById('viewMoreBtn');
const moreReviews = document.getElementById('moreReviews');
if (viewMoreBtn && moreReviews) {
  viewMoreBtn.addEventListener('click', () => {
    const open = moreReviews.classList.toggle('open');
    viewMoreBtn.textContent = open ? 'View less' : 'View more reviews';
  });
}

// Star rating input (Review this Product)
document.querySelectorAll('.rate-stars button').forEach((btn, i, all) => {
  btn.addEventListener('click', () => {
    all.forEach((b, j) => b.textContent = j <= i ? '★' : '☆');
  });
});

// Add to cart feedback
document.querySelectorAll('.add-to-cart, .addon-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    setTimeout(() => { btn.textContent = original; }, 1500);
  });
});
