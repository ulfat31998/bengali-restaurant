/* =========================================================
   RANNA GHOR — script.js
   Vanilla JS: nav, reveal animations, hero effects,
   gallery lightbox, testimonial slider, form validation.
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setYear();
    hidePreloader();
    initHeaderScroll();
    initMobileNav();
    initSmoothScrollClose();
    initActiveNavHighlight();
    initScrollReveal();
    initFloatingSpices();
    initRipple();
    initGalleryLightbox();
    initTestimonialSlider();
    initReservationForm();
    initFloatingButtons();
    initPrivacyModal();
  }

  /* ---------- Footer year ---------- */
  function setYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Preloader ---------- */
  function hidePreloader() {
    var pre = document.getElementById("preloader");
    if (!pre) return;
    window.addEventListener("load", function () {
      setTimeout(function () {
        pre.classList.add("hide");
      }, 300);
    });
    // Fallback in case 'load' already fired or is delayed
    setTimeout(function () {
      pre.classList.add("hide");
    }, 2500);
  }

  /* ---------- Sticky header shadow ---------- */
  function initHeaderScroll() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile hamburger menu ---------- */
  function initMobileNav() {
    var hamburger = document.getElementById("hamburger");
    var navLinks = document.getElementById("navLinks");
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!navLinks.classList.contains("open")) return;
      var clickedInsideMenu = navLinks.contains(e.target);
      var clickedHamburger = hamburger.contains(e.target);
      if (!clickedInsideMenu && !clickedHamburger) {
        closeMobileNav();
      }
    });

    // Close on escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });

    function closeMobileNav() {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open menu");
    }

    window.__closeMobileNav = closeMobileNav;
  }

  /* ---------- Close mobile nav after clicking a link ---------- */
  function initSmoothScrollClose() {
    var links = document.querySelectorAll('.nav-links a[data-nav]');
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        if (typeof window.__closeMobileNav === "function") {
          window.__closeMobileNav();
        }
      });
    });
  }

  /* ---------- Active nav link highlighting on scroll ---------- */
  function initActiveNavHighlight() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("section[id], main[id]")
    );
    var navLinks = document.querySelectorAll(".nav-link[data-nav]");
    if (!sections.length || !navLinks.length) return;

    var map = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      map[id] = link;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.getAttribute("id");
          var link = map[id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("active"); });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (sec) { observer.observe(sec); });
  }

  /* ---------- Scroll reveal (fade-up) ---------- */
  function initScrollReveal() {
    var targets = document.querySelectorAll(".fade-up");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("in-view"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* ---------- Floating spice particles in hero ---------- */
  function initFloatingSpices() {
    var container = document.getElementById("floatingSpices");
    if (!container) return;

    var colors = ["#D9A441", "#B5533C", "#F2E5D2"];
    var count = window.innerWidth < 640 ? 10 : 18;

    for (var i = 0; i < count; i++) {
      var dot = document.createElement("span");
      dot.className = "spice-dot";
      var size = 3 + Math.random() * 6;
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.left = Math.random() * 100 + "%";
      dot.style.bottom = "-5%";
      dot.style.background = colors[i % colors.length];
      dot.style.animationDuration = (8 + Math.random() * 10) + "s";
      dot.style.animationDelay = (Math.random() * 10) + "s";
      container.appendChild(dot);
    }
  }

  /* ---------- Button ripple effect ---------- */
  function initRipple() {
    var buttons = document.querySelectorAll(".ripple");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var rect = btn.getBoundingClientRect();
        var circle = document.createElement("span");
        var size = Math.max(rect.width, rect.height);
        circle.className = "ripple-circle";
        circle.style.width = circle.style.height = size + "px";
        circle.style.left = (e.clientX - rect.left - size / 2) + "px";
        circle.style.top = (e.clientY - rect.top - size / 2) + "px";
        btn.appendChild(circle);
        setTimeout(function () {
          circle.remove();
        }, 650);
      });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  function initGalleryLightbox() {
    var items = document.querySelectorAll(".gallery-item");
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightboxImg");
    var closeBtn = document.getElementById("lightboxClose");
    if (!items.length || !lightbox || !lightboxImg || !closeBtn) return;

    var lastFocused = null;

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        var fullSrc = item.getAttribute("data-full");
        var imgEl = item.querySelector("img");
        lightboxImg.src = fullSrc;
        lightboxImg.alt = imgEl ? imgEl.alt : "";
        lastFocused = item;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
        closeBtn.focus();
      });
    });

    function close() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      lightboxImg.src = "";
      if (lastFocused) lastFocused.focus();
    }

    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) close();
    });
  }

  /* ---------- Testimonial slider ---------- */
  function initTestimonialSlider() {
    var track = document.getElementById("testimonialTrack");
    var dotsWrap = document.getElementById("testimonialDots");
    if (!track || !dotsWrap) return;

    var slides = Array.prototype.slice.call(track.children);
    var index = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, di) {
        d.classList.toggle("active", di === index);
      });
    }

    function next() { goTo(index + 1); }

    function startAutoplay() {
      timer = setInterval(next, 5500);
    }
    function restartAutoplay() {
      clearInterval(timer);
      startAutoplay();
    }

    startAutoplay();

    var slider = track.closest(".testimonial-slider");
    if (slider) {
      slider.addEventListener("mouseenter", function () { clearInterval(timer); });
      slider.addEventListener("mouseleave", startAutoplay);
    }

    // Basic touch swipe support
    var startX = null;
    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) {
        diff < 0 ? next() : goTo(index - 1);
        restartAutoplay();
      }
      startX = null;
    });
  }

  /* ---------- Reservation form validation ---------- */
  function initReservationForm() {
    var form = document.getElementById("reservationForm");
    var status = document.getElementById("formStatus");
    if (!form || !status) return;

    var todayISO = new Date().toISOString().split("T")[0];
    var dateInput = document.getElementById("resDate");
    if (dateInput) dateInput.setAttribute("min", todayISO);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      status.className = "form-status";

      var fields = [
        { id: "resName", check: function (v) { return v.trim().length >= 2; }, msg: "Please enter your full name." },
        { id: "resPhone", check: function (v) { return /^[0-9+\-\s()]{7,15}$/.test(v.trim()); }, msg: "Please enter a valid phone number." },
        { id: "resDate", check: function (v) { return v.length > 0 && v >= todayISO; }, msg: "Please choose today or a future date." },
        { id: "resTime", check: function (v) { return v.length > 0; }, msg: "Please choose a time." },
        { id: "resGuests", check: function (v) { return v.length > 0; }, msg: "Please select number of guests." }
      ];

      var isValid = true;

      fields.forEach(function (f) {
        var input = document.getElementById(f.id);
        var errorEl = document.getElementById("err-" + f.id);
        var row = input.closest(".form-row");
        var value = input.value || "";

        if (!f.check(value)) {
          isValid = false;
          if (errorEl) errorEl.textContent = f.msg;
          if (row) row.classList.add("invalid");
        } else {
          if (errorEl) errorEl.textContent = "";
          if (row) row.classList.remove("invalid");
        }
      });

      if (!isValid) {
        status.textContent = "Please fix the highlighted fields.";
        status.classList.add("error");
        return;
      }

      var name = document.getElementById("resName").value.trim();

      status.textContent =
        "Thank you, " + name + "! Your table request has been received. We'll confirm shortly by phone.";
      status.classList.add("success");
      form.reset();
    });
  }

  /* ---------- Floating action buttons (scroll to top) ---------- */
  function initFloatingButtons() {
    var topBtn = document.getElementById("scrollTop");
    if (!topBtn) return;

    function toggle() {
      if (window.scrollY > 500) {
        topBtn.classList.add("show");
      } else {
        topBtn.classList.remove("show");
      }
    }
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });

    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Privacy policy modal ---------- */
  function initPrivacyModal() {
    var link = document.getElementById("privacyLink");
    var modal = document.getElementById("privacyModal");
    var closeBtn = document.getElementById("privacyClose");
    if (!link || !modal || !closeBtn) return;

    link.addEventListener("click", function (e) {
      e.preventDefault();
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    });

    function close() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) close();
    });
  }
})();
