/* iGenuine CareerEdge: page behaviour. No dependencies. */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const header = $('.site-header');
  const toggle = $('.menu-toggle');
  const nav = $('#primary-nav');
  const toast = $('[data-toast]');
  const status = $('[data-status]');
  let toastTimer;

  // ---------- Mobile menu ----------
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));

  // Close the menu after picking a link, or on Escape.
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  // Reset the mobile menu when the viewport grows back to desktop.
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });

  // ---------- Highlight the section in view ----------
  const links = $$('.primary-nav a[href^="#"]');
  const sections = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const on = a.getAttribute('href') === '#' + entry.target.id;
          if (on) a.setAttribute('aria-current', 'page');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  // ---------- Placeholder actions ----------
  // Apply Now, Download Brochure and unlinked footer items have no destination yet.
  // Show a clear message instead of a dead link or a fake success.
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
  };

  $$('[data-placeholder]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const what = el.dataset.placeholder;
      showToast(`${what} is not connected yet.`);
    });
  });

  // "View All Companies": the full list is not supplied yet, so explain rather than fake it.
  const viewAll = $('[data-view-all]');
  if (viewAll) {
    viewAll.addEventListener('click', () => {
      if (status) status.textContent = 'The full company list is not connected yet. The companies shown are from the programme brief.';
    });
  }

  // ---------- Subscribe form (footer) ----------
  const form = $('[data-subscribe]');
  if (form) {
    const input = $('input', form);
    const msg = $('#subscribe-msg');
    // Practical email check: one @, no spaces, a dot in the domain.
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) {
        setFormState('Please enter your email address.', 'error');
      } else if (!emailOk(value)) {
        setFormState('Please enter a valid email address, for example name@example.com.', 'error');
      } else {
        // No subscription backend is connected yet, so do not claim success.
        setFormState('Thanks. Subscriptions are not connected yet, so your email was not saved.', 'info');
      }
    });

    input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
      if (msg.classList.contains('is-error')) setFormState('', '');
    });

    function setFormState(text, kind) {
      msg.textContent = text;
      msg.classList.toggle('is-error', kind === 'error');
      msg.classList.toggle('is-info', kind === 'info');
      if (kind === 'error') input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }

  // ---------- Scroll reveal (fades sections in once) ----------
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = $$('.section-head, .split > *, .grid > *, .bento > *, .bento__stats > *, .logo-grid, .cta, .footer-grid > *, .deliverables-grid > *, .elig__item, .elig__checker-card, .register-card');
  revealTargets.forEach((el) => el.classList.add('reveal'));
  if ('IntersectionObserver' in window && !reduceMotion) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => ro.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- Header shadow on scroll ----------
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Eligibility Checker ----------
  const eligForm = $('#eligibility-form');
  const eligResult = $('#checker-result');
  if (eligForm && eligResult) {
    eligForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const year = $('#check-grad-year').value;
      const cgpa = parseFloat($('#check-cgpa').value) || 0;
      const percent = parseFloat($('#check-percent').value) || 0;
      const arrears = $('#check-arrears').value === 'yes';

      if (arrears) {
        eligResult.className = 'checker-form__result is-ineligible';
        eligResult.innerHTML = '<strong>Not Currently Eligible:</strong> Candidates must have 0 standing arrears at the time of cohort commencement. Once arrears are cleared, you are welcome to apply!';
        return;
      }

      if (cgpa < 6.0) {
        eligResult.className = 'checker-form__result is-ineligible';
        eligResult.innerHTML = `<strong>CGPA Requirement:</strong> Minimum required CGPA is 6.0 (current entered: ${cgpa}).`;
        return;
      }

      if (percent < 60) {
        eligResult.className = 'checker-form__result is-ineligible';
        eligResult.innerHTML = `<strong>Schooling Cut-off:</strong> Minimum 60% required in 10th/12th/Diploma (current entered: ${percent}%).`;
        return;
      }

      eligResult.className = 'checker-form__result is-eligible';
      const batchNote = (year === '2026' || year === '2025' || year === '2024')
        ? `Graduating batch of ${year} is preferred for upcoming recruitment cycles.`
        : 'Applications for earlier batches are subject to profile review.';
      eligResult.innerHTML = `<strong>✓ Profile Qualified!</strong> You meet the academic criteria. ${batchNote}<br><a class="btn-apply-direct" href="/corpx-edge/register.php">Proceed to Registration →</a>`;
    });
  }
})();
