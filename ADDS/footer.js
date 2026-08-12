(function () {

  /* ── MODALS CONTENT ── */
  const modals = {
    'cookie-settings': {
      title: 'Cookie Settings',
      body: `
        <p style="font-size:13px;color:#444;line-height:1.6;margin-bottom:20px;">Manage your cookie preferences. Essential cookies are always active as they are required for the site to function properly.</p>
        <div class="fp-toggle-row">
          <div>
            <p class="fp-toggle-label">Essential Cookies</p>
            <p class="fp-toggle-sub">Required for login, cart and checkout. Cannot be disabled.</p>
          </div>
          <div class="fp-toggle fp-toggle-on fp-toggle-locked">ON</div>
        </div>
        <div class="fp-toggle-row">
          <div>
            <p class="fp-toggle-label">Analytics Cookies</p>
            <p class="fp-toggle-sub">Help us understand how visitors interact with the site.</p>
          </div>
          <button class="fp-toggle" onclick="this.classList.toggle('fp-toggle-on');this.textContent=this.classList.contains('fp-toggle-on')?'ON':'OFF'">OFF</button>
        </div>
        <div class="fp-toggle-row">
          <div>
            <p class="fp-toggle-label">Marketing Cookies</p>
            <p class="fp-toggle-sub">Used to personalise ads and measure their effectiveness.</p>
          </div>
          <button class="fp-toggle" onclick="this.classList.toggle('fp-toggle-on');this.textContent=this.classList.contains('fp-toggle-on')?'ON':'OFF'">OFF</button>
        </div>
        <button class="fp-btn-primary" onclick="closeFooterModal()">Save Preferences</button>
      `
    },
    'personal-data': {
      title: 'Personal Data Requests',
      body: `
        <p style="font-size:13px;color:#444;line-height:1.6;margin-bottom:20px;">Under the UK GDPR and Data Protection Act 2018, you have the right to access, correct or delete your personal data. Submit a request below and we will respond within 30 days.</p>
        <div class="fp-option-list">
          <label class="fp-option"><input type="radio" name="dsr" value="access"> <span>Access my personal data</span></label>
          <label class="fp-option"><input type="radio" name="dsr" value="delete"> <span>Delete my personal data</span></label>
          <label class="fp-option"><input type="radio" name="dsr" value="correct"> <span>Correct my personal data</span></label>
          <label class="fp-option"><input type="radio" name="dsr" value="portability"> <span>Data portability request</span></label>
        </div>
        <input class="fp-input" type="email" placeholder="Your email address" style="margin-top:14px;" />
        <button class="fp-btn-primary" onclick="closeFooterModal()">Submit Request</button>
        <p style="font-size:11px;color:#999;margin-top:10px;">Or contact us at <strong>privacy@adidas.com</strong></p>
      `
    },
    'terms': {
      title: 'Terms & Conditions',
      body: `
        <div class="fp-text-block">
          <h3>1. General</h3>
          <p>By accessing or purchasing from this site, you agree to these Terms & Conditions. These terms apply to all users of the site.</p>
          <h3>2. Orders & Payment</h3>
          <p>All orders are subject to availability. We reserve the right to cancel any order at any time. Payment is taken at the point of order.</p>
          <h3>3. Delivery</h3>
          <p>Standard UK delivery is free on all new collection orders. Estimated delivery times are 3–5 working days. We are not responsible for delays caused by third-party couriers.</p>
          <h3>4. Returns</h3>
          <p>You may return unworn items in original packaging within 30 days of receipt. Items must be in resaleable condition. Return postage costs are covered by the customer unless the item is faulty.</p>
          <h3>5. Intellectual Property</h3>
          <p>All content on this site, including images, logos and text, is the property of Adidas and may not be reproduced without written permission.</p>
          <h3>6. Governing Law</h3>
          <p>These terms are governed by the laws of England and Wales.</p>
        </div>
      `
    },
    'nav-terms': {
      title: 'Navigation Terms',
      body: `
        <div class="fp-text-block">
          <h3>Use of this Website</h3>
          <p>This website is intended for personal, non-commercial use. You agree not to use this site for any unlawful purpose or in a way that could damage, disable or impair the site.</p>
          <h3>Accuracy of Information</h3>
          <p>We make every effort to ensure product information, pricing and availability are accurate. However, errors may occur. We reserve the right to correct any errors and cancel orders placed based on incorrect information.</p>
          <h3>Links to Third Parties</h3>
          <p>This site may contain links to third-party websites. We are not responsible for the content or privacy practices of those sites.</p>
          <h3>Changes to the Site</h3>
          <p>We reserve the right to modify or discontinue any part of this website at any time without notice.</p>
        </div>
      `
    },
    'privacy': {
      title: 'Privacy Policy',
      body: `
        <div class="fp-text-block">
          <h3>What We Collect</h3>
          <p>We collect information you provide directly (name, email, address, payment details) and data collected automatically (IP address, browser type, pages visited).</p>
          <h3>How We Use It</h3>
          <p>Your data is used to process orders, personalise your experience, send marketing communications (with your consent), and improve our services.</p>
          <h3>Data Sharing</h3>
          <p>We do not sell your personal data. We may share it with trusted service providers (e.g. payment processors, delivery partners) strictly to fulfil your order.</p>
          <h3>Your Rights</h3>
          <p>You have the right to access, correct, delete or restrict processing of your personal data at any time. See our Personal Data Requests section.</p>
          <h3>Cookies</h3>
          <p>We use cookies to improve functionality and analyse traffic. You can manage your cookie preferences at any time via Cookie Settings.</p>
          <h3>Contact</h3>
          <p>For privacy queries, contact <strong>privacy@adidas.com</strong></p>
        </div>
      `
    }
  };

  /* ── CSS ── */
  const css = `
    /* footer */
    .site-footer { border-top: 1px solid #e8e8e8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .site-footer-social {
      padding: 20px 16px;
      display: flex; gap: 20px; align-items: center; justify-content: center;
      border-bottom: 1px solid #e8e8e8;
    }
    .site-footer-social a { color: #000; text-decoration: none; display: flex; align-items: center; }
    .site-footer-social svg { width: 20px; height: 20px; fill: currentColor; }
    .site-footer-bottom { padding: 16px 16px 24px; text-align: center; }
    .site-footer-legal { display: flex; flex-wrap: wrap; gap: 0 16px; margin-bottom: 12px; justify-content: center; }
    .site-footer-legal button {
      color: #767677; font-size: 11px; line-height: 2.2;
      background: none; border: none; cursor: pointer;
      font-family: inherit; padding: 0; text-decoration: none;
    }
    .site-footer-legal button:hover { color: #000; text-decoration: underline; }
    .site-footer-copy { font-size: 11px; color: #767677; line-height: 1.6; }

    /* modal overlay */
    .fp-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,.45); z-index: 8000;
      align-items: center; justify-content: center;
      padding: 16px;
    }
    .fp-overlay.open { display: flex; }
    .fp-modal {
      background: #fff; width: 100%; max-width: 420px;
      max-height: 82vh; overflow-y: auto;
      padding: 24px 20px 28px;
      position: relative;
      animation: fpFadeUp .22s ease;
    }
    @keyframes fpFadeUp {
      from { opacity:0; transform: translateY(16px); }
      to   { opacity:1; transform: translateY(0); }
    }
    .fp-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 18px; border-bottom: 1px solid #e8e8e8; padding-bottom: 14px;
    }
    .fp-modal-title { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
    .fp-modal-close {
      background: none; border: none; cursor: pointer;
      font-size: 20px; line-height: 1; color: #000; padding: 0;
    }

    /* toggles */
    .fp-toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 0; border-bottom: 1px solid #f0f0f0; gap: 12px;
    }
    .fp-toggle-label { font-size: 13px; font-weight: 700; margin-bottom: 3px; }
    .fp-toggle-sub { font-size: 11px; color: #767677; line-height: 1.4; }
    .fp-toggle {
      flex-shrink: 0; min-width: 44px; padding: 5px 10px;
      font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
      border: 1px solid #ccc; background: #fff; color: #767677;
      cursor: pointer; font-family: inherit;
    }
    .fp-toggle.fp-toggle-on { background: #000; color: #fff; border-color: #000; }
    .fp-toggle.fp-toggle-locked { opacity: 0.5; cursor: default; }

    /* options */
    .fp-option-list { display: flex; flex-direction: column; gap: 10px; }
    .fp-option { display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer; }
    .fp-option input { accent-color: #000; width: 16px; height: 16px; }

    /* input */
    .fp-input {
      width: 100%; border: 1px solid #ccc; padding: 11px 12px;
      font-size: 13px; font-family: inherit; outline: none;
      margin-top: 4px;
    }
    .fp-input:focus { border-color: #000; }

    /* text blocks */
    .fp-text-block { font-size: 13px; color: #333; line-height: 1.6; }
    .fp-text-block h3 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 6px; color: #000; }
    .fp-text-block h3:first-child { margin-top: 0; }
    .fp-text-block p { color: #555; margin-bottom: 4px; }

    /* primary button */
    .fp-btn-primary {
      display: block; width: 100%; margin-top: 20px;
      padding: 13px; background: #000; color: #fff;
      font-size: 12px; font-weight: 700; letter-spacing: 0.8px;
      text-transform: uppercase; border: none; cursor: pointer;
      font-family: inherit;
    }
    .fp-btn-primary:hover { background: #222; }
  `;

  /* ── HTML ── */
  const footerHTML = `
    <div class="site-footer-social">
      <a href="#" aria-label="Instagram">
        <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      </a>
      <a href="#" aria-label="TikTok">
        <svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
      </a>
      <a href="#" aria-label="X">
        <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L2.25 2.25h6.978l4.266 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
      </a>
      <a href="#" aria-label="YouTube">
        <svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      </a>
    </div>
    <div class="site-footer-bottom">
      <div class="site-footer-legal">
        <button onclick="openFooterModal('cookie-settings')">Cookie Settings</button>
        <button onclick="openFooterModal('personal-data')">Personal Data Requests</button>
        <button onclick="openFooterModal('terms')">Terms &amp; Conditions</button>
        <button onclick="openFooterModal('nav-terms')">Navigation Terms</button>
        <button onclick="openFooterModal('privacy')">Privacy Policy</button>
      </div>
      <p class="site-footer-copy">© 2025 Adidas. All rights reserved.</p>
    </div>

    <!-- MODAL -->
    <div class="fp-overlay" id="fp-overlay" onclick="if(event.target===this)closeFooterModal()">
      <div class="fp-modal" id="fp-modal">
        <div class="fp-modal-header">
          <span class="fp-modal-title" id="fp-modal-title"></span>
          <button class="fp-modal-close" onclick="closeFooterModal()" aria-label="Close">&#x2715;</button>
        </div>
        <div id="fp-modal-body"></div>
      </div>
    </div>
  `;

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    const footer = document.querySelector('footer');
    if (!footer) return;
    footer.className = (footer.className ? footer.className + ' ' : '') + 'site-footer';
    footer.innerHTML = footerHTML;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  });

  /* ── GLOBAL FUNCTIONS ── */
  window.openFooterModal = function (key) {
    const data = modals[key];
    if (!data) return;
    document.getElementById('fp-modal-title').textContent = data.title;
    document.getElementById('fp-modal-body').innerHTML = data.body;
    document.getElementById('fp-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeFooterModal = function () {
    document.getElementById('fp-overlay').classList.remove('open');
    document.body.style.overflow = '';
  };

})();
