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

    // Close mobile nav after choosing a link. Dropdown toggles are excluded —
    // they open a submenu rather than navigating, so closing the drawer on
    // them would dismiss the menu the user just asked for. Their child links
    // do close it, since those navigate away.
    nav.querySelectorAll('.nav__link:not(.nav__toggle), .nav__menu a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Nav dropdowns (e.g. Support) ----
  // Generic: any .nav__group with a .nav__toggle button and a .nav__menu.
  // Click-driven rather than hover so it works on touch and in the drawer.
  const navGroups = Array.from(document.querySelectorAll('.nav__group'));

  const closeNavGroups = (except) => {
    navGroups.forEach((group) => {
      if (group === except) return;
      group.classList.remove('is-open');
      const toggle = group.querySelector('.nav__toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  };

  navGroups.forEach((group) => {
    const toggle = group.querySelector('.nav__toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      // Without this the document listener below would immediately reclose it.
      e.stopPropagation();
      const willOpen = !group.classList.contains('is-open');
      closeNavGroups(group);
      group.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    });
  });

  if (navGroups.length) {
    document.addEventListener('click', () => closeNavGroups());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNavGroups();
    });
  }

  // ---- Live GT3FORC3 driver count (gt3forc3.html only) ----
  // Reads the same Cloudflare Worker endpoint GT3FORC3.COM's own leaderboard
  // uses, so both sites always agree. The Worker sends
  // Access-Control-Allow-Origin: * and edge-caches for 120s, so calling it
  // cross-origin from here is fine and cheap.
  //
  // `server_players` is a map of track id -> players on that server; this page
  // isn't per-track, so the counts are summed into one total. A track missing
  // from the map means its count couldn't be read, not zero — summing the
  // present ones is the honest reading either way.
  const liveStatus = document.getElementById('liveStatus');
  if (liveStatus) {
    const STATS_URL = 'https://raspy-salad-d894.contact-eb9.workers.dev/discord/stats';
    const REFRESH_MS = 90 * 1000;
    const textEl = document.getElementById('liveStatusText');

    const loadLiveStatus = async () => {
      try {
        const res = await fetch(STATS_URL);
        if (!res.ok) throw new Error(`Worker returned ${res.status}`);
        const data = await res.json();

        const counts = Object.values(data.server_players || {});
        if (!counts.length) throw new Error('no server counts in response');
        const drivers = counts.reduce((total, n) => total + (Number(n) || 0), 0);

        textEl.innerHTML = `GT3FORC3 servers // <span class="live-status__count">${drivers}</span> ` +
          `driver${drivers === 1 ? '' : 's'} on track`;
        liveStatus.classList.toggle('is-empty', drivers === 0);
        liveStatus.hidden = false;
      } catch (err) {
        // Fail silently and stay hidden — the page reads fine without it,
        // and a half-rendered "0 drivers" would be a lie if the fetch broke.
        liveStatus.hidden = true;
      }
    };

    loadLiveStatus();
    setInterval(loadLiveStatus, REFRESH_MS);
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
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
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
