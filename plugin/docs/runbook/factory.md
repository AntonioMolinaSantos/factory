# Runbook: the factory

The method is `plugin/docs/method/factory.md`; this is how to run it.

## Install or update

Once per machine, from your shell:

```
claude plugin marketplace add AntonioMolinaSantos/factory
claude plugin install factory@factory
```

Claude Code runs a cached copy of the plugin. To take a new release:

```
claude plugin marketplace update factory
claude plugin update factory@factory
```

Then `/reload-plugins` in an open session. The commands are
`/factory:factory` and `/factory:ux-grill`.

To declare the plugin in a repo instead, see the README ("Use it in a
repository").

## Before the first run in a repo

The repo has to be factory-ready (`plugin/docs/conventions/factory.md`): CI on pull
requests to `dev`, a `verify-<product>` skill, the ten issue labels
(`plugin/docs/conventions/issues.md`), the Codex GitHub app, and a `dev` branch. The
session needs `git` and an authenticated `gh` on its PATH.

## Run it by hand

In a session opened in the target repo, on a clean `dev`, and dedicated to the
factory: start a new session for it, and do not use that session for other
work while a run is going. In auto permission mode a workflow agent's prompt
is text the script computed, not your request, so the agents that write to
GitHub judge each write against the session's latest message from you; when
that message is about something else, they refuse (a calibration run ended
without its report this way). A run whose report did not post says so in its
result (`reportPosted: false`); post it by hand from that result. If that run
was an escalation, also swap `ready-for-agent` for the label in the result:
until then the issue still looks queued, and a `pick` run would build it
again.

Visual criteria need the product reviewer's screenshots, saved under
`~/.claude/factory-evidence/`, outside the checkout. The approver must be able
to read them: add `Read(~/.claude/factory-evidence/**)` to the allow rules of
the session that runs the factory, and, when the session blocks reads outside
its working directories (`permissions.blockReadsOutsideWorkingDirectories`),
add the directory with `/add-dir ~/.claude/factory-evidence` or
`additionalDirectories`. Without it, every visual run escalates.

Describe the run in plain words:

```
/factory:factory issue 12
/factory:factory issue 12, merge if approved
/factory:factory pick the top ready issue
/factory:factory plan the spec docs/superpowers/specs/<file>.md
/factory:factory file the issues of the plan docs/superpowers/plans/<file>.md
```

The arguments it receives:

```
/factory:factory with args {"repo": "<owner>/<repo>", "issue": 12}
/factory:factory with args {"repo": "<owner>/<repo>", "issue": 12, "merge": true}
/factory:factory with args {"repo": "<owner>/<repo>", "pick": "top"}
```

`repo` is the origin of the session's checkout and is required; `merge` is
ignored with `pick`, and with a high-tier run (method section 13), which
always waits for your code review: the report says `humanReview: true`.
Watch it with `/workflows`.

Spec mode (method section 12) takes a spec you merged: the first run opens
a plan pull request and stops; merge it, then the second run files one issue
per task, blocked by the issues it depends on. Tasks touching CI,
conventions, `package.json` and the rest of the denylist come to you as
`ready-for-human`. Then `pick` builds the rest in order.

A repo can name its own high-risk areas in its CLAUDE.md (for example
"High-risk areas: `src/billing/`, the data export"); the spec reads them and
proposes the high tier for a change there. A label `risk:high` on the issue
does the same for one issue.

## Screens: the UI/UX verdict

Since 0.6.0 (method section 15) the factory builds a screen only from a
design you merged. An issue whose spec is `needed` (a new page, flow or
component, a changed layout or navigation, or any new `page`, `layout`,
`loading` and other screen file under `app/`) comes back `ready-for-human`
when its design is missing or incomplete, and the comment lists each missing
piece. Then:

1. Run `/factory:ux-grill <design spec path>` in a session of that repo.
   It ends in one pull request carrying the spec, the mockup under
   `docs/design/<slug>/` and the grill record.
2. Merge that pull request (an account with write access; the merge is the
   approval).
3. Make sure the issue names the design spec's path, in its body or a
   comment, unless it was filed from a plan that names it: that is how the
   spec stage finds the design.
4. Relabel the issue `ready-for-agent`.

To build screens overnight, grill and merge their designs ahead. A copy,
field or fix inside an existing screen is `not-needed` and runs as before.

The product reviewer uses the design skills (design critique, accessibility
review, UX copy) on every visual change: install a plugin that provides
`design:design-critique`, `design:accessibility-review` and `design:ux-copy`
in the session that runs the factory, the nightly one included. Without it,
the review is weaker.

## A nightly run (example)

A nightly run works in its own clone, never in a checkout someone works in,
so a branch left open there is never switched under them. Give it its own
install too: never a link to another checkout's dependencies.

```
git clone https://github.com/<owner>/<repo> ~/factory-runs/<repo>
cd ~/factory-runs/<repo> && git checkout dev && npm ci
```

A script for one night, as a sketch (adapt and test it on your machine):

```bash
#!/usr/bin/env bash
set -euo pipefail
cd ~/factory-runs/<repo>
for tool in git gh claude; do command -v "$tool" >/dev/null || { echo "missing $tool"; exit 1; }; done
[ -z "$(git status --porcelain)" ] || { echo "unclean tree"; exit 1; }
git checkout dev && git pull --ff-only
origin="$(git remote get-url origin | sed -e 's#^https://github.com/##' -e 's#[.]git$##')"
mkdir -p .factory-logs
claude -p "Run the factory:factory workflow with args {\"repo\": \"$origin\", \"pick\": \"top\"}. Do not pass merge. Report the run summary." \
  --permission-mode auto >> ".factory-logs/$(date +%F).log" 2>&1
```

Schedule it with cron (`0 2 * * * bash ~/factory-runs/nightly.sh`) or, on
Windows, a scheduled task running the same steps in PowerShell. Keep
`.factory-logs/` out of git. The nightly run never merges: `pick` ignores
`merge`. The machine must be awake at the hour; a missed night is simply
skipped. One issue per repo per night.

## Calibration

Calibration is a practice, kept in the repo the factory works in: a record
such as `docs/calibration/factory.md` with two rows per run.

- **The judgement, in prose.** Did the spec match the intent, did the panel
  find what a careful review finds, were the P1 and P2 grades right, was the
  escalation right.
- **A measurement row**, with these columns: date, repo, issue, pull request,
  version, tier, decision, escalation, rounds, agents, tokens, minutes,
  escaped P1, notes. Copy the token total and the duration from the run
  summary `/workflows` shows when the run ends (the script cannot read them
  itself), and the tier, decision, rounds and agents from the report. Add the
  escaped P1 once the audit after merge is done.

Read each version against the first runs, the baseline, after ten runs on it
and not before (method section 14): tokens and minutes per approved pull
request, factory-defect escalations per ten runs, escaped P1 per audited pull
request. The last is the guardrail: a change that raises it is reverted,
whatever it saved. A patch release counts with its minor version.

Until two runs in a row are judged sound in a repo, every approved pull
request there is checked by hand, or by an independent audit against its
design, before the next issue is built on it. After two sound runs the repo
is factory-ready and may join the nightly run.
