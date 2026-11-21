import { configDefaults, defineConfig } from "vitest/config";

// The workflow tests run the whole script body many times; thirty seconds is
// an honest ceiling under contention, not permission to be slow.
export default defineConfig({
  test: {
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // Agent worktrees under .claude/ are whole copies of the repo: never part of this run.
    exclude: [...configDefaults.exclude, ".claude/**"],
  },
});
