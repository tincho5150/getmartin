/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * getmartin.com — main.js
 * Scroll, nav, chapter animations, form
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     NAV — progress bar + dot state
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const progressBar = document.querySelector('.nav-progress');
  const navDots     = document.querySelectorAll('.nav-dot');
  const chapters    = document.querySelectorAll('.chapter');

  // Update progress bar on scroll
  function updateProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';
  }

  // Update active dot based on which chapter is in view
  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(chapters).indexOf(entry.target);
        navDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === idx);
        });
        // Update chapter tag
        const tag = document.querySelector('.chapter-tag-text');
        if (tag && entry.target.dataset.chapter) {
          tag.textContent = entry.target.dataset.chapter;
        }
      }
    });
  }, { threshold: 0.5 });

  chapters.forEach(ch => dotObserver.observe(ch));

  // Nav dot click — smooth scroll to chapter
  navDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (chapters[i]) {
        chapters[i].scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     NAV DOT TOOLTIPS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const chapterNames = [
    'The Problem',
    'The Contrast',
    'The Method',
    'The Formats',
    "Let's talk"
  ];

  navDots.forEach((dot, i) => {
    dot.setAttribute('title', chapterNames[i] || '');
  });


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CH1 — HEADLINE FADE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const headA = document.querySelector('.headline-a');
  const headB = document.querySelector('.headline-b');

  if (headA && headB) {
    setTimeout(() => {
      headA.classList.add('fade-out');
      setTimeout(() => {
        headB.classList.add('fade-in');
      }, 8000);
    }, 1200);
  }


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CH1 — SCRAMBLE COUNTER
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function scramble(card, target, delay) {
    const numEl = card.querySelector('.num-val');
    const sufEl = card.querySelector('.num-suf');
    const bar   = card.querySelector('.stat-bar');
    if (!numEl) return;

    const total  = 1500;
    const scrEnd = 0.40;
    const setEnd = 0.78;
    let   ts0    = null;

    setTimeout(() => {
      if (bar) bar.style.width = '100%';
      numEl.classList.add('slam');

      function tick(ts) {
        if (!ts0) ts0 = ts;
        const p = Math.min((ts - ts0) / total, 1);

        if (p < scrEnd) {
          const sp = p / scrEnd;
          numEl.textContent = sp > 0.65
            ? Math.round(sp * target)
            : Math.floor(Math.random() * Math.max(target * 1.5, 20));
        } else if (p < setEnd) {
          const sp    = (p - scrEnd) / (setEnd - scrEnd);
          const eased = 1 - Math.pow(1 - sp, 2);
          numEl.textContent = Math.min(
            Math.round(eased * target) + Math.round((1 - sp) * 3),
            target + 3
          );
        } else {
          numEl.textContent = target;
          if (sufEl && !sufEl.classList.contains('show')) sufEl.classList.add('show');
          if (p === 1) { numEl.classList.add('pulse'); return; }
        }
        if (p < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }, delay);
  }

  const statDelays = [500, 700, 900];
  let statIndex = 0;
  document.querySelectorAll('.stats-grid .stat-card').forEach(card => {
    const numEl = card.querySelector('.num-val');
    if (!numEl) return;
    const i = statIndex++;
    scramble(card, parseInt(numEl.dataset.target), statDelays[i]);
  });


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CH2 — BAR SWEEPS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  // Triggered by IntersectionObserver when ch2 enters view
  const ch2BarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delays = [600, 800, 1000];
        entry.target.querySelectorAll('.card-reveal').forEach((card, i) => {
          setTimeout(() => card.classList.add('bar-active'), delays[i]);
        });
        ch2BarObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const ch2 = document.querySelector('#ch2');
  if (ch2) ch2BarObserver.observe(ch2);


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CH4 — FORMAT CARD BAR SWEEPS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const ch4BarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delays = [500, 700, 900, 1100];
        entry.target.querySelectorAll('.format-card').forEach((card, i) => {
          setTimeout(() => card.classList.add('bar-active'), delays[i]);
        });
        ch4BarObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const ch4 = document.querySelector('#ch4');
  if (ch4) ch4BarObserver.observe(ch4);


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CH5 — FORM SUBMIT
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const form        = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn   = document.getElementById('submit-btn');

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name    = document.getElementById('name')?.value.trim();
      const email   = document.getElementById('email')?.value.trim();
      const problem = document.getElementById('problem')?.value.trim();

      if (!name || !email || !problem) return;

      if (form) {
        form.style.opacity = '0';
        form.style.transition = 'opacity 0.4s';
        setTimeout(() => {
          form.style.display = 'none';
          if (formSuccess) formSuccess.classList.add('visible');
        }, 400);
      }
    });
  }

});
