// Fogata landing page interactions

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav ---------- */

  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');

  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }
  });

  /* ---------- Hero embers ---------- */

  var embers = document.querySelector('.embers');
  var narrow = window.matchMedia('(max-width: 760px)').matches;

  if (embers && !reducedMotion) {
    var count = narrow ? 8 : 16;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      var size = 2 + Math.random() * 4;
      s.style.left = (Math.random() * 100) + '%';
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.background = Math.random() > 0.5 ? '#ff5a1f' : '#ffab40';
      s.style.setProperty('--dur', (7 + Math.random() * 9) + 's');
      s.style.setProperty('--wait', (Math.random() * 12) + 's');
      frag.appendChild(s);
    }
    embers.appendChild(frag);
  }

  /* ---------- Momentum counters ---------- */

  var stats = Array.prototype.slice.call(document.querySelectorAll('.stat-num[data-count]'));
  var momentum = document.getElementById('momentum');
  var fmt = function (n) { return n.toLocaleString('en-US'); };

  function setFinal() {
    stats.forEach(function (el) { el.textContent = fmt(parseInt(el.dataset.count, 10)); });
  }

  function animateCounters() {
    var dur = 2200;
    var t0 = performance.now();
    function tick(t) {
      var p = Math.min(1, (t - t0) / dur);
      var ease = 1 - Math.pow(1 - p, 3);
      stats.forEach(function (el) {
        el.textContent = fmt(Math.round(parseInt(el.dataset.count, 10) * ease));
      });
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (momentum && stats.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      setFinal();
    } else {
      var started = false;
      var io = new IntersectionObserver(function (entries) {
        if (!started && entries.some(function (e) { return e.isIntersecting; })) {
          started = true;
          animateCounters();
          io.disconnect();
        }
      }, { threshold: 0.3 });
      io.observe(momentum);
    }
  }

  /* ---------- Subscribe form (no backend yet) ---------- */

  var form = document.querySelector('.subscribe');
  var msg = document.querySelector('.subscribe-msg');

  if (form && msg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (!input.value || !input.checkValidity()) {
        msg.textContent = 'Please enter a valid email address.';
        msg.style.color = '#ff8a1f';
        input.focus();
        return;
      }
      // TODO: wire to a real mailing-list endpoint before launch
      msg.textContent = 'You’re in ✓';
      msg.style.color = '';
      form.querySelector('button').disabled = true;
      input.disabled = true;
    });
  }

  /* ---------- Scroll reveal ---------- */

  if (!reducedMotion && 'IntersectionObserver' in window) {
    var singles = ['.section-head', '.container.narrow', '.gap-tagline', '.timeline', '.footer-cta'];
    var groups = ['.gap-grid', '.door-grid', '.stat-grid', '.covenant-grid', '.chip-row', '.faq-list'];

    // Activate the hidden state only now — if any module above threw, the page
    // stays fully visible instead of stuck at opacity 0.
    document.documentElement.classList.add('js');

    singles.forEach(function (sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
        el.classList.add('reveal');
      });
    });

    groups.forEach(function (sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (grp) {
        Array.prototype.forEach.call(grp.children, function (child, i) {
          child.classList.add('reveal');
          child.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
        });
      });
    });

    var reveal = function (el) { el.classList.add('in'); };

    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
      revealIO.observe(el);
    });

    // Backstop: if IO's first callback is ever missed, reveal whatever is
    // already within the viewport once the page has fully loaded.
    window.addEventListener('load', function () {
      requestAnimationFrame(function () {
        Array.prototype.forEach.call(document.querySelectorAll('.reveal:not(.in)'), function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) {
            reveal(el);
            revealIO.unobserve(el);
          }
        });
      });
    });
  }
})();
