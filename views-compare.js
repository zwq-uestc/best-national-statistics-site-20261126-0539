// Compare states: pick any two and see them head to head — a radar chart of
// percentile scores across eight measures, bar-by-bar comparisons for all
// twelve indicators, and a running score of measures won.

window.AIN = window.AIN || {};
AIN.views = AIN.views || {};

const compareState = { a: 'CA', b: 'TX' };

const RADAR_AXES = [
  { key: 'gdpPc', label: 'GDP/capita' },
  { key: 'income', label: 'Income' },
  { key: 'unemp', label: 'Jobs' },
  { key: 'lifeExp', label: 'Longevity' },
  { key: 'edu', label: 'Education' },
  { key: 'poverty', label: 'Low poverty' },
  { key: 'homePrice', label: 'Home prices' },
  { key: 'crime', label: 'Safety' },
];

// Percentile of a value among the 51 rows, flipped so higher = better where
// the indicator's direction is known.
function percentileOf(indicator, value) {
  let below = 0;
  for (const s of AIN.STATES) if (s[indicator.key] < value) below++;
  let pct = below / (AIN.STATES.length - 1);
  if (indicator.higherBetter === false) pct = 1 - pct;
  return Math.max(0.02, Math.min(1, pct));
}

function stateOptions(selected) {
  return AIN.STATES.slice().sort((a, b) => a.name.localeCompare(b.name)).map(function (s) {
    return '<option value="' + s.code + '"' + (s.code === selected ? ' selected' : '') + '>' + s.name + '</option>';
  }).join('');
}

function versusRowsHtml(a, b) {
  let winsA = 0;
  let winsB = 0;
  let html = '';
  for (const ind of AIN.INDICATORS) {
    const va = a[ind.key];
    const vb = b[ind.key];
    const max = Math.max(va, vb);
    const wa = max === 0 ? 0 : (va / max) * 100;
    const wb = max === 0 ? 0 : (vb / max) * 100;
    let winA = false;
    let winB = false;
    if (ind.higherBetter !== null && va !== vb) {
      const aBetter = ind.higherBetter ? va > vb : va < vb;
      winA = aBetter;
      winB = !aBetter;
      if (aBetter) winsA++; else winsB++;
    }
    html += '<div class="vs-row">' +
      '<div class="vs-side left"><span class="vs-val' + (winA ? ' vs-win' : '') + '">' + AIN.fmtValue(ind, va) + '</span>' +
      '<span class="vs-bar" style="width:' + wa.toFixed(1) + '%;background:' + AIN.PALETTE.navy + '"></span></div>' +
      '<div class="vs-label">' + AIN.escapeHtml(ind.label) + '</div>' +
      '<div class="vs-side"><span class="vs-bar" style="width:' + wb.toFixed(1) + '%;background:' + AIN.PALETTE.teal + '"></span>' +
      '<span class="vs-val' + (winB ? ' vs-win' : '') + '">' + AIN.fmtValue(ind, vb) + '</span></div>' +
      '</div>';
  }
  return { html, winsA, winsB };
}

function renderCompareView(container) {
  const a = AIN.stateByCode(compareState.a);
  const b = AIN.stateByCode(compareState.b);
  const vs = versusRowsHtml(a, b);
  const popRatio = Math.max(a.pop, b.pop) / Math.min(a.pop, b.pop);
  const bigger = a.pop > b.pop ? a : b;
  const smaller = a.pop > b.pop ? b : a;
  const gdpA = a.pop * a.gdpPc / 1e12;
  const gdpB = b.pop * b.gdpPc / 1e12;

  container.innerHTML =
    '<section><p class="kicker">Compare states</p>' +
    '<h1 class="section-title">' + a.name + ' vs ' + b.name + '</h1>' +
    '<p class="section-lede">' + bigger.name + ' has ' + popRatio.toFixed(1) + ' times the population of ' + smaller.name +
    '. Their economies produce about $' + gdpA.toFixed(2) + ' trillion and $' + gdpB.toFixed(2) + ' trillion a year.</p>' +
    '<div class="compare-pickers">' +
      '<div><label for="cmp-a">First state</label><select id="cmp-a">' + stateOptions(a.code) + '</select></div>' +
      '<div class="vs">vs</div>' +
      '<div><label for="cmp-b">Second state</label><select id="cmp-b">' + stateOptions(b.code) + '</select></div>' +
    '</div>' +
    '<div class="grid grid-2">' +
      '<div class="card"><h3>Percentile radar</h3>' +
      '<p class="card-sub">Each spoke is the state\u2019s percentile among all 51 rows; outward is stronger. ' +
      '<span style="color:' + AIN.PALETTE.navy + '">\u25a0</span> ' + a.name + ' &nbsp;<span style="color:' + AIN.PALETTE.teal + '">\u25a0</span> ' + b.name + '</p>' +
      '<canvas class="chart chart-radar" id="cmp-radar"></canvas></div>' +
      '<div class="card"><h3>Head to head</h3>' +
      '<p class="card-sub">All twelve indicators. The stronger figure on directional measures is shown in green.</p>' +
      vs.html +
      '<p class="score-line">' + a.name + ' ' + vs.winsA + ' \u2013 ' + vs.winsB + ' ' + b.name + '</p>' +
      '<p class="source-line" style="text-align:center">Score counts only measures with a clear better direction (8 of 12).</p>' +
      '</div>' +
    '</div>' +
    '<p style="margin-top:16px">Full profiles: <a href="#/state/' + a.code + '">' + a.name + '</a> · <a href="#/state/' + b.code + '">' + b.name + '</a>' +
    ' · <a href="#/states">all 51 in the data table</a></p></section>';

  container.querySelector('#cmp-a').addEventListener('change', function (ev) {
    compareState.a = ev.target.value;
    renderCompareView(container);
    AIN.flushDraws();
  });
  container.querySelector('#cmp-b').addEventListener('change', function (ev) {
    compareState.b = ev.target.value;
    renderCompareView(container);
    AIN.flushDraws();
  });

  AIN.afterRender(function () {
    const canvas = document.getElementById('cmp-radar');
    if (!canvas) return;
    const axes = RADAR_AXES.map(x => x.label);
    const valuesFor = function (state) {
      return RADAR_AXES.map(function (x) {
        return percentileOf(AIN.indicatorByKey(x.key), state[x.key]);
      });
    };
    AIN.radarChart(canvas, axes, [
      { label: a.name, values: valuesFor(a), color: AIN.PALETTE.navy },
      { label: b.name, values: valuesFor(b), color: AIN.PALETTE.teal },
    ]);
  });
}

AIN.views.compare = function (container) {
  renderCompareView(container);
};
