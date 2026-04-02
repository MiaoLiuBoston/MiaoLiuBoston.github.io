// ============================================================
//  Miao Liu — Academic Site  |  main.js
//  Vanilla JS only — zero dependencies
// ============================================================

(function () {
  'use strict';

  // ── Navbar scroll effect ──────────────────────────────────
  const navbar   = document.getElementById('navbar');
  const backTop  = document.getElementById('back-top');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [];

  navLinks.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) sections.push({ id, el, a });
  });

  function onScroll() {
    const y = window.scrollY;

    // scrolled class
    navbar.classList.toggle('scrolled', y > 10);

    // back-to-top button
    backTop.classList.toggle('visible', y > 400);

    // active nav link — find the section whose top is nearest above the midpoint
    const mid = y + window.innerHeight * 0.35;
    let active = sections[0];
    for (const s of sections) {
      if (s.el.offsetTop <= mid) active = s;
    }
    navLinks.forEach(a => a.classList.remove('active'));
    if (active) active.a.classList.add('active');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav toggle ─────────────────────────────────────
  const toggle  = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // close on link click
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // ── Back to top ───────────────────────────────────────────
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Paper filter ──────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const paperCards = document.querySelectorAll('.paper-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;

      paperCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── Smooth offset scroll for hash links (account for fixed nav) ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Intersection Observer: fade-in sections ───────────────
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
      .reveal.visible { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(
      '.paper-card, .course-card, .award-item, .press-item, .edu-item, .contact-block'
    ).forEach(el => {
      el.classList.add('reveal');
      obs.observe(el);
    });
  }

})();
