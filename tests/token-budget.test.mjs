// What every grill loads is held under a ceiling. scripts/token-budget.mjs estimates
// tokens as characters divided by 4 for the always-read set (the grill skill and the
// convention), each file read on demand, and the factory script; budget.json at the
// root holds the ceiling for the always-read set. CI runs npm test on every pull
// request, so growth past the ceiling stops a merge until someone raises it on purpose.
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { estimate, measure } from "../scripts/token-budget.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => readFileSync(path.join(root, ...p), "utf8");
const budget = JSON.parse(read("budget.json"));
const run = (...args) => execFileSync(process.execPath, [path.join(root, "scripts", "token-budget.mjs"), ...args], { cwd: root, encoding: "utf8" });

describe("token budget", () => {
  test("the estimate is characters divided by 4, rounded up, line endings counted once", () => {
    expect(estimate("")).toBe(0);
    expect(estimate("abcd")).toBe(1);
    expect(estimate("abcde")).toBe(2);
    // A character is a code point, and a Windows checkout counts what a Linux one does.
    expect(estimate("\u{1F600}".repeat(4))).toBe(1);
    expect(estimate("ab\r\ncd")).toBe(estimate("ab\ncd"));
  });

  test("it measures the always-read set, each on-demand file and the factory script, all present", () => {
    const m = measure();
    // budget.json is the one place the always-read list is written and reviewed.
    expect(Array.isArray(budget.alwaysRead.files) && budget.alwaysRead.files.length > 0).toBe(true);
    expect(m.alwaysRead.files.map((f) => f.path)).toEqual(budget.alwaysRead.files);
    expect(m.onDemand.files.map((f) => f.path).filter((p) => budget.alwaysRead.files.includes(p))).toEqual([]);
    expect(m.onDemand.files.map((f) => f.path)).toEqual([
      "plugin/docs/conventions/ux-checklists.md",
      "plugin/docs/research/ux-rules-sources.md",
      "plugin/docs/research/drawing-skills.md",
      "plugin/docs/method/factory.md",
    ]);
    expect(m.script.files.map((f) => f.path)).toEqual(["plugin/workflows/factory.js"]);
    for (const group of [m.alwaysRead, m.onDemand, m.script]) {
      for (const f of group.files) {
        expect(f.missing, f.path).toBe(false);
        expect(f.tokens, f.path).toBe(estimate(read(f.path)));
      }
      expect(group.total).toBe(group.files.reduce((s, f) => s + f.tokens, 0));
    }
  });

  test("the script takes the always-read list from budget.json, not from its own code", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "budget-"));
    try {
      mkdirSync(path.join(dir, "docs"));
      writeFileSync(path.join(dir, "docs", "one.md"), "abcdefgh");
      writeFileSync(path.join(dir, "budget.json"), JSON.stringify({ alwaysRead: { files: ["docs/one.md"], measured: 2, ceiling: 250 } }));
      const m = measure(dir);
      expect(m.alwaysRead.files.map((f) => f.path)).toEqual(["docs/one.md"]);
      expect(m.alwaysRead.total).toBe(2);
      expect(m.budget).toEqual({ ceiling: 250, within: true });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("the always-read set is at or under the ceiling in budget.json", () => {
    const { total } = measure().alwaysRead;
    expect(
      total,
      `The always-read set (the ux-grill skill and the convention) is about ${total} tokens, over the ceiling of ${budget.alwaysRead.ceiling} in budget.json. Move what is not needed on every grill to a file read on demand; if the growth is deliberate, raise the ceiling in budget.json in the same pull request and say why.`,
    ).toBeLessThanOrEqual(budget.alwaysRead.ceiling);
  });

  test("budget.json records the measured value and a ceiling on a multiple of 250 above it", () => {
    const { ceiling, measured } = budget.alwaysRead;
    expect(Number.isInteger(ceiling) && Number.isInteger(measured)).toBe(true);
    expect(ceiling % 250).toBe(0);
    expect(measured).toBeLessThanOrEqual(ceiling);
    expect(ceiling - measured).toBeLessThanOrEqual(250);
  });

  test("the command prints a Markdown table, or JSON with --json, and says how it estimates", () => {
    const md = run();
    expect(md).toMatch(/characters divided by 4/);
    expect(md).toMatch(/^\| Set \| File \| Characters \| Tokens \|$/m);
    expect(md).toContain("plugin/docs/conventions/ux-design.md");
    expect(md).toMatch(/ceiling/i);
    const json = JSON.parse(run("--json"));
    expect(json.estimate).toMatch(/characters divided by 4/);
    expect(json.alwaysRead.total).toBe(measure().alwaysRead.total);
    expect(json.budget.ceiling).toBe(budget.alwaysRead.ceiling);
  });

  test("npm run budget runs the script", () => {
    expect(JSON.parse(read("package.json")).scripts.budget).toBe("node scripts/token-budget.mjs");
  });

  test("no em or en dash in the script, the budget or this test", () => {
    for (const p of [["scripts", "token-budget.mjs"], ["budget.json"], ["tests", "token-budget.test.mjs"]]) {
      expect(read(...p), p.join("/")).not.toMatch(/[\u2013\u2014]/);
    }
  });
});
