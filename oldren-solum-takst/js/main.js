// Oldren & Solum Takst — meny, scroll-header, animasjoner og kontaktskjema
(function () {
  // TODO: bytt til ekte mottaker-adresse
  var CONTACT_EMAIL = "post@oldrensolum.no";

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("mainNav");
  var toggle = document.getElementById("navToggle");

  // Mobilmeny
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Lukk meny" : "Åpne meny");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Skygge på header når man scroller
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Scroll-reveal
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Kontaktskjema — åpner e-postklienten med utfylt forespørsel.
  // Bytt til f.eks. Formspree/Netlify Forms hvis dere vil ta imot direkte.
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var missing = false;
    ["name", "phone"].forEach(function (key) {
      var field = form.elements[key].closest(".field");
      var empty = !String(data.get(key) || "").trim();
      field.classList.toggle("invalid", empty);
      if (empty) missing = true;
    });
    if (missing) {
      note.textContent = "Fyll inn navn og telefon, så kontakter vi deg.";
      note.classList.add("error");
      return;
    }
    note.classList.remove("error");

    var body = [
      "Navn: " + data.get("name"),
      "Telefon: " + data.get("phone"),
      "E-post: " + (data.get("email") || "-"),
      "Tjeneste: " + data.get("type"),
      "Adresse: " + (data.get("address") || "-"),
      "",
      data.get("message") || ""
    ].join("\n");
    var subject = "Forespørsel: " + data.get("type");
    window.location.href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    note.textContent = "Takk! E-postprogrammet ditt åpnes med forespørselen klar til sending.";
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
