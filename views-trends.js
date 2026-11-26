// Trends explorer: eight long-run national series with recession shading,
// a between-two-years change calculator, and the underlying data table.

window.AIN = window.AIN || {};
AIN.views = AIN.views || {};

const trendsState = { key: 'population', showTable: false };

function seriesStats(series) {
  const pts = series.points;
  const first = pts[0];
  const last = pts[pts.length - 1];
  let min = pts[0];
  let max = pts[0];
  for (const p of pts) {
    if (p[1] < min[1]) min = p;
    if (p[1] > max[1]) max = p;
  }
  const change = ((last[1] - first[1]) / Math.abs(first[1])) * 100;
  return { first, last, min, max, change };
}

function yearOptions(series, selected) {
  return series.points.map(function (p) {
    return '<option value="' + p[0] + '"' + (p[0] === selected ? ' selected' : '') + '>' + p[0] + '</option>';
  }).join('');
}

function renderTrendsView(container) {
  const series = AIN.seriesByKey(trendsState.key);
  const st = seriesStats(series);
  const chips = AIN.SERIES.map(function (s) {
    return '<button class="chip' + (s.key === series.key ? ' active' : '') + '" data-series="' + s.key + '">' + AIN.escapeHtml(s.label) + '</button>';
  }).join('');
  const fromYear = series.points[0][0];
  const toYear = series.points[series.points.length - 1][0];

  let tableHtml = '';
  if (trendsState.showTable) {
    const rows = series.points.map(function (p) {
      return '<tr><td>' + p[0] + '</td><td class="num">' + p[1] + '</td></tr>';
    }).join('');
    tableHtml = '<div class="card" style="margin-top:16px"><h3>Data table</h3>' +
      '<table class="plain-table"><thead><tr><th>Year</th><th class="num">' + AIN.escapeHtml(series.label) + ' (' + AIN.escapeHtml(series.unit) + ')</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';
  }

  container.innerHTML =
    '<section><p class="kicker">Trends since 1790</p>' +
    '<h1 class="section-title">' + AIN.escapeHtml(series.label) + '</h1>' +
    '<p class="section-lede">' + AIN.escapeHtml(series.blurb) + '</p>' +
    '<div class="chip-row" id="trend-chips">' + chips + '</div>' +
    '<div class="card"><canvas class="chart chart-lg" id="trend-chart"></canvas>' +
    '<p class="source-line">Source: ' + AIN.escapeHtml(series.source) + '. Unit: ' + AIN.escapeHtml(series.unit) + '.' +
    (series.key === 'unemployment' || series.key === 'gdpPerCapita' ? ' Shaded bands are NBER recessions.' : '') + '</p></div>' +
    '<div class="grid grid-4 stats" style="margin-top:16px">' +
      '<div class="card stat-card"><p class="stat-label">First figure</p><p class="stat-value">' + st.first[1] + '</p><p class="stat-note">in ' + st.first[0] + '</p></div>' +
      '<div class="card stat-card"><p class="stat-label">Latest figure</p><p class="stat-value">' + st.last[1] + '</p><p class="stat-note">in ' + st.last[0] + '</p></div>' +
      '<div class="card stat-card"><p class="stat-label">Change over the series</p><p class="stat-value">' + (st.change >= 0 ? '+' : '') + st.change.toFixed(0) + '%</p><p class="stat-note">' + st.first[0] + ' to ' + st.last[0] + '</p></div>' +
      '<div class="card stat-card"><p class="stat-label">Peak / trough</p><p class="stat-value">' + st.max[1] + ' / ' + st.min[1] + '</p><p class="stat-note">' + st.max[0] + ' / ' + st.min[0] + '</p></div>' +
    '</div>' +
    '<div class="card" style="margin-top:16px"><h3>Change between two years</h3>' +
    '<p class="card-sub">Pick any two recorded years to see the absolute and percentage change.</p>' +
    '<div class="control-bar">' +
      '<label>From <select id="trend-from">' + yearOptions(series, fromYear) + '</select></label>' +
      '<label>To <select id="trend-to">' + yearOptions(series, toYear) + '</select></label>' +
      '<strong id="trend-change"></strong>' +
      '<button class="btn btn-ghost" id="trend-table-toggle" type="button">' + (trendsState.showTable ? 'Hide data table' : 'Show data table') + '</button>' +
    '</div></div>' +
    tableHtml +
    '</section>';

  container.querySelectorAll('#trend-chips .chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      trendsState.key = btn.getAttribute('data-series');
      renderTrendsView(container);
      AIN.flushDraws();
    });
  });
  const fromSel = container.querySelector('#trend-from');
  const toSel = container.querySelector('#trend-to');
  const changeEl = container.querySelector('#trend-change');
  function updateChange() {
    const byYear = {};
    for (const p of series.points) byYear[p[0]] = p[1];
    const a = byYear[fromSel.value];
    const b = byYear[toSel.value];
    if (a === undefined || b === undefined) { changeEl.textContent = ''; return; }
    const diff = b - a;
    const pct = a === 0 ? 0 : (diff / Math.abs(a)) * 100;
    changeEl.textContent = (diff >= 0 ? '+' : '') + diff.toFixed(1) + ' (' + (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%)';
  }
  fromSel.addEventListener('change', updateChange);
  toSel.addEventListener('change', updateChange);
  updateChange();
  container.querySelector('#trend-table-toggle').addEventListener('click', function () {
    trendsState.showTable = !trendsState.showTable;
    renderTrendsView(container);
    AIN.flushDraws();
  });

  AIN.afterRender(function () {
    const canvas = document.getElementById('trend-chart');
    if (!canvas) return;
    AIN.lineChart(canvas, series.points, {
      color: AIN.PALETTE.navy,
      unit: series.unit,
      recessions: (series.key === 'unemployment' || series.key === 'gdpPerCapita') ? AIN.RECESSIONS : null,
      zeroBase: series.key === 'population' || series.key === 'gdpPerCapita',
    });
  });
}

AIN.views.trends = function (container) {
  renderTrendsView(container);
};
