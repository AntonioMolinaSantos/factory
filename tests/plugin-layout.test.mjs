// The plugin is the plugin/ folder. Claude Code copies only that folder into its
// cache, so everything the plugin reads at run time lives in it: the workflow,
// the skill and the docs the skill reads, once, as real files, with no symlink
// (a Windows checkout without symlink support breaks on one). The npm tooling
// and the tests stay at the root: a package.json inside plugin/ would make
// every install run npm there.
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, test } from "vitest";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const plugin = path.join(root, "plugin");
const json = (...p) => JSON.parse(readFileSync(path.join(root, ...p), "utf8"));
const isFile = (abs) => existsSync(abs) && lstatSync(abs).isFile();

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  if ([".git", "node_modules"].includes(n)) return [];
  const p = path.join(dir, n);
  const st = lstatSync(p);
  if (st.isSymbolicLink()) return [p];
  return st.isDirectory() ? walk(p) : [];
});

describe("plugin layout", () => {
  test("the marketplace lists one plugin, factory, in plugin/", () => {
    const market = json(".claude-plugin", "marketplace.json");
    expect(market.name).toBe("factory");
    expect(market.plugins.map((p) => [p.name, p.source])).toEqual([["factory", "./plugin"]]);
    expect(json("plugin", ".claude-plugin", "plugin.json").name).toBe("factory");
  });

  test("the workflow, the skill and the convention are real files under plugin/", () => {
    for (const rel of ["workflows/factory.js", "skills/ux-grill/SKILL.md", "docs/conventions/ux-design.md"]) {
      expect(isFile(path.join(plugin, rel)), rel).toBe(true);
    }
  });

  test("every ${CLAUDE_PLUGIN_ROOT} path the skill names is a file under plugin/", () => {
    const skill = readFileSync(path.join(plugin, "skills", "ux-grill", "SKILL.md"), "utf8");
    const refs = [...skill.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^\s`'")]+)/g)].map((m) => m[1]);
    expect(refs.length).toBeGreaterThan(0);
    for (const rel of refs) {
      const abs = path.resolve(plugin, rel);
      expect(abs.startsWith(plugin + path.sep) && isFile(abs), rel).toBe(true);
    }
  });

  test("the docs exist once: no docs/ at the root", () => {
    expect(existsSync(path.join(root, "docs"))).toBe(false);
  });

  test("no package.json inside plugin/, so an install runs no npm", () => {
    expect(existsSync(path.join(plugin, "package.json"))).toBe(false);
  });

  test("the tree holds no symlink", () => {
    expect(walk(root).map((p) => path.relative(root, p))).toEqual([]);
  });
});
