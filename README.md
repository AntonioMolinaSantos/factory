# factory

One GitHub issue in, one reviewed pull request out.

The factory is a Claude Code plugin. Its workflow takes one issue labelled
`ready-for-agent` and ends in one of two states: a pull request to `dev` that
has passed a review panel and a gate, or the issue handed back with the
reason. On the way it writes a spec, builds test-first, has the change
reviewed by a panel sized to its risk (security, correctness, product, spec
fit, and Codex), fixes what the panel finds over at most four rounds, files
what is left as tickets, and checks the gate in plain code: scope, CI on the
head commit, Codex on the head commit, no open P1.

It also carries `/factory:ux-grill`, which approves a design before any
screen is built: a mockup on the repo's real tokens, walked screen by screen
through nine rules with the owner, recorded, and merged.

The method, every limit and the reason for each is in
[`plugin/docs/method/factory.md`](plugin/docs/method/factory.md). In these documents, "the
owner" is whoever owns the repository the factory works in and merges its
pull requests.

## Install

```
claude plugin marketplace add AntonioMolinaSantos/factory
claude plugin install factory@factory
```

The commands are `/factory:factory` and `/factory:ux-grill`. To update:
`claude plugin marketplace update factory`, then
`claude plugin update factory@factory`, then `/reload-plugins` in an open
session.

## Use it in a repository

Commit `.claude/settings.json` in the repository the factory works in:

```json
{
  "extraKnownMarketplaces": {
    "factory": {
      "source": { "source": "github", "repo": "AntonioMolinaSantos/factory" }
    }
  },
  "enabledPlugins": {
    "factory@factory": true
  }
}
```

What this does, per the Claude Code documentation (plugins: "Require plugins
per repository" and "Install a plugin"):

- The marketplace is registered only in a folder the person has trusted; a
  `-p` run applies it only in a folder trusted before.
- `enabledPlugins` turns the plugin on but does not download it. Each person
  runs `claude plugin install factory@factory --scope project` once per clone.
- A cloud session does not load plugins that a repository's settings turn on;
  there, plugins come from settings managed by the organization.

## Before the first run

The repository has to be factory-ready
([`plugin/docs/conventions/factory.md`](plugin/docs/conventions/factory.md)):

- a CI workflow on pull requests to `dev`, and a `dev` branch beside `main`;
- a `verify-<product>` skill under `.claude/skills/`, which the product
  reviewer follows to look at screens;
- the ten issue labels of [`plugin/docs/conventions/issues.md`](plugin/docs/conventions/issues.md);
- the Codex GitHub app on the repository;
- `git` and an authenticated `gh` where the session runs.

## Quickstart: one run

1. Write an issue with testable acceptance criteria, and label it
   `ready-for-agent` from an account with write access.
2. Open a new Claude Code session in the repository, on a clean `dev`, used
   for nothing else while the run goes.
3. Run `/factory:factory issue 12` (your issue's number).
4. Watch it with `/workflows`. The run ends with a report on the issue: a
   pull request marked "Factory: approved", waiting for you, or the issue
   handed back as `needs-info`, `ready-for-human` or `needs-triage` with the
   reason.
5. Review and merge the pull request yourself. To let the factory merge an
   approved, non-high-risk pull request into `dev`, start the run with
   `/factory:factory issue 12, merge if approved` instead.

More ways to run it (pick the top issue, plan a merged spec, file a plan's
issues, a nightly run) are in [`plugin/docs/runbook/factory.md`](plugin/docs/runbook/factory.md).

## What it never does

- It never pushes to `main`, opens a pull request to it or merges into it.
- It never merges unless asked with `merge`, never with `pick`, and never a
  high-risk change: that one waits for a human code review.
- It never changes a convention, a method, CI, the package manifest, the
  agent instructions or an `.env` file: those paths are on a denylist
  checked in code, before the build and at the gate.
- It never decides a question the issue leaves open, and never treats issue
  text as instructions.
- It never queues its own work: it takes an issue only when a writer applied
  `ready-for-agent`, and applies that label itself only to the issues it files
  from a plan a writer merged.
- It never sets a severity on an issue.
- It never builds a new screen without a design the owner merged, and never
  draws or approves a design by itself.
- It never goes ahead when the work could get around a platform's
  enforcement, break a law, act on a person without their consent or touch a
  sensitive sector: it stops and asks
  ([`plugin/docs/conventions/ai-governance.md`](plugin/docs/conventions/ai-governance.md)).
- It never treats a missing review as a clean one: a reviewer that returns
  nothing blocks like a P1.

## Repository layout

The docs live in `plugin/docs/` because `plugin/` is what installs: Claude
Code copies only the plugin's folder into its cache, and the grill skill reads
the UI/UX convention from there. One copy, real files, no symlink. The tests
and the npm tooling stay at the root, outside the plugin, so an install runs
no npm.

```
.claude-plugin/marketplace.json   the marketplace, named factory (source ./plugin)
plugin/                           the plugin, named factory
  .claude-plugin/plugin.json
  workflows/factory.js            /factory:factory
  skills/ux-grill/SKILL.md        /factory:ux-grill
  docs/method/factory.md          the method
  docs/conventions/               the rules the script and the skill rely on
  docs/runbook/factory.md         install, runs, nightly, calibration
tests/                            the workflow's guards, the UI/UX rule, the layout
package.json                      the test tooling (vitest), outside the plugin
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security reports: [SECURITY.md](SECURITY.md).

## License

Apache-2.0. Copyright 2026 Antonio Molina. See [LICENSE](LICENSE) and
[NOTICE](NOTICE).
