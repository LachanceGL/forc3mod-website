(() => {
  'use strict';

  // ---- Footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile nav toggle ----
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  const headerEl = document.querySelector('.header');

  const positionMobileNav = () => {
    if (headerEl) nav.style.top = `${headerEl.getBoundingClientRect().bottom}px`;
  };

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.classList.toggle('is-active', isOpen);
      if (isOpen) positionMobileNav();
    });

    window.addEventListener('resize', () => {
      if (nav.classList.contains('is-open')) positionMobileNav();
    });

    // On mobile, tapping a "has-drop" link toggles its submenu instead of navigating.
    nav.querySelectorAll('.nav__item.has-drop > .nav__link').forEach((link) => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1080) {
          e.preventDefault();
          link.parentElement.classList.toggle('is-expanded');
        }
      });
    });

    // Close mobile nav after choosing a real link
    nav.querySelectorAll('.nav__link:not(.has-drop > .nav__link)').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Search button placeholder ----
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const term = window.prompt('Search FORC3MOD mods:');
      if (term) {
        window.location.hash = 'mods';
      }
    });
  }

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const setActiveLink = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ---- Animated stat counters ----
  const counters = document.querySelectorAll('[data-count]');

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k';
    return String(num);
  };

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNumber(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target);
    };

    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((el) => io.observe(el));
  }

  // ---- Contact form (client-side only, no backend wired up) ----
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const type = String(data.get('type') || '').trim();

      if (!name || !email || !type) {
        note.textContent = 'Please fill in your name, email, and mod type.';
        note.style.color = '#ff6b6b';
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        note.textContent = 'That email address doesn’t look right.';
        note.style.color = '#ff6b6b';
        return;
      }

      // No backend is connected yet — this just confirms receipt client-side.
      note.textContent = `Thanks, ${name}! Your request has been noted — we'll reply at ${email}.`;
      note.style.color = 'var(--accent-2)';
      form.reset();
    });
  }
})();
