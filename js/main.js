// HP Media — site scripts
// Kept dependency-free on purpose: this is a lightweight marketing/portfolio
// site and shouldn't ship a framework for a handful of UI behaviors.

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Header: solid background once the page has scrolled                */
  /* ------------------------------------------------------------------ */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------------------------------ */
  /* Mobile nav toggle                                                   */
  /* ------------------------------------------------------------------ */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll-reveal animations for anything with [data-animate]           */
  /* ------------------------------------------------------------------ */
  var animatedEls = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window && animatedEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    animatedEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: no IntersectionObserver support — just show everything.
    animatedEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Hero content should reveal immediately on load rather than waiting for
  // a scroll/intersection event, since it's already in the viewport.
  document.querySelectorAll('.hero [data-animate]').forEach(function (el) {
    el.classList.add('is-visible');
  });
})();
