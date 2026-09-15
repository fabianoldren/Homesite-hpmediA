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

  /* ------------------------------------------------------------------ */
  /* Portfolio: render cards + filters from js/portfolio-data.js, and    */
  /* wire up the detail modal. Adding a project only means editing the   */
  /* data file — nothing here needs to change.                           */
  /* ------------------------------------------------------------------ */
  var portfolio = window.HP_PORTFOLIO || [];
  var filtersEl = document.getElementById('portfolioFilters');
  var gridEl = document.getElementById('portfolioGrid');
  var modal = document.getElementById('portfolioModal');
  var modalBody = document.getElementById('portfolioModalBody');
  var modalClose = document.getElementById('portfolioModalClose');

  if (filtersEl && gridEl && portfolio.length) {
    var categories = [{ key: 'alle', label: 'Alle' }];
    var seen = {};
    portfolio.forEach(function (item) {
      if (!seen[item.category]) {
        seen[item.category] = true;
        categories.push({ key: item.category, label: item.categoryLabel });
      }
    });

    var activeFilter = 'alle';

    function iconFor(type) {
      if (type === 'video') {
        return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M8 5v14l11-7L8 5z" fill="currentColor"/></svg>';
      }
      return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="14" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 16.5 9 12l3 2.6L16 11l4 4.5" stroke-linejoin="round"/></svg>';
    }

    function renderGrid() {
      gridEl.innerHTML = '';
      portfolio
        .filter(function (item) { return activeFilter === 'alle' || item.category === activeFilter; })
        .forEach(function (item) {
          var card = document.createElement('article');
          card.className = 'case-card';
          card.setAttribute('data-animate', '');
          card.innerHTML =
            '<button class="case-card__thumb" data-project="' + item.id + '" aria-label="Se prosjekt: ' + item.title + '">' +
              '<span class="case-card__badge">' + item.categoryLabel + '</span>' +
              '<span class="case-card__play">' + iconFor(item.type) + '</span>' +
            '</button>' +
            '<div class="case-card__info">' +
              '<h3 class="case-card__title">' + item.title + '</h3>' +
              '<p class="case-card__summary">' + item.summary + '</p>' +
            '</div>';
          gridEl.appendChild(card);
        });

      // Re-observe newly created [data-animate] cards so they fade in on scroll.
      var newAnimated = gridEl.querySelectorAll('[data-animate]');
      if ('IntersectionObserver' in window) {
        var cardObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              cardObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
        newAnimated.forEach(function (el) { cardObserver.observe(el); });
      } else {
        newAnimated.forEach(function (el) { el.classList.add('is-visible'); });
      }
    }

    function renderFilters() {
      filtersEl.innerHTML = categories
        .map(function (cat) {
          var isActive = cat.key === activeFilter;
          return '<button class="filter-pill' + (isActive ? ' is-active' : '') + '" data-filter="' + cat.key + '">' + cat.label + '</button>';
        })
        .join('');
    }

    filtersEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      activeFilter = btn.getAttribute('data-filter');
      renderFilters();
      renderGrid();
    });

    gridEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-project]');
      if (!btn) return;
      openProject(btn.getAttribute('data-project'));
    });

    function openProject(id) {
      var item = portfolio.filter(function (p) { return p.id === id; })[0];
      if (!item || !modal || !modalBody) return;

      var mediaHtml;
      if (item.type === 'video' && item.embedUrl) {
        mediaHtml =
          '<div class="portfolio-modal__embed">' +
            '<iframe src="' + item.embedUrl + '" title="' + item.title + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>' +
          '</div>';
      } else if (item.type === 'video') {
        // No embedUrl set yet — show a placeholder rather than a broken player.
        mediaHtml =
          '<div class="portfolio-modal__placeholder">' + iconFor('video') + '<span>Video legges til her</span></div>';
      } else if (item.images && item.images.length) {
        mediaHtml =
          '<div class="portfolio-modal__gallery">' +
          item.images.map(function (src) { return '<img src="' + src + '" alt="' + item.title + '" loading="lazy" />'; }).join('') +
          '</div>';
      } else {
        mediaHtml =
          '<div class="portfolio-modal__gallery portfolio-modal__gallery--placeholder">' +
          [1, 2, 3, 4].map(function () { return '<div class="portfolio-modal__tile"></div>'; }).join('') +
          '</div>';
      }

      modalBody.innerHTML =
        '<span class="portfolio-modal__badge">' + item.categoryLabel + '</span>' +
        '<h3 class="portfolio-modal__title">' + item.title + '</h3>' +
        '<p class="portfolio-modal__desc">' + item.description + '</p>' +
        mediaHtml;

      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
    }

    if (modalClose && modal) {
      modalClose.addEventListener('click', function () { modal.close(); });
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.close();
      });
      modal.addEventListener('close', function () {
        modalBody.innerHTML = '';
      });
    }

    renderFilters();
    renderGrid();
  }
})();
