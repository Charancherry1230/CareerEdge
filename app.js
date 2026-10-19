/**
 * iGenuine FresherXEdge v2 (app1.js)
 * Clean, modern interactive JavaScript engine
 * Follows senior frontend engineering best practices.
 */

// Marks the page as scriptable so CSS can hide reveal targets until they animate in.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Theme: remembered choice + wave reveal ----------
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  try {
    if (localStorage.getItem('fxe-theme') === 'dark') root.dataset.theme = 'dark';
  } catch (e) { /* storage blocked: keep light */ }

  function syncThemeBtn() {
    if (!themeBtn) return;
    const dark = root.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  // Left-side region of the page is repainted in the new theme along a curved edge.
  const wavePath = x => {
    const W = innerWidth, H = innerHeight, d = W * 0.09;
    return `path('M0 0 L${x + d} 0 C${x + d * 0.4} ${H * 0.3} ${x - d * 0.9} ${H * 0.7} ${x - d} ${H} L0 ${H} Z')`;
  };
  function setTheme(next) {
    if (next === root.dataset.theme) return;
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem('fxe-theme', next); } catch (e) { /* ignore */ }
      syncThemeBtn();
    };
    if (!document.startViewTransition || reduceMotion) { apply(); return; }
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => {
      const W = innerWidth;
      root.animate(
        { clipPath: [wavePath(-W * 0.2), wavePath(W * 1.2)] },
        { duration: 900, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }
  themeBtn?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  syncThemeBtn();

  // ---------- Sliding pill under the active nav link ----------
  const primaryNav = document.querySelector('.primary-nav');
  let navInd = null;
  if (primaryNav) {
    navInd = document.createElement('span');
    navInd.className = 'nav-ind';
    primaryNav.prepend(navInd);
  }
  function placeNav() {
    if (!navInd) return;
    const active = primaryNav.querySelector('a[aria-current="page"]');
    navInd.style.opacity = active ? '1' : '0';
    if (!active) return;
    navInd.style.width = active.offsetWidth + 'px';
    navInd.style.height = active.offsetHeight + 'px';
    navInd.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
  }
  addEventListener('resize', placeNav);
  placeNav();
  document.fonts?.ready.then(placeNav);

  // ---------- Highlights: the arrows and counter step through the nine items ----------
  const hlItems = [...document.querySelectorAll('.step')];
  const hlCount = document.getElementById('hlCount');
  let hlIndex = 0;
  function renderHighlight() {
    hlItems.forEach((el, k) => el.classList.toggle('is-on', k === hlIndex));
    if (hlCount) hlCount.textContent = String(hlIndex + 1).padStart(2, '0') + ' / ' + String(hlItems.length).padStart(2, '0');
  }
  document.getElementById('hlPrev')?.addEventListener('click', () => {
    hlIndex = (hlIndex + hlItems.length - 1) % hlItems.length;
    renderHighlight();
  });
  document.getElementById('hlNext')?.addEventListener('click', () => {
    hlIndex = (hlIndex + 1) % hlItems.length;
    renderHighlight();
  });
  hlItems.forEach((el, k) => el.addEventListener('click', () => { hlIndex = k; renderHighlight(); }));
  renderHighlight();

  // ---------- Scroll reveal for cards and sections ----------
  const revealTargets = document.querySelectorAll(
    '.section-heading, .track-details, .service-card, .project-card, .stat, .benefit-card, .eligibility-layout > div, .profiler, .contact-item, .contact-form-card, .partner-showcase > div, .cta-banner, .quiet-details'
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('anim');
    el.style.transitionDelay = `${(i % 4) * 90}ms`;
  });
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
  }

  // ---------- Top Scroll Progress Bar ----------
  const scrollBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    if (scrollBar) scrollBar.style.width = `${pct}%`;
  }, { passive: true });

  // ---------- Sticky Header Shadow ----------
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (siteHeader) {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
    }
  }, { passive: true });

  // ---------- Mobile Hamburger Navigation ----------
  const menuBtn = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.primary-nav');
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const open = mainNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    mainNav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        mainNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        mainNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  // ---------- Active Nav Scroll Spy ----------
  const navAnchorLinks = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
  const trackedSections = navAnchorLinks
    .map(link => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  // Active link = the deepest tracked section crossing a line 35% down the viewport.
  // Highlights sits inside About, so both overlap; document order decides, not observer order.
  trackedSections.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
  function updateScrollSpy() {
    const line = window.innerHeight * 0.35;
    let active = null;
    trackedSections.forEach(section => {
      const r = section.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) active = section.id;
    });
    navAnchorLinks.forEach(link => {
      if (active && link.getAttribute('href') === `#${active}`) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
    placeNav();
  }
  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  window.addEventListener('resize', updateScrollSpy);
  updateScrollSpy();

  // ---------- Hero Trajectory Simulator ----------
  const trajectoryData = {
    academic: {
      title: "Conventional Engineering Graduate",
      desc: "Primarily theoretical understanding with limited hands-on production code, minimal hardware lab debugging exposure, and standard off-campus hiring hurdles.",
      tags: ["Basic Academic Syllabus", "Standard Projects", "General Applications", "Uncertain Placement Timelines"]
    },
    careeredge: {
      title: "FresherXEdge Industry-Ready Engineer",
      desc: "Specialized deep-skilling in high-demand domains (Java/DSA, VLSI, Embedded, IoT), production-standard capstone builds, diagnostic scorecards, and facilitated hiring across 70+ enterprises.",
      tags: ["Deep Domain Mastery", "Production Lab Rigor", "SME 1-on-1 Feedback", "100% Placement-Linked Refund"]
    }
  };

  const toggleBtns = document.querySelectorAll('.toggle-tab-btn');
  const trajectoryContent = document.getElementById('trajectory-content');

  function renderTrajectory(type) {
    const data = trajectoryData[type];
    if (!data || !trajectoryContent) return;
    trajectoryContent.innerHTML = `
      <h4>${data.title}</h4>
      <p>${data.desc}</p>
      <div class="trajectory-tags">
        ${data.tags.map(t => `<span>${t}</span>`).join('')}
      </div>
    `;
    toggleBtns.forEach(btn => btn.classList.toggle('is-active', btn.dataset.trajectory === type));
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      renderTrajectory(btn.dataset.trajectory);
    });
  });

  // Programme cards open the matching curriculum before anchor navigation.
  document.querySelectorAll('[data-track]').forEach(link => {
    link.addEventListener('click', () => {
      const details = document.getElementById('track-details');
      const button = document.querySelector(`[data-domain="${link.dataset.track}"]`);
      if (details && button) {
        details.open = true;
        button.click();
      }
    });
  });

  // ---------- Domains Interactive Switcher ----------
  const domainButtons = document.querySelectorAll('.domain-btn');
  const domainPanels = document.querySelectorAll('.domain-panel');

  domainButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.domain;
      domainButtons.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      domainPanels.forEach(panel => {
        panel.classList.toggle('is-active', panel.id === targetId);
        panel.setAttribute('aria-hidden', String(panel.id !== targetId));
      });
    });
  });

  // ---------- Interactive Eligibility Profiler ----------
  const cgpaRange = document.getElementById('slider-cgpa');
  const cgpaValue = document.getElementById('val-cgpa');
  const percentRange = document.getElementById('slider-percent');
  const percentValue = document.getElementById('val-percent');
  const gradYear = document.getElementById('calc-grad-year');
  const backlogs = document.getElementById('calc-arrears');
  const profilerForm = document.getElementById('eligibility-profiler-form');
  const profilerOutput = document.getElementById('profiler-output');

  if (cgpaRange && cgpaValue) {
    cgpaRange.addEventListener('input', () => {
      cgpaValue.textContent = parseFloat(cgpaRange.value).toFixed(1);
    });
  }

  if (percentRange && percentValue) {
    percentRange.addEventListener('input', () => {
      percentValue.textContent = `${percentRange.value}%`;
    });
  }

  if (profilerForm) {
    profilerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cgpa = parseFloat(cgpaRange.value);
      const percent = parseInt(percentRange.value, 10);
      const year = gradYear.value;
      const hasBacklogs = backlogs.value === 'yes';

      if (hasBacklogs) {
        profilerOutput.className = 'eligibility-output is-fail';
        profilerOutput.innerHTML = `
          <strong>Standing Arrears Prerequisite</strong>
          <p>Candidates must have 0 standing arrears at cohort commencement. As soon as arrears are cleared, your profile will be eligible!</p>
        `;
        return;
      }

      if (cgpa < 6.0) {
        profilerOutput.className = 'eligibility-output is-fail';
        profilerOutput.innerHTML = `
          <strong>CGPA Criteria</strong>
          <p>Minimum required CGPA is 6.0 (current entered: ${cgpa.toFixed(1)}).</p>
        `;
        return;
      }

      if (percent < 60) {
        profilerOutput.className = 'eligibility-output is-fail';
        profilerOutput.innerHTML = `
          <strong>Secondary / Higher Secondary Cut-off</strong>
          <p>Minimum 60% aggregate in 10th, 12th, or Diploma is required (current entered: ${percent}%).</p>
        `;
        return;
      }

      // Qualified!
      profilerOutput.className = 'eligibility-output is-pass';
      const yearNotice = (year === '2026' || year === '2025' || year === '2024')
        ? `Graduating batch of ${year} receives priority enrollment for immediate placement drives.`
        : 'Applications for earlier batches are admitted upon technical profile evaluation.';

      profilerOutput.innerHTML = `
        <strong>✓ Your Profile is Fully Eligible!</strong>
        <p>You satisfy all academic benchmarks (CGPA ${cgpa.toFixed(1)}, ${percent}% schooling, 0 backlogs). ${yearNotice}</p>
        <a class="pass-cta" href="/corpx-edge/register.php?year=${year}&cgpa=${cgpa}">Proceed to Direct Cohort Registration →</a>
      `;
    });
  }

  // ---------- Participating Companies Directory (123 Enterprises: IT + Core) ----------
  const directoryGrid = document.getElementById('companies-directory-grid');
  const searchField = document.getElementById('company-search-field');
  const counterEl = document.getElementById('companies-counter');
  const categoryChips = document.querySelectorAll('.category-chip');
  const sectorTabs = document.querySelectorAll('.sector-tab-btn');
  const inspectorThumb = document.getElementById('inspector-thumb');
  const inspectorHeading = document.getElementById('inspector-heading');
  const inspectorSub = document.getElementById('inspector-sub');
  const inspectorBox = document.getElementById('company-inspector-box');

  const boards = window.COMPANY_BOARDS || [];
  const itEntries = boards.find(b => b.key === 'it')?.entries || [];
  const coreEntries = boards.find(b => b.key === 'core')?.entries || [];

  function classifyCompany(entry, sectorKey) {
    const low = entry.name.toLowerCase();
    let category = sectorKey === 'it' ? 'Tech Giants & Cloud' : 'Heavy Eng & Infrastructure';

    if (sectorKey === 'it') {
      if (['google', 'microsoft', 'amazon', 'ibm', 'oracle', 'dell', 'hpe', 'hp', 'nokia', 'cisco'].some(k => low.includes(k))) {
        category = 'Tech Giants & Cloud';
      } else if (['nvidia', 'intel', 'amd', 'qualcomm'].some(k => low.includes(k))) {
        category = 'Semiconductors & Systems';
      } else if (['walmart', 'flipkart', 'phonepe', 'myntra', 'razorpay', 'swiggy', 'groww', 'cred', 'meesho', 'zepto', 'juspay'].some(k => low.includes(k))) {
        category = 'Fintech & Unicorns';
      } else if (['zoho', 'freshworks', 'browserstack', 'whatfix', 'chargebee', 'darwinbox', 'moengage', 'leadsquared', 'hackerearth', 'postman'].some(k => low.includes(k))) {
        category = 'SaaS & Enterprise';
      } else if (['accenture', 'tcs', 'infosys', 'deloitte', 'capgemini', 'cognizant', 'hcltech', 'wipro', 'ey', 'pwc', 'kpmg', 'ltimindtree', 'tech mahindra', 'cgi', 'mphasis', 'genpact', 'kyndryl'].some(k => low.includes(k))) {
        category = 'Consulting & IT Leaders';
      } else {
        category = 'Consulting & IT Leaders';
      }
    } else {
      if (['tata motors', 'mahindra', 'bosch', 'ather', 'tvs', 'ashok leyland', 'hyundai', 'toyota', 'maruti', 'hero', 'royal enfield', 'bajaj', 'ola'].some(k => low.includes(k))) {
        category = 'Automotive & EV';
      } else if (['texas instruments', 'analog devices', 'samsung', 'panasonic', 'philips', 'murata', 'stmicro', 'nxp', 'infineon', 'renesas'].some(k => low.includes(k))) {
        category = 'Semiconductors & Systems';
      } else if (['siemens', 'abb', 'schneider', 'larsen', 'l&t', 'alstom', 'ge', 'general electric', 'honeywell', 'cummins', 'caterpillar', 'bharat forge', 'eaton', 'emerson', 'rockwell', 'danfoss'].some(k => low.includes(k))) {
        category = 'Heavy Eng & Infrastructure';
      } else {
        category = 'Heavy Eng & Infrastructure';
      }
    }

    return {
      ...entry,
      sectorKey: sectorKey,
      sectorName: sectorKey === 'it' ? 'IT & Technology' : 'Core & Non-IT Engineering',
      categoryGroup: category
    };
  }

  const allCompanies = [
    ...itEntries.map(e => classifyCompany(e, 'it')),
    ...coreEntries.map(e => classifyCompany(e, 'core'))
  ];

  let selectedSector = 'all';
  let selectedCategory = 'all';
  let filterText = '';

  function updateDirectory() {
    if (!directoryGrid) return;

    const matched = allCompanies.filter(comp => {
      const matchSector = (selectedSector === 'all') || (comp.sectorKey === selectedSector);
      const matchCat = (selectedCategory === 'all') || (comp.categoryGroup === selectedCategory);
      const matchSearch = comp.name.toLowerCase().includes(filterText.toLowerCase()) ||
                          comp.categoryGroup.toLowerCase().includes(filterText.toLowerCase()) ||
                          comp.sectorName.toLowerCase().includes(filterText.toLowerCase());
      return matchSector && matchCat && matchSearch;
    });

    if (counterEl) {
      counterEl.textContent = `Showing ${matched.length} of 123 Hiring Partners`;
    }

    if (matched.length === 0) {
      directoryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--ink-muted);">
          <p style="font-size:16px; margin-bottom:8px;">No enterprise found matching "<strong>${filterText}</strong>" in this category.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="reset-filter-btn" style="margin-top:8px;">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          selectedSector = 'all';
          selectedCategory = 'all';
          filterText = '';
          if (searchField) searchField.value = '';
          sectorTabs.forEach((t, i) => t.classList.toggle('is-active', i === 0));
          categoryChips.forEach((c, i) => c.classList.toggle('is-active', i === 0));
          updateDirectory();
        });
      }
      return;
    }

    directoryGrid.innerHTML = matched.map(comp => {
      const sectorBadgeClass = comp.sectorKey === 'it' ? 'tile-sector-badge--it' : 'tile-sector-badge--core';
      const sectorLabel = comp.sectorKey === 'it' ? 'IT' : 'CORE';

      const logoImg = comp.file
        ? `<img src="assets/brand-logos/${comp.file}" alt="${comp.name} logo" loading="lazy">`
        : `<span class="company-tile-name">${comp.name}</span>`;

      return `
        <button type="button" class="company-tile${comp.mono ? ' is-mono' : ''}${comp.big ? ' is-big' : ''}"
          data-name="${comp.name}"
          data-sector="${comp.sectorName}"
          data-cat="${comp.categoryGroup}"
          data-file="${comp.file || ''}"
          aria-label="${comp.name} - ${comp.sectorName}">
          <span class="tile-sector-badge ${sectorBadgeClass}">${sectorLabel}</span>
          ${logoImg}
        </button>
      `;
    }).join('');

    // Attach card inspection
    directoryGrid.querySelectorAll('.company-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        directoryGrid.querySelectorAll('.company-tile').forEach(t => t.classList.remove('is-active'));
        tile.classList.add('is-active');

        const name = tile.dataset.name;
        const sector = tile.dataset.sector;
        const cat = tile.dataset.cat;
        const file = tile.dataset.file;

        if (inspectorHeading) inspectorHeading.textContent = name;
        if (inspectorSub) inspectorSub.textContent = `Sector: ${sector} • Track: ${cat} • Active Facilitated Hiring Partner`;
        if (inspectorThumb) {
          inspectorThumb.innerHTML = file
            ? `<img src="assets/brand-logos/${file}" alt="${name} logo">`
            : `<strong style="font-size:12px; color:var(--blue-900);">${name}</strong>`;
        }
        if (inspectorBox) {
          inspectorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  // Sector tab switcher (All, IT, Core)
  sectorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sectorTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      selectedSector = tab.dataset.sector;
      updateDirectory();
    });
  });

  // Sub-category chips
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      selectedCategory = chip.dataset.catGroup;
      updateDirectory();
    });
  });

  // Search input
  if (searchField) {
    searchField.addEventListener('input', (e) => {
      filterText = e.target.value.trim();
      updateDirectory();
    });
  }

  // Populate all 123 companies on init
  updateDirectory();

  // ---------- Back to Top Button ----------
  const backTop = document.getElementById('back-to-top-btn');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });

    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  // ---------- Contact Us Form Handler ----------
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  const contactBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!contactStatus) return;

      contactStatus.className = 'form-feedback';
      contactStatus.textContent = '';
      contactStatus.style.display = 'none';

      // Basic field validation
      const name = contactForm.elements['name']?.value.trim();
      const phone = contactForm.elements['phone']?.value.trim();
      const email = contactForm.elements['email']?.value.trim();
      const message = contactForm.elements['message']?.value.trim();
      const honeypot = contactForm.elements['website']?.value.trim();

      if (honeypot) return; // Silent discard for bots

      if (!name) {
        contactStatus.className = 'form-feedback is-error';
        contactStatus.textContent = 'Please enter your full name.';
        contactStatus.style.display = 'block';
        contactForm.elements['name']?.focus();
        return;
      }

      if (!phone || !/^[0-9+\s\-]{8,16}$/.test(phone)) {
        contactStatus.className = 'form-feedback is-error';
        contactStatus.textContent = 'Please enter a valid phone number (8–16 digits).';
        contactStatus.style.display = 'block';
        contactForm.elements['phone']?.focus();
        return;
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        contactStatus.className = 'form-feedback is-error';
        contactStatus.textContent = 'Please enter a valid email address.';
        contactStatus.style.display = 'block';
        contactForm.elements['email']?.focus();
        return;
      }

      if (!message) {
        contactStatus.className = 'form-feedback is-error';
        contactStatus.textContent = 'Please provide a message or question.';
        contactStatus.style.display = 'block';
        contactForm.elements['message']?.focus();
        return;
      }

      // Submit state
      const originalText = contactBtn ? contactBtn.innerHTML : 'Submit Message';
      if (contactBtn) {
        contactBtn.disabled = true;
        contactBtn.innerHTML = 'Sending Message...';
      }

      try {
        const formData = new FormData(contactForm);
        const res = await fetch('send_mail.php', {
          method: 'POST',
          body: formData
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data && data.ok) {
          contactStatus.style.display = 'none';
          contactStatus.textContent = '';
          contactForm.reset();
        } else {
          // Local or test preview: silently reset form with no verbose text
          contactStatus.style.display = 'none';
          contactStatus.textContent = '';
          contactForm.reset();
        }
      } catch (err) {
        contactStatus.style.display = 'none';
        contactStatus.textContent = '';
        contactForm.reset();
      } finally {
        if (contactBtn) {
          contactBtn.disabled = false;
          contactBtn.innerHTML = originalText;
        }
      }
    });
  }
});
