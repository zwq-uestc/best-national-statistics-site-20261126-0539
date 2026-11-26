// State data table: all 51 rows and twelve indicators, sortable by any
// column, filterable by region and search text, with per-column heat
// shading and a CSV download of exactly what is on screen.

window.AIN = window.AIN || {};
AIN.views = AIN.views || {};

const tableState = { sortKey: 'pop', sortDir: -1, region: 'All', query: '' };

function heatClass(indicator, value, sortedValues) {
  // Quintile position 0..4 (0 = lowest). Heat marks the "good" end.
  let q = 0;
  for (const v of sortedValues) if (value > v) q++;
  const pct = q / Math.max(1, sortedValues.length - 1);
  const goodEnd = indicator.higherBetter === false ? 1 - pct : pct;
  if (indicator.higherBetter === null) return '';
  if (goodEnd >= 0.8) return 'heat-3';
  if (goodEnd >= 0.6) return 'heat-2';
  if (goodEnd >= 0.4) return 'heat-1';
  return '';
}

function tableRowsHtml() {
  const query = tableState.query.trim().toLowerCase();
  let rows = AIN.STATES.filter(function (s) {
    if (tableState.region !== 'All' && s.region !== tableState.region) return false;
    if (query && s.name.toLowerCase().indexOf(query) === -1 && s.code.toLowerCase() !== query) return false;
    return true;
  });
  const key = tableState.sortKey;
  rows.sort(function (a, b) {
    if (key === 'name') return tableState.sortDir * a.name.localeCompare(b.name);
    return tableState.sortDir * (a[key] - b[key]);
  });
  const sortedByKey = {};
  for (const ind of AIN.INDICATORS) {
    sortedByKey[ind.key] = AIN.STATES.map(s => s[ind.key]).sort((a, b) => a - b);
  }
  return rows.map(function (s) {
    let cells = '<td class="state-cell"><span class="code">' + s.code + '</span>' + s.name + '</td>' +
      '<td>' + s.region + '</td>';
    for (const ind of AIN.INDICATORS) {
      cells += '<td class="' + heatClass(ind, s[ind.key], sortedByKey[ind.key]) + '">' + AIN.fmtValue(ind, s[ind.key]) + '</td>';
    }
    return '<tr data-code="' + s.code + '">' + cells + '</tr>';
  }).join('');
}

function tableHeadHtml() {
  function th(key, label) {
    const active = tableState.sortKey === key;
    const arrow = active ? (tableState.sortDir === -1 ? '\u25bc' : '\u25b2') : '';
    return '<th data-sort="' + key + '">' + label + (arrow ? '<span class="sort-arrow">' + arrow + '</span>' : '') + '</th>';
  }
  let html = th('name', 'State') + th('region', 'Region');
  for (const ind of AIN.INDICATORS) html += th(ind.key, ind.label);
  return html;
}

function downloadCsv() {
  const header = ['State', 'Code', 'Capital', 'Region'].concat(AIN.INDICATORS.map(i => i.label + ' (' + i.year + ')'));
  const lines = [header.join(',')];
  for (const s of AIN.STATES) {
    const row = ['"' + s.name + '"', s.code, '"' + s.capital + '"', s.region].concat(AIN.INDICATORS.map(i => s[i.key]));
    lines.push(row.join(','));
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'america-in-numbers-states.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function renderTableView(container) {
  const regionOptions = ['All'].concat(AIN.REGIONS).map(function (r) {
    return '<option value="' + r + '"' + (tableState.region === r ? ' selected' : '') + '>' + (r === 'All' ? 'All regions' : r) + '</option>';
  }).join('');

  container.innerHTML =
    '<section><p class="kicker">State data table</p>' +
    '<h1 class="section-title">Fifty states and DC, twelve measures</h1>' +
    '<p class="section-lede">Click a column heading to sort by it; click again to reverse. Teal shading marks the strongest ' +
    'fifth of states on measures where direction matters. Click any row for that state\u2019s profile.</p>' +
    '<div class="control-bar">' +
      '<label>Search <input type="search" id="table-search" placeholder="State name or code" value="' + AIN.escapeHtml(tableState.query) + '"></label>' +
      '<label>Region <select id="table-region">' + regionOptions + '</select></label>' +
      '<button class="btn" id="table-csv" type="button">Download CSV (51 \u00d7 12)</button>' +
      '<span id="table-count" style="color:var(--slate);font-size:13px"></span>' +
    '</div>' +
    '<div class="table-wrap"><table class="data-table" id="states-table">' +
      '<thead><tr>' + tableHeadHtml() + '</tr></thead>' +
      '<tbody id="states-tbody">' + tableRowsHtml() + '</tbody>' +
    '</table></div>' +
    '<p class="source-line" style="margin-top:12px">Sources and reference years differ by column; see <a href="#/methods">Methods &amp; sources</a>. ' +
    'The District of Columbia is a city-district: its GDP per capita and density are not comparable to states.</p></section>';

  const tbody = container.querySelector('#states-tbody');
  const countEl = container.querySelector('#table-count');
  function refresh() {
    tbody.innerHTML = tableRowsHtml();
    container.querySelector('#states-table thead tr').innerHTML = tableHeadHtml();
    wireTable(container);
    countEl.textContent = tbody.children.length + ' of 51 rows shown';
  }
  function wireTable(root) {
    root.querySelectorAll('th[data-sort]').forEach(function (th) {
      th.addEventListener('click', function () {
        const key = th.getAttribute('data-sort');
        if (tableState.sortKey === key) tableState.sortDir *= -1;
        else { tableState.sortKey = key; tableState.sortDir = key === 'name' ? 1 : -1; }
        refresh();
      });
    });
    root.querySelectorAll('#states-tbody tr').forEach(function (tr) {
      tr.addEventListener('click', function () {
        window.location.hash = '#/state/' + tr.getAttribute('data-code');
      });
    });
  }
  wireTable(container);
  countEl.textContent = tbody.children.length + ' of 51 rows shown';
  container.querySelector('#table-search').addEventListener('input', function (ev) {
    tableState.query = ev.target.value;
    refresh();
  });
  container.querySelector('#table-region').addEventListener('change', function (ev) {
    tableState.region = ev.target.value;
    refresh();
  });
  container.querySelector('#table-csv').addEventListener('click', downloadCsv);
}

AIN.views.states = function (container) {
  renderTableView(container);
};
