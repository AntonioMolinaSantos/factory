# Changelog

## 0.6.5 (22 November 2026)

- **A reviewed pull request is no longer refused over a short commit name.**
  Two runs handed back clean pull requests with "Codex did not review the
  head": a fix agent reported the head as a short sha (`3335545`) while
  Codex's record held the full one, and the check only accepted a short
  name on Codex's side. One commit under two names now matches either way
  (`sameCommit`: equal, or one a prefix of the other, both at least 7 hex
  characters), at every place the script compares commits: Codex on the
  head, CI, the gate and the merge check.
- The agents that push (build, fix, plan, plan fix) are asked for the full
  40-character sha.
- After the gate, the head is the full sha GitHub returned, so the merge
  check and `gh pr merge --match-head-commit` never receive a short name.

## 0.6.4 (22 November 2026)

- **A standing clearance for the adult sector.** A repository's owner can
  now clear the adult sector for good in `docs/conventions/factory-guardrail.json`
  on `dev` (format in `plugin/docs/conventions/ai-governance.md`). The run
  reads it only when the spec names the adult sector, and only that sector is
  ever cleared: alcohol, gambling, data about minors, law, consent and
  platform enforcement still stop. Only the user owner can clear: `decidedBy`
  must be their login and the pull request that last changed the file must
  have been merged by them, as GitHub records it. A missing, unread or
  malformed file clears nothing. Age, birth dates, age or identity checks and
  minors are never cleared: the spec adds a `minors` entry for them, and a
  change to a path naming them stops whatever the label. The path is under
  the denylist, so the factory never writes it.
- The spec names the sector of each `sensitive-sector` entry (`adult`,
  `alcohol`, `gambling`, `minors`, `other`), and the stop comment shows it.
- The report adds `guardrailStanding`, the triggers cleared this way.

## 0.6.3 (21 November 2026)

- **The factory runs from a cloud Claude Code session.** There the GitHub
  proxy answers 403 on `repos/{owner}/{repo}/collaborators/{login}/permission`
  and GraphQL is unavailable, so every writer check failed closed ("the
  permission of X ... could not be verified"). A second trust source: the
  owner of a repository a user account owns is a writer without the
  collaborators call. The owner comes from
  `gh api repos/{owner}/{repo} --jq '.owner.type, .owner.login'`, which the
  proxy answers (`users/{login}` is refused there). The type must be `User`,
  the login must be the owner named in the repo, and logins compare ignoring
  case.
- **One function, `writer()`, decides every writer check**, so the rules
  cannot drift: the label applier at intake, the merger of a spec or plan,
  the mergers of a design spec and its mockup folder, and the author of a
  guardrail stop. The guardrail read now returns every stop with its
  author's permission and the script keeps the last one that counts; the
  agent no longer filters them. `WRITERS` is read in that one place.
- **A stop whose author's permission cannot be read counts as a stop.** Only
  a stop from an author read as below write, and not the owner, is dropped.
  Doubt stops: a write collaborator's stop in a cloud session, where the
  permission call answers 403, still holds the run. An unread stop blocks
  but never clears: a relabel clears only when at least one stop is a
  verified writer's, so a stranger's comment cannot stand in for the
  factory's own.
- **Unchanged, fail closed:** an organisation repository, or any login other
  than the user owner, still needs the permission read, and a failed read
  refuses as before. A permission the intake did not report as read
  (`permissionRead` missing) now counts as unread.
- The intake, document, UI/UX and guardrail reads ask for `ownerType` and
  `ownerLogin` (two empty strings when the call fails).
- The method says who counts as a writer in section 2.

## 0.6.2 (21 November 2026)

- **Every grill loads less, and no rule or check is lost.** What a grill
  always reads (the ux-grill skill and the convention) falls from about
  7,200 tokens to about 5,300.
  - The checklists by hand ("How each rule is checked") move to
    `plugin/docs/conventions/ux-checklists.md`. The convention, the skill
    and the checklists say to read it only for a rule whose skill is not
    installed, or not at the vetted version. The three checks no skill makes
    (R1's states against the data model, R4's decoration over text, R6's
    focus under sticky parts) are steps 5 and 6 of the skill, so a grill
    with every skill installed never opens the file.
  - The convention's "Sources" moves into
    `plugin/docs/research/ux-rules-sources.md`, as "In short"; the
    convention keeps one line pointing there.
  - "Skills that draw and polish" leaves the convention: the guidance lives
    once, in the skill's "Borrowed skills", with every condition the
    convention carried, and the convention keeps a one-line pointer.
  - The method's reference to the R2 grading of target sizes now points to
    the checklists. The script names no moved section and is unchanged.
- **A token budget, enforced on every pull request.** `npm run budget`
  (`scripts/token-budget.mjs`, no dependency) estimates tokens as
  characters divided by 4 for the always-read set, each file read on
  demand and the factory script; it prints a Markdown table, or JSON with
  `--json`. `budget.json` lists the always-read set (the script and the
  test read it there, so the list is reviewed in one place) and holds its
  ceiling: 5,500, the measured 5,262 rounded up to the next 250.
  `tests/token-budget.test.mjs` fails when the set goes over it; a
  deliberate growth raises the ceiling in the same pull request.

### Token cost

From `npm run budget`, characters divided by 4, rounded up per file. The
0.6.1 column ran the same script on the 0.6.1 tree.

| Set | File | 0.6.1 | 0.6.2 |
| --- | --- | ---: | ---: |
| Always read, every grill | `plugin/skills/ux-grill/SKILL.md` | 2,195 | 2,376 |
| Always read, every grill | `plugin/docs/conventions/ux-design.md` | 5,003 | 2,886 |
| Always read, every grill | **Total** | **7,198** | **5,262** |
| Read on demand | `plugin/docs/conventions/ux-checklists.md` | absent | 1,343 |
| Read on demand | `plugin/docs/research/ux-rules-sources.md` | 7,053 | 7,560 |
| Read on demand | `plugin/docs/research/drawing-skills.md` | 4,399 | 4,399 |
| Read on demand | `plugin/docs/method/factory.md` | 10,021 | 10,031 |
| Read on demand | **Total** | **21,473** | **23,333** |
| The factory script | `plugin/workflows/factory.js` | 23,431 | 23,431 |

The skill grows by about 180 tokens because it now carries the drawing
skills' conditions the convention held and the R6 check by hand no skill
makes; the convention sheds about 2,100. Every grill saves about 1,900
tokens (7,198 to 5,262).

## 0.6.1 (21 November 2026)

- **The nine UI/UX rules are checked against their primary sources**
  (`plugin/docs/research/ux-rules-sources.md`). Three change wording: R2
  (reflow down to 320 px, targets of 44 by 44 px with the inline exception),
  R4 (3 to 1 for controls and their states), R9 (a confirmation only where
  the action cannot be undone). The count stays nine.
- **Six candidates from that reading are adopted, each folded into its
  rule**, never a tenth: R1 (an error state says what went wrong and how to
  fix it), R3 (a destructive action is never the primary one), R4 (colour is
  never the only signal), R6 (focus is never hidden by sticky parts, and a
  placeholder is never the label), R7 (a new component draws its interaction
  states). Each has its check by hand in "How each rule is checked".
- **The grill borrows existing skills, each for one job**, and works without
  them: the convention gains "How each rule is checked", a checklist by hand
  per rule beside the skill that does it when installed.
- **The grill's drawing and polish steps may use third-party skills, never
  required and never installed by the grill.** Drawing: `frontend-design`
  (Anthropic's plugin) when installed, else by hand. A style direction, only
  when the owner asks: `design-taste-frontend` or `ui-ux-pro-max`. Polish
  and motion after the layout is approved: `impeccable`, its `polish` and
  `animate` commands, motion under R6. Each was vetted, with its licence,
  the version read, what it installs and runs, and its conditions:
  `plugin/docs/research/drawing-skills.md`. Every screen still ends in the
  nine rules and the grill.
- **A third-party skill is matched by its version, not its name.** It is
  used only when its installed version matches the one read in the record,
  or the owner accepts the difference; otherwise it is absent and the step is
  done by hand. `ui-ux-pro-max` is pinned to the commit read (`f76d165`),
  since its tag `v2.15.0` is another commit. `design-taste-frontend` is never
  invoked in the repo, because its Stop hook registers on use: it runs in a
  scratch copy outside the repo, or its rules are read as text.
- **The product reviewer grades target sizes by R2**, not by
  `design:accessibility-review`, which audits WCAG 2.1 and lists 44 px as AA.

### Token cost

Measured on the files at the versions vetted, at about 4 characters per
token. The 0.6.1 figures for the skill and the convention are after this
release's fixes.

| What is loaded | 0.6.0 | 0.6.1 |
| --- | --- | --- |
| Per grill, always read: the skill and the convention | about 3,500 (skill 1,200, convention 2,300) | about 7,200 (skill 2,200, convention 5,000) |
| Optional, the design skills (critique, accessibility, UX copy, design system) | | about 4,300 together |
| Optional, research and grilling | | about 700 |
| Optional, `frontend-design` | | about 2,350 |
| Optional, `design-taste-frontend` | | about 7,750, plus headless Chrome runs |
| Optional, `ui-ux-pro-max` | | about 4,650, plus lookup output |
| Optional, `impeccable` with `polish` and `animate` | | about 7,050, plus hooks on every edit while installed |
| Per grill, nothing optional | about 3,500 | about 7,200 |
| Per grill, typical (design skills, research and grilling, `frontend-design`) | | about 14,500 |
| Per grill, everything | | about 34,000 |

Loaded text is re-sent each turn, which is cheaper when it is cached.
Generation, screenshots and browser runs are not included; they will be
measured on the first real 0.6.1 grill.

## 0.6.0, 21 November 2026

First public release, extracted from the private repository where the
factory was built and calibrated. Fresh history.

- **The UI/UX verdict** (method section 15). The spec returns `needed` or
  `not-needed`; a new screen file raises it to `needed` in code, never lowered.
  A `needed` spec builds only on a design spec, a mockup folder and a complete
  grill record that a writer merged; otherwise the issue goes back
  `ready-for-human` naming each missing piece.
- **The product reviewer reads the mockup** for a `needed` spec, at 375 px
  and 1280 px, only the screens the issue covers; the check fails closed when
  the scope is empty. It uses the design skills on every visual change.
- **`/factory:ux-grill`**: the verdict, the before, research, the mockup,
  the grill against the nine rules, the record, one pull request.
- The report carries `ux` and `uxMissing`.

Carried from earlier private releases: risk tiers (light, standard, high),
past decisions read before grading, P1-only confirmation rounds, Codex
collected beside the panel and required on the head commit, the P2 re-grade
and bundled tickets, the AI governance guardrail, spec mode (plan, then
issues), the Fable fallback on Opus, and the measurement fields of the report.
