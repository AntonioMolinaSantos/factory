# Changelog

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
