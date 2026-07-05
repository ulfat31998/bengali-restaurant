/* =============================================================
   SONAR BANGLA RESTAURANT — SCRIPT.JS
   Pure Vanilla JavaScript — no frameworks or libraries
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. PRELOADER — hide once the page has fully loaded
  --------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 400);
  });

  /* ---------------------------------------------------------
     2. STICKY HEADER — add background on scroll
  --------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const scrollTopBtn = document.getElementById('scrollTop');

  function handleScrollEffects() {
    const scrollY = window.scrollY;

    // Header background toggle
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (scrollY > 500) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }

    updateActiveNavLink();
  }

  window.addEventListener('scroll', handleScrollEffects);
  handleScrollEffects();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     3. MOBILE HAMBURGER MENU
  --------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
  });

  // Close mobile menu whenever a nav link is clicked
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------
     4. ACTIVE NAV LINK ON SCROLL
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.getAttribute('id');
      }
    });

    navAnchors.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  /* ---------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------
     6. ANIMATED STAT COUNTERS (Our Story section)
  --------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  function animateCounters() {
    statNumbers.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 1600; // ms
      const frameRate = 1000 / 60;
      const totalFrames = Math.round(duration / frameRate);
      let frame = 0;

      const countUp = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        const currentValue = Math.floor(eased * target);
        counter.textContent = currentValue.toLocaleString();

        if (frame >= totalFrames) {
          counter.textContent = target.toLocaleString();
          clearInterval(countUp);
        }
      }, frameRate);
    });
  }

  const storyStatsEl = document.querySelector('.story-stats');
  if (storyStatsEl) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(storyStatsEl);
  }

  /* ---------------------------------------------------------
     7. MENU FILTER (Signature Dishes)
  --------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Show/hide dish cards based on category
      dishCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden-card');
        } else {
          card.classList.add('hidden-card');
        }
      });
    });
  });

  /* ---------------------------------------------------------
     8. GALLERY LIGHTBOX
  --------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-img');
      const altText = item.querySelector('img').getAttribute('alt');
      lightboxImg.setAttribute('src', imgSrc);
      lightboxImg.setAttribute('alt', altText);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ---------------------------------------------------------
     9. RESERVATION FORM — client-side handling
  --------------------------------------------------------- */
  const reserveForm = document.getElementById('reserveForm');
  const formSuccess = document.getElementById('formSuccess');

  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic front-end validation is already handled by "required" attributes.
      // In production, this would POST to a backend or reservation API.
      formSuccess.classList.add('show');
      reserveForm.reset();

      // Hide success message after a few seconds
      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 5000);
    });
  }

  /* ---------------------------------------------------------
     10. FOOTER — current year
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     11. SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: 'smooth'
          });
        }
      }
    });
  });

});
