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
const galleryDots = document.querySelectorAll('.gallery-dots .gd');
const gallerySources = Array.from(thumbs).map(t => t.dataset.src);
let galleryIndex = 0;

function showGalleryImage(i) {
  if (!gallerySources.length) return;
  galleryIndex = (i + gallerySources.length) % gallerySources.length;
  if (mainPhoto) mainPhoto.src = gallerySources[galleryIndex];
  thumbs.forEach((t, j) => t.classList.toggle('active', j === galleryIndex));
  galleryDots.forEach((d, j) => d.classList.toggle('active', j === galleryIndex));
}

thumbs.forEach((t, i) => t.addEventListener('click', () => showGalleryImage(i)));
galleryDots.forEach((d, i) => d.addEventListener('click', () => showGalleryImage(i)));

// Prev / next controls (thumb arrows + main-image next button)
document.querySelector('.thumb-up')?.addEventListener('click', () => showGalleryImage(galleryIndex - 1));
document.querySelector('.thumb-down')?.addEventListener('click', () => showGalleryImage(galleryIndex + 1));
document.querySelector('.gallery-next')?.addEventListener('click', () => showGalleryImage(galleryIndex + 1));

// Swipe support on the main image (mobile)
const mainImage = document.querySelector('.main-image');
if (mainImage) {
  let touchStartX = null;
  mainImage.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  mainImage.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) showGalleryImage(galleryIndex + (dx < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
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

// Newsletter signup
const nlEmail = document.getElementById('nlEmail');
const nlSignup = document.getElementById('nlSignup');
const nlSuccess = document.getElementById('nlSuccess');
if (nlEmail && nlSignup && nlSuccess) {
  let nlTimer;
  const submitNewsletter = () => {
    if (!nlEmail.checkValidity() || !nlEmail.value.trim()) {
      nlEmail.reportValidity();
      return;
    }
    nlEmail.value = '';
    nlSuccess.classList.add('show');
    clearTimeout(nlTimer);
    nlTimer = setTimeout(() => nlSuccess.classList.remove('show'), 3000);
  };
  nlSignup.addEventListener('click', submitNewsletter);
  nlEmail.addEventListener('keydown', e => { if (e.key === 'Enter') submitNewsletter(); });
}
