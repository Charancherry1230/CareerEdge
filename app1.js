/**
 * iGenuine CareerEdge v2 (app1.js)
 * Clean, modern interactive JavaScript engine
 * Follows senior frontend engineering best practices.
 */

document.addEventListener('DOMContentLoaded', () => {
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

  if ('IntersectionObserver' in window && trackedSections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchorLinks.forEach(link => {
            const isTarget = link.getAttribute('href') === `#${entry.target.id}`;
            if (isTarget) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { rootMargin: '-30% 0px -50% 0px' });

    trackedSections.forEach(section => observer.observe(section));
  }

  // ---------- Hero Trajectory Simulator ----------
  const trajectoryData = {
    academic: {
      title: "Conventional Engineering Graduate",
      desc: "Primarily theoretical understanding with limited hands-on production code, minimal hardware lab debugging exposure, and standard off-campus hiring hurdles.",
      tags: ["Basic Academic Syllabus", "Standard Projects", "General Applications", "Uncertain Placement Timelines"]
    },
    careeredge: {
      title: "CareerEdge Industry-Ready Engineer",
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

  // ---------- Domains Interactive Switcher ----------
  const domainButtons = document.querySelectorAll('.domain-btn');
  const domainPanels = document.querySelectorAll('.domain-panel');

  domainButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.domain;
      domainButtons.forEach(b => b.classList.toggle('is-active', b === btn));
      domainPanels.forEach(panel => {
        panel.classList.toggle('is-active', panel.id === targetId);
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

  // ---------- Participating Companies Directory ----------
  const directoryGrid = document.getElementById('companies-directory-grid');
  const searchField = document.getElementById('company-search-field');
  const categoryChips = document.querySelectorAll('.category-chip');
  const inspectorThumb = document.getElementById('inspector-thumb');
  const inspectorHeading = document.getElementById('inspector-heading');
  const inspectorSub = document.getElementById('inspector-sub');
  const inspectorBox = document.getElementById('company-inspector-box');

  const boards = window.COMPANY_BOARDS || [];
  const itCompanies = boards.find(b => b.key === 'it')?.entries || [];

  // Group companies into clean logical categories
  const allCompanies = itCompanies.map(entry => {
    let category = 'Tech Giants & Cloud';
    const low = entry.name.toLowerCase();

    if (['google', 'microsoft', 'amazon', 'ibm', 'oracle', 'dell', 'hpe', 'hp', 'nokia', 'cisco'].some(k => low.includes(k))) {
      category = 'Tech Giants & Cloud';
    } else if (['nvidia', 'intel', 'amd', 'qualcomm', 'ather'].some(k => low.includes(k))) {
      category = 'Semiconductors & Systems';
    } else if (['walmart', 'flipkart', 'phonepe', 'myntra', 'razorpay', 'swiggy', 'groww', 'cred', 'meesho', 'zepto', 'juspay'].some(k => low.includes(k))) {
      category = 'Fintech & Unicorns';
    } else if (['zoho', 'freshworks', 'browserstack', 'whatfix', 'chargebee', 'darwinbox', 'moengage', 'leadsquared', 'hackerearth'].some(k => low.includes(k))) {
      category = 'SaaS & Enterprise';
    } else if (['accenture', 'tcs', 'infosys', 'deloitte', 'capgemini', 'cognizant', 'hcltech', 'wipro', 'ey', 'pwc', 'kpmg', 'ltimindtree', 'tech mahindra', 'cgi', 'mphasis', 'genpact', 'kyndryl'].some(k => low.includes(k))) {
      category = 'Consulting & IT Leaders';
    } else {
      category = 'High-Growth Tech';
    }

    return {
      ...entry,
      categoryGroup: category
    };
  });

  let selectedCategory = 'all';
  let filterText = '';

  function updateDirectory() {
    if (!directoryGrid) return;

    const matched = allCompanies.filter(comp => {
      const matchSearch = comp.name.toLowerCase().includes(filterText.toLowerCase());
      const matchCat = (selectedCategory === 'all') || (comp.categoryGroup === selectedCategory);
      return matchSearch && matchCat;
    });

    if (matched.length === 0) {
      directoryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--ink-muted);">
          <p>No participating enterprise matches "<strong>${filterText}</strong>". Clear search to view all 70 companies.</p>
        </div>
      `;
      return;
    }

    directoryGrid.innerHTML = matched.map(comp => {
      const imageOrName = comp.file 
        ? `<img src="assets/brand-logos/${comp.file}" alt="${comp.name} logo" loading="lazy">` 
        : `<span class="company-tile-name">${comp.name}</span>`;

      return `
        <button type="button" class="company-tile" data-name="${comp.name}" data-cat="${comp.categoryGroup}" data-file="${comp.file || ''}" aria-label="${comp.name}">
          ${imageOrName}
        </button>
      `;
    }).join('');

    // Attach card inspection
    directoryGrid.querySelectorAll('.company-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        directoryGrid.querySelectorAll('.company-tile').forEach(t => t.classList.remove('is-active'));
        tile.classList.add('is-active');

        const name = tile.dataset.name;
        const cat = tile.dataset.cat;
        const file = tile.dataset.file;

        if (inspectorHeading) inspectorHeading.textContent = name;
        if (inspectorSub) inspectorSub.textContent = `Industry Category: ${cat} • Active Facilitated Hiring Partner`;
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

  if (searchField) {
    searchField.addEventListener('input', (e) => {
      filterText = e.target.value.trim();
      updateDirectory();
    });
  }

  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      selectedCategory = chip.dataset.catGroup;
      updateDirectory();
    });
  });

  // Initial populate of 70 companies
  updateDirectory();

  // ---------- FAQ Accordion ----------
  const faqTiles = document.querySelectorAll('.faq-tile');
  faqTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const isOpen = tile.classList.contains('is-open');
      faqTiles.forEach(t => t.classList.remove('is-open'));
      if (!isOpen) tile.classList.add('is-open');
    });
  });

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
