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
| R1 | Every state is drawn | Empty, loading, error, long or partial content, success. One drawing per state, not a sentence promising it. Only the states the product's real flow supports: check the data model before inventing a state or rejecting one, and say in the spec why a state is not drawn; an error state says what went wrong and how to fix it, and names the field when there is one |
| R2 | Two widths | 375 px and 1280 px, no horizontal scroll, and none when the narrow screen is squeezed to 320 px (a data table, a map or a diagram may scroll inside its own box); touch targets of at least 44 by 44 px, a link inside a sentence excepted |
| R3 | One primary action | One per screen, and the order of importance reads at a glance; a destructive action is never the primary one |
| R4 | Tokens only | No colour, spacing or radius typed by hand; text contrast of at least 4.5 to 1, and at least 3 to 1 for what identifies a control or its state (an input's border, an icon, the focus ring), both measured rather than judged by eye; colour is never the only signal (an error is red and also says so in words or with an icon); no decoration crosses a line of text, checked by geometry (the text boxes against the decoration's edges, at both widths) rather than by eye |
| R5 | Real content | Real copy in every locale the repo ships, the longest realistic strings, no placeholder text |
| R6 | Keyboard and focus | Every action reachable by keyboard; a visible focus, and focus is never hidden by sticky parts (a header, a bar, a sheet); labelled inputs, and a placeholder is never the label; reduced motion respected |
| R7 | Reuse before invent | The spec names the existing component each part reuses; a new component says why none fitted, and a new component draws its interaction states (hover, focus, active, disabled, where they apply) |
| R8 | The journey | Where the user arrives from, what happens after, how to go back or undo |
| R9 | Feedback | Every action shows its result on the screen; a destructive one that cannot be undone asks first, and one that can be undone offers the undo instead |

The first grill (21 November 2026) found three gaps. Two became part of a
rule, because a mockup or a screenshot can show them: what R1 draws is bound
by the data model, and R4's legibility now covers decoration over text. The
third, a live defect found while drawing, is a step of the work below, not a
rule: no mockup can show whether it was filed. So the rules stay nine, and a
grill record keeps nine lines per screen.

The reading of the primary sources (same day) changed the wording of R2, R4
and R9, and found six more things a mockup can show, each folded into its
rule, never a tenth: what an error state says (R1), a destructive action is
never the primary one (R3), colour is never the only signal (R4), focus never
hidden by sticky parts and a placeholder never the label (R6), the
interaction states of a new component (R7). The sources, rule by rule:
[`../research/ux-rules-sources.md`](../research/ux-rules-sources.md).

## How each rule is checked

The rules are the contract: the record has one line per rule and nothing
else is parsed. A skill that already exists checks a rule when the session
has it (the grill skill's "Borrowed skills" says which); its finding is
evidence for a rule's line, never the line. Every rule also keeps a
checklist by hand, so the grill works with no other plugin installed:
[`ux-checklists.md`](ux-checklists.md). Read it only for a rule whose skill
is not installed, or not at the vetted version. The three checks no skill
makes are steps of the grill skill.

Skills that draw and polish a mockup: guided in [the grill skill](../../skills/ux-grill/SKILL.md)
only, vetted in [`../research/drawing-skills.md`](../research/drawing-skills.md).

## How the work runs

What the first grill taught, each item a correction that cost a rework.

**Order of work.**

1. **The before comes first.** Screenshots of the running product at 375 px
   and 1280 px, with seeded data so the page shows a real record (an empty or
   not-found page is not a before). Then a written list of what is weak, in
   the spec; the design must answer every item of it.
2. **Research before drawing.** Named reference patterns, in a table of
   adopted and rejected with the reason, each source labelled read in full,
   read in part, second-hand or not read. Allow the reference hosts in the
   environment's network first, or say in the spec that the research was
   not live.
3. **The design skills from the start.** Design critique and accessibility
   review, plus UX copy where copy changes, shape the design and are run
   again on the result. The spec says what each one changed. Which skill
   checks which rule, and the checklist that stands in when a skill is not
   installed: "How each rule is checked" above.
4. **Layout first, then atmosphere.** Backgrounds and decorative variants
   are a separate step after the layout is approved, shown as a labelled
   sheet of variants; the spec records the choice. Polish and motion belong
   to this step too, never before it (the grill skill, step 7).
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
