/* ============================================================
   MADIVAL EDITS — script.js
   Interactive features: cursor, navbar, filter, form, scroll
   ============================================================ */

'use strict';

/* ── CUSTOM CURSOR ─────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale up ring on interactive elements
  const interactiveEls = 'a, button, .service-card, .portfolio-item, .filter-btn, input, textarea, select';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveEls)) {
      ring.style.transform   = 'translate(-50%,-50%) scale(1.8)';
      ring.style.borderColor = 'rgba(255,60,60,0.9)';
      dot.style.transform    = 'translate(-50%,-50%) scale(0)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveEls)) {
      ring.style.transform   = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(255,60,60,0.6)';
      dot.style.transform    = 'translate(-50%,-50%) scale(1)';
    }
  });
})();


/* ── NAVBAR: scroll + highlight + hamburger ────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = document.querySelectorAll('.nav-link');

  // Scrolled state
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  }, { passive: true });

  // Hamburger toggle
  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Highlight active section link
  function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    allLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  highlightActiveLink();
})();


/* ── SMOOTH SCROLL (for older browsers fallback) ───────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ── PORTFOLIO FILTER ──────────────────────────────────────── */
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.portfolio-item');

  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Filter items with animation
      items.forEach((item, i) => {
        const match = filter === 'all' || item.dataset.category === filter;

        if (match) {
          // Reveal with stagger
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9) translateY(20px)';
          // Use requestAnimationFrame to ensure CSS transition runs
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
              item.style.opacity = '1';
              item.style.transform = 'scale(1) translateY(0)';
            });
          });
        } else {
          // Hide
          item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 260);
        }
      });
    });
  });
})();


/* ── CONTACT FORM ──────────────────────────────────────────── */
(function initContactForm() {
  const form  = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload

    // Basic validation
    const name    = form.querySelector('#name').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !message) {
      shakeForm();
      return;
    }

    // Simulate sending
    const btn     = form.querySelector('.btn-submit');
    const btnText = btn.querySelector('.btn-text');
    const btnArrow= btn.querySelector('.btn-arrow');

    btn.disabled = true;
    btnText.textContent = 'Sending…';
    btnArrow.textContent = '⏳';

    setTimeout(() => {
      // Reset button
      btn.disabled = false;
      btnText.textContent = 'Send Message';
      btnArrow.textContent = '→';

      // Reset form
      form.reset();

      // Show toast
      showToast('Message sent successfully! 🎬');
    }, 1200);
  });

  function shakeForm() {
    const fw = form.querySelector('.contact-form-wrap') || form;
    fw.style.animation = 'shake 0.4s ease';
    fw.addEventListener('animationend', () => { fw.style.animation = ''; }, { once: true });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
})();


/* ── SCROLL REVEAL ─────────────────────────────────────────── */
(function initReveal() {
  // Add reveal class to key elements
  const targets = [
    '.service-card',
    '.portfolio-item',
    '.contact-item',
    '.section-header',
    '.contact-form-wrap',
    '.contact-info',
    '.contact-quote',
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ── PLACEHOLDER GENERATOR (for missing media) ─────────────── */
// Called via onerror on img/video elements
window.generatePlaceholder = function(type, name) {
  const icons = {
    'Photo Edit': '📸',
    'Short Video': '🎬',
    'Long Video': '🎥',
  };
  const icon = icons[type] || '🎞️';
  return `
    <div class="placeholder-media">
      <span class="placeholder-icon">${icon}</span>
      <span class="placeholder-type">${type}</span>
      <span class="placeholder-name">${name}</span>
    </div>
  `;
};


/* ── CSS INJECTION for missing animations ───────────────────── */
(function injectAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();


/* ── HERO PARALLAX (subtle) ────────────────────────────────── */
(function initParallax() {
  const blobs = document.querySelectorAll('.blob');
  const bgLetters = document.querySelectorAll('.bg-letters span');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    blobs.forEach((b, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      b.style.transform = `translateY(${sy * 0.08 * dir}px)`;
    });
    bgLetters.forEach((l, i) => {
      const dir = i % 2 === 0 ? 0.04 : -0.04;
      l.style.transform = `translateY(${sy * dir}px)`;
    });
  }, { passive: true });
})();
