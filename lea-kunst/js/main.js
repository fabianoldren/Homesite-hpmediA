/* Atelier Lea — interaksjon og 3D-bevegelse */
(function () {
  "use strict";

  var works = window.LEA_WORKS || [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (sel) { return document.querySelector(sel); };

  document.getElementById("year").textContent = new Date().getFullYear();
  requestAnimationFrame(function () { document.body.classList.add("loaded"); });

  /* ---------- Header + mobilmeny ---------- */
  var header = $(".site-header");
  var toggle = $(".nav-toggle");
  var navList = $("#nav-list");

  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 30); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    navList.classList.toggle("open", open);
  });
  navList.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      toggle.setAttribute("aria-expanded", "false");
      navList.classList.remove("open");
    }
  });

  /* ---------- Lysglød som følger musen ---------- */
  if (finePointer && !reduceMotion) {
    var glow = $(".cursor-glow");
    window.addEventListener("pointermove", function (e) {
      glow.style.setProperty("--mx", e.clientX + "px");
      glow.style.setProperty("--my", e.clientY + "px");
    }, { passive: true });
  }

  /* ---------- Hero: 3D-stabel som følger mus og scroll ---------- */
  var stack = $("#stack");
  if (stack && !reduceMotion) {
    // Etter inngangsanimasjonen: raskere respons på bevegelse
    setTimeout(function () { stack.classList.add("live"); }, 1900);

    if (finePointer) {
      window.addEventListener("pointermove", function (e) {
        var x = e.clientX / window.innerWidth - 0.5;
        var y = e.clientY / window.innerHeight - 0.5;
        stack.style.setProperty("--ry", (-16 + x * 22).toFixed(2) + "deg");
        stack.style.setProperty("--rx", (8 - y * 14).toFixed(2) + "deg");
      }, { passive: true });
    }

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, window.innerHeight);
        stack.style.setProperty("--p1", (y * -0.18).toFixed(1) + "px");
        stack.style.setProperty("--p2", (y * 0.08).toFixed(1) + "px");
        stack.style.setProperty("--p3", (y * -0.32).toFixed(1) + "px");
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- 3D-karusell ---------- */
  var ring = $("#ring");
  var viewport = $("#ring-viewport");
  var caption = $("#ring-caption");
  var step = 360 / works.length;
  var angle = 0;
  var velocity = reduceMotion ? 0 : -0.08; // langsom auto-rotasjon
  var dragging = false;

  // Flere kort gir en fyldigere ring; gjenta listen til vi har minst 8
  var ringWorks = works.slice();
  while (ringWorks.length && ringWorks.length < 8) ringWorks = ringWorks.concat(works);
  step = 360 / ringWorks.length;

  function layoutRing() {
    var cardW = Math.max(150, Math.min(260, viewport.clientWidth * 0.22));
    // Radius slik at kortene akkurat ikke overlapper
    var radius = Math.round((cardW / 2 + 18) / Math.tan(Math.PI / ringWorks.length));
    ring.style.setProperty("--card-w", cardW + "px");
    ring.style.setProperty("--radius3d", radius + "px");
  }

  ringWorks.forEach(function (w, i) {
    var fig = document.createElement("figure");
    fig.className = "ring-item";
    fig.style.setProperty("--a", i * step + "deg");
    fig.innerHTML = '<img src="img/' + w.file + '" alt="' + w.title + '" loading="lazy" draggable="false">';
    ring.appendChild(fig);
  });
  layoutRing();
  window.addEventListener("resize", layoutRing);

  var lastCaption = "";
  function updateCaption() {
    var idx = Math.round(-angle / step) % ringWorks.length;
    if (idx < 0) idx += ringWorks.length;
    var t = ringWorks[idx].title;
    if (t !== lastCaption) { caption.textContent = t; lastCaption = t; }
  }

  var ringVisible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { ringVisible = entries[0].isIntersecting; })
      .observe(viewport);
  }

  var snapTarget = null;
  function tick() {
    if (ringVisible && !dragging) {
      if (snapTarget !== null) {
        angle += (snapTarget - angle) * 0.12;
        if (Math.abs(snapTarget - angle) < 0.05) { angle = snapTarget; snapTarget = null; }
      } else {
        angle += velocity;
        // Friksjon tilbake mot langsom auto-rotasjon etter et kast
        var base = reduceMotion ? 0 : -0.08;
        velocity += (base - velocity) * 0.03;
      }
      ring.style.setProperty("--angle", angle.toFixed(2) + "deg");
      updateCaption();
    }
    requestAnimationFrame(tick);
  }
  ring.style.setProperty("--angle", "0deg");
  updateCaption();
  requestAnimationFrame(tick);

  var startX = 0, startAngle = 0, lastX = 0, lastT = 0;
  viewport.addEventListener("pointerdown", function (e) {
    dragging = true; snapTarget = null;
    startX = lastX = e.clientX; startAngle = angle; lastT = performance.now();
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var now = performance.now();
    angle = startAngle + (e.clientX - startX) * 0.25;
    velocity = ((e.clientX - lastX) * 0.25) / Math.max(1, (now - lastT) / 16);
    lastX = e.clientX; lastT = now;
    ring.style.setProperty("--angle", angle.toFixed(2) + "deg");
    updateCaption();
  });
  function endDrag() { dragging = false; }
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    var current = snapTarget !== null ? snapTarget : Math.round(angle / step) * step;
    snapTarget = current + (e.key === "ArrowLeft" ? step : -step);
    velocity = 0;
  });

  /* ---------- Galleri ---------- */
  var gallery = $("#gallery");
  function statusClass(s) { return s === "Solgt" ? "sold" : s === "Tilgjengelig" ? "" : "pending"; }

  works.forEach(function (w, i) {
    var el = document.createElement("article");
    el.className = "work reveal " + (w.shape === "wide" ? "wide" : "tall");
    el.innerHTML =
      '<button class="work-btn" data-index="' + i + '" aria-label="Åpne ' + w.title + ' i stor visning">' +
        '<div class="work-frame"><img src="img/' + w.file + '" alt="' + w.title + ' — ' + w.tech + '" loading="lazy"></div>' +
        '<div class="work-meta"><div><h3>' + w.title + '</h3><p>' + w.tech + '</p></div>' +
        '<span class="badge ' + statusClass(w.status) + '">' + w.status + '</span></div>' +
      "</button>";
    gallery.appendChild(el);
  });

  var cta = document.createElement("div");
  cta.className = "gallery-cta reveal";
  cta.innerHTML =
    '<p class="eyebrow" style="color:var(--accent-2)">Bestillingsverk</p>' +
    "<h3>Drømmer du om et eget maleri?</h3>" +
    "<p>Lea maler på bestilling — velg format, farger og motiv, så lager hun et unikt verk til ditt rom.</p>" +
    '<a class="btn" href="#kontakt">Ta kontakt</a>';
  gallery.appendChild(cta);

  // 3D-tilt på kort og om-bildet
  function addTilt(el, frame, max) {
    if (!finePointer || reduceMotion) return;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      frame.style.transform = "rotateX(" + ((0.5 - y) * max).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * max).toFixed(2) + "deg) translateZ(10px)";
      frame.style.setProperty("--gx", x * 100 + "%");
      frame.style.setProperty("--gy", y * 100 + "%");
    });
    el.addEventListener("pointerleave", function () { frame.style.transform = ""; });
  }
  gallery.querySelectorAll(".work-btn").forEach(function (btn) {
    addTilt(btn, btn.querySelector(".work-frame"), 12);
  });
  document.querySelectorAll("[data-tilt]").forEach(function (el) { addTilt(el.parentNode, el, 10); });

  /* ---------- Lightbox ---------- */
  var lb = $("#lightbox");
  var lbImg = $("#lb-img");
  var lbCap = $("#lb-cap");
  var current = 0;
  var lastFocus = null;

  function show(i) {
    current = (i + works.length) % works.length;
    var w = works[current];
    lbImg.src = "img/" + w.file;
    lbImg.alt = w.title;
    lbCap.innerHTML = "<strong>" + w.title + "</strong><span>" + w.tech + " · " + w.size + " · " + w.status + "</span>";
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add("open"); });
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }
  function closeLb() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(function () { lb.hidden = true; }, 300);
    if (lastFocus) lastFocus.focus();
  }

  gallery.addEventListener("click", function (e) {
    var btn = e.target.closest(".work-btn");
    if (btn) openLb(Number(btn.dataset.index));
  });
  lb.querySelector(".lb-close").addEventListener("click", closeLb);
  lb.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.08 + "s";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Kontaktskjema (mailto) ---------- */
  // TODO: Bytt til en skjematjeneste (f.eks. Formspree/Netlify Forms) ved behov
  $("#contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var body = "Navn: " + f.navn.value + "\nE-post: " + f.epost.value + "\n\n" + f.melding.value;
    window.location.href = "mailto:hei@atelierlea.no?subject=" +
      encodeURIComponent(f.emne.value + " — via nettsiden") + "&body=" + encodeURIComponent(body);
  });
})();
