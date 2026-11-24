(function () {
  'use strict';
  var cfg = window.SITE_CONFIG || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Anno dinamico ---------- */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Canonical / og:url da configurazione ---------- */
  if (cfg.domain && !$('link[rel="canonical"]')) {
    var l = document.createElement('link'); l.rel = 'canonical'; l.href = cfg.domain.replace(/\/$/, '') + '/';
    document.head.appendChild(l);
  }

  /* ---------- Dati legali nel footer (solo campi compilati) ---------- */
  var legal = cfg.legal || {};
  var labels = [
    ['ragioneSociale', ''], ['partitaIva', 'P.IVA '], ['codiceFiscale', 'C.F. '],
    ['direttoreSanitario', 'Direttore Sanitario: '], ['iscrizioneAlbo', ''],
    ['autorizzazioneSanitaria', 'Autorizzazione sanitaria: '], ['pec', 'PEC: ']
  ];
  var parts = labels.filter(function (p) { return legal[p[0]]; }).map(function (p) { return p[1] + legal[p[0]]; });
  var legalEl = $('#legal-info');
  if (legalEl && parts.length) { legalEl.textContent = parts.join(' · '); legalEl.hidden = false; }

  /* ---------- Header: separatore allo scroll ---------- */
  var header = $('#site-header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    if (window.scrollY < 120) $$('.main-nav ul a[aria-current]').forEach(function (a) { a.removeAttribute('aria-current'); });
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = $('#nav-toggle'), nav = $('#main-nav');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Chiudi il menu' : 'Apri il menu';
    nav.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

  /* ---------- Voce di menu attiva ---------- */
  var navLinks = $$('.main-nav ul a');
  if ('IntersectionObserver' in window) {
    var map = {}; navLinks.forEach(function (a) { map[a.getAttribute('href')] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = '#' + en.target.id;
        navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        if (map[id]) map[id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.map(function (a) { return a.getAttribute('href').slice(1); }).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Reveal ---------- */
  var reveals = $$('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Come funziona: linea che si disegna con lo scroll ---------- */
  var tl = $('#timeline');
  if (tl) {
    var steps = $$('.step', tl);
    if (reduce) {
      tl.style.setProperty('--p', '1');
      steps.forEach(function (s) { s.classList.add('is-active'); });
    } else {
      var head = document.createElement('span');
      head.className = 'tl-head'; head.setAttribute('aria-hidden', 'true'); tl.appendChild(head);
      var ticking = false;
      var update = function () {
        ticking = false;
        var r = tl.getBoundingClientRect(), vh = window.innerHeight;
        var p = (vh * 0.85 - r.top) / (r.height * 0.9 + vh * 0.3);
        p = Math.max(0, Math.min(1, p));
        tl.style.setProperty('--p', p.toFixed(4));
        tl.classList.toggle('is-moving', p > 0.01 && p < 0.99);
        var n = steps.length;
        steps.forEach(function (s, i) { s.classList.toggle('is-active', p >= Math.max(0.02, i / (n - 1) - 0.02)); });
      };
      var onTl = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
      window.addEventListener('scroll', onTl, { passive: true });
      window.addEventListener('resize', onTl);
      update();
    }
  }

  /* ---------- FAQ accordion ---------- */
  $$('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      item.classList.toggle('is-open', open);
    });
  });

  /* ---------- Mappa: caricata solo su richiesta (privacy) ---------- */
  var mapBtn = $('#map-load');
  if (mapBtn) mapBtn.addEventListener('click', function () {
    var wrap = $('#map-wrap');
    var f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Via Roma 111, 91025 Marsala TP, Italia') + '&output=embed';
    f.title = 'Mappa: Studio Dentistico Euripide, Via Roma 111, Marsala';
    f.referrerPolicy = 'no-referrer-when-downgrade'; f.setAttribute('allowfullscreen', '');
    wrap.innerHTML = ''; wrap.appendChild(f);
  });

  /* ---------- Modulo contatti ----------
     Invia solo se SITE_CONFIG.form.endpoint è configurato con un servizio reale.
     Nessun invio simulato: lo stato mostrato riflette la risposta del server;
     senza endpoint il modulo invita a telefonare. */
  var endpoint = cfg.form && cfg.form.endpoint;
  var form = $('#contact-form');
  if (!form) return;

  var status = $('#form-status'), submit = $('#f-submit');
  var rules = {
    'f-name': function (v) { return v.trim().length >= 3 ? '' : 'Inserisci nome e cognome.'; },
    'f-phone': function (v) { return /^[0-9+\s().\-]{6,30}$/.test(v.trim()) ? '' : 'Inserisci un numero di telefono valido.'; },
    'f-email': function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Inserisci un indirizzo email valido.'; },
    'f-privacy': function (v, el) { return el.checked ? '' : 'È necessario prendere visione dell\'informativa privacy.'; }
  };
  function check(id) {
    var el = document.getElementById(id), msg = rules[id](el.value, el), err = document.getElementById(id + '-err');
    el.setAttribute('aria-invalid', msg ? 'true' : 'false'); err.textContent = msg; return !msg;
  }
  Object.keys(rules).forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'blur', function () { if (el.getAttribute('aria-invalid') !== null || el.value) check(id); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status'; status.textContent = '';
    var ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok) { var first = $('[aria-invalid="true"]', form); if (first) first.focus(); return; }
    if ($('#f-web').value) return; // honeypot anti-spam
    if (!endpoint) {
      status.classList.add('is-error');
      status.innerHTML = 'L\'invio online non è ancora attivo. Per prenotare chiamaci al <a href="tel:+393273498199">327 3498199</a>.';
      return;
    }

    var data = {
      nome: $('#f-name').value.trim(), telefono: $('#f-phone').value.trim(), email: $('#f-email').value.trim(),
      servizio: $('#f-service').value, messaggio: $('#f-msg').value.trim(),
      privacy: 'Presa visione informativa privacy', _subject: 'Richiesta appuntamento dal sito'
    };
    submit.disabled = true; submit.textContent = 'Invio in corso…';
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); })
      .then(function () {
        form.reset(); $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
        status.classList.add('is-success');
        status.textContent = 'Grazie, la tua richiesta è stata inviata. Ti ricontatteremo al più presto.';
      })
      .catch(function () {
        status.classList.add('is-error');
        status.textContent = 'Non è stato possibile inviare la richiesta. Riprova oppure chiamaci al 327 3498199.';
      })
      .then(function () { submit.disabled = false; submit.textContent = 'Richiedi un appuntamento'; });
  });
})();
