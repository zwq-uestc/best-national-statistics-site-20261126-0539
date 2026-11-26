// State profile: one state's twelve indicators with national ranks and
// percentile bars, a radar against the national average, its share of the
// country, and the states most similar to it.

window.AIN = window.AIN || {};
AIN.views = AIN.views || {};

function profilePercentile(indicator, value) {
  let below = 0;
  for (const s of AIN.STATES) if (s[indicator.key] < value) below++;
  let pct = below / (AIN.STATES.length - 1);
  if (indicator.higherBetter === false) pct = 1 - pct;
  return Math.max(0.02, Math.min(1, pct));
}

function rankChipHtml(rank, indicator) {
  let cls = 'rank-chip';
  if (indicator.higherBetter !== null) {
    const goodRank = indicator.higherBetter ? rank : 52 - rank;
    if (goodRank <= 10) cls += ' top';
    else if (goodRank >= 42) cls += ' bottom';
  }
  return '<span class="' + cls + '">' + AIN.ordinal(rank) + ' of 51</span>';
}

function similarStates(state, count) {
  // Z-score distance across all twelve indicators.
  const stats = {};
  for (const ind of AIN.INDICATORS) {
    const vals = AIN.STATES.map(s => s[ind.key]);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) * (b - mean), 0) / vals.length) || 1;
    stats[ind.key] = { mean, sd };
  }
  return AIN.STATES
    .filter(s => s.code !== state.code)
    .map(function (s) {
      let d = 0;
      for (const ind of AIN.INDICATORS) {
        const z = (s[ind.key] - state[ind.key]) / stats[ind.key].sd;
        d += z * z;
      }
      return { state: s, dist: Math.sqrt(d) };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count);
}

AIN.views.state = function (container, code) {
  const state = AIN.stateByCode((code || '').toUpperCase());
  if (!state) {
    container.innerHTML = '<section><h1 class="section-title">State not found</h1>' +
      '<p class="section-lede">Pick a state from the <a href="#/states">data table</a> or the <a href="#/map">map explorer</a>.</p></section>';
    return;
  }
  const usPop = AIN.STATES.reduce((sum, s) => sum + s.pop, 0);
  const usGdp = AIN.STATES.reduce((sum, s) => sum + s.pop * s.gdpPc, 0);
  const popShare = (state.pop / usPop) * 100;
  const gdpShare = ((state.pop * state.gdpPc) / usGdp) * 100;
  const popRank = AIN.rankOf(state.code, 'pop');

  let tiles = '';
  for (const ind of AIN.INDICATORS) {
    const value = state[ind.key];
    const rank = AIN.rankOf(state.code, ind.key);
    const fig = AIN.nationalFigure(ind);
    const avg = fig.value;
    const pct = profilePercentile(ind, value);
    const tickValue = ind.key === 'pop' ? AIN.medianValue(ind.key) : avg;
    const avgPct = profilePercentile(ind, tickValue);
    tiles += '<div class="card stat-card">' +
      '<p class="stat-label">' + AIN.escapeHtml(ind.label) + rankChipHtml(rank, ind) + '</p>' +
      '<p class="stat-value">' + AIN.fmtValue(ind, value) + '</p>' +
      '<p class="stat-note">' + fig.label.toLowerCase() + ' ' + AIN.fmtValue(ind, avg) + ' · ' + ind.year + '</p>' +
      '<div class="pct-bar"><span class="fill" style="width:' + (pct * 100).toFixed(0) + '%"></span>' +
      '<span class="avg-mark" style="left:' + (avgPct * 100).toFixed(0) + '%"></span></div>' +
      '<p class="stat-note">bar: percentile among 51 · amber tick: ' + (ind.key === 'pop' ? 'median state' : 'national average') + '</p></div>';
  }

  const similar = similarStates(state, 4);
  const similarHtml = similar.map(function (x) {
    return '<li><a href="#/state/' + x.state.code + '">' + x.state.name + '</a>' +
      '<span class="rv">' + x.state.region + ' · pop. ' + AIN.fmtCompact(x.state.pop) + '</span></li>';
  }).join('');

  container.innerHTML =
    '<section><p class="kicker">State profile · ' + state.region + '</p>' +
    '<div class="state-head"><h1 class="state-name">' + state.name + '</h1>' +
    '<span class="state-meta">Capital: ' + state.capital + ' · ' + AIN.ordinal(popRank) + ' most populous of 51</span></div>' +
    '<p class="section-lede">' + state.name + ' is home to ' + popShare.toFixed(1) + '% of Americans and produces ' +
    gdpShare.toFixed(1) + '% of national output. Compare it with any other state in the ' +
    '<a href="#/compare">comparison tool</a>.</p>' +
    '<div class="grid grid-4 stats">' + tiles + '</div></section>' +

    '<section class="section"><div class="grid grid-2">' +
      '<div class="card"><h3>' + state.name + ' vs the national average</h3>' +
      '<p class="card-sub">Percentile radar across eight measures. <span style="color:' + AIN.PALETTE.navy + '">\u25a0</span> ' + state.name +
      ' &nbsp;<span style="color:' + AIN.PALETTE.amber + '">\u25a0</span> national average</p>' +
      '<canvas class="chart chart-radar" id="state-radar"></canvas></div>' +
      '<div class="card"><h3>Most similar states</h3>' +
      '<p class="card-sub">Nearest neighbours across all twelve indicators, standardised.</p>' +
      '<ul class="rank-list">' + similarHtml + '</ul>' +
      '<p class="source-line">Similarity is computed from this atlas\u2019s own dataset; see <a href="#/methods">Methods</a>.</p></div>' +
    '</div></section>';

  AIN.afterRender(function () {
    const canvas = document.getElementById('state-radar');
    if (!canvas) return;
    const axes = RADAR_AXES.map(x => x.label);
    const stateVals = RADAR_AXES.map(function (x) {
      return profilePercentile(AIN.indicatorByKey(x.key), state[x.key]);
    });
    const avgVals = RADAR_AXES.map(function (x) {
      return profilePercentile(AIN.indicatorByKey(x.key), AIN.nationalAverage(x.key));
    });
    AIN.radarChart(canvas, axes, [
      { label: state.name, values: stateVals, color: AIN.PALETTE.navy },
      { label: 'National average', values: avgVals, color: AIN.PALETTE.amber },
    ]);
  });
};
