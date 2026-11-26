// Map explorer: switch the tile map between the twelve indicators, see the
// distribution and the top and bottom five states for the selected measure,
// and jump from any tile to that state's profile.

window.AIN = window.AIN || {};
AIN.views = AIN.views || {};

let mapIndicatorKey = 'gdpPc';

function rankedListHtml(indicator, count, fromBottom) {
  const ranked = AIN.rankedBy(indicator.key);
  const picked = fromBottom ? ranked.slice(-count).reverse() : ranked.slice(0, count);
  let html = '<ul class="rank-list">';
  picked.forEach(function (s, i) {
    const rank = fromBottom ? ranked.length - i : i + 1;
    html += '<li><span><span class="rk">' + rank + '</span><a href="#/state/' + s.code + '">' + s.name + '</a></span>' +
      '<span class="rv">' + AIN.fmtValue(indicator, s[indicator.key]) + '</span></li>';
  });
  html += '</ul>';
  return html;
}

function renderMapView(container) {
  const ind = AIN.indicatorByKey(mapIndicatorKey);
  const fig = AIN.nationalFigure(ind);
  const avg = fig.value;
  const values = AIN.STATES.map(s => s[ind.key]);
  const min = Math.min.apply(null, values);
  const max = Math.max.apply(null, values);
  const chips = AIN.INDICATORS.map(function (x) {
    return '<button class="chip' + (x.key === ind.key ? ' active' : '') + '" data-ind="' + x.key + '">' + AIN.escapeHtml(x.label) + '</button>';
  }).join('');

  container.innerHTML =
    '<section><p class="kicker">Map explorer</p>' +
    '<h1 class="section-title">' + AIN.escapeHtml(ind.label) + ' by state</h1>' +
    '<p class="section-lede">' + AIN.escapeHtml(ind.blurb) + ' Colours are quintiles \u2014 each shade holds about a fifth of the states. ' +
    'Click any tile for the full state profile.</p>' +
    '<div class="chip-row" id="map-chips">' + chips + '</div>' +
    '<div class="grid grid-main-side">' +
      '<div class="card"><div id="explorer-map"></div><div id="explorer-legend"></div>' +
      '<p class="source-line">Source: ' + AIN.escapeHtml(ind.source) + ', ' + ind.year + '. ' + fig.label + ': ' +
      AIN.fmtValue(ind, avg) + '. Range: ' + AIN.fmtValue(ind, min) + ' to ' + AIN.fmtValue(ind, max) + '.</p></div>' +
      '<div>' +
        '<div class="card"><h3>Top five</h3>' + rankedListHtml(ind, 5, false) + '</div>' +
        '<div class="card" style="margin-top:16px"><h3>Bottom five</h3>' + rankedListHtml(ind, 5, true) + '</div>' +
      '</div>' +
    '</div></section>' +

    '<section class="section"><p class="kicker">Distribution</p>' +
    '<h2 class="section-title">How the 51 values spread out</h2>' +
    '<div class="grid grid-2">' +
      '<div class="card"><h3>Histogram</h3><p class="card-sub">States per value band; the red line marks the ' + (ind.key === 'pop' ? 'median state' : 'national average') + '.</p>' +
      '<canvas class="chart chart-sm" id="explorer-hist"></canvas></div>' +
      '<div class="card"><h3>Reading the map</h3>' +
      '<p style="margin:0 0 8px">Each tile is one state, drawn the same size so that Rhode Island counts as much as Texas. ' +
      'Tiles sit roughly where the state belongs; Alaska and Hawaii are pulled in from the edges.</p>' +
      '<p style="margin:0">Because colours are quintiles, the darkest shade always means \u201ctop fifth\u201d for the selected ' +
      'measure \u2014 not a fixed value. The legend gives the actual ranges. For measures where lower is better ' +
      '(unemployment, poverty, violent crime) the ramp runs rust-red instead of teal.</p></div>' +
    '</div></section>';

  container.querySelectorAll('#map-chips .chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      mapIndicatorKey = btn.getAttribute('data-ind');
      renderMapView(container);
      AIN.flushDraws();
    });
  });

  AIN.afterRender(function () {
    const mapBox = document.getElementById('explorer-map');
    if (mapBox) {
      const scale = AIN.tileMap(mapBox, ind, {});
      document.getElementById('explorer-legend').innerHTML = AIN.mapLegendHtml(ind, scale);
    }
    const hist = document.getElementById('explorer-hist');
    if (hist) {
      AIN.histogram(hist, values, {
        bins: 10,
        color: AIN.PALETTE.navy,
        formatX: v => AIN.fmtCompact(v, ind.unit),
        marker: ind.key === 'pop' ? AIN.medianValue(ind.key) : avg,
      });
    }
  });
}

AIN.views.map = function (container) {
  renderMapView(container);
};
