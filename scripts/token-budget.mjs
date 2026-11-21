#!/usr/bin/env node
// What the plugin loads, in tokens. An estimate: characters divided by 4,
// rounded up per file, which is close enough to see growth and cheap enough to
// run with no dependency. Three groups:
// - the always-read set, what every grill loads: the ux-grill skill and the
//   convention. budget.json at the root is the one place its list is written
//   (alwaysRead.files) and holds its ceiling; tests/token-budget.test.mjs
//   fails a pull request that goes over it;
// - each file read on demand: the checklists by hand, the two research
//   records and the method;
// - the factory script.
// Usage: node scripts/token-budget.mjs [--json]   (npm run budget)
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export const ESTIMATE = "tokens estimated as characters divided by 4, rounded up per file; not a tokenizer count";

// The always-read list is budget.json's alwaysRead.files, read by groups().
const ALWAYS_READ = { key: "alwaysRead", label: "Always read, every grill" };

const OTHER_GROUPS = [
  { key: "onDemand", label: "Read on demand", files: [
    "plugin/docs/conventions/ux-checklists.md",
    "plugin/docs/research/ux-rules-sources.md",
    "plugin/docs/research/drawing-skills.md",
    "plugin/docs/method/factory.md",
  ] },
  { key: "script", label: "The factory script", files: [
    "plugin/workflows/factory.js",
  ] },
];

export function readBudget(root = ROOT) {
  const file = path.join(root, "budget.json");
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
}

export function groups(root = ROOT, budget = readBudget(root)) {
  return [{ ...ALWAYS_READ, files: budget?.alwaysRead?.files ?? [] }, ...OTHER_GROUPS];
}

// A character is a code point; CRLF counts as one, so every checkout agrees.
export const estimate = (text) => Math.ceil([...String(text).replace(/\r\n/g, "\n")].length / 4);

export function measure(root = ROOT) {
  const budget = readBudget(root);
  const out = { estimate: ESTIMATE };
  for (const g of groups(root, budget)) {
    const files = g.files.map((rel) => {
      const abs = path.join(root, rel);
      if (!existsSync(abs)) return { path: rel, missing: true, characters: 0, tokens: 0 };
      const text = readFileSync(abs, "utf8").replace(/\r\n/g, "\n");
      return { path: rel, missing: false, characters: [...text].length, tokens: estimate(text) };
    });
    out[g.key] = { label: g.label, files, total: files.reduce((s, f) => s + f.tokens, 0) };
  }
  const ceiling = budget?.alwaysRead?.ceiling ?? null;
  out.budget = { ceiling, within: ceiling === null ? null : out.alwaysRead.total <= ceiling };
  return out;
}

const n = (x) => x.toLocaleString("en-US");

export function markdown(m) {
  const lines = [
    `Estimate: ${m.estimate}.`,
    "",
    "| Set | File | Characters | Tokens |",
    "| --- | --- | ---: | ---: |",
  ];
  for (const key of [ALWAYS_READ.key, ...OTHER_GROUPS.map((g) => g.key)]) {
    const group = m[key];
    for (const f of group.files) {
      lines.push(`| ${group.label} | \`${f.path}\` | ${f.missing ? "absent" : n(f.characters)} | ${f.missing ? "·" : n(f.tokens)} |`);
    }
    lines.push(`| ${group.label} | **Total** | | **${n(group.total)}** |`);
  }
  lines.push("");
  if (m.budget.ceiling === null) lines.push("No ceiling: budget.json is absent.");
  else lines.push(`Always read: ${n(m.alwaysRead.total)} against a ceiling of ${n(m.budget.ceiling)} (budget.json): ${m.budget.within ? "within" : "OVER"}.`);
  return lines.join("\n");
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const m = measure();
  process.stdout.write(process.argv.includes("--json") ? `${JSON.stringify(m, null, 2)}\n` : `${markdown(m)}\n`);
}
