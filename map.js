// Tile-grid choropleth map of the United States: one rounded square per
// state (plus DC) laid out in a 12 x 7 grid that keeps every state the same
// size and roughly in its geographic place, so small states stay readable.
// Colours are quintiles of the chosen indicator; hovering a tile shows its
// value and clicking it opens that state's profile page.

window.AIN = window.AIN || {};

// [column, row] of each state tile, row 0 at the top.
AIN.TILE_POS = {
  AK: [0, 0], ME: [11, 0],
  WA: [1, 1], ID: [2, 1], MT: [3, 1], ND: [4, 1], MN: [5, 1], WI: [6, 1], MI: [7, 1], VT: [9, 1], NH: [10, 1],
  OR: [1, 2], NV: [2, 2], WY: [3, 2], SD: [4, 2], IA: [5, 2], IL: [6, 2], IN: [7, 2], OH: [8, 2], PA: [9, 2], NY: [10, 2], MA: [11, 2],
  CA: [1, 3], UT: [2, 3], CO: [3, 3], NE: [4, 3], MO: [5, 3], KY: [6, 3], WV: [7, 3], VA: [8, 3], MD: [9, 3], NJ: [10, 3], CT: [11, 3],
  AZ: [2, 4], NM: [3, 4], KS: [4, 4], AR: [5, 4], TN: [6, 4], NC: [7, 4], SC: [8, 4], DE: [9, 4], DC: [10, 4], RI: [11, 4],
  OK: [4, 5], LA: [5, 5], MS: [6, 5], AL: [7, 5], GA: [8, 5],
  HI: [1, 6], TX: [4, 6], FL: [8, 6],
};

const RAMPS = {
  good: ['#e7f0ec', '#bcd8cd', '#7fb5a6', '#3d8a76', '#0e5f4d'],
  bad: ['#f7eae3', '#efcdb9', '#e09a7d', '#c96a45', '#9c3a1c'],
  neutral: ['#e6eaf2', '#bcc8de', '#8aa3c7', '#55719f', '#1d3a6e'],
};

// Quintile breaks for a value list: [20th, 40th, 60th, 80th percentile].
function quintileBreaks(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  const at = q => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
  return [at(0.2), at(0.4), at(0.6), at(0.8)];
}

function rampFor(indicator) {
  if (indicator.higherBetter === true) return RAMPS.good;
  if (indicator.higherBetter === false) return RAMPS.bad;
  return RAMPS.neutral;
}

// Build the colour scale for an indicator: returns { colorOf, breaks, ramp }.
AIN.mapScale = function (indicator) {
  const values = AIN.STATES.map(s => s[indicator.key]);
  const breaks = quintileBreaks(values);
  const ramp = rampFor(indicator);
  const colorOf = function (v) {
    let idx = 0;
    while (idx < breaks.length && v > breaks[idx]) idx++;
    return ramp[idx];
  };
  return { colorOf, breaks, ramp };
};

// Text colour that stays readable on a ramp step.
function tileTextColor(idx) {
  return idx >= 3 ? '#ffffff' : '#16233f';
}

// Render the map into a container element. options: { selectedCode }.
// Returns the scale used, so the caller can draw the legend.
AIN.tileMap = function (container, indicator, options) {
  const opts = options || {};
  const scale = AIN.mapScale(indicator);
  const cols = 12;
  const rows = 7;
  const tile = 54;
  const gap = 5;
  const width = cols * (tile + gap);
  const height = rows * (tile + gap);
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
  svg.setAttribute('class', 'tile-map');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Map of US states coloured by ' + indicator.label);

  for (const state of AIN.STATES) {
    const pos = AIN.TILE_POS[state.code];
    if (!pos) continue;
    const x = pos[0] * (tile + gap);
    const y = pos[1] * (tile + gap);
    const value = state[indicator.key];
    let idx = 0;
    while (idx < scale.breaks.length && value > scale.breaks[idx]) idx++;

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'tile' + (opts.selectedCode === state.code ? ' tile-selected' : ''));
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'link');
    g.setAttribute('aria-label', state.name + ': ' + AIN.fmtValue(indicator, value));

    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', tile);
    rect.setAttribute('height', tile);
    rect.setAttribute('rx', 8);
    rect.setAttribute('fill', scale.ramp[idx]);
    g.appendChild(rect);

    const label = document.createElementNS(NS, 'text');
    label.setAttribute('x', x + tile / 2);
    label.setAttribute('y', y + tile / 2 + 1);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'middle');
    label.setAttribute('fill', tileTextColor(idx));
    label.setAttribute('class', 'tile-code');
    label.textContent = state.code;
    g.appendChild(label);

    const title = document.createElementNS(NS, 'title');
    title.textContent = state.name + ' \u2014 ' + indicator.label + ': ' + AIN.fmtValue(indicator, value) +
      ' (' + AIN.ordinal(AIN.rankOf(state.code, indicator.key)) + ' of 51)';
    g.appendChild(title);

    const go = function () { window.location.hash = '#/state/' + state.code; };
    g.addEventListener('click', go);
    g.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); }
    });
    svg.appendChild(g);
  }
  container.innerHTML = '';
  container.appendChild(svg);
  return scale;
};

// Legend HTML for a scale: five swatches with their value ranges.
AIN.mapLegendHtml = function (indicator, scale) {
  const values = AIN.STATES.map(s => s[indicator.key]);
  const min = Math.min.apply(null, values);
  const max = Math.max.apply(null, values);
  const edges = [min].concat(scale.breaks, [max]);
  let html = '<div class="map-legend">';
  for (let i = 0; i < 5; i++) {
    html += '<span class="legend-item"><span class="legend-swatch" style="background:' + scale.ramp[i] + '"></span>' +
      AIN.fmtValue(indicator, edges[i]) + ' \u2013 ' + AIN.fmtValue(indicator, edges[i + 1]) + '</span>';
  }
  html += '</div>';
  return html;
};
