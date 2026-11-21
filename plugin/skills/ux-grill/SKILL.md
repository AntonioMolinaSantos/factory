---
name: ux-grill
description: Decide whether a design spec needs UI/UX, and when it does, draw the mockup from a before of the real product, then grill the owner on it screen by screen against the nine rules, then write the grill record into the spec.
disable-model-invocation: true
argument-hint: "<path to the design spec>"
---

Run from the root of the repo the spec belongs to. Spec: `$ARGUMENTS`.

The contract, the line between needed and not needed, the nine rules, the
record format and how the work runs: `${CLAUDE_PLUGIN_ROOT}/docs/conventions/ux-design.md`.
Read it first and follow it; this file only orders the work.

## Steps

1. **Verdict.** Read the spec and the code it concerns. Apply item 2 of the
   contract and tell the owner the verdict you propose, with the one fact that
   decides it (the page, flow or component added, or its absence). They
   confirm or overrule. Write the `## UI/UX` section with the verdict line.
   When it is `not needed`, add the reason, run the repo's tests and stop.
2. **Before.** Screenshot the running product at 375 px and 1280 px with the
   repo's `verify-<product>` skill, on seeded data that shows a real record.
   Write the list of what is weak into the spec. A live bug or wrong copy you
   find here is filed as its own issue now (`gh issue create`), and the spec
   links it; never fix it inside the design.
3. **Research.** Before drawing, collect named reference patterns into the
   spec's table of adopted and rejected, each source marked read in full or
   second-hand. When the reference hosts are blocked, ask for them to be
   allowed, or write that the research was not live.
4. **Brief once.** If agents draw, give each one brief carrying every
   requirement (the weak list, the research, the nine rules, the repo's
   tokens, both widths, the design skills), run them on Fable, check the
   model in each agent's record before trusting its output, give parallel
   agents their own worktree, and send each follow-up to the agent it is for.
5. **Mockup, layout first.** Look for `docs/design/<spec slug>/` and add the
   `Mockup:` line to the section. Draw each screen the spec names that has no
   HTML file there: the repo's real tokens, one file per screen, named after
   the screen (`product.html` for "Product page"), every state
   of rule R1 the data model supports (read the schema before adding or
   dropping a state). Look up existing components before drawing a new one
   (rule R7). Run design critique and accessibility review, and UX copy when
   copy changes, while drawing and again on the result; write what each one
   changed into the spec.
6. **Evidence.** Capture every screen twice at 375 px and 1280 px into a
   folder outside git and compare the two captures; a layout that moves
   between them is a flaw to fix. Check by geometry that no decoration
   crosses a line of text: the text boxes against the decoration's edges.
   Show the owner the before and the after side by side, plus a stacked first
   screen legible on a phone, never only the HTML. Open every image yourself
   before sending it, and say so when variants barely differ.
7. **Atmosphere, after the layout.** Once the owner approves the layout, show
   background and decoration variants as one labelled sheet of the same
   screens. Record their choice in the spec; the grill covers the chosen one.
8. **Grill.** One round per screen. In each round, put the nine rules in
   order as numbered questions, each with what the mockup shows and the
   answer you recommend, then wait. A rule the mockup already meets is stated
   as met with the evidence, not asked. Facts are yours to look up (a
   contrast ratio, the longest real string, the component that already
   exists); decisions are the owner's. After the last screen, one free round:
   what the rules did not ask, starting with the screen you would least like
   to ship.
9. **Change.** Apply each answer to the mockup and the spec as it lands, and
   capture again whatever changed. A rule the owner waives is recorded with
   their reason, in their words.
10. **Record.** Write `### Grill record` in the format the convention gives:
    the date line, then each screen as a `####` heading that names its HTML
    file (the convention's matching rule) with its nine lines, and notes on
    what changed.
11. **Hand over.** Run the repo's tests. Commit the spec, the mockup and the
    record together on a `docs/` branch and open one pull request to `dev`.
    Done when that pull request exists and you have told the owner that merging
    it is the approval. Nothing is built from the spec before the merge; once
    it is merged, an issue the factory handed back for this design can be
    relabelled `ready-for-agent`.
