/* ============================================================
   script.js — PMB Universitas Udayana 2026
   ============================================================ */

/* ---------- 1. NAVBAR: scroll effect + hamburger ---------- */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll → add "scrolled" class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close nav when a link is clicked (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();


/* ---------- 2. COUNTER ANIMATION on stats bar ---------- */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  let animated   = false;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1400;   // ms
    const steps    = 60;
    const increment = target / steps;
    let current    = 0;
    let step       = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      el.textContent = Math.min(Math.round(current), target);
      if (step >= steps) {
        el.textContent = target;
        clearInterval(timer);
      }
    }, duration / steps);
  }

  // Trigger when stats bar enters the viewport
  const statsBar = document.querySelector('.stats-bar');

  if (!statsBar) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => animateCounter(counter));
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statsBar);
})();


/* ---------- 3. REVEAL ANIMATION on scroll ---------- */
(function initReveal() {
  // General .reveal elements (faculty cards, gallery items)
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement.children);
          const idx      = siblings.indexOf(entry.target);
          const delay    = Math.min(idx * 80, 500);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  // Registration cards (.reveal-reg) — staggered
  const regCards = document.querySelectorAll('.reveal-reg');

  if (regCards.length) {
    const regObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement.children);
          const idx      = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 120);
          regObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    regCards.forEach(el => regObserver.observe(el));
  }
})();


/* ---------- 4. ACTIVE NAV LINK on scroll (spy) ---------- */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], div.stats-bar');
  const navLinks = document.querySelectorAll('.navbar-links a');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => observer.observe(sec));

  // Active style
  const style = document.createElement('style');
  style.textContent = `
    .navbar-links a.active {
      color: var(--gold) !important;
    }
  `;
  document.head.appendChild(style);
})();


/* ---------- 5. SMOOTH SCROLL for older browsers ---------- */
(function initSmoothScroll() {
  // Modern browsers handle this with css scroll-behavior: smooth
  // This is a fallback for browsers that don't support it
  if ('scrollBehavior' in document.documentElement.style) return;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


/* ---------- 6. GALLERY LIGHTBOX (simple) ---------- */
(function initLightbox() {
  // Create overlay elements
  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 10, 30, 0.92);
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
    padding: 20px;
  `;

  const img = document.createElement('img');
  img.style.cssText = `
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 12px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    object-fit: contain;
    transition: transform 0.3s ease;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 24px;
    background: rgba(255,255,255,0.15);
    border: none;
    color: white;
    font-size: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  `;
  closeBtn.addEventListener('mouseover', () => {
    closeBtn.style.background = 'rgba(255,255,255,0.3)';
  });
  closeBtn.addEventListener('mouseout', () => {
    closeBtn.style.background = 'rgba(255,255,255,0.15)';
  });

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  // Open
  function openLightbox(src, alt) {
    img.src   = src;
    img.alt   = alt || '';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  // Close
  function closeLightbox() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Attach to gallery items
  document.querySelectorAll('.gallery-item img').forEach(galleryImg => {
    galleryImg.style.cursor = 'zoom-in';
    galleryImg.addEventListener('click', () => {
      openLightbox(galleryImg.src, galleryImg.alt);
    });
  });
})();