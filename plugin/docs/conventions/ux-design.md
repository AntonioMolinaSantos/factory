# Convention: every spec carries a UI/UX verdict

Decided 21 November 2026 (the owner), in a grill of twelve questions. It is
the design and taste process of the factory.

## The contract

1. **Every spec answers one question before anything is built: does this
   need UI/UX?** A design spec answers it in a `## UI/UX` section, with a
   line `Verdict: needed` or `Verdict: not needed, because <reason>`. There
   is no third answer and no missing answer.
2. **Needed means new or rearranged.** The verdict is `needed` when the work
   adds a page, a flow or a component, or changes a layout or the navigation.
   A change inside an existing screen (copy, a field, a fix) is `not needed`:
   it keeps the product reviewer's screenshots, and the nine rules below
   apply to it as P2 findings only.
3. **The spec and the UI/UX are written together.** A `needed` spec names a
   mockup folder in a line of its own, exactly `Mockup: docs/design/<spec
   slug>/`, the slug being the spec's file name without its date and
   `-design.md`, in lower-case kebab case. The folder holds HTML on the
   repo's real tokens (its design tokens), one file per screen named after it, drawn at 375 px
   and 1280 px. A mockup written after the build is a screenshot, not a design.
4. **The owner is grilled on it before it is approved.** `/factory:ux-grill
   <spec path>` walks every screen through the nine rules, then asks what the
   rules did not. It writes a `### Grill record` into the section: the line
   `Grilled on <day> <Month> <year>.`, then for each screen a `#### <screen>`
   heading and one line per rule, `- R1: met`, `- R1: changed` (the mockup
   and spec were changed to meet it) or `- R1: waived, <reason>`, the reason
   being any text after the comma. Every HTML file of the mockup is a screen
   of the record: its name without `.html`, hyphens and underscores read as
   spaces, appears as whole words in the screen's heading, ignoring case
   (`product.html` and `#### Product page`). Notes under a screen say what
   changed and why; the first grill needed them, and the three results were
   enough. A note may start `- R1:` too: the result is the first such line
   that reads `met`, `changed` or `waived`.
5. **Approval is a merge.** The spec, the mockup and the grill record arrive
   in one pull request, and are approved when the owner merges it. A record the
   skill wrote and nobody merged approves nothing.
6. **Nothing with a `needed` verdict is built without that merge.** By hand,
   and in the factory from 0.6.0 (`plugin/docs/method/factory.md`, section 15),
   which hands such an issue back `ready-for-human` naming what is missing.

## The nine rules

Brand-neutral: they ask for tokens, not for any one brand's tokens. Each is
checkable on a mockup or a screenshot, which is the test for adding a tenth.

| Rule | Name | What the screen shows |
| --- | --- | --- |
| R1 | Every state is drawn | Empty, loading, error, long or partial content, success. One drawing per state, not a sentence promising it. Only the states the product's real flow supports: check the data model before inventing a state or rejecting one, and say in the spec why a state is not drawn |
| R2 | Two widths | 375 px and 1280 px, no horizontal scroll, and none when the narrow screen is squeezed to 320 px (a data table, a map or a diagram may scroll inside its own box); touch targets of at least 44 by 44 px, a link inside a sentence excepted |
| R3 | One primary action | One per screen, and the order of importance reads at a glance |
| R4 | Tokens only | No colour, spacing or radius typed by hand; text contrast of at least 4.5 to 1, and at least 3 to 1 for what identifies a control or its state (an input's border, an icon, the focus ring), both measured rather than judged by eye; no decoration crosses a line of text, checked by geometry (the text boxes against the decoration's edges, at both widths) rather than by eye |
| R5 | Real content | Real copy in every locale the repo ships, the longest realistic strings, no placeholder text |
| R6 | Keyboard and focus | Every action reachable by keyboard, a visible focus, labelled inputs, reduced motion respected |
| R7 | Reuse before invent | The spec names the existing component each part reuses; a new component says why none fitted |
| R8 | The journey | Where the user arrives from, what happens after, how to go back or undo |
| R9 | Feedback | Every action shows its result on the screen; a destructive one that cannot be undone asks first, and one that can be undone offers the undo instead |

The first grill (21 November 2026) found three gaps. Two became part of a
rule, because a mockup or a screenshot can show them: what R1 draws is bound
by the data model, and R4's legibility now covers decoration over text. The
third, a live defect found while drawing, is a step of the work below, not a
rule: no mockup can show whether it was filed. So the rules stay nine, and a
grill record keeps nine lines per screen.

## How each rule is checked

The rules are the contract: the record has one line per rule and nothing
else is parsed. Skills that already exist are how a rule gets checked, not a
replacement for it. Each one below is named by plugin and skill. A repo may
not have them, so every rule keeps a checklist by hand, and the grill works
with no other plugin installed. A skill's finding is evidence for a rule's
line; it is never the line.

- **R1.** By hand: list from the data model the states the screen can be in;
  tick each against a drawing; a state not drawn has its reason in the spec.
  With skills: `design:ux-copy` writes the empty and the error state (what
  this is, why, what to do next).

- **R2.** By hand: open each file at 375 px and 1280 px, then squeeze the
  narrow one to 320 px; the page is never wider than its window; measure the
  box of every button, link and control. With skills:
  `design:accessibility-review`, its findings graded with this rule's
  figures, not the skill's (it audits WCAG 2.1 and knows neither the 24 px
  floor nor which level 44 px belongs to).

- **R3.** By hand: name the primary action of the screen; count what is
  drawn in the primary style; say what the eye lands on first and whether
  that is the most important thing. With skills: `design:design-critique`,
  its first impression and visual hierarchy parts.

- **R4.** By hand: search the mockup's styles for a colour, a spacing or a
  radius that is not a token; compute the ratio of every pair of text and
  background, and of every control border, icon and focus ring; compare the
  text boxes with the decoration's edges at both widths. With skills:
  `design:design-system` in audit mode for values typed by hand,
  `design:accessibility-review` for the table of ratios.

- **R5.** By hand: one capture per locale the repo ships; put the longest
  real string of the data or the catalogue in every slot; search for filler
  text. With skills: `design:ux-copy`, its notes on what grows in
  translation.

- **R6.** By hand: press Tab through each file; every action is reached and
  the focus is seen at each stop; every input has a visible label tied to
  it; anything that moves stops under the reduced-motion setting. With
  skills: `design:accessibility-review`, its keyboard table. Its screen
  reader table waits for the built screen: a mockup cannot show it.

- **R7.** By hand: for each part of the screen, the path of the component it
  reuses; for a new one, what was looked at and why it did not fit. With
  skills: `design:design-system` in extend mode, whose table of existing
  patterns is this rule.

- **R8.** By hand: for each screen write where the user comes from, where
  they go next and how they go back or undo; each is a link or a control the
  mockup draws. With skills: `design:design-critique`, its usability part
  (unnecessary steps).

- **R9.** By hand: list every action of the screen and point to the drawing
  of its result; for a destructive one, say whether it can be undone, then
  point to the undo or to the confirmation, which names the action and what
  is lost. With skills: `design:ux-copy` for the confirmation and the result
  messages.

Two more skills serve steps of the work, not a rule. Research before
drawing: `mattpocock-skills:research`, primary sources into one file, which
the spec's table of adopted and rejected then cites. The interview itself:
`mattpocock-skills:grilling`, for the form of a round (numbered questions,
a recommended answer each, facts looked up rather than asked) and for the
free round; the screens and the nine rules still fix what the rounds are.

What is left out, and why. The accessibility part of `design:design-critique`
repeats the accessibility review without figures. The document mode of
`design:design-system` writes component documentation, which is the build's
work, not the design's. The tone alternatives of `design:ux-copy` are
choices for the owner, not checks. No skill checks R1's list of states
against the data model or R4's decoration over text: those two stay by hand.

## Sources

The rules were first written from general knowledge. On 21 November 2026
each was checked against the primary texts: WCAG 2.2 and Apple's Human
Interface Guidelines were read; Nielsen Norman Group's heuristics and
Material Design 3 could not be reached and are marked as such. The findings,
rule by rule, with the quoted criteria, their levels and the candidates for
missing rules: [`../research/ux-rules-sources.md`](../research/ux-rules-sources.md).

Three rules changed wording because a text required it. R2: the level AA
floor for reflow is 320 px, not 375 px, and 44 by 44 px is the AAA target
size and Apple's (the AA floor is 24 by 24 px), kept on purpose. R4: level AA
also sets 3 to 1 for controls and their states. R9: both texts accept undo in
place of a confirmation, and Apple advises against asking when the action
can be undone. Where a rule goes beyond level AA (44 px targets, reduced
motion, 4.5 to 1 for large text) it is a choice, and the findings say so.

## How the work runs

What the first grill taught, each item a correction that cost a rework.

**Order of work.**

1. **The before comes first.** Screenshots of the running product at 375 px
   and 1280 px, with seeded data so the page shows a real record (an empty or
   not-found page is not a before). Then a written list of what is weak, in
   the spec; the design must answer every item of it.
2. **Research before drawing.** Named reference patterns, in a table of
   adopted and rejected with the reason, each source labelled read in full or
   second-hand. Allow the reference hosts in the environment's network first,
   or say in the spec that the research was not live.
3. **The design skills from the start.** Design critique and accessibility
   review, plus UX copy where copy changes, shape the design and are run
   again on the result. The spec says what each one changed. Which skill
   checks which rule, and the checklist that stands in when a skill is not
   installed: "How each rule is checked" above.
4. **Layout first, then atmosphere.** Backgrounds and decorative variants
   are a separate step after the layout is approved, shown as a labelled
   sheet of variants; the spec records the choice.
5. **A live defect is its own issue.** A bug or wrong copy found while
   drawing the before is filed as an issue of its own, never fixed silently
   inside the design. The spec may propose the fix; it does not carry it.

**Briefing agents.** One brief carries every requirement: adding one mid-run
restarted the work. Design agents run on Fable, and a forked agent takes the
parent's current model, including when it is resumed, so the model in the
agent's record is checked before its output is trusted. Follow-ups go to the
agent they are for; a stopped agent is never resumed by mistake. Parallel
work gets its own git worktree, so agents never share a checkout.

**Evidence shown to the owner.** The before and the after side by side, plus a
stacked first-screen version legible on a phone. Whoever coordinates looks at
every image before sending it, and says plainly when variants barely differ.
Each screen is captured twice and compared: a layout that changes between
captures (a title on one line, then two) is a design flaw.

## What a reviewer does

The review loop is unchanged (`review-loop.md`): no fifth reason to stop a
merge.

- A built screen that differs from the approved mockup, or lacks a state the
  mockup drew, is a contradiction with the spec. That was already P1.
- Any other rule broken on a built screen is P2 and becomes a ticket.
- A `needed` spec with no mockup or no grill record is incomplete: say so at
  the spec, the only round where the answer is cheap.
- The factory's product reviewer runs design critique and accessibility
  review, plus UX copy when copy changes, on every visual change, and for a
  `needed` spec compares its screenshots with the approved mockup
  (`plugin/docs/method/factory.md`, section 15). The skills grade nothing
  themselves: their findings take the two grades above.

## Why

Before this, a visual change was first looked at after it was built: the
factory's product reviewer screenshots the screens and compares them with
acceptance criteria written in words. Words do not show an empty state nobody
drew or a table that breaks at phone width, so the screens matched their spec
and still read as unfinished. The cheapest place to find that is a mockup, and
the cheapest reviewer of a mockup is the person who will use the screen, asked
the same nine questions every time.

The line in item 2 is what keeps the rule alive. A grill for every label
change would be skipped within two weeks, and a rule skipped for small things
is soon skipped for large ones.

## Scope

Every repo that adopts the convention and has screens. Design specs dated before
21 November 2026 are records of their time and are not backfilled.

## Detection

A repo adopts the practice when it carries
`tests/ux-convention.test.mjs` (or `.ts`) declaring `UX_SINCE`, its own
adoption date. The test fails on any design spec dated from that day without
the section or with a slug that is not lower-case kebab case, and on a
`needed` verdict without its mockup folder and a complete grill record that
names every HTML file of the folder. A repo whose specs live elsewhere than
`docs/superpowers/specs/` points its copy of the test there.

Not detected: whether the merge in item 5 happened, which lives in GitHub,
and whether the built screens match the mockup, which is the product
reviewer's job.

## Where it came from

The first real grill covered a spec of two screens. Its lessons are the
section "How the work runs" and the two extended rules, R1 and R4.
