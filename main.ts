// Entry program for make.fun's news-image-20261123 bounty.
//
// The repository holds entry.png: a front page summing up the world news of
// Monday 23 November 2026. This program copies it to the output directory.
// Standard library only; no network, no clock, no randomness, so two runs
// always write the same bytes.

import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));

/** Read a --name value from the arguments, or use the fallback. */
function option(name: string, fallback: string): string {
  const at = process.argv.indexOf(`--${name}`);
  if (at >= 0 && at + 1 < process.argv.length) return process.argv[at + 1]!;
  const joined = process.argv.find((a) => a.startsWith(`--${name}=`));
  return joined === undefined ? fallback : joined.slice(name.length + 3);
}

const outDir = option('output', process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const source = join(here, 'entry.png');

if (!existsSync(source)) {
  process.stderr.write('news image: entry.png is missing from the repository\n');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.png');
copyFileSync(source, target);
// Confirm the copy landed whole: the grader reads exactly these bytes.
if (statSync(target).size !== statSync(source).size) {
  process.stderr.write('news image: entry.png copy is incomplete\n');
  process.exit(1);
}
process.stdout.write('news image: wrote entry.png\n');
