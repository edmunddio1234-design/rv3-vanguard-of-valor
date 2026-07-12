/* RV3 — Rural Veterans Vanguard of Valor Foundation — minimal vanilla JS
   (Lighthouse ecosystem shared pattern)
   1) Accessible mobile nav toggle
   2) Form submission to /api/submit with graceful fallback */

(function () {
  // ---- Mobile nav ----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('primary-nav');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close menu when a link is chosen (mobile)
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Forms ----
  var forms = document.querySelectorAll('form[data-form]');
  forms.forEach(function (form) {
    var statusEl = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var payload = { form_type: form.getAttribute('data-form'), page: location.pathname, submitted_at: new Date().toISOString() };
      var fd = new FormData(form);
      fd.forEach(function (v, k) {
        if (payload[k] !== undefined) {
          payload[k] = [].concat(payload[k], v); // group repeated fields (checkboxes)
        } else { payload[k] = v; }
      });

      setStatus('', '');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.label = submitBtn.textContent; submitBtn.textContent = 'Sending…'; }

      fetch('https://lighthouse-rural-communities.vercel.app/api/submit', { // shared ecosystem CRM — feeds VI-PAR
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (r) { return r.ok ? r.json().catch(function(){return {};}) : Promise.reject(r.status); })
      .then(function () { onSuccess(); })
      .catch(function () { onFallback(payload); });
    });

    function onSuccess() {
      setStatus('ok', form.getAttribute('data-success') || 'Thank you. Your information was received and someone will follow up with you.');
      form.reset();
      restoreBtn();
    }

    // If the API isn't wired yet, don't lose the submission — open a prefilled email.
    function onFallback(payload) {
      var to = form.getAttribute('data-fallback-email') || 'give@rv3vanguardofvalor.org';
      var subject = encodeURIComponent('Website submission: ' + payload.form_type);
      var lines = Object.keys(payload).map(function (k) { return k + ': ' + payload[k]; });
      var body = encodeURIComponent(lines.join('\n'));
      setStatus('ok', 'Opening your email app to send this securely. If it does not open, email us at ' + to + '.');
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
      restoreBtn();
    }

    function setStatus(kind, msg) {
      if (!statusEl) return;
      statusEl.className = 'form-status' + (kind ? ' show ' + kind : '');
      statusEl.textContent = msg;
      if (kind) statusEl.setAttribute('role', kind === 'err' ? 'alert' : 'status');
    }
    function restoreBtn() {
      if (submitBtn && submitBtn.dataset.label) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label; }
    }
  });

  // ---- Footer year ----
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();

// ---- Click-to-zoom lightbox for [data-glb] images (ported from main-site memorial) ----
(function () {
  var els = document.querySelectorAll('[data-glb]');
  if (!els.length) return;
  var b = document.createElement('div'); b.id = 'glb'; b.setAttribute('aria-hidden', 'true');
  b.innerHTML = '<span class="glb-x" aria-label="Close">\u00d7</span><img alt="Enlarged image">';
  document.body.appendChild(b);
  var im = b.querySelector('img');
  els.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      im.src = a.getAttribute('data-img') || a.getAttribute('src');
      im.alt = a.getAttribute('data-alt') || a.getAttribute('alt') || 'Enlarged image';
      b.classList.add('open'); b.setAttribute('aria-hidden', 'false');
    });
    a.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); a.click(); } });
  });
  function close() { b.classList.remove('open'); b.setAttribute('aria-hidden', 'true'); im.src = ''; }
  b.addEventListener('click', function (e) { if (e.target === b || e.target.classList.contains('glb-x')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();

// === FX pack: scroll progress, header shadow, staggered reveals, stat count-up ===
(function () {
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scroll progress bar + header shadow
  var bar = document.createElement('div'); bar.id = 'fx-progress'; document.body.appendChild(bar);
  var hdr = document.querySelector('.site-header'), tick = false;
  function onScroll() {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      if (hdr) hdr.classList.toggle('fx-scrolled', h.scrollTop > 8);
      tick = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (rm || !('IntersectionObserver' in window)) return;

  // staggered reveal on scroll
  var els = document.querySelectorAll('.card, figure.media, .stat, .section h2, .flipbook-embed, .embed-16x9');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('fx-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el) {
    var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = (sibs % 6) * 70 + 'ms';
    el.classList.add('fx-reveal'); io.observe(el);
  });

  // count-up for stat numbers (keeps %, +, $, "vs", commas, decimals)
  var stats = document.querySelectorAll('.stat b');
  if (!stats.length) return;
  var so = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return; so.unobserve(en.target);
      var el = en.target, orig = el.textContent;
      var parts = orig.split(/(\d[\d,]*(?:\.\d+)?)/);
      if (parts.length < 2) return;
      var t0 = null, DUR = 1300;
      function fmt(n, sample) {
        var dec = (sample.split('.')[1] || '').length;
        var s = n.toFixed(dec);
        if (sample.indexOf(',') > -1) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return s;
      }
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / DUR, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = parts.map(function (seg, i) {
          if (i % 2 === 0) return seg;
          return fmt(parseFloat(seg.replace(/,/g, '')) * e, seg);
        }).join('');
        if (p < 1) requestAnimationFrame(step); else el.textContent = orig;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  stats.forEach(function (s) { so.observe(s); });
})();