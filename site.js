/* ═══════════════════════════════════════════════
   TheeSingular — site.js  (shared across all pages)
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Sticky nav shadow ── */
  var nav = document.getElementById('ts-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ── Mobile menu toggle ── */
  var burger = document.getElementById('ts-burger');
  var mobileNav = document.getElementById('ts-mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Highlight active nav link ── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('#')[0];
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Fade-up on scroll ── */
  var fuObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = parseInt(el.dataset.delay || 0);
        setTimeout(function () { el.classList.add('in'); }, delay);
        fuObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fu').forEach(function (el, i) {
    /* Stagger siblings in same parent */
    var siblings = el.parentElement.querySelectorAll('.fu');
    var idx = Array.from(siblings).indexOf(el);
    el.dataset.delay = idx * 80;
    fuObserver.observe(el);
  });

  /* ── Accordion (why-items, FAQ items) ── */
  document.querySelectorAll('.acc-item').forEach(function (item) {
    var head = item.querySelector('.acc-head');
    if (!head) return;
    head.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      /* Close siblings in same group */
      var group = item.closest('.acc-list, .acc-group');
      if (group) {
        group.querySelectorAll('.acc-item.open').forEach(function (o) { o.classList.remove('open'); });
      }
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── HubSpot form loader ── */
  /* Called by individual pages: window.loadHubSpotForm(portalId, formId, region, targetId) */
  window.loadHubSpotForm = function (portalId, formId, region, targetId) {
    if (!portalId || portalId === 'YOUR_PORTAL_ID') {
      var fb = document.getElementById('hs-fallback');
      if (fb) fb.style.display = 'block';
      return;
    }
    var s = document.createElement('script');
    s.src = '//js.hsforms.net/forms/embed/v2.js';
    s.charset = 'utf-8';
    s.onload = function () {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: region || 'eu1',
          portalId: portalId,
          formId: formId,
          target: '#' + targetId
        });
      }
    };
    document.head.appendChild(s);
  };

})();
