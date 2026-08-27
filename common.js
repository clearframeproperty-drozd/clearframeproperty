(function () {
  const CFG = window.SITE_CONFIG || {};

  // ---- inject config values into elements marked data-cfg="KEY" ----
  document.querySelectorAll('[data-cfg]').forEach(el => {
    const key = el.getAttribute('data-cfg');
    if (CFG[key] !== undefined) el.textContent = CFG[key];
  });
  document.querySelectorAll('[data-cfg-href]').forEach(el => {
    const key = el.getAttribute('data-cfg-href');
    if (CFG[key] !== undefined) el.setAttribute('href', el.getAttribute('href-prefix') ? el.getAttribute('href-prefix') + CFG[key] : CFG[key]);
  });
  document.querySelectorAll('a[data-cfg-tel]').forEach(el => { el.href = 'tel:' + CFG.PHONE_TEL; });
  document.querySelectorAll('a[data-cfg-mail]').forEach(el => { el.href = 'mailto:' + CFG.EMAIL; });
  document.querySelectorAll('a[data-cfg-booking]').forEach(el => { if (CFG.BOOKING_LINK && CFG.BOOKING_LINK !== '[BOOKING_LINK]') el.href = CFG.BOOKING_LINK; });

  // ---- footer year ----
  document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

  // ---- mobile nav toggle ----
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // ---- animated stat counters: <b class="mono" data-count-to="1240">0</b> ----
  function animateCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
    const dur = 1300;
    const t0 = performance.now();
    function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(p * target).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---- scroll reveal + focus brackets + stat counters ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        entry.target.classList.add('in-focus');
        entry.target.querySelectorAll('[data-count-to]').forEach(animateCount);
        if (entry.target.hasAttribute('data-count-to')) animateCount(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .bracket-frame, .stats').forEach(el => io.observe(el));

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ---- Sample report slider ----
  const slider = document.querySelector('.report-slider');
  if (slider) {
    const track = slider.querySelector('.report-track');
    const pages = Array.from(slider.querySelectorAll('.report-page'));
    const prev = slider.querySelector('.report-nav.prev');
    const next = slider.querySelector('.report-nav.next');
    const dotsWrap = slider.querySelector('.report-dots');
    let idx = 0;

    pages.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
      dot.addEventListener('click', () => go(i));
      dotsWrap.appendChild(dot);
    });

    function go(i) {
      idx = (i + pages.length) % pages.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dotsWrap.querySelectorAll('button').forEach((d, di) => d.classList.toggle('active', di === idx));
    }
    prev.addEventListener('click', () => go(idx - 1));
    next.addEventListener('click', () => go(idx + 1));
    go(0);
  }

  // ---- Before/After compare slider(s): <div class="compare" data-compare> ----
  document.querySelectorAll('.compare').forEach(el => {
    const after = el.querySelector('.after-layer');
    const handle = el.querySelector('.handle');
    const range = el.querySelector('.compare-range');
    if (!after || !handle || !range) return;
    function set(val) {
      after.style.clipPath = `inset(0 0 0 ${val}%)`;
      handle.style.left = val + '%';
    }
    range.addEventListener('input', () => set(range.value));
    set(range.value);
  });

  // ---- Booking / contact form submission (Formspree + Telegram) ----
  document.querySelectorAll('form[data-submit-form]').forEach(form => {
    const statusEl = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.querySelector('.honeypot') && form.querySelector('.honeypot').value) return;

      const data = Object.fromEntries(new FormData(form).entries());
      if (submitBtn) submitBtn.disabled = true;
      if (statusEl) { statusEl.textContent = 'Sending…'; statusEl.className = 'form-status mono'; }

      const tasks = [];

      if (CFG.FORMSPREE_ENDPOINT && !CFG.FORMSPREE_ENDPOINT.includes('YOUR_FORMSPREE_ID')) {
        tasks.push(fetch(CFG.FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }));
      }

      if (CFG.TELEGRAM_BOT_TOKEN && !CFG.TELEGRAM_BOT_TOKEN.includes('YOUR_TELEGRAM_BOT_TOKEN')) {
        const lines = Object.entries(data).filter(([k]) => k !== 'company_website')
          .map(([k, v]) => `${k}: ${v || '-'}`).join('\n');
        const text = `New request (${form.dataset.formName || 'form'})\n` + lines;
        tasks.push(fetch(`https://api.telegram.org/bot${CFG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CFG.TELEGRAM_CHAT_ID, text })
        }));
      }

      if (tasks.length === 0) {
        if (statusEl) { statusEl.textContent = 'Form not connected yet — see README.md'; statusEl.className = 'form-status mono err'; }
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      try {
        await Promise.all(tasks);
        if (form.dataset.redirect) {
          window.location.href = form.dataset.redirect;
          return;
        }
        if (statusEl) { statusEl.textContent = 'Request sent — we\'ll be in touch shortly.'; statusEl.className = 'form-status mono ok'; }
        form.reset();
      } catch (err) {
        if (statusEl) { statusEl.textContent = 'Something went wrong. Please email us directly.'; statusEl.className = 'form-status mono err'; }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
})();
