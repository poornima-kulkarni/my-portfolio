/**
 * Portfolio Script — Aryan Mehta
 * - Dark/Light theme toggle (persisted in localStorage)
 * - Custom cursor (desktop)
 * - Mobile nav toggle
 * - Nav scroll behaviour
 * - Scroll reveal (IntersectionObserver)
 * - Counter animation
 * - Contact form validation
 * - Project card 3-D tilt
 * - Skill tag ripple
 */

'use strict';

/* ====================================================
   THEME TOGGLE
   ==================================================== */
(function initTheme() {
  const html       = document.documentElement;
  const btn        = document.getElementById('themeToggle');
  const STORAGE_KEY = 'portfolio-theme';

  // Load saved preference (fallback: light)
  const saved = localStorage.getItem(STORAGE_KEY) || 'light';
  html.setAttribute('data-theme', saved);

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch(e) {}
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      // Quick rotation animation on button
      btn.style.transform = 'rotate(360deg)';
      setTimeout(() => { btn.style.transform = ''; }, 400);
    });
  }
})();


/* ====================================================
   CUSTOM CURSOR  (desktop only)
   ==================================================== */
(function initCursor() {
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursor || !cursorDot) return;

  let targetX = -200, targetY = -200;
  let ringX   = -200, ringY   = -200;

  // Raw mouse → dot snaps immediately, ring lerps
  document.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorDot.style.left = targetX + 'px';
    cursorDot.style.top  = targetY + 'px';
  });

  (function animateRing() {
    ringX += (targetX - ringX) * 0.13;
    ringY += (targetY - ringY) * 0.13;
    cursor.style.left = ringX + 'px';
    cursor.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover expand
  const hoverEls = document.querySelectorAll(
    'a, button, .tag, .project-card, .skill-category, .about-stat-card, input, textarea, .social-link'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));
  document.addEventListener('mouseleave',() => { cursor.style.opacity = '0'; cursorDot.style.opacity = '0'; });
  document.addEventListener('mouseenter',() => { cursor.style.opacity = '1'; cursorDot.style.opacity = '1'; });
})();


/* ====================================================
   NAVIGATION — scroll & mobile toggle
   ==================================================== */
(function initNav() {
  const nav      = document.getElementById('mainNav');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links    = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

  // Scroll behaviour
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 40) nav.classList.add('scrolled');
    else        nav.classList.remove('scrolled');
    lastScroll = y;
  }, { passive: true });

  if (!toggle || !navLinks) return;

  // Open / close mobile menu
  function openMenu(open) {
    navLinks.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    openMenu(!navLinks.classList.contains('open'));
  });

  // Close on link click
  links.forEach(link => link.addEventListener('click', () => openMenu(false)));

  // Close on outside tap / click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) openMenu(false);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') openMenu(false);
  });
})();


/* ====================================================
   SCROLL REVEAL — IntersectionObserver
   ==================================================== */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Stagger siblings in same parent
      const siblings = [...entry.target.parentElement.children]
        .filter(c => c.classList.contains('reveal') && !c.classList.contains('visible'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = Math.max(idx * 0.09, 0) + 's';
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ====================================================
   COUNTER ANIMATION
   ==================================================== */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length) return;

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const dur    = 1500;
      const start  = performance.now();

      (function step(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(easeOutQuart(p) * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      })(start);

      io.unobserve(el);
    });
  }, { threshold: 0.6 });

  nums.forEach(el => io.observe(el));
})();


/* ====================================================
   CONTACT FORM VALIDATION
   ==================================================== */
(function initForm() {
  const form         = document.getElementById('contactForm');
  if (!form) return;

  const nameInput    = document.getElementById('fname');
  const emailInput   = document.getElementById('femail');
  const msgInput     = document.getElementById('fmessage');
  const nameErr      = document.getElementById('nameError');
  const emailErr     = document.getElementById('emailError');
  const msgErr       = document.getElementById('messageError');
  const successMsg   = document.getElementById('formSuccess');

  function setErr(input, el, msg) {
    input.classList.add('error');
    if (el) el.textContent = msg;
  }
  function clrErr(input, el) {
    input.classList.remove('error');
    if (el) el.textContent = '';
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  // Live clear
  nameInput.addEventListener('input',  () => clrErr(nameInput, nameErr));
  emailInput.addEventListener('input', () => clrErr(emailInput, emailErr));
  msgInput.addEventListener('input',   () => clrErr(msgInput, msgErr));

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    clrErr(nameInput, nameErr); clrErr(emailInput, emailErr); clrErr(msgInput, msgErr);
    if (successMsg) successMsg.textContent = '';

    if (nameInput.value.trim().length < 2)     { setErr(nameInput, nameErr, 'Please enter your name.'); ok = false; }
    if (!validEmail(emailInput.value.trim()))   { setErr(emailInput, emailErr, 'Please enter a valid email.'); ok = false; }
    if (msgInput.value.trim().length < 10)      { setErr(msgInput, msgErr, 'Message too short (min 10 chars).'); ok = false; }
    if (!ok) return;

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      if (successMsg) successMsg.textContent = '✓ Message received! I\'ll be in touch soon.';
      form.reset();
      btn.textContent = orig;
      btn.disabled = false;
    }, 1400);
  });
})();


/* ====================================================
   PROJECT CARD 3-D TILT
   ==================================================== */
(function initTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left - r.width  / 2;
      const y  = e.clientY - r.top  - r.height / 2;
      const rX = (y / (r.height / 2)) * -5;
      const rY = (x / (r.width  / 2)) *  5;
      card.style.transform  = `translateY(-8px) rotateX(${rX}deg) rotateY(${rY}deg)`;
      card.style.transition = 'transform .08s linear';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform .4s ease, box-shadow .35s';
    });
  });
})();


/* ====================================================
   SKILL TAG RIPPLE
   ==================================================== */
(function initRipple() {
  // Inject keyframes once
  const style = document.createElement('style');
  style.textContent = '@keyframes ripple{to{transform:scale(1.8);opacity:0;}}';
  document.head.appendChild(style);

  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', e => {
      const r      = tag.getBoundingClientRect();
      const size   = Math.max(r.width, r.height) * 1.4;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${e.clientX - r.left - size/2}px;
        top:${e.clientY - r.top  - size/2}px;
        background:rgba(122,158,135,0.3);
        transform:scale(0); animation:ripple .5s ease-out forwards;
      `;
      tag.style.position = 'relative';
      tag.style.overflow = 'hidden';
      tag.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();


/* ====================================================
   SMOOTH ANCHOR SCROLL (polyfill for older browsers)
   ==================================================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const id  = this.getAttribute('href');
      if (id === '#') return;
      const el  = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ====================================================
   TITLE SEP BLINK (tiny hero detail)
   ==================================================== */
(function() {
  const sep = document.querySelector('.title-sep');
  if (!sep) return;
  setInterval(() => {
    sep.style.opacity = sep.style.opacity === '0.1' ? '0.4' : '0.1';
  }, 900);
})();
