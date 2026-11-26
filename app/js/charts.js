// Canvas chart engine: line, bar, scatter, radar, histogram, donut and
// sparkline charts, drawn with the 2D canvas API. No libraries, no images,
// no network. Every chart is HiDPI-aware and the line/scatter charts show a
// tooltip on hover.

window.AIN = window.AIN || {};

AIN.PALETTE = {
  ink: '#16233f',
  navy: '#1d3a6e',
  teal: '#0e7c7b',
  amber: '#d9930d',
  rust: '#c0532f',
  slate: '#5a6577',
  grid: '#e3ddd0',
  paper: '#f7f5f0',
  series: ['#1d3a6e', '#0e7c7b', '#d9930d', '#c0532f', '#6a5acd', '#3f7d4e'],
};

// Shared tooltip element, created once.
let tooltipEl = null;
function showTooltip(html, x, y) {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'chart-tooltip';
    document.body.appendChild(tooltipEl);
  }
  tooltipEl.innerHTML = html;
  tooltipEl.style.display = 'block';
  const pad = 14;
  const w = tooltipEl.offsetWidth;
  const left = Math.min(x + pad, window.innerWidth - w - 8);
  tooltipEl.style.left = left + 'px';
  tooltipEl.style.top = (y + pad) + 'px';
}
function hideTooltip() {
  if (tooltipEl) tooltipEl.style.display = 'none';
}

// Prepare a canvas for drawing at device resolution; returns ctx + css size.
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

// "Nice" axis bounds and step for a value range.
function niceScale(min, max, ticksWanted) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const rawStep = span / ticksWanted;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  let step = mag;
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (mag * m >= rawStep) { step = mag * m; break; }
  }
  return {
    lo: Math.floor(min / step) * step,
    hi: Math.ceil(max / step) * step,
    step,
  };
}

function axisText(ctx, text, x, y, align) {
  ctx.fillStyle = AIN.PALETTE.slate;
  ctx.font = '11px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

// Line chart over [x, y] points. options: { color, unit, recessions, area,
// formatY, zeroBase, label }.
AIN.lineChart = function (canvas, points, options) {
  const opts = options || {};
  const color = opts.color || AIN.PALETTE.navy;
  const { ctx, w, h } = setupCanvas(canvas);
  if (w < 40 || h < 40 || points.length < 2) return;
  const m = { l: 52, r: 14, t: 14, b: 26 };
  const plotW = w - m.l - m.r;
  const plotH = h - m.t - m.b;
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const xMin = Math.min.apply(null, xs);
  const xMax = Math.max.apply(null, xs);
  let yMin = Math.min.apply(null, ys);
  let yMax = Math.max.apply(null, ys);
  if (opts.zeroBase && yMin > 0) yMin = 0;
  const scale = niceScale(yMin, yMax, 5);
  const X = v => m.l + ((v - xMin) / (xMax - xMin)) * plotW;
  const Y = v => m.t + plotH - ((v - scale.lo) / (scale.hi - scale.lo)) * plotH;

  // Recession shading first, under everything.
  if (opts.recessions) {
    ctx.fillStyle = 'rgba(192, 83, 47, 0.10)';
    for (const [a, b] of opts.recessions) {
      const x1 = Math.max(X(a), m.l);
      const x2 = Math.min(X(b + 1), m.l + plotW);
      if (x2 > x1) ctx.fillRect(x1, m.t, x2 - x1, plotH);
    }
  }
  // Gridlines and y labels.
  ctx.strokeStyle = AIN.PALETTE.grid;
  ctx.lineWidth = 1;
  for (let v = scale.lo; v <= scale.hi + 1e-9; v += scale.step) {
    const y = Y(v);
    ctx.beginPath();
    ctx.moveTo(m.l, y);
    ctx.lineTo(m.l + plotW, y);
    ctx.stroke();
    axisText(ctx, opts.formatY ? opts.formatY(v) : AIN.fmtCompact(v, opts.unit), m.l - 6, y, 'right');
  }
  // X labels: about six evenly spaced years.
  const xTicks = 6;
  for (let i = 0; i <= xTicks; i++) {
    const v = xMin + ((xMax - xMin) * i) / xTicks;
    axisText(ctx, String(Math.round(v)), X(v), m.t + plotH + 12, 'center');
  }
  // Area fill.
  if (opts.area !== false) {
    ctx.beginPath();
    ctx.moveTo(X(points[0][0]), Y(points[0][1]));
    for (const p of points) ctx.lineTo(X(p[0]), Y(p[1]));
    ctx.lineTo(X(points[points.length - 1][0]), m.t + plotH);
    ctx.lineTo(X(points[0][0]), m.t + plotH);
    ctx.closePath();
    ctx.fillStyle = color + '22';
    ctx.fill();
  }
  // The line itself.
  ctx.beginPath();
  ctx.moveTo(X(points[0][0]), Y(points[0][1]));
  for (const p of points) ctx.lineTo(X(p[0]), Y(p[1]));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineJoin = 'round';
  ctx.stroke();
  // End-point dot and value.
  const last = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(X(last[0]), Y(last[1]), 3.5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  // Hover: nearest point tooltip + marker.
  canvas.onmousemove = function (ev) {
    const rect = canvas.getBoundingClientRect();
    const mx = ev.clientX - rect.left;
    let best = null;
    let bestDist = Infinity;
    for (const p of points) {
      const d = Math.abs(X(p[0]) - mx);
      if (d < bestDist) { bestDist = d; best = p; }
    }
    if (!best) return;
    showTooltip(
      '<strong>' + best[0] + '</strong>: ' + (opts.formatY ? opts.formatY(best[1]) : best[1]) +
      (opts.unit && !opts.formatY ? ' ' + AIN.escapeHtml(opts.unit) : ''),
      ev.clientX, ev.clientY);
  };
  canvas.onmouseleave = hideTooltip;
};

// Horizontal ranked bars. items: [{label, value, color?, note?}].
AIN.barChart = function (canvas, items, options) {
  const opts = options || {};
  const { ctx, w, h } = setupCanvas(canvas);
  if (w < 40 || h < 20 || items.length === 0) return;
  const labelW = opts.labelW || 118;
  const valueW = 76;
  const barAreaW = w - labelW - valueW;
  const rowH = h / items.length;
  const barH = Math.min(20, rowH * 0.62);
  const maxV = Math.max.apply(null, items.map(i => i.value));
  const minV = Math.min.apply(null, items.map(i => i.value));
  const lo = opts.zeroBase === false ? minV - (maxV - minV) * 0.08 : 0;
  ctx.font = '12px -apple-system, "Segoe UI", Roboto, sans-serif';
  items.forEach((item, i) => {
    const cy = rowH * i + rowH / 2;
    const bw = Math.max(2, ((item.value - lo) / (maxV - lo)) * barAreaW);
    ctx.fillStyle = AIN.PALETTE.ink;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.label, labelW - 8, cy);
    ctx.fillStyle = item.color || AIN.PALETTE.teal;
    ctx.beginPath();
    ctx.roundRect(labelW, cy - barH / 2, bw, barH, 3);
    ctx.fill();
    ctx.fillStyle = AIN.PALETTE.slate;
    ctx.textAlign = 'left';
    ctx.fillText(opts.formatValue ? opts.formatValue(item.value) : String(item.value), labelW + bw + 6, cy);
  });
};

// Scatter plot. points: [{x, y, label, color?, highlight?}].
AIN.scatterChart = function (canvas, points, options) {
  const opts = options || {};
  const { ctx, w, h } = setupCanvas(canvas);
  if (w < 60 || h < 60 || points.length === 0) return;
  const m = { l: 52, r: 16, t: 14, b: 34 };
  const plotW = w - m.l - m.r;
  const plotH = h - m.t - m.b;
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const sx = niceScale(Math.min.apply(null, xs), Math.max.apply(null, xs), 5);
  const sy = niceScale(Math.min.apply(null, ys), Math.max.apply(null, ys), 5);
  const X = v => m.l + ((v - sx.lo) / (sx.hi - sx.lo)) * plotW;
  const Y = v => m.t + plotH - ((v - sy.lo) / (sy.hi - sy.lo)) * plotH;
  ctx.strokeStyle = AIN.PALETTE.grid;
  ctx.lineWidth = 1;
  for (let v = sy.lo; v <= sy.hi + 1e-9; v += sy.step) {
    ctx.beginPath(); ctx.moveTo(m.l, Y(v)); ctx.lineTo(m.l + plotW, Y(v)); ctx.stroke();
    axisText(ctx, opts.formatY ? opts.formatY(v) : AIN.fmtCompact(v, opts.yUnit), m.l - 6, Y(v), 'right');
  }
  for (let v = sx.lo; v <= sx.hi + 1e-9; v += sx.step) {
    ctx.beginPath(); ctx.moveTo(X(v), m.t); ctx.lineTo(X(v), m.t + plotH); ctx.stroke();
    axisText(ctx, opts.formatX ? opts.formatX(v) : AIN.fmtCompact(v, opts.xUnit), X(v), m.t + plotH + 12, 'center');
  }
  if (opts.xLabel) axisText(ctx, opts.xLabel, m.l + plotW / 2, h - 4, 'center');
  for (const p of points) {
    ctx.beginPath();
    ctx.arc(X(p.x), Y(p.y), p.highlight ? 5 : 3.4, 0, Math.PI * 2);
    ctx.fillStyle = p.color || AIN.PALETTE.navy;
    ctx.globalAlpha = p.highlight ? 1 : 0.72;
    ctx.fill();
    ctx.globalAlpha = 1;
    if (p.highlight) {
      ctx.fillStyle = AIN.PALETTE.ink;
      ctx.font = '600 11px -apple-system, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(p.label, X(p.x) + 7, Y(p.y) - 5);
    }
  }
  canvas.onmousemove = function (ev) {
    const rect = canvas.getBoundingClientRect();
    const mx = ev.clientX - rect.left;
    const my = ev.clientY - rect.top;
    let best = null;
    let bestDist = 18;
    for (const p of points) {
      const d = Math.hypot(X(p.x) - mx, Y(p.y) - my);
      if (d < bestDist) { bestDist = d; best = p; }
    }
    if (!best) { hideTooltip(); return; }
    showTooltip(
      '<strong>' + AIN.escapeHtml(best.label) + '</strong><br>' +
      AIN.escapeHtml(opts.xLabel || 'x') + ': ' + (opts.formatX ? opts.formatX(best.x) : best.x) + '<br>' +
      AIN.escapeHtml(opts.yLabel || 'y') + ': ' + (opts.formatY ? opts.formatY(best.y) : best.y),
      ev.clientX, ev.clientY);
  };
  canvas.onmouseleave = hideTooltip;
};

// Radar chart. axes: [labels]; datasets: [{label, values (0..1), color}].
AIN.radarChart = function (canvas, axes, datasets) {
  const { ctx, w, h } = setupCanvas(canvas);
  if (w < 60 || h < 60 || axes.length < 3) return;
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) / 2 - 44;
  const n = axes.length;
  const angle = i => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  // Rings.
  ctx.strokeStyle = AIN.PALETTE.grid;
  ctx.lineWidth = 1;
  for (const frac of [0.25, 0.5, 0.75, 1]) {
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const a = angle(i % n);
      const px = cx + Math.cos(a) * R * frac;
      const py = cy + Math.sin(a) * R * frac;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  // Spokes and axis labels. Label anchors are clamped so long labels stay
  // inside the canvas on narrow (phone) widths.
  ctx.font = '11px -apple-system, "Segoe UI", Roboto, sans-serif';
  for (let i = 0; i < n; i++) {
    const a = angle(i);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    ctx.stroke();
    let lx = cx + Math.cos(a) * (R + 10);
    const ly = cy + Math.sin(a) * (R + 10);
    const align = Math.abs(Math.cos(a)) < 0.35 ? 'center' : (Math.cos(a) > 0 ? 'left' : 'right');
    const tw = ctx.measureText(axes[i]).width;
    if (align === 'right' && lx - tw < 2) lx = tw + 2;
    if (align === 'left' && lx + tw > w - 2) lx = w - 2 - tw;
    if (align === 'center') lx = Math.max(tw / 2 + 2, Math.min(w - tw / 2 - 2, lx));
    ctx.fillStyle = AIN.PALETTE.ink;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(axes[i], lx, ly);
  }
  // Data polygons.
  for (const ds of datasets) {
    ctx.beginPath();
    ds.values.forEach((v, i) => {
      const a = angle(i);
      const px = cx + Math.cos(a) * R * Math.max(0, Math.min(1, v));
      const py = cy + Math.sin(a) * R * Math.max(0, Math.min(1, v));
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = ds.color + '33';
    ctx.fill();
    ctx.strokeStyle = ds.color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

// Histogram of a value list. options: { bins, color, formatX, marker }.
AIN.histogram = function (canvas, values, options) {
  const opts = options || {};
  const { ctx, w, h } = setupCanvas(canvas);
  if (w < 40 || h < 40 || values.length === 0) return;
  const m = { l: 34, r: 10, t: 10, b: 24 };
  const plotW = w - m.l - m.r;
  const plotH = h - m.t - m.b;
  const min = Math.min.apply(null, values);
  const max = Math.max.apply(null, values);
  const bins = opts.bins || 10;
  const width = (max - min) / bins || 1;
  const counts = new Array(bins).fill(0);
  for (const v of values) {
    const idx = Math.min(bins - 1, Math.floor((v - min) / width));
    counts[idx]++;
  }
  const maxCount = Math.max.apply(null, counts);
  const X = v => m.l + ((v - min) / (max - min || 1)) * plotW;
  ctx.fillStyle = opts.color || AIN.PALETTE.teal;
  counts.forEach((c, i) => {
    const bw = plotW / bins;
    const bh = (c / maxCount) * plotH;
    ctx.fillRect(m.l + i * bw + 1, m.t + plotH - bh, bw - 2, bh);
  });
  axisText(ctx, opts.formatX ? opts.formatX(min) : String(Math.round(min)), m.l, m.t + plotH + 11, 'left');
  axisText(ctx, opts.formatX ? opts.formatX(max) : String(Math.round(max)), m.l + plotW, m.t + plotH + 11, 'right');
  axisText(ctx, String(maxCount) + ' states', m.l - 4, m.t + 6, 'right');
  if (opts.marker !== undefined && opts.marker !== null) {
    ctx.strokeStyle = AIN.PALETTE.rust;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(X(opts.marker), m.t);
    ctx.lineTo(X(opts.marker), m.t + plotH);
    ctx.stroke();
  }
};

// Donut chart. slices: [{label, value, color}].
AIN.donutChart = function (canvas, slices) {
  const { ctx, w, h } = setupCanvas(canvas);
  if (w < 40 || h < 40 || slices.length === 0) return;
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) / 2 - 6;
  const total = slices.reduce((s, x) => s + x.value, 0);
  let start = -Math.PI / 2;
  for (const s of slices) {
    const sweep = (s.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, start, start + sweep);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
    start += sweep;
  }
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
};

// Tiny inline trend line for stat cards.
AIN.sparkline = function (canvas, points, color) {
  const { ctx, w, h } = setupCanvas(canvas);
  if (w < 10 || h < 10 || points.length < 2) return;
  const ys = points.map(p => p[1]);
  const xs = points.map(p => p[0]);
  const yMin = Math.min.apply(null, ys);
  const yMax = Math.max.apply(null, ys);
  const xMin = Math.min.apply(null, xs);
  const xMax = Math.max.apply(null, xs);
  const X = v => 2 + ((v - xMin) / (xMax - xMin)) * (w - 4);
  const Y = v => h - 3 - ((v - yMin) / (yMax - yMin || 1)) * (h - 6);
  ctx.beginPath();
  ctx.moveTo(X(points[0][0]), Y(points[0][1]));
  for (const p of points) ctx.lineTo(X(p[0]), Y(p[1]));
  ctx.strokeStyle = color || AIN.PALETTE.teal;
  ctx.lineWidth = 1.6;
  ctx.stroke();
  const last = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(X(last[0]), Y(last[1]), 2.2, 0, Math.PI * 2);
  ctx.fillStyle = color || AIN.PALETTE.teal;
  ctx.fill();
};
