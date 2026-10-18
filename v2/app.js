/* Genuine CareerEdge — page behaviour. No dependencies. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  $("[data-year]").textContent = new Date().getFullYear();

  /* ---------- Header: scrolled state, mobile sheet, scroll-spy ---------- */
  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  const sheet = $("#mobile-menu");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    sheet.hidden = !open;
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(sheet.hidden));
  sheet.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
  addEventListener("keydown", (e) => e.key === "Escape" && !sheet.hidden && (setMenu(false), toggle.focus()));
  matchMedia("(min-width: 1081px)").addEventListener("change", (e) => e.matches && setMenu(false));

  const links = $$(".nav__links a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("is-active", a.hash === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["about", "highlights", "deliverables", "companies", "register", "contact"].forEach((id) => spy.observe(document.getElementById(id)));

  const CATS = {
    g: "Global technology",
    s: "Semiconductors",
    i: "IT services & consulting",
    c: "Consumer internet & fintech",
    a: "SaaS & edtech",
    e: "Engineering & solutions",
  };
  // [number from the official list, full name, short label, symbol, sector]
  const COMPANIES = [
    [4, "NVIDIA", "NVIDIA", "Nv", "s"], [7, "Intel", "Intel", "In", "s"], [8, "AMD", "AMD", "Ad", "s"], [9, "Qualcomm", "Qualcomm", "Qc", "s"],
    [1, "Google", "Google", "Go", "g"], [2, "Microsoft", "Microsoft", "Ms", "g"], [3, "Amazon", "Amazon", "Am", "g"], [5, "IBM", "IBM", "Ib", "g"],
    [6, "Oracle", "Oracle", "Or", "g"], [10, "Cisco", "Cisco", "Cs", "g"], [11, "SAP Labs India", "SAP Labs", "Sp", "g"], [12, "Dell Technologies", "Dell", "Dl", "g"],
    [13, "Hewlett Packard Enterprise (HPE)", "HPE", "He", "g"], [14, "HP Inc.", "HP Inc.", "Hp", "g"], [15, "Nokia", "Nokia", "Nk", "g"], [33, "Walmart Global Tech India", "Walmart", "Wm", "g"],
    [16, "Accenture", "Accenture", "Ac", "i"], [17, "Tata Consultancy Services (TCS)", "TCS", "Tc", "i"], [18, "Infosys", "Infosys", "If", "i"], [19, "Deloitte India", "Deloitte", "Dt", "i"],
    [20, "Capgemini", "Capgemini", "Cp", "i"], [21, "Cognizant", "Cognizant", "Cz", "i"], [22, "HCLTech", "HCLTech", "Hc", "i"], [23, "Wipro", "Wipro", "Wp", "i"],
    [24, "EY India", "EY", "Ey", "i"], [25, "PwC India", "PwC", "Pw", "i"], [26, "KPMG India", "KPMG", "Km", "i"], [27, "LTIMindtree", "LTIMindtree", "Lt", "i"],
    [28, "Tech Mahindra", "Tech Mahindra", "Tm", "i"], [29, "CGI", "CGI", "Ci", "i"], [30, "Mphasis", "Mphasis", "Mp", "i"], [31, "Genpact", "Genpact", "Gp", "i"],
    [32, "Kyndryl", "Kyndryl", "Ky", "i"],
    [34, "Flipkart", "Flipkart", "Fk", "c"], [35, "PhonePe", "PhonePe", "Pp", "c"], [36, "Myntra", "Myntra", "My", "c"], [37, "Razorpay", "Razorpay", "Rz", "c"],
    [38, "Swiggy", "Swiggy", "Sw", "c"], [39, "Groww", "Groww", "Gr", "c"], [40, "CRED", "CRED", "Cr", "c"], [41, "Meesho", "Meesho", "Me", "c"],
    [42, "Zepto", "Zepto", "Zp", "c"], [43, "Ather Energy", "Ather", "At", "c"], [44, "Rapido", "Rapido", "Rp", "c"], [45, "Porter", "Porter", "Pt", "c"],
    [67, "DrinkPrime", "DrinkPrime", "Dp", "c"], [70, "Juspay", "Juspay", "Js", "c"],
    [46, "Zoho", "Zoho", "Zo", "a"], [47, "Freshworks", "Freshworks", "Fw", "a"], [48, "BrowserStack", "BrowserStack", "Bs", "a"], [49, "Whatfix", "Whatfix", "Wf", "a"],
    [50, "Chargebee", "Chargebee", "Cb", "a"], [51, "Darwinbox", "Darwinbox", "Db", "a"], [52, "MoEngage", "MoEngage", "Mo", "a"], [53, "LeadSquared", "LeadSquared", "Ls", "a"],
    [54, "HackerEarth", "HackerEarth", "Hk", "a"], [55, "Practo", "Practo", "Pr", "a"], [56, "Unacademy", "Unacademy", "Un", "a"], [57, "Simplilearn", "Simplilearn", "Sl", "a"],
    [58, "Redington", "Redington", "Rd", "e"], [59, "In Time Tec", "In Time Tec", "It", "e"], [60, "Value Point Systems", "Value Point", "Vp", "e"], [61, "Sysnet Global Technologies", "Sysnet", "Sy", "e"],
    [62, "Cumulations Technologies", "Cumulations", "Cu", "e"], [63, "Airdit Software Services", "Airdit", "Ai", "e"], [64, "Webaxis Software Services", "Webaxis", "Wx", "e"], [65, "Techasoft", "Techasoft", "Ts", "e"],
    [66, "Appriffy", "Appriffy", "Ap", "e"], [68, "Smart Food Safe India", "Smart Food Safe", "Sf", "e"], [69, "Synergy Group", "Synergy", "Sg", "e"],
  ];
  // Logos by company number. Vector marks (Simple Icons, pinned) where the site icon is low-res,
  // otherwise the company's own site icon. Webaxis (64) and Synergy (69) use files supplied by iGenuine.
  // ponytail: hotlinked icons; drop official SVGs into assets/logos/ and point these at them when you have them.
  const SI = (s) => `https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/${s}.svg`;
  const FAV = (d, www) => `https://www.google.com/s2/favicons?domain=${www ? "www." : ""}${d}&sz=${www ? 256 : 128}`;
  const DDG = (d) => `https://icons.duckduckgo.com/ip3/${d}.ico`;
  const LOGOS = {
    1: FAV("google.com"), 2: FAV("microsoft.com"), 3: SI("amazon"), 4: SI("nvidia"), 5: FAV("ibm.com"),
    6: SI("oracle"), 7: SI("intel"), 8: SI("amd"), 9: SI("qualcomm"), 10: SI("cisco"),
    11: FAV("sap.com"), 12: SI("dell"), 13: FAV("hpe.com"), 14: SI("hp"), 15: FAV("nokia.com"),
    16: SI("accenture"), 17: SI("tcs"), 18: FAV("infosys.com"), 19: FAV("deloitte.com"), 20: FAV("capgemini.com"),
    21: FAV("cognizant.com"), 22: FAV("hcltech.com", true), 23: FAV("wipro.com"), 24: FAV("ey.com"), 25: FAV("pwc.com"),
    26: FAV("kpmg.com"), 27: DDG("ltimindtree.com"), 28: FAV("techmahindra.com", true), 29: FAV("cgi.com"), 30: FAV("mphasis.com"),
    31: FAV("genpact.com"), 32: FAV("kyndryl.com"), 33: FAV("walmart.com"), 34: FAV("flipkart.com"), 35: FAV("phonepe.com"),
    36: FAV("myntra.com"), 37: FAV("razorpay.com"), 38: FAV("swiggy.com"), 39: FAV("groww.in"), 40: FAV("cred.club"),
    41: FAV("meesho.com"), 42: FAV("zeptonow.com"), 43: FAV("atherenergy.com"), 44: FAV("rapido.bike"), 45: FAV("porter.in"),
    46: SI("zoho"), 47: FAV("freshworks.com"), 48: DDG("browserstack.com"), 49: FAV("whatfix.com"), 50: FAV("chargebee.com"),
    51: FAV("darwinbox.com"), 52: FAV("moengage.com"), 53: FAV("leadsquared.com"), 54: FAV("hackerearth.com"), 55: FAV("practo.com"),
    56: FAV("unacademy.com"), 57: FAV("simplilearn.com"), 58: FAV("redingtongroup.com"), 59: FAV("intimetec.com"), 60: FAV("valuepointsystems.com"),
    61: FAV("sysnetglobal.com"), 62: FAV("cumulations.com"), 63: FAV("airditsoftware.com"), 64: "../assets/logos/webaxis.png", 65: FAV("techasoft.com"), 66: FAV("appriffy.com"),
    67: FAV("drinkprime.in"), 68: FAV("smartfoodsafe.com"), 69: "../assets/logos/synergy.png", 70: FAV("juspay.in"),
  };
  const URL_ = (d) => `https://www.google.com/s2/favicons?domain_url=https://www.${d}/&sz=128`; // sites only Google's full-URL lookup finds
  // [name, logo or null (monogram), also in the IT list]
  const CORE = [
    ["Semiconductors & electronics", [
      ["NVIDIA", SI("nvidia"), 1], ["Intel", SI("intel"), 1], ["AMD", SI("amd"), 1], ["Qualcomm", SI("qualcomm"), 1],
      ["Texas Instruments", FAV("ti.com")], ["NXP Semiconductors", SI("nxp")], ["Synopsys", FAV("synopsys.com", true)],
      ["Cadence Design Systems", FAV("cadence.com")], ["Samsung Electronics", SI("samsung")], ["Sony", SI("sony")],
      ["Foxconn", FAV("foxconn.com")], ["Delta Electronics", FAV("deltaww.com")], ["Tata Electronics", FAV("tataelectronics.com")],
      ["AT&S", FAV("ats.net")], ["Logitech", SI("logitech")],
    ]],
    ["Automotive & mobility", [
      ["Kia", SI("kia")], ["Motherson Group", FAV("motherson.com")], ["Tata AutoComp Systems", FAV("tataautocomp.com")],
      ["Toyota Boshoku", FAV("toyota-boshoku.com", true)], ["Astemo", FAV("astemo.com")], ["Tenneco", FAV("tenneco.com")],
      ["Federal-Mogul", FAV("federalmogul.com")], ["UNO Minda", URL_("unominda.com")], ["Kosei Minda", null],
      ["Rane Group", URL_("ranegroup.com")], ["JK Tyre & Industries", URL_("jktyre.com")], ["Advik Hi-Tech", null],
      ["Uber", SI("uber")], ["Ola", FAV("book.olacabs.com")],
    ]],
    ["Industrial automation, energy & aerospace", [
      ["Siemens", SI("siemens")], ["Bosch", SI("bosch")], ["ABB", FAV("abb.com")], ["Schneider Electric", SI("schneiderelectric")],
      ["Honeywell", FAV("honeywell.com")], ["Hitachi", SI("hitachi")], ["Airbus", SI("airbus")], ["Collins Aerospace", FAV("collinsaerospace.com")],
      ["Parker Hannifin", FAV("parker.com")], ["SKF", FAV("skf.com")], ["GE HealthCare", FAV("gehealthcare.com")], ["Plansee", FAV("plansee.com")],
    ]],
    ["Conglomerates & infrastructure", [
      ["Tata Group", SI("tata")], ["Mahindra Group", SI("mahindra")], ["Larsen & Toubro", FAV("larsentoubro.com")],
      ["Godrej Group", FAV("godrejindustries.com", true)], ["Triveni Engineering & Industries", FAV("trivenigroup.com")],
    ]],
    ["Technology platforms", [
      ["Amazon", SI("amazon"), 1], ["Tech Mahindra", FAV("techmahindra.com", true), 1], ["GlobalLogic", FAV("globallogic.com")], ["Flipkart", FAV("flipkart.com"), 1],
    ]],
    ["Consumer & process industries", [
      ["Birla Opus Paints", FAV("birlaopus.com")], ["AB InBev", FAV("ab-inbev.com")], ["Carlsberg Group", FAV("carlsberg.com")],
    ]],
  ];
  console.assert(CORE.flatMap((g) => g[1]).length === 53, "core list should have 53 companies");

  /* ---------- Participating companies: two logo walls ---------- */
  // In both lists (IT numbers): NVIDIA, Amazon, Intel, AMD, Qualcomm, Tech Mahindra, Flipkart.
  const BOTH = new Set([3, 4, 7, 8, 9, 28, 34]);
  const initials = (n) => n.split(/[\s-]+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
  const tile = (name, src, tag) => `
    <li class="logo">
      <span class="logo__mark">${src
        ? `<img src="${src}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-sym="${initials(name)}">`
        : `<span class="mono">${initials(name)}</span>`}</span>
      <span class="logo__name">${esc(name)}</span>
      ${tag ? `<span class="logo__tag">${tag}</span>` : ""}
    </li>`;
  const group = (title, tiles) =>
    `<section class="logo-group"><h3>${esc(title)} <span>${tiles.length}</span></h3><ul class="logo-grid">${tiles.join("")}</ul></section>`;
  $("[data-it]").innerHTML = Object.entries(CATS).map(([k, label]) =>
    group(label, COMPANIES.filter((c) => c[4] === k).sort((a, b) => a[0] - b[0])
      .map(([num, name]) => tile(name.replace(/\s*\(.*\)$/, ""), LOGOS[num], BOTH.has(num) ? "Also core" : "")))).join("");
  $("[data-core]").innerHTML = CORE.map(([sector, list]) =>
    group(sector, list.map(([name, src, it]) => tile(name, src, it ? "Also IT" : "")))).join("");

  // Some companies only publish a 16px icon: show it at true size instead of blurring it up.
  document.addEventListener("load", (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && /favicons|\.ico/.test(img.src) && img.naturalWidth && img.naturalWidth <= 20) img.classList.add("is-small");
  }, true);
  // A logo that fails to load falls back to its monogram.
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && img.dataset.sym) img.outerHTML = `<span class="mono">${img.dataset.sym}</span>`;
  }, true);

  // Simple Icons draw every mark in a square 24×24 box, so wordmarks render tiny.
  // Re-serve each one with its viewBox cropped to what is actually drawn.
  const probe = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  document.body.append(probe);
  const cropped = new Map();
  const cropSI = (src) => {
    if (!cropped.has(src)) cropped.set(src, fetch(src).then((r) => r.text()).then((svg) => {
      probe.innerHTML = svg.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, "");
      const b = probe.getBBox();
      const tight = svg.replace(/viewBox="[^"]*"/, `viewBox="${b.x} ${b.y} ${b.width} ${b.height}"`);
      return URL.createObjectURL(new Blob([tight], { type: "image/svg+xml" }));
    }));
    return cropped.get(src);
  };
  $$('img[src*="simple-icons"]').forEach((img) => cropSI(img.src).then((u) => { img.src = u; }).catch(() => {}));

  /* ---------- Slash tabs (deliverables + companies) ---------- */
  $$('[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    const pick = (i, focus) => tabs.forEach((t, j) => {
      t.setAttribute("aria-selected", j === i);
      t.tabIndex = j === i ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = j !== i;
      if (focus && j === i) t.focus();
    });
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => pick(i));
      t.addEventListener("keydown", (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); pick((i + k + tabs.length) % tabs.length, true); }
      });
    });
  });
  // Footer links can open a specific company tab.
  $$("[data-goto]").forEach((a) => a.addEventListener("click", () => document.getElementById(a.dataset.goto).click()));

  /* ---------- Outlined cards: black circle grows from where the cursor enters ---------- */
  const aim = (e) => {
    const card = e.target.closest(".fcard");
    if (!card || card.contains(e.relatedTarget)) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - r.left}px`);
    card.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  document.addEventListener("pointerover", aim);
  document.addEventListener("pointerout", aim);

  /* ---------- Headings blur in as they enter ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.25 });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Line art (string-art ribbon + burst, after the reference) ---------- */
  const NS = "http://www.w3.org/2000/svg";
  const draw = (svg, lines) => svg && svg.append(...lines.map(([x1, y1, x2, y2]) => {
    const l = document.createElementNS(NS, "line");
    Object.entries({ x1, y1, x2, y2 }).forEach(([k, v]) => l.setAttribute(k, v.toFixed(1)));
    return l;
  }));
  // ruled surface: connect points on two straight edges in opposite order
  draw($("[data-fan]"), Array.from({ length: 64 }, (_, i) => {
    const t = i / 63;
    return [20 + 160 * t, 380 - 320 * t, 360 - 300 * t, 330 - 290 * t];
  }));
  draw($("[data-burst]"), Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2, r1 = 18, r2 = i % 3 ? 120 : 148;
    return [150 + r1 * Math.cos(a), 150 + r1 * Math.sin(a), 150 + r2 * Math.cos(a), 150 + r2 * Math.sin(a)];
  }));

  /* ---------- Photo band: gentle parallax ---------- */
  const band = $(".band-photo img");
  if (band && !reduced) {
    let queued = false;
    const move = () => {
      queued = false;
      const r = band.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;   // -1 … 1
      band.style.transform = `translateY(${(-8 + p * 8).toFixed(2)}%)`;
    };
    addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(move); } }, { passive: true });
    move();
  }

  /* ---------- Eligibility quick check ---------- */
  const checker = $("[data-checker]");
  const out = $("[data-checker-out]");
  checker.addEventListener("submit", (e) => e.preventDefault());
  checker.addEventListener("input", () => {
    const f = checker.elements;
    const cgpa = parseFloat(f.cgpa.value), pct = parseFloat(f.pct.value);
    out.className = "checker__out";
    if (Number.isNaN(cgpa) || Number.isNaN(pct)) {
      out.textContent = "Fill in your scores to see where you stand.";
      return;
    }
    const gaps = [];
    if (cgpa < 6) gaps.push("a CGPA of at least 6.0");
    if (f.arrears.checked) gaps.push("no standing arrears");
    if (pct < 60) gaps.push("at least 60% in 10th, 12th and Diploma");
    let mark, msg;
    if (gaps.length) {
      out.classList.add("is-no");
      mark = "!";
      msg = `Not eligible yet. The programme requires ${gaps.join(", ").replace(/, ([^,]*)$/, " and $1")}.`;
    } else if (f.year.value === "older") {
      out.classList.add("is-maybe");
      mark = "?";
      msg = "Your scores meet the criteria. Preference goes to 2024–2026 graduates, so register and our team will review your profile.";
    } else {
      out.classList.add("is-yes");
      mark = "✓";
      msg = "You meet the eligibility criteria. Go ahead and register.";
    }
    out.innerHTML = `<b aria-hidden="true">${mark}</b><span>${esc(msg)}</span>`;
  });

  /* ---------- Register + Contact forms → ../send_mail.php → helpdesk ---------- */
  const MESSAGES = {
    name: "Enter your full name.",
    phone: "Enter a valid phone number (8–16 digits).",
    email: "Enter a valid email address, like name@example.com.",
    college: "Enter your college or university.",
    branch: "Choose your branch.",
    year: "Choose your year of graduation.",
    cgpa: "Enter your CGPA between 0 and 10.",
    experience: "Choose your experience.",
    domain: "Choose a domain of interest.",
    message: "Tell us how we can help.",
  };
  const fieldOf = (el) => el.closest(".field");
  const setError = (el, msg) => {
    const field = fieldOf(el);
    if (!field) return;
    field.classList.toggle("is-invalid", !!msg);
    let err = $(".field__err", field);
    if (msg && !err) {
      err = document.createElement("span");
      err.className = "field__err";
      err.id = `err-${el.form.dataset.form}-${el.name}`;
      field.append(err);
    }
    if (err) err.textContent = msg || "";
    $$(`[name="${el.name}"]`, el.form).forEach((x) => msg ? x.setAttribute("aria-describedby", err.id) : x.removeAttribute("aria-describedby"));
    if (!msg && err) err.remove();
  };

  $$("form[data-form]").forEach((form) => {
    const statusEl = $("[data-status]", form);
    const button = $("button[type=submit]", form);
    const controls = $$("input:not([type=hidden]):not([name=website]), select, textarea", form);

    controls.forEach((el) => el.addEventListener("input", () => fieldOf(el)?.classList.contains("is-invalid") && el.checkValidity() && setError(el, "")));
    controls.forEach((el) => el.addEventListener("change", () => fieldOf(el)?.classList.contains("is-invalid") && el.checkValidity() && setError(el, "")));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusEl.className = "form__status";
      statusEl.textContent = "";
      let firstBad = null;
      const done = new Set();
      controls.forEach((el) => {
        if (done.has(el.name)) return;
        done.add(el.name);
        if (el.value && el.value.trim() !== el.value && el.type !== "radio") el.value = el.value.trim();
        const ok = el.checkValidity();
        setError(el, ok ? "" : MESSAGES[el.name] || el.validationMessage);
        if (!ok && !firstBad) firstBad = el;
      });
      if (firstBad) { firstBad.focus(); return; }

      button.disabled = true;
      const label = button.textContent;
      button.textContent = "Sending…";
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch("../send_mail.php", { method: "POST", body: new FormData(form), signal: ctrl.signal });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "Send failed");
        const first = form.elements.name.value.split(" ")[0];
        statusEl.classList.add("is-ok");
        statusEl.textContent = form.dataset.form === "registration"
          ? `Thanks, ${first}. Your registration has reached our team. We'll contact you within one business day.`
          : `Thanks, ${first}. Your enquiry has been sent. We'll reply within one business day.`;
        form.reset();
      } catch {
        statusEl.classList.add("is-err");
        statusEl.textContent = "We couldn't send this right now. Please email helpdesk@igenuinelearning.com or call +91 78450 01115.";
      } finally {
        clearTimeout(timer);
        button.disabled = false;
        button.textContent = label;
      }
    });
  });
})();
