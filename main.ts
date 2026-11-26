// Hand-in program for the "America in Numbers" national statistics site.
//
// What the grader runs (Node 22, standard library only, no network, 10 s):
//   1. mirror this repository's app/        -> <output>/app
//   2. mirror this repository's screenshots/ -> <output>/screenshots
//   3. write <output>/dossier.json using buildDossier from the vendored
//      make.fun library, so the scorer can rebuild it byte for byte.
//
// The output root is /output in the grader's container; anywhere else the
// MAKEFUN_OUTPUT_DIR environment variable stands in for it, e.g.
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The caps passed to buildDossier are the scorer's own (reference/gate.json):
// dossier text at most 163,840 bytes; at most 4 screenshots of 256 KiB each;
// app/ at most 993 entries and 16 MiB, inside /output's 1,000-entry / 64 MiB
// envelope shared with screenshots/ and dossier.json.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputRoot = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function mirrorFolder(name: string): void {
  const from = join(repoRoot, name);
  const to = join(outputRoot, name);
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) {
    cpSync(from, to, { recursive: true });
  }
}

mkdirSync(outputRoot, { recursive: true });
mirrorFolder('app');
mirrorFolder('screenshots');

const dossier = buildDossier(outputRoot, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputRoot, 'dossier.json'), dossier);
