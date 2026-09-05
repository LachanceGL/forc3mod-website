(() => {
  'use strict';

  // Kept only as the contact form's fallback if the Worker is unreachable.
  const FORC3_EMAIL = 'forc3mod@gmail.com';

  // Contact form posts here; the Worker relays it into the Discord channel
  // using the bot token. The token stays server-side — never put a Discord
  // webhook URL in this file, it would be public in a public repo (and
  // GitHub's secret scanning gets those auto-revoked).
  const CONTACT_ENDPOINT = 'https://raspy-salad-d894.contact-eb9.workers.dev/contact';

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
  // `server_players` is a map of track id -> players on that server. The pill
  // names the Nordschleife server specifically, so it reads THAT key rather
  // than summing every server — summing under this label would misreport.
  //
  // The pill only ever appears when someone is actually driving: an empty
  // server, a missing `nordschleife` key (the Worker renames track keys when
  // servers are reshuffled) or any fetch error all resolve to "show nothing".
  // The same response also carries `member_count`, shown inside the GT3FORC3
  // Discord button. One fetch feeds both; each is updated independently so
  // an empty track can't suppress the member count (or vice versa).
  const liveStatus = document.getElementById('liveStatus');
  const discordMembers = document.getElementById('discordMembers');

  if (liveStatus || discordMembers) {
    const STATS_URL = 'https://raspy-salad-d894.contact-eb9.workers.dev/discord/stats';
    const TRACK_KEY = 'nordschleife';
    const REFRESH_MS = 90 * 1000;
    const textEl = document.getElementById('liveStatusText');

    const showDrivers = (data) => {
      if (!liveStatus) return;
      const drivers = Number((data && data.server_players || {})[TRACK_KEY]);
      if (!Number.isFinite(drivers) || drivers < 1) {
        liveStatus.hidden = true;
        return;
      }
      textEl.innerHTML = `GT3 Nordschleife server : <span class="live-status__count">${drivers}</span> ` +
        `driver${drivers === 1 ? '' : 's'} on track`;
      liveStatus.hidden = false;
    };

    const showMembers = (data) => {
      if (!discordMembers) return;
      const members = Number(data && data.member_count);
      if (!Number.isFinite(members) || members < 1) {
        discordMembers.hidden = true;
        return;
      }
      discordMembers.textContent = `[${members} MEMBERS]`;
      discordMembers.hidden = false;
    };

    const loadStats = async () => {
      try {
        const res = await fetch(STATS_URL);
        if (!res.ok) throw new Error(`Worker returned ${res.status}`);
        const data = await res.json();
        showDrivers(data);
        showMembers(data);
      } catch (err) {
        // Fail silently and stay hidden — the page reads fine without either,
        // and rendering a count we couldn't actually read would be a lie.
        showDrivers(null);
        showMembers(null);
      }
    };

    loadStats();
    setInterval(loadStats, REFRESH_MS);
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

  // ---- Modals (e.g. Changelog, demo video) ----
  // Deep-linkable: opening a modal pushes its id onto the URL hash (so the
  // current address bar URL can be copied/shared to reopen it directly),
  // closing clears the hash again. Loading a page with a matching hash
  // already in the URL opens that modal automatically. Uses
  // pushState/replaceState rather than setting location.hash directly so
  // the browser never tries a native scroll-to-anchor jump for it.
  //
  // Individual id'd items inside a modal (e.g. each changelog version entry)
  // are linkable too: opening one (a <details> being expanded) pushes its
  // own id onto the hash instead of the modal's; loading/jumping to that
  // hash opens the modal, expands that specific entry, and scrolls it into
  // view. Collapsing a linked entry falls back to the modal's own hash
  // (the modal is still open, just no longer pointing at one entry).
  //
  // A hashchange listener (below the loop) also opens/closes modals and
  // entries when the hash changes without a full page load — e.g. the
  // back/forward buttons, or an in-page link jumping straight from one
  // hash to another on the same page. Without it, only the very first page
  // load honors the hash; a same-document hash change (which is all
  // back/forward and same-page hash links ever cause) wouldn't reach the
  // "open on load" check below, since that only runs once per real load.
  const modalControllers = [];
  document.querySelectorAll('[data-modal-target]').forEach((trigger) => {
    const modal = document.querySelector(trigger.getAttribute('data-modal-target'));
    if (!modal) return;

    // Any <video> inside a modal (the demo player, or a changelog entry's
    // preview clip) pauses + rewinds when the modal closes — generic, so
    // it applies to any future video without extra wiring. Only a video
    // that isn't sitting inside a collapsed <details> autoplays when the
    // modal opens — a changelog preview clip only starts once its own
    // entry is expanded, never invisibly in the background. Checked via
    // the ancestor <details>' own `.open` property directly, not layout
    // (e.g. offsetParent) — a collapsed <details> is only guaranteed to
    // hide its content visually if the browser applies the UA stylesheet's
    // `details:not([open]) > *:not(summary){display:none}` rule, which
    // isn't something to depend on for correctness here.
    const modalVideos = () => Array.from(modal.querySelectorAll('video'));
    const visibleModalVideo = () => modalVideos().find((v) => !v.closest('details:not([open])'));

    // Any other id'd element inside the modal (e.g. changelog entries) is
    // individually linkable — generic, not hardcoded to the changelog.
    const linkableEntries = Array.from(modal.querySelectorAll('[id]'));
    const entryForHash = (hash) => linkableEntries.find((el) => el.id === hash);

    const openModal = (updateHash = true, hashOverride = null) => {
      // Only one modal open at a time — a trigger button sits behind the
      // open overlay so a mouse can't normally reach a second one, but a
      // keyboard user tabbing past it still can, so this isn't purely
      // defensive.
      modalControllers.forEach((c) => {
        if (c.modal !== modal && c.modal.classList.contains('is-open')) c.closeModal();
      });
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      const targetHash = hashOverride || modal.id;
      if (updateHash && location.hash.slice(1) !== targetHash) {
        history.pushState(null, '', `#${targetHash}`);
      }
      const video = visibleModalVideo();
      if (video) video.play().catch(() => {});
    };
    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      const currentHash = location.hash.slice(1);
      if (currentHash === modal.id || entryForHash(currentHash)) {
        history.replaceState(null, '', location.pathname + location.search);
      }
      modalVideos().forEach((v) => {
        v.pause();
        v.currentTime = 0;
      });
    };
    // Expands (if it's a <details>) and scrolls a linkable entry into view.
    // Doesn't touch the hash itself — callers decide that separately.
    const revealEntry = (entry) => {
      if (entry.tagName === 'DETAILS') entry.open = true;
      entry.scrollIntoView({ block: 'start' });
    };

    trigger.addEventListener('click', () => openModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    modal.querySelectorAll('[data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    // Expanding a linkable <details> entry by hand links straight to it;
    // collapsing one that was linked falls back to the modal's own link
    // rather than clearing the hash outright (the modal is still open).
    linkableEntries.forEach((entry) => {
      if (entry.tagName !== 'DETAILS') return;
      entry.addEventListener('toggle', () => {
        if (entry.open) {
          if (location.hash.slice(1) !== entry.id) history.pushState(null, '', `#${entry.id}`);
        } else {
          if (location.hash.slice(1) === entry.id) history.replaceState(null, '', `#${modal.id}`);
          // Collapsing an entry stops any preview clip inside it rather
          // than leaving it playing silently offscreen.
          entry.querySelectorAll('video').forEach((v) => {
            v.pause();
            v.currentTime = 0;
          });
        }
      });
    });

    modalControllers.push({ modal, openModal, closeModal, entryForHash, revealEntry });

    // Open immediately if the page was loaded pointing at this modal, or at
    // one specific entry inside it — don't re-push the same hash that's
    // already there.
    const initialHash = location.hash.slice(1);
    if (initialHash === modal.id) {
      openModal(false);
    } else {
      const entry = entryForHash(initialHash);
      if (entry) {
        openModal(false, initialHash);
        revealEntry(entry);
      }
    }
  });

  window.addEventListener('hashchange', () => {
    const targetId = location.hash.slice(1);
    modalControllers.forEach(({ modal, openModal, closeModal, entryForHash, revealEntry }) => {
      const isOpen = modal.classList.contains('is-open');
      const entry = entryForHash(targetId);
      if (modal.id === targetId) {
        if (!isOpen) openModal(false);
      } else if (entry) {
        if (!isOpen) openModal(false, targetId);
        revealEntry(entry);
      } else if (isOpen) {
        closeModal();
      }
    });
  });

  // The contact form has no backend, so it hands off to the visitor's own
  // email client via a mailto: link rather than pretending to submit.
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const note = contactForm.querySelector('.form-note');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.innerHTML : '';

    const setNote = (text, color) => {
      note.textContent = text;
      note.style.color = color;
    };

    // Falls back to the old mailto hand-off if the Worker can't be reached, so
    // a backend outage never silently swallows someone's message.
    const mailtoFallback = (name, email, type, message) => {
      const subject = `[FORC3MOD] ${type} from ${name}`;
      const body = `From: ${name} (${email})\n\n${message}`;
      setNote('Couldn’t reach us directly — opening your email app instead…', '#ffb454');
      window.location.href =
        `mailto:${FORC3_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(contactForm);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const type = String(data.get('type') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (!name || !email || !type || !message) {
        setNote('Please fill in your name, email, what this is about, and your message.', '#ff6b6b');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setNote('That email address doesn’t look right.', '#ff6b6b');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      setNote('Sending…', 'var(--accent-2)');

      try {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, type, message })
        });
        if (!res.ok) throw new Error(`Worker returned ${res.status}`);

        setNote('Message sent — thanks! We’ll get back to you.', 'var(--accent-2)');
        contactForm.reset();
      } catch (err) {
        mailtoFallback(name, email, type, message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitLabel;
        }
      }
    });
  }
})();
