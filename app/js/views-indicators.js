// Indicators: an encyclopedia of the twelve measures (definition, source,
// year, distribution, top and bottom ten) and the United States placed
// among twenty large world economies.

window.AIN = window.AIN || {};
AIN.views = AIN.views || {};

function indicatorIndexHtml() {
  let html = '<section><p class="kicker">Indicators &amp; the world</p>' +
    '<h1 class="section-title">Twelve measures, explained</h1>' +
    '<p class="section-lede">Every number in this atlas belongs to one of twelve indicators. Open any card for its ' +
    'definition, publisher, reference year, the spread across states and the full top and bottom ten.</p>' +
    '<div class="grid grid-3">';
  for (const ind of AIN.INDICATORS) {
    const ranked = AIN.rankedBy(ind.key);
    const top = ranked[0];
    const bottom = ranked[ranked.length - 1];
    const fig = AIN.nationalFigure(ind);
    html += '<a class="card indicator-card" href="#/indicators/' + ind.key + '" style="color:inherit">' +
      '<h3>' + AIN.escapeHtml(ind.label) + '</h3>' +
      '<p class="ind-value">' + AIN.fmtValue(ind, fig.value) + '</p>' +
      '<p class="ind-range">' + fig.label.toLowerCase() + ' · ' + ind.year + '<br>Highest: ' + top.name + ' (' + AIN.fmtValue(ind, top[ind.key]) + ')<br>' +
      'Lowest: ' + bottom.name + ' (' + AIN.fmtValue(ind, bottom[ind.key]) + ')</p>' +
      '<p class="source-line">' + AIN.escapeHtml(ind.source) + '</p></a>';
  }
  html += '</div></section>';
  return html;
}

function worldSectionHtml() {
  const rows = AIN.WORLD.slice().sort((a, b) => b.gdpPc - a.gdpPc).map(function (c) {
    return '<tr' + (c.us ? ' class="row-us"' : '') + '><td>' + AIN.escapeHtml(c.country) + '</td>' +
      '<td class="num">' + c.pop.toFixed(1) + 'M</td><td class="num">$' + AIN.fmtInt(c.gdpPc) + '</td>' +
      '<td class="num">' + c.lifeExp.toFixed(1) + ' yrs</td></tr>';
  }).join('');
  return '<section class="section"><p class="kicker">International context</p>' +
    '<h2 class="section-title">The United States among twenty economies</h2>' +
    '<p class="section-lede">The US produces more per person than almost every large economy, yet its life expectancy ' +
    'sits below every other rich country in this table \u2014 the central paradox of American statistics.</p>' +
    '<div class="grid grid-2">' +
      '<div class="card"><h3>Wealth vs longevity</h3><p class="card-sub">GDP per capita against life expectancy, 2024/25. The United States is labelled.</p>' +
      '<canvas class="chart chart-md" id="world-scatter"></canvas>' +
      '<p class="source-line">Source: World Bank, World Development Indicators.</p></div>' +
      '<div class="card"><h3>Twenty economies ranked by GDP per capita</h3>' +
      '<table class="plain-table"><thead><tr><th>Country</th><th class="num">Population</th><th class="num">GDP per capita</th><th class="num">Life expectancy</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>' +
      '<p class="source-line">Source: World Bank, World Development Indicators, 2024/25. Population in millions.</p></div>' +
    '</div></section>';
}

function indicatorDetailHtml(ind) {
  const ranked = AIN.rankedBy(ind.key);
  const fig = AIN.nationalFigure(ind);
  const avg = fig.value;
  const values = AIN.STATES.map(s => s[ind.key]);
  const top10 = ranked.slice(0, 10).map(s => ({ label: s.name, value: s[ind.key], color: AIN.PALETTE.teal }));
  const bottom10 = ranked.slice(-10).reverse().map(s => ({ label: s.name, value: s[ind.key], color: AIN.PALETTE.rust }));
  const direction = ind.higherBetter === null
    ? 'Neither high nor low is inherently better; the ranking is shown high to low.'
    : ind.higherBetter
      ? 'Higher is generally better on this measure.'
      : 'Lower is generally better on this measure.';

  AIN.afterRender(function () {
    const topCanvas = document.getElementById('ind-top');
    if (topCanvas) AIN.barChart(topCanvas, top10, { formatValue: v => AIN.fmtValue(ind, v), zeroBase: true });
    const botCanvas = document.getElementById('ind-bottom');
    if (botCanvas) AIN.barChart(botCanvas, bottom10, { formatValue: v => AIN.fmtValue(ind, v), zeroBase: true });
    const hist = document.getElementById('ind-hist');
    if (hist) AIN.histogram(hist, values, { bins: 10, color: AIN.PALETTE.navy, formatX: v => AIN.fmtCompact(v, ind.unit), marker: ind.key === 'pop' ? AIN.medianValue(ind.key) : avg });
    const mapBox = document.getElementById('ind-map');
    if (mapBox) {
      const scale = AIN.tileMap(mapBox, ind, {});
      document.getElementById('ind-map-legend').innerHTML = AIN.mapLegendHtml(ind, scale);
    }
  });

  return '<section><p class="kicker">Indicator</p>' +
    '<h1 class="section-title">' + AIN.escapeHtml(ind.label) + '</h1>' +
    '<p class="section-lede">' + AIN.escapeHtml(ind.blurb) + ' ' + direction + '</p>' +
    '<div class="grid grid-4 stats">' +
      '<div class="card stat-card"><p class="stat-label">' + fig.label + '</p><p class="stat-value">' + AIN.fmtValue(ind, avg) + '</p><p class="stat-note">' + (ind.key === 'pop' ? 'sum of the 51 rows' : 'population-weighted') + '</p></div>' +
      '<div class="card stat-card"><p class="stat-label">Highest</p><p class="stat-value">' + AIN.fmtValue(ind, ranked[0][ind.key]) + '</p><p class="stat-note"><a href="#/state/' + ranked[0].code + '">' + ranked[0].name + '</a></p></div>' +
      '<div class="card stat-card"><p class="stat-label">Lowest</p><p class="stat-value">' + AIN.fmtValue(ind, ranked[50][ind.key]) + '</p><p class="stat-note"><a href="#/state/' + ranked[50].code + '">' + ranked[50].name + '</a></p></div>' +
      '<div class="card stat-card"><p class="stat-label">Reference year</p><p class="stat-value">' + ind.year + '</p><p class="stat-note">' + AIN.escapeHtml(ind.source) + '</p></div>' +
    '</div>' +
    '<div class="grid grid-2" style="margin-top:16px">' +
      '<div class="card"><h3>Top ten</h3><canvas class="chart chart-md" id="ind-top"></canvas></div>' +
      '<div class="card"><h3>Bottom ten</h3><canvas class="chart chart-md" id="ind-bottom"></canvas></div>' +
    '</div>' +
    '<div class="grid grid-2" style="margin-top:16px">' +
      '<div class="card"><h3>Distribution across states</h3><p class="card-sub">Red line: national average.</p><canvas class="chart chart-sm" id="ind-hist"></canvas></div>' +
      '<div class="card"><h3>On the map</h3><div id="ind-map"></div><div id="ind-map-legend"></div></div>' +
    '</div>' +
    '<p style="margin-top:16px"><a href="#/indicators">\u2190 All twelve indicators</a> · <a href="#/states">See it in the data table</a> · <a href="#/map">Open in the map explorer</a></p>' +
    '</section>';
}

AIN.views.indicators = function (container, param) {
  if (param) {
    const ind = AIN.indicatorByKey(param);
    if (ind) {
      container.innerHTML = indicatorDetailHtml(ind);
      return;
    }
  }
  container.innerHTML = indicatorIndexHtml() + worldSectionHtml();
  AIN.afterRender(function () {
    const canvas = document.getElementById('world-scatter');
    if (!canvas) return;
    const points = AIN.WORLD.map(function (c) {
      return {
        x: c.gdpPc,
        y: c.lifeExp,
        label: c.country,
        color: c.us ? AIN.PALETTE.rust : AIN.PALETTE.navy,
        highlight: !!c.us,
      };
    });
    AIN.scatterChart(canvas, points, {
      xLabel: 'GDP per capita',
      yLabel: 'Life expectancy',
      formatX: v => '$' + AIN.fmtCompact(v),
      formatY: v => v.toFixed(0) + ' yrs',
    });
  });
};
