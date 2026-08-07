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

  // ---- Contact / notify forms (client-side only, no backend wired up) ----
  const setupForm = (form, { requireType = false, requiredMessage, successMessage }) => {
    const note = form.querySelector('.form-note');
    if (!note) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const type = String(data.get('type') || '').trim();

      if (!name || !email || (requireType && !type)) {
        note.textContent = requiredMessage;
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
      note.textContent = successMessage(name, email);
      note.style.color = 'var(--accent-2)';
      form.reset();
    });
  };

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    setupForm(contactForm, {
      requireType: true,
      requiredMessage: 'Please fill in your name, email, and what this is about.',
      successMessage: (name, email) => `Thanks, ${name}! Your message has been noted — we'll reply at ${email}.`,
    });
  }

  const waitlistForm = document.getElementById('waitlistForm');
  if (waitlistForm) {
    setupForm(waitlistForm, {
      requireType: false,
      requiredMessage: 'Please fill in your name and email.',
      successMessage: (name) => `Thanks, ${name}! We'll email you the moment FORC3 Designer is live.`,
    });
  }
})();
