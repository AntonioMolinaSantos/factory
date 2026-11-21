// plugin/docs/conventions/ux-design.md: every design spec dated from UX_SINCE carries
// a UI/UX verdict, and a "needed" verdict carries a mockup and a grill record.
// Specs dated before it are records of their time and are not scanned.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, test } from "vitest";

export const UX_SINCE = "2026-11-21";
export const RULES = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"];
const RESULTS = ["met", "changed", "waived"];
// The factory reads a design spec's slug with this same expression (plugin/workflows/factory.js, DESIGN_NAME).
const SPEC_NAME = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)-design\.md$/;

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => readFileSync(path.join(root, ...p), "utf8");

// The section runs from its heading to the next heading of the same level.
function section(text) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => /^## (?:\d+\.\s*)?UI\/UX\s*$/.test(l));
  if (start === -1) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^## /.test(l));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n");
}

// A screen of the record names an HTML file of the mockup when the file's name
// without .html, hyphens and underscores read as spaces, appears as whole words
// in the screen's heading, ignoring case: product.html and "#### Product page".
const words = (s) => ` ${String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;
export function namesFile(heading, file) {
  const name = words(file.replace(/[.]html$/i, ""));
  return name.trim() !== "" && words(heading).includes(name);
}

// mockupFiles(dir) lists the names of the files in the folder, an empty array
// when there is none. It is passed in so the rule can be tested without a tree.
export function uxProblems(text, slug, mockupFiles) {
  const body = section(text);
  if (body === null) return ["no UI/UX section"];
  const verdict = body.match(/^Verdict: (needed|not needed)(.*)$/m);
  if (!verdict) return ["no verdict line"];
  if (verdict[1] === "not needed") {
    return /^, because \S.{15,}/.test(verdict[2]) ? [] : ["not needed without a reason"];
  }
  const problems = [];
  const dir = `docs/design/${slug}/`;
  const html = (mockupFiles(dir) || []).map((f) => String(f).split("/").pop()).filter((f) => /[.]html$/i.test(f));
  if (!body.split("\n").includes(`Mockup: ${dir}`)) problems.push(`no mockup line naming ${dir}`);
  else if (!html.length) problems.push(`no HTML mockup under ${dir}`);
  const at = body.indexOf("### Grill record");
  if (at === -1) return [...problems, "no grill record"];
  const record = body.slice(at);
  if (!/^Grilled on \d{1,2} [A-Z][a-z]+ \d{4}\.$/m.test(record)) problems.push("grill record without its date");
  const screens = record.split(/^#### /m).slice(1);
  if (!screens.length) problems.push("grill record without a screen");
  for (const block of screens) {
    const name = block.split("\n")[0].trim();
    for (const rule of RULES) {
      // The result line is the first "- Rn: met|changed|waived"; any other line about the rule is a note.
      const line = block.match(new RegExp(`^- ${rule}: (${RESULTS.join("|")})\\b(.*)$`, "m"));
      if (!line) problems.push(`${name}: ${rule} has no result`);
      else if (line[1] === "waived" && !/^,\s*\S/.test(line[2])) problems.push(`${name}: ${rule} waived without a reason`);
    }
  }
  const headings = screens.map((b) => b.split("\n")[0]);
  for (const file of html) if (!headings.some((h) => namesFile(h, file))) problems.push(`${file} has no screen in the grill record`);
  return problems;
}

const record = (lines, screens = ["Dashboard"]) => ["### Grill record", "", "Grilled on 21 November 2026.", "", ...screens.flatMap((s) => [`#### ${s}`, ...lines, ""])].join("\n");
const allMet = RULES.map((r) => `- ${r}: met`);
const spec = (ux) => `# A design\n\n## Why\n\nText.\n\n${ux}\n\n## Testing\n\nText.\n`;
const yes = () => ["dashboard.html", "mockup.css"];

describe("the UI/UX rule", () => {
  test("a spec without the section or without a verdict fails", () => {
    expect(uxProblems("# A design\n", "a", yes)).toEqual(["no UI/UX section"]);
    expect(uxProblems(spec("## UI/UX\n\nNothing decided."), "a", yes)).toEqual(["no verdict line"]);
  });

  test("not needed asks for a reason and nothing else", () => {
    expect(uxProblems(spec("## UI/UX\n\nVerdict: not needed"), "a", yes)).toEqual(["not needed without a reason"]);
    expect(uxProblems(spec("## 7. UI/UX\n\nVerdict: not needed, because the change is a test and two documents."), "a", yes)).toEqual([]);
  });

  test("needed asks for the mockup folder and a grill record", () => {
    expect(uxProblems(spec("## UI/UX\n\nVerdict: needed"), "reports", yes)).toEqual(["no mockup line naming docs/design/reports/", "no grill record"]);
    const full = spec(`## UI/UX\n\nVerdict: needed\nMockup: docs/design/reports/\n\n${record(allMet)}`);
    expect(uxProblems(full, "reports", yes)).toEqual([]);
    expect(uxProblems(full, "reports", () => ["mockup.css"])).toEqual(["no HTML mockup under docs/design/reports/"]);
  });

  test("the mockup line is a whole line naming the folder, never prose or a path out of it", () => {
    for (const line of ["See Mockup: docs/design/reports/ for the screens.", "Mockup: docs/design/reports/../other/", "Mockup: docs/design/reports/dashboard.html"]) {
      expect(uxProblems(spec(`## UI/UX\n\nVerdict: needed\n${line}\n\n${record(allMet)}`), "reports", yes), line).toEqual(["no mockup line naming docs/design/reports/"]);
    }
  });

  test("every HTML file of the mockup is a screen of the record: its name, hyphens as spaces, in the heading", () => {
    const two = () => ["home.html", "product.html", "mockup.css"];
    const ux = (screens) => spec(`## UI/UX\n\nVerdict: needed\nMockup: docs/design/storefront/\n\n${record(allMet, screens)}`);
    expect(uxProblems(ux(["Home"]), "storefront", two)).toEqual(["product.html has no screen in the grill record"]);
    expect(uxProblems(ux(["Homepage", "Product"]), "storefront", two)).toEqual(["home.html has no screen in the grill record"]);
    expect(uxProblems(ux(["Home", "Product page"]), "storefront", two)).toEqual([]);
    expect(uxProblems(ux(["Product detail"]), "storefront", () => ["product-detail.html"])).toEqual([]);
  });

  test("a note line about a rule is not read as its result", () => {
    const noted = ["- R1: the banner keeps its image, see the notes", ...allMet, "", "Notes:", "", "- R3: two buttons, never in one view"];
    expect(uxProblems(spec(`## UI/UX\n\nVerdict: needed\nMockup: docs/design/reports/\n\n${record(noted)}`), "reports", yes)).toEqual([]);
  });

  test("every screen answers the nine rules, and a waiver says why", () => {
    const missing = spec(`## UI/UX\n\nVerdict: needed\nMockup: docs/design/reports/\n\n${record(allMet.slice(0, 8))}`);
    expect(uxProblems(missing, "reports", yes)).toEqual(["Dashboard: R9 has no result"]);
    const waived = (tail) => spec(`## UI/UX\n\nVerdict: needed\nMockup: docs/design/reports/\n\n${record([...allMet.slice(0, 8), `- R9: waived${tail}`])}`);
    expect(uxProblems(waived(""), "reports", yes)).toEqual(["Dashboard: R9 waived without a reason"]);
    expect(uxProblems(waived(", the screen has no action to confirm"), "reports", yes)).toEqual([]);
    // Any reason once trimmed, however short; the comma introduces it.
    expect(uxProblems(waived(", none"), "reports", yes)).toEqual([]);
    for (const tail of [",", ",   ", " because"]) expect(uxProblems(waived(tail), "reports", yes), tail).toEqual(["Dashboard: R9 waived without a reason"]);
  });

  test("a design spec is named <date>-<slug>-design.md, the slug in lower-case kebab case", () => {
    expect("2026-12-01-storefront-summary-design.md".match(SPEC_NAME)?.[2]).toBe("storefront-summary");
    for (const name of ["2026-12-01-Storefront-design.md", "2026-12-01-store_front-design.md", "2026-12-01-store--front-design.md"]) expect(name, name).not.toMatch(SPEC_NAME);
  });

  test("the section ends at the next heading, so a later verdict does not count", () => {
    expect(uxProblems(spec("## UI/UX\n\nOpen.\n\n## Notes\n\nVerdict: not needed, because nothing a user sees changes here."), "a", yes)).toEqual(["no verdict line"]);
  });
});

describe("the UI/UX convention in this repo", () => {
  const mockupFiles = (dir) => (existsSync(path.join(root, dir)) ? readdirSync(path.join(root, dir)) : []);

  test("every design spec dated from the adoption date passes the rule", () => {
    const offenders = [];
    let scanned = 0;
    const specs = path.join(root, "docs", "superpowers", "specs");
    for (const file of existsSync(specs) ? readdirSync(specs) : []) {
      const dated = file.match(/^(\d{4}-\d{2}-\d{2})-.*-design\.md$/);
      if (!dated || dated[1] < UX_SINCE) continue;
      scanned += 1;
      const m = file.match(SPEC_NAME);
      if (!m) offenders.push(`${file}: the slug is not lower-case kebab case`);
      else for (const p of uxProblems(read("docs", "superpowers", "specs", file), m[2], mockupFiles)) offenders.push(`${file}: ${p}`);
    }
    expect(offenders).toEqual([]);
    // A repo with a specs folder scans at least one spec; this repo has none yet.
    if (existsSync(specs)) expect(scanned).toBeGreaterThan(0);
  });

  test("the convention names the nine rules and the grill skill reads it rather than restating them", () => {
    const doc = read("plugin", "docs", "conventions", "ux-design.md");
    for (const rule of RULES) expect(doc, rule).toMatch(new RegExp(`\\| ${rule} \\|`));
    const skill = read("plugin", "skills", "ux-grill", "SKILL.md");
    expect(skill).toContain("docs/conventions/ux-design.md");
    expect(skill).not.toMatch(/\| R1 \|/);
  });

  // The rules were checked against primary texts (plugin/docs/research/ux-rules-sources.md).
  // The convention points to the findings, and the findings judge every rule it names.
  test("the convention cites its sources, and the findings carry a verdict for every rule", () => {
    const doc = read("plugin", "docs", "conventions", "ux-design.md");
    expect(doc).toMatch(/^## Sources$/m);
    expect(doc).toContain("../research/ux-rules-sources.md");
    const findings = read("plugin", "docs", "research", "ux-rules-sources.md");
    for (const rule of RULES) {
      const start = findings.search(new RegExp(`^### ${rule}: `, "m"));
      expect(start, rule).toBeGreaterThan(-1);
      const body = findings.slice(start + 1).split(/^### /m)[0];
      expect(body, rule).toMatch(/^\| Verdict \| \*\*(supported|needs correction|unsupported)\*\*/m);
    }
    // Every source says how far it was read: nothing is passed off as read.
    const sources = findings.split(/^## Sources$/m)[1] ?? "";
    const rows = sources.split("\n").filter((l) => /^\| (?!Source|---)/.test(l));
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) expect(row).toMatch(/read in full|read in part|second-hand|not read, from memory/);
    expect(doc + findings).not.toMatch(/[\u2013\u2014]/);
  });

  // The grill borrows skills that already exist, each for one job, and works without
  // them: the convention keeps a checklist by hand for every rule. The checklist is a
  // list, never a second table: the factory reads the rule ids off table rows.
  test("every rule has a checklist by hand, and the grill names each borrowed skill with its fallback", () => {
    const doc = read("plugin", "docs", "conventions", "ux-design.md");
    const start = doc.search(/^## How each rule is checked$/m);
    expect(start).toBeGreaterThan(-1);
    const part = doc.slice(start + 1).split(/^## /m)[0];
    for (const rule of RULES) {
      const line = part.split("\n\n").find((b) => b.startsWith(`- **${rule}.**`));
      expect(line, rule).toBeTruthy();
      expect(line, rule).toMatch(/By hand:/);
    }
    expect([...doc.matchAll(/^\| (R\d+) \|/gm)].map((m) => m[1])).toEqual(RULES);
    const skill = read("plugin", "skills", "ux-grill", "SKILL.md");
    const borrowed = ["mattpocock-skills:research", "mattpocock-skills:grilling", "design:design-critique", "design:accessibility-review", "design:ux-copy", "design:design-system"];
    for (const name of borrowed) {
      expect(skill, name).toContain(`\`${name}\``);
      expect(doc, name).toContain(`\`${name}\``);
    }
    expect(skill).toMatch(/if it is installed/);
    expect(skill).toMatch(/How each rule is checked/);
    expect(skill).not.toMatch(/By hand:/);
    expect(doc + skill).not.toMatch(/[\u2013\u2014]/);
  });
});
