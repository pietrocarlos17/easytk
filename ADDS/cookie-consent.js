(function () {
  if (localStorage.getItem('adds_cookie_consent')) return;

  const style = document.createElement('style');
  style.textContent = `
    #cookie-banner {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: #fff; border-top: 1px solid #e0e0e0;
      padding: 16px 20px; z-index: 9999;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      animation: slideUp .3s ease;
    }
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
    #cookie-banner p {
      font-size: 12px; color: #444; line-height: 1.5;
      margin-bottom: 12px;
    }
    #cookie-banner p a {
      color: #000; text-decoration: underline;
    }
    #cookie-banner-btns {
      display: flex; gap: 8px; flex-wrap: wrap;
    }
    .cb-btn {
      flex: 1; min-width: 120px;
      padding: 11px 14px;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.8px; text-transform: uppercase;
      border: none; cursor: pointer;
      font-family: inherit; white-space: nowrap;
    }
    .cb-accept { background: #000; color: #fff; }
    .cb-reject { background: #fff; color: #000; border: 1px solid #ccc; }
    .cb-accept:hover { background: #222; }
    .cb-reject:hover { background: #f5f5f5; }
  `;
  document.head.appendChild(style);

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML = `
    <p>We use cookies to improve your experience, analyse site traffic and serve personalised content. Read our <a href="#">Cookie Policy</a> and <a href="#">Privacy Policy</a>.</p>
    <div id="cookie-banner-btns">
      <button class="cb-btn cb-accept" id="cb-accept">Accept All Cookies</button>
      <button class="cb-btn cb-reject" id="cb-reject">Reject Non-Essential</button>
    </div>
  `;
  document.body.appendChild(banner);

  function dismiss(choice) {
    localStorage.setItem('adds_cookie_consent', choice);
    banner.style.transition = 'transform .25s ease, opacity .25s ease';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => banner.remove(), 280);
  }

  document.getElementById('cb-accept').addEventListener('click', () => dismiss('accepted'));
  document.getElementById('cb-reject').addEventListener('click', () => dismiss('rejected'));
})();
