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

  // The contact form has no backend, so it hands off to the visitor's own
  // email client via a mailto: link rather than pretending to submit.
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const note = contactForm.querySelector('.form-note');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(contactForm);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const type = String(data.get('type') || '').trim();

      if (!name || !email || !type) {
        note.textContent = 'Please fill in your name, email, and what this is about.';
        note.style.color = '#ff6b6b';
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        note.textContent = 'That email address doesn’t look right.';
        note.style.color = '#ff6b6b';
        return;
      }

      const subject = `[FORC3MOD] ${type} from ${name}`;
      const body = `From: ${name} (${email})`;
      const mailto = `mailto:forc3mod@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      note.textContent = 'Opening your email app to send this to forc3mod@gmail.com…';
      note.style.color = 'var(--accent-2)';
      window.location.href = mailto;
      contactForm.reset();
    });
  }
})();
