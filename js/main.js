(() => {
  'use strict';

  const FORC3_EMAIL = 'forc3mod@gmail.com';

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

    // Close mobile nav after choosing a link
    nav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Active nav link on scroll ----
  // Only same-page anchor links (e.g. "#top", "#contact" on index.html)
  // participate in scroll-spying. Cross-page links (FORC3 Designer, GT3
  // FORC3, Support Us, etc.) keep whichever is-active state the page was
  // rendered with — scrolling on one page must never touch the nav item
  // for a completely different page.
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const sameLinkAnchors = Array.from(navLinks).filter((link) => (link.getAttribute('href') || '').startsWith('#'));

  const setActiveLink = () => {
    if (!sameLinkAnchors.length) return;

    // "top" is the default section — #top is a marker span, not a
    // tracked <section>, so nothing below ever claims that id on its own.
    let currentId = 'top';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    sameLinkAnchors.forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ---- Modals (e.g. Changelog) ----
  document.querySelectorAll('[data-modal-target]').forEach((trigger) => {
    const modal = document.querySelector(trigger.getAttribute('data-modal-target'));
    if (!modal) return;

    const openModal = () => {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    trigger.addEventListener('click', openModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    modal.querySelectorAll('[data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  });

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
      const message = String(data.get('message') || '').trim();

      if (!name || !email || !type || !message) {
        note.textContent = 'Please fill in your name, email, what this is about, and your message.';
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
      const body = `From: ${name} (${email})\n\n${message}`;
      const mailto = `mailto:${FORC3_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      note.textContent = 'Opening your email app to send this to FORC3 Email…';
      note.style.color = 'var(--accent-2)';
      window.location.href = mailto;
      contactForm.reset();
    });
  }
})();
