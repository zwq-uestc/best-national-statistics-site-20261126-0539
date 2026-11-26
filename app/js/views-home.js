// Overview page: the country at a glance. Headline stat cards with
// sparklines, two centuries of population growth, state extremes, a map
// teaser, computed facts and the United States among world economies.

window.AIN = window.AIN || {};
AIN.views = AIN.views || {};

function headlineCardsHtml() {
  let html = '<div class="grid grid-4 stats">';
  AIN.HEADLINE.forEach(function (h, i) {
    html += '<div class="card stat-card">' +
      '<p class="stat-label">' + AIN.escapeHtml(h.label) + '</p>' +
      '<p class="stat-value">' + AIN.escapeHtml(h.value) + '</p>' +
      '<p class="stat-note">' + AIN.escapeHtml(h.note) + ' · ' + AIN.escapeHtml(h.source) + '</p>' +
      (h.spark ? '<canvas class="stat-spark" id="spark-' + i + '" aria-hidden="true"></canvas>' : '') +
      '</div>';
  });
  html += '</div>';
  return html;
}

function topBarsHtml(canvasId, title, sub, indicatorKey, count, invert) {
  const ind = AIN.indicatorByKey(indicatorKey);
  const ranked = AIN.rankedBy(indicatorKey);
  const picked = invert ? ranked.slice(-count).reverse() : ranked.slice(0, count);
  const items = picked.map(function (s) {
    return {
      label: s.name,
      value: s[indicatorKey],
      color: invert ? AIN.PALETTE.rust : AIN.PALETTE.teal,
    };
  });
  AIN.afterRender(function () {
    const canvas = document.getElementById(canvasId);
    if (canvas) AIN.barChart(canvas, items, {
      formatValue: v => AIN.fmtValue(ind, v),
      zeroBase: true,
    });
  });
  return '<div class="card"><h3>' + title + '</h3><p class="card-sub">' + sub + '</p>' +
    '<canvas class="chart chart-md" id="' + canvasId + '"></canvas>' +
    '<p class="source-line">Source: ' + AIN.escapeHtml(ind.source) + ', ' + ind.year + '. ' +
    '<a href="#/indicators/' + ind.key + '">Full ranking</a></p></div>';
}

function factsHtml() {
  const ca = AIN.stateByCode('CA');
  const caGdp = ca.pop * ca.gdpPc / 1e12;
  const hi = AIN.stateByCode('HI');
  const wv = AIN.stateByCode('WV');
  const sc = AIN.stateByCode('SC');
  const shrinking = AIN.STATES.filter(s => s.growth < 0).length;
  const nj = AIN.stateByCode('NJ');
  const ak = AIN.stateByCode('AK');
  const facts = [
    {
      big: '$' + caGdp.toFixed(1) + ' trillion',
      text: 'California\u2019s economy on its own would rank fourth in the world, behind only the United States as a whole, China and Germany. One in nine Americans lives there.',
    },
    {
      big: (hi.lifeExp - wv.lifeExp).toFixed(1) + ' years',
      text: 'separate the longest-lived state, Hawaii (' + hi.lifeExp.toFixed(1) + ' years), from the shortest, West Virginia (' + wv.lifeExp.toFixed(1) + '). The national figure is 79.0 years.',
    },
    {
      big: '+' + sc.growth.toFixed(1) + '% since 2020',
      text: 'South Carolina is the fastest-growing state, ahead of Florida and Texas. ' + shrinking + ' states have fewer residents than at the 2020 Census.',
    },
    {
      big: AIN.fmtInt(Math.round(nj.density / ak.density)) + '\u00d7 denser',
      text: 'New Jersey packs ' + AIN.fmtInt(nj.density) + ' people into each square mile; Alaska averages ' + ak.density + '. The national average is about 97.',
    },
  ];
  let html = '<div class="grid grid-4">';
  for (const f of facts) {
    html += '<div class="card fact-card"><p class="fact-big">' + f.big + '</p><p>' + f.text + '</p></div>';
  }
  html += '</div>';
  return html;
}

function worldStripHtml() {
  const byGdp = AIN.WORLD.slice().sort((a, b) => b.gdpPc - a.gdpPc);
  const usRankGdp = byGdp.findIndex(c => c.us) + 1;
  const byLife = AIN.WORLD.slice().sort((a, b) => b.lifeExp - a.lifeExp);
  const usRankLife = byLife.findIndex(c => c.us) + 1;
  const byPop = AIN.WORLD.slice().sort((a, b) => b.pop - a.pop);
  const usRankPop = byPop.findIndex(c => c.us) + 1;
  const rows = byGdp.slice(0, 6).map(function (c) {
    return '<tr' + (c.us ? ' class="row-us"' : '') + '><td>' + AIN.escapeHtml(c.country) + '</td>' +
      '<td class="num">$' + AIN.fmtInt(c.gdpPc) + '</td><td class="num">' + c.lifeExp.toFixed(1) + ' yrs</td></tr>';
  }).join('');
  return '<div class="card"><h3>The United States in the world</h3>' +
    '<p class="card-sub">Among twenty large economies: ' + AIN.ordinal(usRankPop) + ' by population, ' +
    AIN.ordinal(usRankGdp) + ' by GDP per capita, ' + AIN.ordinal(usRankLife) + ' by life expectancy.</p>' +
    '<table class="plain-table"><thead><tr><th>Country</th><th class="num">GDP per capita</th><th class="num">Life expectancy</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table>' +
    '<p class="source-line">Source: World Bank, World Development Indicators, 2024/25. <a href="#/indicators">All twenty countries</a></p></div>';
}

AIN.views.home = function (container) {
  container.innerHTML =
    '<section class="hero-band">' +
      '<h1 class="hero-title">The United States, measured.</h1>' +
      '<p class="hero-lede">Population, output, incomes, health, education and housing for the whole country and for every ' +
      'state \u2014 with the source and year behind every figure, and 235 years of trends to put today in context.</p>' +
      '<div class="hero-links">' +
        '<a href="#/map">Explore the map</a><a href="#/states">Browse the data table</a>' +
        '<a href="#/compare">Compare two states</a><a href="#/trends">See the long trends</a>' +
      '</div>' +
    '</section>' +

    '<section class="section"><p class="kicker">Headline figures</p>' +
    '<h2 class="section-title">The country at a glance</h2><hr class="rule">' +
    headlineCardsHtml() + '</section>' +

    '<section class="section"><p class="kicker">Long view</p>' +
    '<h2 class="section-title">Two centuries of growth</h2>' +
    '<p class="section-lede">The first census in 1790 counted 3.9 million people. The July 2025 estimate is 341.8 million \u2014 ' +
    'the population has multiplied 87-fold, through immigration waves, the baby boom and, lately, slower growth of about 0.5% a year.</p>' +
    '<div class="card"><canvas class="chart chart-lg" id="home-population"></canvas>' +
    '<p class="source-line">Source: U.S. Census Bureau, decennial censuses 1790\u20132020 and Vintage 2025 estimates. ' +
    '<a href="#/trends">More long-run series</a></p></div></section>' +

    '<section class="section"><p class="kicker">State extremes</p>' +
    '<h2 class="section-title">Where states differ most</h2><hr class="rule">' +
    '<div class="grid grid-2">' +
      topBarsHtml('home-gdp-bars', 'Highest GDP per capita', 'Output per resident, 2024. The District of Columbia ($268,000) is a city-district and sits far above every state.', 'gdpPc', 8, false) +
      topBarsHtml('home-life-bars', 'Longest life expectancy', 'Years at birth, 2022. Hawaii leads; the shortest-lived states cluster in Appalachia and the Deep South.', 'lifeExp', 8, false) +
    '</div></section>' +

    '<section class="section"><p class="kicker">Geography</p>' +
    '<h2 class="section-title">One map, twelve measures</h2>' +
    '<p class="section-lede">Every state as an equal tile, coloured by GDP per capita. The full explorer switches between all ' +
    'twelve indicators and links each tile to a state profile.</p>' +
    '<div class="card"><div id="home-map"></div><div id="home-map-legend"></div>' +
    '<p class="source-line">Source: Bureau of Economic Analysis, 2024. <a href="#/map">Open the map explorer</a></p></div></section>' +

    '<section class="section"><p class="kicker">Worth knowing</p>' +
    '<h2 class="section-title">Four facts from the data</h2><hr class="rule">' +
    factsHtml() + '</section>' +

    '<section class="section"><div class="grid grid-2">' +
      worldStripHtml() +
      '<div class="card"><h3>Start exploring</h3><p class="card-sub">Five ways into the atlas, each built on the same 51-by-12 dataset.</p>' +
      '<ul class="rank-list">' +
        '<li><a href="#/map">Map explorer</a><span class="rv">12 indicators</span></li>' +
        '<li><a href="#/states">State data table</a><span class="rv">51 rows, sortable, CSV</span></li>' +
        '<li><a href="#/compare">Compare states</a><span class="rv">head-to-head radar</span></li>' +
        '<li><a href="#/trends">Trends since 1790</a><span class="rv">8 national series</span></li>' +
        '<li><a href="#/indicators">Indicators &amp; the world</a><span class="rv">definitions + 20 countries</span></li>' +
      '</ul>' +
      '<p class="source-line">Every figure names its publisher and year. <a href="#/methods">How the data was compiled</a></p></div>' +
    '</div></section>';

  AIN.afterRender(function () {
    AIN.HEADLINE.forEach(function (h, i) {
      if (!h.spark) return;
      const canvas = document.getElementById('spark-' + i);
      const series = AIN.seriesByKey(h.spark);
      if (canvas && series) AIN.sparkline(canvas, series.points, AIN.PALETTE.teal);
    });
    const pop = document.getElementById('home-population');
    if (pop) {
      AIN.lineChart(pop, AIN.seriesByKey('population').points, {
        color: AIN.PALETTE.navy,
        unit: 'millions',
        formatY: v => AIN.fmtCompact(v) + 'M',
        zeroBase: true,
      });
    }
    const mapBox = document.getElementById('home-map');
    if (mapBox) {
      const ind = AIN.indicatorByKey('gdpPc');
      const scale = AIN.tileMap(mapBox, ind, {});
      document.getElementById('home-map-legend').innerHTML = AIN.mapLegendHtml(ind, scale);
    }
  });
};
