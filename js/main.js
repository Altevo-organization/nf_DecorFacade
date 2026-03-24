/**
 * N.F. DécorFaçade — Main JavaScript
 * Author: NF DécorFaçade
 * Description: Navigation, animations, form validation
 * No external dependencies — vanilla JS only
 */

'use strict';

/* ============================================================
   1. DOM Ready Helper
   ============================================================ */
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/* ============================================================
   2. Sticky Header — shadow on scroll
   ============================================================ */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 10;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once on init in case page is already scrolled
  onScroll();
}

/* ============================================================
   3. Mobile Hamburger Menu
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Toggle on hamburger click
  hamburger.addEventListener('click', toggleMenu);

  // Close when a link is clicked
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close when clicking outside the menu
  document.addEventListener('click', function(e) {
    if (isOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on resize to desktop breakpoint
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  mediaQuery.addEventListener('change', function(e) {
    if (e.matches && isOpen) {
      closeMenu();
    }
  });
}

/* ============================================================
   4. Active Navigation Link
   ============================================================ */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Desktop nav links
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  // Mobile nav links
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');
  mobileLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.style.color = 'var(--color-accent)';
    }
  });
}

/* ============================================================
   5. Intersection Observer — Fade-in Animations
   ============================================================ */
function initFadeInAnimations() {
  // Elements with .fade-in, .fade-in--left, .fade-in--right
  const fadeEls = document.querySelectorAll('.fade-in, .fade-in--left, .fade-in--right');
  // Stagger containers
  const staggerEls = document.querySelectorAll('.stagger-children');

  if (!('IntersectionObserver' in window)) {
    // Fallback: make everything visible immediately
    fadeEls.forEach(function(el) { el.classList.add('is-visible'); });
    staggerEls.forEach(function(el) { el.classList.add('is-visible'); });
    return;
  }

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeEls.forEach(function(el) { observer.observe(el); });
  staggerEls.forEach(function(el) { observer.observe(el); });
}

/* ============================================================
   6. Smooth Scroll for Anchor Links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.site-header')
        ? document.querySelector('.site-header').offsetHeight
        : 0;

      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
}

/* ============================================================
   7. Contact Form Validation
   ============================================================ */
function initContactForm() {
  const form = document.querySelector('.js-contact-form');
  if (!form) return;

  const formContent = document.querySelector('.js-form-content');
  const successMsg = document.querySelector('.js-form-success');

  /* --- Validation rules --- */
  const validators = {
    name: function(value) {
      if (!value.trim()) return 'Veuillez entrer votre nom et prénom.';
      if (value.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères.';
      return null;
    },
    email: function(value) {
      if (!value.trim()) return 'Veuillez entrer votre adresse e-mail.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) return 'Veuillez entrer une adresse e-mail valide.';
      return null;
    },
    phone: function(value) {
      if (!value.trim()) return null; // optional
      const phoneRegex = /^[\d\s\+\-\(\)\.]{7,20}$/;
      if (!phoneRegex.test(value.trim())) return 'Veuillez entrer un numéro de téléphone valide.';
      return null;
    },
    service: function(value) {
      // optional — no validation needed
      return null;
    },
    message: function(value) {
      if (!value.trim()) return 'Veuillez entrer votre message.';
      if (value.trim().length < 10) return 'Votre message doit contenir au moins 10 caractères.';
      return null;
    }
  };

  /* --- Show/clear error for a field --- */
  function showError(field, message) {
    const group = field.closest('.form-group');
    if (!group) return;

    const errorEl = group.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('is-visible');
    }
    field.classList.add('is-error');
    field.classList.remove('is-valid');
    field.setAttribute('aria-invalid', 'true');
  }

  function clearError(field) {
    const group = field.closest('.form-group');
    if (!group) return;

    const errorEl = group.querySelector('.form-error');
    if (errorEl) {
      errorEl.classList.remove('is-visible');
    }
    field.classList.remove('is-error');
    field.setAttribute('aria-invalid', 'false');
  }

  function markValid(field) {
    clearError(field);
    field.classList.add('is-valid');
  }

  /* --- Validate a single field --- */
  function validateField(field) {
    const name = field.dataset.validate;
    if (!name || !validators[name]) return true;

    const error = validators[name](field.value);
    if (error) {
      showError(field, error);
      return false;
    } else {
      markValid(field);
      return true;
    }
  }

  /* --- Real-time validation on blur and input --- */
  const fields = form.querySelectorAll('[data-validate]');
  fields.forEach(function(field) {
    // Validate on blur (when user leaves the field)
    field.addEventListener('blur', function() {
      validateField(this);
    });

    // Clear error on input while user is typing (after first blur)
    field.addEventListener('input', function() {
      if (this.classList.contains('is-error')) {
        validateField(this);
      }
    });
  });

  /* --- Form submit --- */
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;

    // Validate all required fields
    fields.forEach(function(field) {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Focus first error field
      const firstError = form.querySelector('.is-error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    /* --- Envoi réel via Formspree --- */
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      if (response.ok) {
        if (formContent) formContent.style.display = 'none';
        if (successMsg) {
          successMsg.classList.add('is-visible');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        response.json().then(function(data) {
          const msg = (data.errors && data.errors.map(function(e) { return e.message; }).join(', '))
            || 'Une erreur est survenue. Veuillez réessayer ou nous appeler directement.';
          alert(msg);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer le message';
          }
        });
      }
    })
    .catch(function() {
      alert('Erreur réseau. Veuillez vérifier votre connexion ou nous appeler directement au 06 36 99 39 03.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer le message';
      }
    });
  });
}

/* ============================================================
   8. Hero Parallax (subtle, performance-safe)
   ============================================================ */
function initHeroParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  // Only on devices that can handle it and prefer motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrollY = window.scrollY;
        const heroEl = document.querySelector('.hero');
        if (heroEl) {
          const heroBottom = heroEl.offsetHeight;
          if (scrollY <= heroBottom) {
            heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   9. Service Cards — hover cursor effect (desktop only)
   ============================================================ */
function initCardEffects() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.service-card, .feature-card');

  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 2;
      const rotateY = ((centerX - x) / centerX) * 2;

      card.style.transform =
        'translateY(-4px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      card.style.transition = 'transform 80ms linear, box-shadow 250ms ease, border-color 250ms ease';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      card.style.transition = 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease';
    });
  });
}

/* ============================================================
   10. Scroll-to-top (optional, activates after 600px)
   ============================================================ */
function initScrollToTop() {
  // Dynamically inject a scroll-to-top button
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Retour en haut de page');
  btn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>';

  // Inject styles
  const style = document.createElement('style');
  style.textContent = [
    '.scroll-top-btn {',
    '  position: fixed;',
    '  bottom: 2rem;',
    '  right: 1.5rem;',
    '  width: 44px;',
    '  height: 44px;',
    '  background-color: var(--color-accent);',
    '  color: var(--color-white);',
    '  border: none;',
    '  border-radius: 8px;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  cursor: pointer;',
    '  z-index: 900;',
    '  opacity: 0;',
    '  visibility: hidden;',
    '  transform: translateY(10px);',
    '  transition: opacity 250ms ease, transform 250ms ease, visibility 250ms ease, background-color 250ms ease;',
    '  box-shadow: 0 4px 16px rgba(192,57,43,0.35);',
    '}',
    '.scroll-top-btn.is-visible {',
    '  opacity: 1;',
    '  visibility: visible;',
    '  transform: translateY(0);',
    '}',
    '.scroll-top-btn:hover {',
    '  background-color: var(--color-accent-dark);',
    '  transform: translateY(-2px);',
    '}',
    '.scroll-top-btn:active {',
    '  transform: translateY(0);',
    '}'
  ].join('\n');

  document.head.appendChild(style);
  document.body.appendChild(btn);

  window.addEventListener('scroll', function() {
    if (window.scrollY > 600) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   11. Page Loader — maison SVG animée
   ============================================================ */
(function() {
  // Injecter le loader immédiatement (avant DOMContentLoaded)
  const loaderHTML = `
    <div id="page-loader" aria-hidden="true">
      <div class="loader__inner">
        <svg class="loader__house" viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Toit -->
          <polyline class="loader__path loader__path--roof" points="10,60 60,10 110,60" />
          <!-- Murs -->
          <polyline class="loader__path loader__path--walls" points="20,60 20,100 100,100 100,60" />
          <!-- Porte -->
          <polyline class="loader__path loader__path--door" points="48,100 48,75 72,75 72,100" />
          <!-- Fenêtre gauche -->
          <rect class="loader__path loader__path--win-left" x="28" y="67" width="14" height="14" rx="1" />
          <!-- Fenêtre droite -->
          <rect class="loader__path loader__path--win-right" x="78" y="67" width="14" height="14" rx="1" />
          <!-- Cheminée -->
          <polyline class="loader__path loader__path--chimney" points="78,48 78,28 88,28 88,42" />
        </svg>
        <p class="loader__label">Chargement…</p>
      </div>
    </div>
  `;

  const loaderStyles = `
    #page-loader {
      position: fixed;
      inset: 0;
      background: rgba(10, 10, 10, 0.92);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.9s ease;
    }
    #page-loader.is-hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .loader__inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .loader__house {
      width: 110px;
      height: 100px;
    }
    .loader__path {
      fill: none;
      stroke: #C0392B;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .loader__path--roof    { stroke-width: 4; }
    .loader__path--walls   { stroke-width: 4; }
    .loader__path--door    { stroke-width: 3; }
    .loader__path--win-left  { stroke-width: 2.5; }
    .loader__path--win-right { stroke-width: 2.5; }
    .loader__path--chimney { stroke-width: 3; }
    .loader__label {
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.35);
      margin: 0;
    }
  `;

  // Injecter styles
  const styleTag = document.createElement('style');
  styleTag.textContent = loaderStyles;
  document.head.appendChild(styleTag);

  // Injecter HTML
  document.addEventListener('DOMContentLoaded', function() {
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);

    // Mesurer et animer chaque path avec stroke-dasharray/dashoffset
    const paths = document.querySelectorAll('.loader__path');
    const delays = [0, 180, 360, 480, 560, 300]; // ms par segment
    const durations = [420, 380, 280, 220, 220, 240];

    paths.forEach(function(path, i) {
      let length;
      if (path.tagName === 'rect') {
        // Périmètre du rectangle
        const w = parseFloat(path.getAttribute('width'));
        const h = parseFloat(path.getAttribute('height'));
        length = 2 * (w + h);
      } else {
        length = path.getTotalLength ? path.getTotalLength() : 200;
      }

      path.style.strokeDasharray  = length;
      path.style.strokeDashoffset = length;
      path.style.transition = `stroke-dashoffset ${durations[i]}ms ease forwards`;
      path.style.transitionDelay = `${delays[i]}ms`;

      // Déclencher l'animation
      requestAnimationFrame(function() {
        setTimeout(function() {
          path.style.strokeDashoffset = '0';
        }, 80);
      });
    });

    // Cacher le loader une fois la page chargée (ou après 1.6s max)
    const totalAnimTime = 900;

    function hideLoader() {
      const loader = document.getElementById('page-loader');
      if (!loader) return;
      setTimeout(function() {
        loader.classList.add('is-hidden');
        setTimeout(function() { loader.remove(); }, 950);
      }, totalAnimTime);
    }

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader, { once: true });
      // Fallback : masquer au bout de 3s max
      setTimeout(hideLoader, 3000);
    }
  });
})();

/* ============================================================
   12. Init all modules on DOM ready
   ============================================================ */
ready(function() {
  initStickyHeader();
  initMobileMenu();
  initActiveNavLink();
  initFadeInAnimations();
  initSmoothScroll();
  initContactForm();
  initHeroParallax();
  initCardEffects();
  initScrollToTop();
});
