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

      fetch('/api/submit', {
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
