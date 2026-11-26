// Formatting and DOM helpers shared by every view.

window.AIN = window.AIN || {};

// "341784857" -> "341,784,857"
AIN.fmtInt = function (n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Indicator value with its unit, e.g. "$104,916", "5.3%", "78.6 years".
AIN.fmtValue = function (ind, v) {
  if (v === null || v === undefined || Number.isNaN(v)) return '\u2014';
  const fixed = Number(v).toFixed(ind.dec);
  const grouped = Number(fixed).toLocaleString('en-US', {
    minimumFractionDigits: ind.dec,
    maximumFractionDigits: ind.dec,
  });
  if (ind.unit === 'US$') return '$' + grouped;
  if (ind.unit === '%') return grouped + '%';
  if (ind.unit === 'years') return grouped + ' yrs';
  if (ind.unit === 'people') return grouped;
  return grouped + ' ' + ind.unit;
};

// Compact form for axis ticks: 341784857 -> "342M", 104916 -> "$105k".
AIN.fmtCompact = function (v, unit) {
  const abs = Math.abs(v);
  let s;
  if (abs >= 1e9) s = (v / 1e9).toFixed(1) + 'B';
  else if (abs >= 1e6) s = (v / 1e6).toFixed(abs >= 1e8 ? 0 : 1) + 'M';
  else if (abs >= 1e3) s = (v / 1e3).toFixed(abs >= 1e5 ? 0 : 1) + 'k';
  else s = String(Math.round(v * 10) / 10);
  return unit === 'US$' ? '$' + s : s;
};

AIN.escapeHtml = function (s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

// Ordinal suffix: 1 -> "1st", 23 -> "23rd".
AIN.ordinal = function (n) {
  const tail = n % 100;
  if (tail >= 11 && tail <= 13) return n + 'th';
  switch (n % 10) {
    case 1: return n + 'st';
    case 2: return n + 'nd';
    case 3: return n + 'rd';
    default: return n + 'th';
  }
};

// Signed percentage with one decimal, e.g. +4.3% / -1.2%.
AIN.fmtSignedPct = function (v) {
  const sign = v > 0 ? '+' : '';
  return sign + v.toFixed(1) + '%';
};
