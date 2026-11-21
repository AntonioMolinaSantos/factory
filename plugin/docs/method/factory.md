# Method: the factory

Status: built, 16 October 2026 (design reviewed by Codex and Fable; script `plugin/workflows/factory.js`, tests
`tests/factory-workflow.test.mjs`); revised 18 October 2026 after the
first calibration runs (section 10); revised 24 October 2026 for 0.5.0:
risk tiers (section 13), past decisions in every review (section 4), shorter
confirmation rounds, Codex collected beside the panel, bundled tickets, and
the measurement that proves whether any of it helped (section 14); revised
21 November 2026 for 0.6.0: the UI/UX verdict (section 15). One GitHub
issue in, one reviewed pull request out. The factory chains what a careful
team does by hand (spec, test-first build, review panel, the review loop,
the merge rule) into one saved workflow,
`/factory:factory`, so it runs the same way in every repo and every night.

## 1. What it is, and what it is not

The factory is a dynamic workflow shipped in the `factory` plugin
(`plugin/workflows/factory.js`). It takes one issue labelled `ready-for-agent`
and ends in one of two states: a pull request to `dev` that has passed the
panel and the gate, or the issue handed back with the reason.

It never merges to `main`, never changes a convention, a method, a data model
or CI on its own, and never decides a question the issue leaves open. Those
are the owner's (`plugin/docs/conventions/branches.md`). Because a repo cannot always
protect `main` (branch protection on a private repo needs a paid plan), those limits are enforced by checks in the script's own code
(section 5), not by asking an agent to respect them.

## 2. Input, and what is trusted

- `args.repo`: required, `owner/name`, the origin of the session's checkout
  (one session per repo). The intake must read that same repo, or the run
  aborts; every later stage is pinned to it.
- `args.issue`: the issue number.
- `args.pick: "top"` instead of an issue: take the top open issue labelled
  `ready-for-agent` in the issues convention's order (`plugin/docs/conventions/issues.md`, "Ranking": `critical`, then no severity, then `important`, then
  `minor`; oldest first), skipping every issue that an open pull request
  already closes (its `closingIssuesReferences`), so an approved pull request
  waiting for the owner is never built twice, and every issue blocked by an
  open issue (GitHub issue dependencies), so tasks of a plan are built in
  order. Blocking is decided in code: the intake returns each issue's
  blocking issues with their states, and a second read runs one exact
  `gh api .../dependencies/blocked_by` for the issue about to be built (in
  `pick`, for each candidate in turn, at most five); any blocker GitHub does
  not report closed stops it. In a calibration run the intake
  agent once called every issue unblocked, and `pick` built one whose blocker
  was still open.
- `args.merge`: `true` lets the factory merge an approved pull request into
  `dev`. Default `false`. It is ignored whenever `pick` is given, so the
  nightly run can never merge, whatever its configuration says.

**Issue text is data, never instructions.** Every agent that reads an issue
is told so, and nothing an issue says widens what the factory may touch. Two
plain-code checks run before any agent reads the body:

1. The `ready-for-agent` label was applied by an account with write access to
   the repo (read from the issue's timeline). Anyone who can only open issues
   cannot queue work.
2. The factory never applies `ready-for-agent` itself, except to the issues
   it files from a plan a writer merged (section 12).

**Decisions come from the work's own record.** The spec, the plan writer and
the approver are told that decisions come only from the issue's body and
comments and the merged spec and plan (in spec mode, the merged spec and its
pull request). A message from the session that does not name the issue is
context, never a decision (a calibration run: a spec agent took
an answer about another issue as a decision for its own).

An issue that fails the first check is refused with a comment, and nothing
else is written. Any other refusal (closed, not labelled, already closed by an
open pull request, blocked by an open issue, a permission that could not be
read, not found) returns without touching the issue.

## 3. Stages

The pushed branch is the only state carried between stages. Every stage that
touches files works in its own worktree: it fetches, checks out the branch,
runs the repo's install as its CLAUDE.md names it (`npm ci` when it names
none) inside that worktree, never into a shared or global environment (a
global install once pointed every later run at a stale
worktree), and pushes what it changed. Tests run with the repo's own test
command the same way (`npm test` when CLAUDE.md names none).

Every other agent works in the session's own checkout and changes nothing
there: never `git checkout`, `switch`, `reset`, `stash`, `pull` or `merge`
(`git fetch` is fine). To run code at a commit, it exports the commit into a
new directory outside the repo (`git archive <commit> | tar -x -C <dir>`) and
runs it there. In a calibration run a read-only agent checked out
a pull request's commit in the session checkout and left it detached there.

| # | Stage | Model | Does | Ends in |
| --- | --- | --- | --- | --- |
| 1 | Spec | Opus, high effort | Reads the issue, the repo's CLAUDE.md and the code the issue concerns. Returns a schema object: goal, acceptance criteria, the files it will change (the shared test helpers, fixtures and `conftest` its tests use included: two calibration runs stopped at the gate on a helper the list left out), tests to write first, risks, out of scope, a proposed risk tier with its reason (section 13), and the UI/UX verdict with its reason and the design spec that covers the issue (section 15). Reads no file outside the tracked tree and no `.env*`. | A spec, its tier and its UI/UX verdict, or escalate (section 6) |
| 2 | Build | Opus, high effort, own worktree | Fetches, branches off `origin/dev` (`fix/` for a bug, `feat/` otherwise, named after the outcome). Writes the failing tests first, then the code, runs the repo's test command, commits, pushes, opens a pull request to `dev` with the spec in its body and `Closes #N`, and posts `@codex review` on it. | A pull request with green tests, or escalate. A red local run after the push is weaker evidence than CI (a calibration run): a read-only agent waits for CI on that commit, at most 15 minutes, and green CI carries on while red or pending CI escalates. A build that did not push escalates |
| 3 | Review | The tier's panel and the Codex collection, all in parallel | Section 4. Each returns findings graded P1 or P2, each marked inside or outside the spec's scope. | Findings |
| 4 | Fix | Opus, high effort, own worktree | Round one: fixes every real finding inside the spec's scope, P1 and P2 (`review-loop.md`: round one fixes everything real), with a test for each correctness fix. Every later fix round: the P1 the round before found. Pushes. | The next review round, when it pushed anything; a red local run after the push follows the same CI rule as the build |
| 5 | Re-grade | Opus, high effort | Every P2 bound for a ticket is checked on the head commit first: one the head already fixes is dropped (counted `p2Stale`); one that meets the P1 rule is promoted (`p1Promoted`) and gets a fix round when it is inside the scope, or escalates when it is not; the rest stay P2. A candidate the re-grade leaves out stays P2. | Tickets to file, or more work |
| 6 | Tickets | Haiku, medium effort | Files the P2 that survived the re-grade as issues labelled `needs-triage` plus `bug` or `enhancement`, never a severity (`issues.md`: severity is set by whoever triages, never by automation), linking the pull request. Findings on the same file go into one issue, so related small fixes are triaged and built together rather than one run each. | Issue numbers |
| 7 | Approver | Opus, high effort | Section 5. | Approve or escalate |

A review round after round one runs only when the fix stage before it pushed,
and reviews that commit for P1 only. It is a confirmation round, not a second
full panel: Codex, every reviewer whose finding the fix addressed (the
correctness reviewer when only Codex raised them), and the product reviewer
when a criterion is visual or the UI/UX verdict is `needed`, because the fix
may have changed the screens. The
high tier keeps the full panel in every round. A P1 it finds gets its own fix
round, up to at most 4 review rounds in all; a P1 still open after the last round
escalates. `review-loop.md` allows this: a P1 stops a merge at any round, and
only P1 keep the loop going. A run that escalates on an open P1 still
re-grades and tickets its P2, so no finding is lost on that path either. The
re-grade reads the commit the branch is at: the fix's push when it pushed,
even if a P1 stays open. An escalation inside a fix round (tests red, a
reviewer that returned nothing, a fix stage that returned nothing) re-grades
the same way; after a fix stage that returned nothing, the pull request's head
is read again first, since a partial push may already resolve a finding. When
that read fails too, the candidates are filed as they are and the reason says
so.

## 4. The review panel

| Reviewer | Model | Works from | Looks for |
| --- | --- | --- | --- |
| Security | Fable, high effort | `gh pr diff` | Secrets, authorisation, data reachable by the wrong person, privacy, legal exposure, unsafe input handling |
| Correctness and conventions | Opus, high effort | `gh pr diff` plus the files it names | Behaviour without a test, a defect the tests miss, the repo's CLAUDE.md rules and the practices it adopted |
| Product | Opus, high effort | Own worktree | Only when the change touches what a user sees (a visual criterion, or a `needed` UI/UX verdict): reads the repo's `verify-<product>` SKILL.md and follows it (the skills are user-invoked, so the agent follows the file rather than calling it), drives the changed screens, reads the screenshots against the spec, and, for a `needed` spec, against the approved mockup, using the design skills on every visual change (section 15). It empties, then fills, `~/.claude/factory-evidence/<owner>-<repo>/issue-<N>/<commit>/round-<n>/` with one screenshot per visual criterion, outside the repo (its worktree is deleted when it finishes), and returns file names only; the script builds each path itself and the approver opens them (a calibration run). Otherwise "not applicable" |
| Spec fit | Fable, high effort | Own worktree on the pull request branch, plus the design the change serves (the issue names its plan, the plan its design spec) | Round one in the standard tier, every round in the high tier, and any confirmation round of a finding it raised; never in the light tier. The change against the real inputs and uses the design names (formats, sizes, devices, edge cases real data has), not only against the acceptance criteria; and whether each test would fail if its behaviour broke. May run the tests and short experiments on synthetic data; its only writes are its worktree's untracked install and `~/.claude/factory-scratch/<owner>-<repo>/issue-<N>/round-<n>/` |
| Codex | external | The pull request | Requested by the build stage at pull request open, and by each fix stage after its push. Collected in parallel with the panel, so its wait overlaps theirs instead of following it. A short agent reads the pull request's head itself and waits for Codex's answer on it, at most 20 minutes in all. It reads the commit Codex reviewed only from Codex's own record: a review's `commit_id`, the `codex-review-state` block of its summary comment, or a receipt's "Reviewed commit" line, never from when a comment was posted. The commit is not in its prompt; the script compares what it read with the round's commit (a short commit counts when it is at least 7 characters and a prefix). An answer on another commit counts as no answer, and its findings are set aside: they were collected in the round that reviewed that commit |

Which reviewers sit on the panel depends on the run's risk tier (section 13):
the light tier runs security, correctness and Codex; the standard tier the
full panel; the high tier the full panel in every round.

**Fable fallback (0.5.1).** A Fable reviewer that returns nothing is asked
once more with the same prompt on Opus, and the report counts it
(`fableFallbacks`). Twice in the first calibration runs, a Fable reviewer returned nothing mid-review and the run was resumed on
Opus by hand. A retry that also returns nothing blocks like any missing
reviewer.

**Past decisions.** Every reviewer, before grading, reads what the repo has
already decided: its `CONTEXT.md`, its `docs/adr/`, the decision records its
CLAUDE.md points to, and its closed issues labelled `wontfix` (findings
someone already declined). A finding that only restates a recorded decision is
set aside and counted (`setAside`), not reported, unless the change breaks
that decision or the reviewer shows the decision should change, which is a P1
under `review-loop.md`. Without this, a reviewer with no memory re-raises a
question the repo already settled, and the run spends a fix round or a ticket
on it.

P1 is only what `review-loop.md` says stops a merge: a security or privacy
exposure, a correctness defect without a test, a contradiction inside the
change or with the spec, a decision the reviewer shows should change.
Everything else is P2. The first calibration (section 10) made three
cases explicit in the reviewers' grading: user media or personal data left
able to reach git or an outside service is a privacy exposure;
a defect the design's real inputs would trigger that no test covers is a
correctness defect without a test; a circular or tautological test leaves its
behaviour untested.

**Models (20 October 2026).** Fable reviews code: the security and spec-fit reviewers and the plan reviewer. The other judging stages (spec, plan writer, re-grade, approver) run on Opus. Every read whose facts drive a decision (intake, blockers, CI reads, Codex collections, gate facts, merge check) runs on Opus: in a calibration run a Haiku intake once called every issue unblocked. Haiku keeps only fixed-text actions (tickets, report, labels, the merge command). The reason is long term: Fable's weekly limit binds first. Since 10 November 2026 (`plugin/docs/conventions/models.md`) no stage runs on a model outside that convention or on the session's model, and every agent states its effort: Opus and Fable at high, Haiku at medium. A subagent on another model than the session's otherwise runs at that model's own default, which is medium in Claude Code.

## 5. The gate

Most of the gate is computed by the script from facts that read-only agents
return as schema objects, not judged by a model:

1. **Scope, in code.** The changed files (`git diff --name-only
   origin/dev...branch`) must all be in the spec's file list, tests
   included, and none may match the denylist: `docs/conventions/**`,
   `docs/method/**`, `docs/superpowers/**`, `.github/**`, `plugin/**`,
   `CLAUDE.md`, `AGENTS.md`, `package.json`, `package-lock.json`,
   `vitest.config.*`, `.env*`. A path ending in `/**` covers everything under
   it; a bare name matches that file name anywhere, so a nested `CLAUDE.md` or
   `package.json` is covered too (a build that edits the test script could
   otherwise turn CI green by construction). The spec's own file list is
   checked against the same denylist before the build starts, and must be
   canonical: repo-relative, no leading `/`, no `.` or `..` segment, no
   backslash, so `./plugin/x` cannot slip past it.
2. **Head and CI, in code.** The pull request's base is `dev`, its head is
   the last commit the panel reviewed (a later push escalates), and its checks
   are green on that commit. The read waits at most 15 minutes; checks still
   pending at the ceiling escalate, never pass.
3. **No open P1**, and **Codex answered on the head**, in every mode. A run
   whose last review round has no Codex answer on the head commit escalates
   (`needs-triage`) before the approver, with or without `merge`, `pick`
   included: an approval always means both the panel and Codex saw the
   commit approved.
4. **Acceptance, judged.** The approver, Opus, checks every acceptance
   criterion against a test or, for a visual one, a product screenshot.
   Which screenshots it may open is decided in code first: plain PNG file
   names returned by the product reviewer, joined to the script's own evidence
   directory for the reviewed commit, for a visual criterion of the spec, from
   the last review round only (a fix may have changed the screens). A reviewer
   never supplies a path. A visual
   criterion without such a screenshot escalates before the approver runs.
5. **Head again, in code.** After the approver, the base, head and checks are
   read once more; a change since the gate escalates, merge or not, so
   nothing that arrived during the approval is reported approved.

A reviewer that returns nothing, or reports itself unavailable, blocks like
a P1: the run escalates rather than treat a missing review as clean.

On approve:

- without `merge`, the factory comments "Factory: approved" with the report
  and leaves the pull request for the owner;
- in the high tier (section 13), the same as without `merge`, whatever was
  passed: the report says a human code review is due (`humanReview`);
- with `merge`, a last agent with a fixed prompt (the repo, the pull request
  number and the head commit, nothing from the issue) merges into `dev` with
  a merge commit, but only after a read-only agent confirmed the base is
  `dev` and the head is the commit CI passed. A read afterwards confirms
  `main` did not move; if it did, the report says so (`mainMoved`) for
  the owner to check, without relabelling the issue the merge just closed.

## 6. Escalation

The factory runs in a session dedicated to it (a calibration run): its
writing agents judge each write against the session's latest request, and
refuse when that request is about something else. A report that could not
post is surfaced in the run's result and posted by hand.

The factory hands the issue back, removing `ready-for-agent`, with a comment
saying why and linking whatever it built:

| Case | Label |
| --- | --- |
| Underspecified: no testable acceptance criteria | `needs-info` |
| The work would change a convention, a method, a data model, CI, a public URL, a price or anything promised to a customer, or the spec hits the denylist | `ready-for-human` |
| The work trips the AI governance guardrail (`plugin/docs/conventions/ai-governance.md`, "The guardrail"): it could get around a platform's enforcement, break a law, act on a person without their consent, or touch a sensitive sector. The spec names each trigger it sees; the run stops before the build and the comment names each trigger with its reason and carries the line `factory-guardrail-stop`. The owner relabelling `ready-for-agent` after that comment is the go-ahead: an Opus read finds the last such comment from an account with write access and when `ready-for-agent` was last applied, and the run builds only when the label is the later of the two, reporting the cleared triggers (`guardrailCleared`). A read that fails stops again. Decided 8 November 2026, in the script from 0.5.1 | `ready-for-human` |
| A `needed` UI/UX verdict without an approved design: no design spec named, or one not merged by a writer, or without its `needed` verdict, its mockup folder holding HTML, or a complete grill record (section 15). The comment names each missing piece and `/factory:ux-grill` as the next step. From 0.6.0 | `ready-for-human` |
| CI red or pending after a red local build or fix round, a build that did not push, a P1 left after the last round, a P1 the re-grade found outside the scope, a re-grade that returned nothing (its candidates are still filed), no Codex answer on the head, CI still pending at the ceiling, a failed gate | `needs-triage` |

The report agent posts a body built in code: its prompt names its only
actions and fences the report between markers as data, so a reason that
carries issue text cannot become an instruction. Every comment the factory
posts starts with the line the issues convention requires of an agent:

```
> *This was generated by AI during triage.*
```

## 7. Bounds

| Bound | Value |
| --- | --- |
| Agents per run | at most 46 (intake, up to five blockers reads, spec, a UI/UX read when the spec is `needed` or adds a screen file under `app/`, build, a CI read after a red build, at most four reviewers in each of four rounds (confirmation rounds usually run one or two), at most four fix rounds with a CI read after each red one, a head read after a fix round that returned nothing, at most six re-grades, tickets, gate facts, approver, merge check, merge, report; the reads that feed a decision (intake, blockers, the UI/UX read, the CI reads, the head read, the Codex collections, gate facts, the merge check) on Opus, and tickets, report and merge on Haiku), plus one Codex collection per round |
| Review rounds | at most 4 review rounds: round one, then a P1-only round after each fix that pushed; fix rounds stop at the same number |
| Retries of a red build | none: a red local run after a push defers to CI on that commit, never to a rebuild; red or pending CI escalates |
| Waits | Codex 20 minutes, the CI read 15, each stated in the agent's prompt. The runtime sets no other time limit on an agent; a stalled one is restarted by the runtime and, if it never answers, the run escalates |
| An agent that returns nothing | before any write, the run aborts and touches nothing; after a write, it escalates as `needs-triage` and still reports |
| Nightly | one issue per repo per night |

Whatever a bound cuts is logged and named in the report, so a cut run never
reads as complete.

## 8. Report

Every run ends with one short report, returned to the session and posted on
the issue: issue, pull request, rounds, P1 found and fixed, P2 fixed and
ticketed, reviewers that returned nothing, whether Codex answered, whether a
merge was skipped or failed, whether `main` moved during the run, decision
and reason. From 0.5.0 it also carries the measurement fields of section 14:
`version`, `tier`, `agents` (in all and by model), `outputTokens`,
`p1ByReviewer` and `setAside`; from 0.6.0, `ux` and `uxMissing` (section 15). A finding the fix stage could not fix is never dropped: a P2
becomes a ticket, a P1 stays open and escalates.

## 9. Nightly run

A local scheduled task on the owner's machine runs `claude -p` in a clone
kept for it, with `pick: "top"` and no `merge`, and leaves its pull request
and report for the morning. Local, because the run needs the owner's GitHub
authentication and the Codex link. `plugin/docs/runbook/factory.md` holds an example
setup. A night with no eligible issue does nothing and says so. Other repos
join once they are factory-ready (section 11).

## 10. Calibration

The first runs are judged by the owner against the same issue done by hand: did
the spec match the intent, did the panel find what a careful review finds,
were the P1 and P2 grades right, was escalation right. Judgements go in the
repo's calibration record (`docs/calibration/factory.md` there), one row per run.

A repo's runs stay calibration runs until two in a row are judged sound
there (section 11): until then, every approved pull request is checked by
hand, or by an independent audit against its design, before the next issue
is built on it.

The first calibration runs, on 17 and 18 October 2026, showed why. Seven issues
were approved with zero P1 in all; an audit of each against the design then
found eight P1 the panel had missed (an unusual input format handled wrong, a timing
assumption no test checked, a readiness gate whose test was circular, an output
over a service's size limit, among others), two P2 that met the P1
rule, four tickets filed after their fix had landed, and no rule that Codex
saw the approved commit. The spec-fit reviewer, the re-grade, the P1-only
rounds and the Codex-on-the-head gate (sections 3 to 5) are the answer.

## 11. Readiness

A repo is factory-ready when it has a CI workflow, the issue labels, a
verification skill, the Codex GitHub app, and two factory runs there judged
sound. `plugin/docs/conventions/factory.md` holds the contract.

## 12. Spec mode: from an approved spec to queued issues

Decided 17 October 2026 (the owner), revised after one review round (Codex and
Fable). The factory builds issues; spec mode makes the
issues from a design the owner has already approved, in two runs, each ending
with something the owner merges or reads.

### 12.1 What counts as approved

A spec or plan is approved when, on a freshly fetched `origin/dev`, its last
change arrived through a merged pull request whose merger has write access. A
read-only agent reports those facts; the script refuses when the fetch failed,
the file is absent, no pull request is found, or the merger's permission could
not be confirmed. No factory build can create that state by itself:
`docs/superpowers/**`, where specs and plans live, is on the denylist
(section 5), and the plan run never merges.

### 12.2 The plan run

`args.spec`: a path under `docs/` ending in `.md` (letters, digits, `.`, `_`,
`-` and `/` only).

1. **Plan.** Opus, high effort, writes
   `docs/superpowers/plans/<date>-<slug>.md` on a branch `docs/plan-<slug>`,
   ending with a fenced `factory-tasks` JSON block: one entry per task with
   `id` (T1, T2, ...), `title`, `goal`, `acceptance` (testable criteria,
   `visual` flagged), `files`, `dependsOn` (task ids) and `kind`. It pushes
   only its branch, opens a pull request to `dev` with that one file, and posts
   `@codex review`.
2. **Checks in code** on what the plan stage returned, before any review:
   unique task ids, canonical files, acceptance present, known dependencies,
   no cycle, the plan path under `docs/superpowers/plans/`, the branch named
   `docs/plan-<slug>`. A plan that fails is handed back on its pull request.
3. **Review, one round** (a design document, `review-loop.md`): a Fable plan
   reviewer and the Codex collection, which also reads the pull request's base,
   head branch and changed files. The plan is not ready when either reviewer
   did not answer, when the base is not `dev`, the head is not the plan branch,
   or the pull request changes anything but the plan file.
4. **Fix, once.** Every P1 and every finding fixable in the plan file goes to a
   fix agent, which posts `@codex review` after its push. A fix that pushed
   nothing, or a P1 it did not fix, leaves the plan not ready; an unfixed P2,
   and any P2 the plan file cannot fix, is listed in the report. The tasks are
   checked again after the fix.
5. **Confirm, on the fixed commit.** The plan reviewer and the Codex
   collection look again at the fix's commit, P1 only. The plan is not ready
   when either did not answer, when Codex answered on another commit, or when
   either found a P1; a P2 there is listed in the report. In both rounds Codex
   counts only when its answer is on the commit under review (a calibration run: a plan's fix commit was never reviewed), and the pull
   request's live head, read after Codex answered, must still be that commit:
   a later push to the plan branch is never reported ready.
6. **Stop.** The report on the pull request says the plan is ready, or why it
   is handed back. The plan run never merges, whatever `merge` says: merging
   the plan is the owner's approval.

### 12.3 The issues run

`args.plan`: the path of a plan approved as in 12.1.

1. **Tasks.** The read-only agent returns the `factory-tasks` block verbatim;
   the script checks it as in 12.2 step 2, then orders it by dependency.
2. **File.** One issue per task: the task's title; a body starting with the
   line the issues convention requires of an agent, then the goal, the
   acceptance criteria, the files, a link to the plan's pull request, and the
   marker `factory-task: <plan path>#<id>@<version>;`, where the version is a
   hash of the task's content. Each issue carries its kind label (`bug` or
   `enhancement`) and is blocked by exactly the issues of its `dependsOn`
   tasks (GitHub issue dependencies): blocking issues the plan no longer names
   are removed, missing ones added. Any `ready-*` label is removed in this step.
3. **Idempotent and versioned.** An open issue with the same marker is reused.
   An open issue for the same task id with another version is rewritten to the
   new task, unless an open pull request closes it: then it is left alone and a
   new issue is filed, so the old pull request can never satisfy the amended
   task. A closed issue with the same marker counts as done; otherwise a new
   issue is filed. Kind label and blocking issues are set on every task, reused
   or not.
4. **Read back, checked in code.** The agent returns, per task, the issue's
   number, marker line, labels and blocking issues as read back from GitHub.
   A task is incomplete when its number is missing or shared, its marker or
   labels differ from the computed ones, or its blocking issues differ from
   its dependencies.
5. **Queue, last.** Only complete tasks get their ready label: `ready-for-agent`,
   or `ready-for-human` when a task touches the denylist (CI, conventions,
   `package.json` and the rest stay the owner's). The label is read back too. An
   incomplete task carries no ready label, so nothing builds it out of order;
   the run reports `issues-incomplete` and a rerun repairs it.

Filed tasks carry no severity (issues convention: automation never sets one),
so they rank as "no severity", above `important` and `minor`. That is
intended: the owner queues a plan deliberately.

This is the one place the factory applies `ready-for-agent` itself (section 2,
check 2). The authority is the plan, approved as in 12.1, which each issue
links; issue text written by anyone else never queues work.

### 12.4 Building

The existing factory, one issue per run: an issue blocked by an open issue is
not eligible, whether picked or named, so tasks are built in dependency order.
A blocking issue closes only when its pull request merges, so with `pick`
the order waits for the owner's merges.

### 12.5 Bounds

| Run | Agents |
| --- | --- |
| Plan | facts, plan, plan reviewer, Codex collection, one fix, confirmation reviewer, second Codex collection, report: at most 8 |
| Issues | facts, filing, labelling, report: at most 4 |

## 13. Risk tiers

Decided 24 October 2026 (the owner), after the cost and time review of the
0.4 runs. One panel for every change spent a full Fable review with a
worktree install on a one-line doc fix, and gave a payment change no more
scrutiny than that doc fix. The tier sets the panel and the merge rule.

| Tier | When | Panel | Merge |
| --- | --- | --- | --- |
| Light | The spec proposes it, every spec file is Markdown, and no criterion is visual | Security, correctness and Codex; confirmation rounds as section 3 | As usual |
| Standard | Everything else | The full panel in round one; confirmation rounds as section 3 | As usual |
| High | The spec proposes it; or a spec file is on a path about authentication, permissions, payments, billing, checkout, wallets, refunds, payouts, secrets, security, migrations or a database schema; or the issue carries `critical`, `security` or `risk:high` | The full panel in every round | Never by the factory: an approved high-tier pull request waits for a human code review, `merge` or not (`humanReview` in the report) |

The script computes the tier, in code, from the spec's proposal and the
facts above, and only ever raises the proposal, never lowers it: a label or a
path can make a run high, nothing can make it light except the spec and the
files together. The repo's CLAUDE.md may name its own high-risk areas; the
spec reads them and proposes high for them.

## 14. Measurement

Decided 24 October 2026 (the owner): the factory has to prove it got cheaper
and faster without getting worse, so each change is measured against the
runs before it, not argued for.

Four numbers, counted over every issue run, escalated ones included, because
an escalation costs tokens too:

| Metric | What it proves | Counted as | Source |
| --- | --- | --- | --- |
| Tokens per approved pull request | Cheaper | Total tokens of all runs divided by the runs that ended approved | The run summary's token total, in the calibration row; the report's `outputTokens` and `agents` back it up |
| Minutes per approved pull request | Faster | Total wall-clock minutes of all runs divided by the approved runs | The run summary's duration, in the calibration row |
| Factory-defect escalations | Fewer wasted runs | Escalations judged a factory defect, per ten runs (an escalation that was right is the factory working) | The calibration judgement |
| Escaped P1 per audited pull request | Not worse | P1 an audit after merge finds that the panel missed, per audited pull request | The post-merge audit, in the calibration row |

The last one is the guardrail: a cost change that raises it is reverted,
whatever it saved. Lead time to merge is not on the list, because most of it
is the wait for the owner, which says nothing about the factory.

The calibration record holds the baseline (the first runs), the proposed
targets and one row per run with these columns, and each version is read
against the baseline. The comparison is read after ten runs on a version, and not
before: fewer runs than that are anecdotes. A patch release (0.5.1) only fixes
defects, so its runs count with its minor version (0.5). Every pull request of those ten
runs is audited after merge, so the guardrail stands on as many audits as the
baseline; after them, every high-tier pull request and at least one other in
three.

## 15. The UI/UX verdict

Decided 21 November 2026 (the owner). In the
script from 0.6.0, built the same day after the first real grill, as the convention's
step two: the method changed first, the script follows the rules that
survived their first use, per `plugin/docs/conventions/ux-design.md`.

- **A verdict in the spec.** The spec stage returns `ux`: `needed` when the
  work adds a page, a flow or a component, or changes a layout or the
  navigation, `not-needed` otherwise, with its reason (`uxReason`). It also
  names the design spec that covers the issue (`designSpec`): the one the
  issue or its comments cite, or the design spec the issue's plan names;
  empty when there is none. A verdict that is neither value counts as
  `needed`.
- **Raised in code, never lowered.** A spec whose file list adds a screen
  file is `needed` whatever the agent proposed, the way a high-risk path
  raises the tier (section 13). A screen file is one of Next's: under a
  folder named `app`, a file named `page`, `layout`, `template`, `loading`,
  `error`, `not-found`, `global-error`, `default`, `forbidden` or
  `unauthorized`; under the pages router, any file in `pages/` or
  `src/pages/` at the root of the repo or of `apps/<name>/` or
  `packages/<name>/`, except under `pages/api/`. The extension is `tsx`,
  `ts`, `jsx`, `js`, `mdx` or `md`. A route handler (`route.ts`, or an API
  route of the pages router) draws nothing and does not raise the verdict,
  and neither does a new component file: whether a component is new UI is
  the agent's verdict, which nothing lowers. "Adds" is a fact, not a
  judgement: an Opus read on a fresh `origin/dev` reports which of those
  files already exist, and only a new one raises. Nothing lowers a `needed`
  proposal. A `needed` proposal that names no design spec is handed back
  without that read, since no answer could change the outcome.
- **A hand-back before the build.** A `needed` spec builds only when the
  design spec it names is on a freshly fetched `origin/dev`, approved in the
  sense of 12.1 (its last change arrived through a pull request a writer
  merged), its mockup folder approved the same way (the last commit touching
  the folder on `dev` arrived through a pull request a writer merged), and
  the spec carries, all merged on `dev`: a `## UI/UX` section with the line
  `Verdict: needed`, the line `Mockup: docs/design/<slug>/` on a line of its
  own, exactly (the slug taken from the design spec's file name,
  `<date>-<slug>-design.md`, the slug in lower-case kebab case, by the same
  expression as the convention's test), at least one HTML file in that
  folder, and a complete grill record: its date, and for each screen one
  result per rule. A result is the first line `- Rn: met`, `changed` or
  `waived` under the screen; any other line about the rule is a note. A
  waiver carries a reason, any text after `waived,` once trimmed. Every HTML
  file of the folder is a screen of the record: its name without `.html`,
  hyphens and underscores read as spaces, appears as whole words in a
  `####` heading, ignoring case (`product.html` and `#### Product page`).
  The read agent returns facts only: the section as written, the folder's
  file names, each merge and its merger's permission; the script judges them
  with the same rule as the convention's test. Whether the design covers the
  issue is the spec agent's reading, not checked in code. Otherwise the issue goes back
  `ready-for-human`, with a comment naming each missing piece and
  `/factory:ux-grill` as the next step; the owner relabels `ready-for-agent`
  once that pull request is merged. The factory never draws a design and
  never grills anyone: a grill needs the owner.
- **The product reviewer reads the mockup.** A `needed` spec puts the product
  reviewer on the panel even without a visual criterion. For a `needed` spec
  it opens the approved mockup at 375 px and 1280 px and compares each
  screenshot with it as well as with the criteria. It compares the mockup
  screens the issue covers, which the script passes it: the union of the
  spec's `mockupScreens` (the HTML files of the folder the spec agent says
  this issue builds; a name not in the folder is dropped and logged), those
  its acceptance criteria name, and those its screen files draw by their
  route's words, where a `page` file at the app root (its folders under
  `app/` only route groups, dynamic segments or parallel slots) draws the
  mockup named `home`, `index` or `landing`. An unmatched name is no proof a
  screen is another task's, so the check fails closed: a `needed` spec with
  screen files and an empty scope goes back `ready-for-human` before the
  build ("the issue does not say which mockup screens it builds"), and the
  reviewer is told a mockup screen is no finding at all only when it is
  named, out of scope, and at least one screen is in scope. A difference from
  the mockup, or a state the mockup drew and the screen lacks, is a
  contradiction with the spec, so P1; any other of the nine rules broken is
  P2. For a `not-needed` visual change the nine rules are P2 only. No new
  reason stops a merge.
- **The design skills on every visual change.** Decided 21 November 2026
  (the owner). Whenever the product reviewer runs, it uses the design skills on
  the built screens: design critique and accessibility review, plus UX copy
  when the change alters copy. Their findings are graded by the rule above,
  never by the skill's own severity: a skill adds no reason to stop a merge.
  `design:accessibility-review` audits WCAG 2.1 and lists 44 px targets as
  AA, so the reviewer grades a target size with the figures of rule R2 (24
  by 24 px is the AA floor, 44 by 44 px is AAA and a choice of the rule), as
  the convention's "How each rule is checked" says.
- **The report** carries `ux` (the verdict after the raise) and `uxMissing`
  (each missing piece when the issue was handed back, empty otherwise).
