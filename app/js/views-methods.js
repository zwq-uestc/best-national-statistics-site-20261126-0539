// Methods & sources: where every figure comes from, how rankings and
// averages are computed, and the caveats a careful reader should know.

window.AIN = window.AIN || {};
AIN.views = AIN.views || {};

AIN.views.methods = function (container) {
  const indRows = AIN.INDICATORS.map(function (ind) {
    return '<tr><td><a href="#/indicators/' + ind.key + '">' + AIN.escapeHtml(ind.label) + '</a></td>' +
      '<td>' + AIN.escapeHtml(ind.unit) + '</td><td>' + AIN.escapeHtml(ind.source) + '</td>' +
      '<td class="num">' + ind.year + '</td><td>' + AIN.escapeHtml(ind.blurb) + '</td></tr>';
  }).join('');
  const seriesRows = AIN.SERIES.map(function (s) {
    const first = s.points[0];
    const last = s.points[s.points.length - 1];
    return '<tr><td>' + AIN.escapeHtml(s.label) + '</td><td>' + AIN.escapeHtml(s.unit) + '</td>' +
      '<td>' + AIN.escapeHtml(s.source) + '</td><td class="num">' + first[0] + '\u2013' + last[0] + '</td></tr>';
  }).join('');

  container.innerHTML =
    '<section><p class="kicker">Methods &amp; sources</p>' +
    '<h1 class="section-title">How this atlas was compiled</h1>' +
    '<p class="section-lede">Every figure on this site comes from a named public publisher and carries its reference ' +
    'year. This page lists them all, explains the few calculations the site itself performs, and states the caveats plainly.</p></section>' +

    '<section class="section"><h2 class="section-title">State indicators</h2><hr class="rule">' +
    '<div class="table-wrap"><table class="plain-table" style="min-width:860px">' +
    '<thead><tr><th>Indicator</th><th>Unit</th><th>Publisher</th><th class="num">Year</th><th>What it measures</th></tr></thead>' +
    '<tbody>' + indRows + '</tbody></table></div></section>' +

    '<section class="section"><h2 class="section-title">National time series</h2><hr class="rule">' +
    '<div class="table-wrap"><table class="plain-table" style="min-width:760px">' +
    '<thead><tr><th>Series</th><th>Unit</th><th>Publisher</th><th class="num">Span</th></tr></thead>' +
    '<tbody>' + seriesRows + '</tbody></table></div>' +
    '<p class="source-line" style="margin-top:10px">World comparison figures: World Bank, World Development Indicators, 2024/25. ' +
    'Recession bands: National Bureau of Economic Research business-cycle dates.</p></section>' +

    '<section class="section"><div class="grid grid-2">' +
      '<div class="card"><h3>Calculations done by this site</h3>' +
      '<p style="margin:0 0 8px"><strong>National averages</strong> are population-weighted means of the 51 state rows, so ' +
      'California counts more than Wyoming. They will differ slightly from the publishers\u2019 own national figures, which use ' +
      'microdata and, for some series, different reference periods.</p>' +
      '<p style="margin:0 0 8px"><strong>Ranks</strong> run from 1 (highest value) to 51 across the 50 states plus DC. ' +
      'Percentiles on the radar charts count the share of rows below a value, flipped where lower is better.</p>' +
      '<p style="margin:0"><strong>Similar states</strong> are nearest neighbours by Euclidean distance over the twelve ' +
      'indicators after standardising each to z-scores, so no single measure dominates.</p></div>' +
      '<div class="card"><h3>Caveats worth knowing</h3>' +
      '<p style="margin:0 0 8px"><strong>The District of Columbia is a city</strong>, not a state: its GDP per capita ' +
      '($268,000) reflects commuters who produce there but live in Maryland and Virginia, and its density (11,300 per ' +
      'square mile) is urban. It is included as a 51st row and flagged where it distorts a ranking.</p>' +
      '<p style="margin:0 0 8px"><strong>Estimates, not counts.</strong> Between censuses, state populations are modelled ' +
      'from births, deaths and migration; income and education come from survey samples with margins of error, ' +
      'largest in small states.</p>' +
      '<p style="margin:0"><strong>Years differ by indicator</strong> because publishers release on different schedules. ' +
      'A 2022 life-expectancy figure beside a 2025 unemployment rate is the freshest honest pairing available.</p></div>' +
    '</div></section>' +

    '<section class="section"><div class="card"><h3>About this site</h3>' +
    '<p style="margin:0 0 8px">America in Numbers is a static site: a dozen small files, no build step, no accounts, ' +
    'no tracking and no network requests. The whole dataset \u2014 51 rows \u00d7 12 indicators, eight national series and ' +
    'twenty world economies \u2014 ships inside the page files, so it works identically offline, on a desktop and on a phone.</p>' +
    '<p style="margin:0">The state dataset is downloadable as CSV from the <a href="#/states">data table</a>. ' +
    'If you spot a figure that looks wrong, check it against the publisher named above: official series are revised, ' +
    'and this atlas records the vintage it compiled.</p></div></section>';
};
