/* Participating companies: two periodic-table boards, logo only.
   Data: companies-data.js (window.COMPANY_BOARDS). Placement uses absolute grid-row / grid-column.
   Names live only in alt and aria-label. Missing logos leave an empty tile; see companies-missing-logos.md. */
(() => {
  const B = 'assets/brand-logos/';
  const boards = window.COMPANY_BOARDS || [];
  const esc = (s) => s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  const tabs = document.getElementById('co-tabs');
  const panels = document.getElementById('co-panels');
  const detail = document.getElementById('co-detail');
  const note = document.getElementById('co-note');
  if (!tabs || !panels || !detail || boards.length === 0) return;

  const LABEL = { it: 'IT and technology', core: 'Core and non-IT engineering' };
  const THEME = { it: 'it', core: 'core' };

  // Render one periodic board. Tiles are positioned with absolute grid-row / grid-column.
  function boardHTML(b) {
    const tiles = b.entries.map((e) => {
      const img = e.file ? `<img src="${B + e.file}" alt="${esc(e.name)} logo">` : '';
      return `<button type="button" class="pt__tile" role="listitem" data-board="${b.key}" data-idx="${e.n}"
        style="grid-row:${e.p};grid-column:${e.g}" aria-label="${esc(e.name)}"${e.file ? '' : ' data-missing="true"'}${e.light ? ' data-light="true"' : ''}>${img}</button>`;
    }).join('');
    return `<section class="pt pt--${THEME[b.key]}" aria-label="${LABEL[b.key]}">
      <ul class="pt__grid" role="list">${tiles}</ul>
    </section>`;
  }

  // Tabs: IT, Core, or both stacked (View all)
  const tabDefs = [{ id: 'it', label: 'IT and technology' }, { id: 'core', label: 'Core and non-IT' }, { id: 'all', label: 'View all' }];
  tabs.innerHTML = tabDefs.map((t, i) =>
    `<button type="button" role="tab" class="pt__tab" data-tab="${t.id}" aria-selected="${i === 0}" aria-controls="co-panels">${t.label}</button>`
  ).join('');

  const boardsByKey = Object.fromEntries(boards.map((b) => [b.key, b]));
  function show(which) {
    const list = which === 'all' ? boards : [boardsByKey[which]];
    panels.innerHTML = list.map(boardHTML).join('');
    tabs.querySelectorAll('[data-tab]').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === which)));
    detail.hidden = true;
  }

  // Detail bar (logo + reference fields). Only NVIDIA has reference data; others say not added yet.
  function showDetail(entry) {
    const logo = entry.file ? `<img src="${B + entry.file}" alt="${esc(entry.name)} logo" class="co__d-logo">` : "";
    detail.innerHTML = `
      <div class="co__d-id">${logo}<span class="co__d-name">${esc(entry.name)}</span></div>`;
    detail.hidden = false;
  }

  // Hovering a company shows it in the detail bar below; clicking keeps it selected.
  panels.addEventListener('mouseover', (e) => {
    const tile = e.target.closest('.pt__tile');
    if (!tile || tile.dataset.missing) return;
    const entry = boardsByKey[tile.dataset.board].entries.find((x) => String(x.n) === tile.dataset.idx);
    showDetail(entry);
  });

  panels.addEventListener('click', (e) => {
    const tile = e.target.closest('.pt__tile');
    if (!tile || tile.dataset.missing) return;
    const key = tile.dataset.board;
    const entry = boardsByKey[key].entries.find((x) => String(x.n) === tile.dataset.idx);
    panels.querySelectorAll('.pt__tile').forEach((t) => t.classList.toggle('is-selected', t === tile));
    showDetail(entry);
  });

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (btn) show(btn.dataset.tab);
  });

  // Developer diagnostics: list every tile without a logo (names are never shown on the page)
  const missing = boards.flatMap((b) => b.entries.filter((x) => !x.file).map((x) => `${b.key}: ${x.name} (${x.key})`));
  if (missing.length) console.warn(`[companies] ${missing.length} tiles have no logo file. See companies-missing-logos.md`);

  show('it');
})();
