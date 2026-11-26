// Router and boot: hash-based navigation between the atlas views, the
// after-render draw queue that canvas charts use (they need layout first),
// active-nav highlighting, and redraws on window resize.

window.AIN = window.AIN || {};

// --- Draw queue ------------------------------------------------------------
// Views register canvas drawing callbacks with AIN.afterRender(fn). The
// router flushes them on the next animation frame, once the new DOM has
// layout; the callbacks are kept so a resize can redraw at the new size.

let pendingDraws = [];
let lastDraws = [];

AIN.afterRender = function (fn) {
  pendingDraws.push(fn);
};

AIN.flushDraws = function () {
  const draws = pendingDraws;
  pendingDraws = [];
  lastDraws = draws;
  requestAnimationFrame(function () {
    for (const fn of draws) {
      try { fn(); } catch (err) { /* one bad chart must not blank the page */ }
    }
  });
};

let resizeTimer = null;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    for (const fn of lastDraws) {
      try { fn(); } catch (err) { /* ignore */ }
    }
  }, 180);
});

// --- Routing ---------------------------------------------------------------

const ROUTES = {
  '': 'home',
  'map': 'map',
  'states': 'states',
  'compare': 'compare',
  'trends': 'trends',
  'indicators': 'indicators',
  'state': 'state',
  'methods': 'methods',
};

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const parts = raw.split('/').filter(Boolean);
  return { head: parts[0] || '', param: parts[1] || null };
}

function setActiveNav(routeKey) {
  document.querySelectorAll('.main-nav a').forEach(function (a) {
    a.classList.toggle('active', a.getAttribute('data-route') === routeKey);
  });
}

function render() {
  const container = document.getElementById('view');
  const { head, param } = parseHash();
  const routeKey = ROUTES[head] || 'home';
  pendingDraws = [];
  lastDraws = [];
  const view = AIN.views[routeKey];
  if (view) {
    view(container, param);
  } else {
    AIN.views.home(container);
  }
  setActiveNav(routeKey);
  AIN.flushDraws();
  container.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
document.addEventListener('DOMContentLoaded', render);
if (document.readyState !== 'loading') render();
