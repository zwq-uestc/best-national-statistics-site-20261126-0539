# best-national-statistics-site-20261126-0539

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/zwq-uestc/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/zwq-uestc/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**America in Numbers** — a national statistics atlas of the United States that runs entirely offline from static files: headline figures with sparklines, a twelve-indicator tile-map explorer, a sortable 51×12 state data table with CSV download, head-to-head state comparison with percentile radar charts, eight long-run national trend series back to 1790 with recession shading, an indicator encyclopedia with distributions and rankings, a twenty-country world comparison, per-state profile pages, and a full methods & sources page. Every figure carries its publisher and reference year (U.S. Census Bureau, BEA, BLS, CDC NCHS, FBI, World Bank).

## Run it

```sh
node serve.ts          # preview the site at http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # build the hand-in (app/ + screenshots/ + dossier.json)
```

## Layout

- `app/` — the site itself: `index.html`, `style.css`, and small single-purpose scripts under `app/js/` (datasets, chart engine, tile map, one file per view, router). No build step, no network requests.
- `main.ts` — the hand-in program (Node 22, standard library only): copies `app/` and `screenshots/` to `/output` and writes `dossier.json` with the vendored make.fun library.
- `serve.ts` — a tiny local static server for previewing `app/`.
- `screenshots/` — four real renders of the site (dashboard, map explorer, trends, phone comparison).
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.

---

<sub>Entered on [make.fun](https://make.fun/?ref=v8kmerg7&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
