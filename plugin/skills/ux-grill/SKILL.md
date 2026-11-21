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

## Borrowed skills

Some steps are a job an existing skill already does. For each one below,
look in the session's list of skills: if it is installed, load it and run it
for that step; otherwise do the step with the checklist by hand in
`${CLAUDE_PLUGIN_ROOT}/docs/conventions/ux-checklists.md`, which needs no
other plugin. Read that file only for a rule whose skill is not installed,
or not at the vetted version. The three checks no skill makes are steps 5
and 6 below. Say in the spec which way each step was done. A skill's
finding is evidence for a rule's line of the record, never the line itself:
the nine rules stay the contract.

| Step | Skill, by plugin and name | What it does here |
| --- | --- | --- |
| 3, research | `mattpocock-skills:research` | Primary sources into one file the spec cites |
| 5, drawing | `design:design-system` | Audit mode for values typed by hand, extend mode before a new component |
| 5 and 6, the drawn screens | `design:design-critique` | First impression, hierarchy, unnecessary steps |
| 5 and 6, the drawn screens | `design:accessibility-review` | Ratios, target sizes, the keyboard pass |
| 5, states and messages | `design:ux-copy` | Empty and error states, confirmations, result messages, what grows in translation |
| 8, the grill | `mattpocock-skills:grilling` | The form of a round and the free round |

Four more skills can make a drawing. They are third-party and optional,
vetted at the version read in
`${CLAUDE_PLUGIN_ROOT}/docs/research/drawing-skills.md`. Use one only when
the session lists a skill of that name (under any plugin prefix) at that
version, or the owner accepts the difference; a name alone is not a match.
Otherwise treat it as absent and draw (or polish) by hand. Never install
one, and never run an install command for one. Read its entry there first
(what it installs, runs and sends) and keep inside its conditions.

- **Step 5, drawing, the default:** `frontend-design`
  (`anthropics/claude-plugins-official`). Text only: no script, no hook, no
  network.
- **Step 5, a style direction, only when the owner asks for one; one of the
  two, never both.** `design-taste-frontend` (`Leonxlnx/taste-skill`), for a
  public marketing or landing screen only. It runs Node and headless
  Chrome, copies a kit and registers a Stop hook once invoked, so it is
  never invoked in the repo: run it in a scratch copy outside the repo, or
  read its rules as text. Or `ui-ux-pro-max`
  (`nextlevelbuilder/ui-ux-pro-max-skill`), as a lookup of styles: it runs
  Python, and its plugin installs six more skills the grill does not use.
  Their palettes, fonts and kits never enter the mockup.
- **Step 7, polish and motion, after the owner approved the layout:**
  `impeccable` (`pbakaus/impeccable`), `polish` then `animate`. As a plugin
  its hooks run a downloaded binary on every edit and it records anonymous
  usage unless told not to, so the owner installs it knowingly and turns
  that record off; the two commands also work from a copy of the skill
  without hooks.

Whatever drew or polished a screen still goes through the nine rules and the
grill, and its lines of the record come from there. The spec says which
skill did what, and at which version.

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
   spec's table of adopted and rejected, each source marked read in full,
   read in part, second-hand or not read. When the reference hosts are
   blocked, ask for them to be allowed, or write that the research was not
   live. With
   `mattpocock-skills:research`, the findings go to one file and the table
   cites it.
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
   (rule R7), and draw a new one's interaction states on a sheet. With
   `frontend-design`, the brief pins the repo's tokens as the whole palette,
   the real copy and both widths: its freedom is layout, hierarchy and one
   bold element, never a colour or a typeface of its own. A style direction
   is shown as a labelled sheet, then drawn on the repo's tokens, and writes
   nothing into the repo unless the owner says so. Run design critique and
   accessibility review, and UX copy when copy changes, while drawing and
   again on the result (the borrowed skills above, or the checklist by
   hand); write what each one changed into the spec. Grade an accessibility
   finding with the convention's figures, not the skill's.
6. **Evidence.** Capture every screen twice at 375 px and 1280 px into a
   folder outside git and compare the two captures; a layout that moves
   between them is a flaw to fix. Check by geometry that no decoration
   crosses a line of text: the text boxes against the decoration's edges.
   No focus hides under a sticky part: scroll with keyboard focus at both
   widths (R6).
   Show the owner the before and the after side by side, plus a stacked first
   screen legible on a phone, never only the HTML. Open every image yourself
   before sending it, and say so when variants barely differ.
7. **Atmosphere, polish and motion, after the layout.** Once the owner
   approves the layout, show background and decoration variants as one
   labelled sheet of the same screens. Record their choice in the spec; the
   grill covers the chosen one. Then, with `impeccable` installed, run its
   `polish` command on the mockup, and its `animate` command only where
   motion explains a state or a relationship, never only to be seen. Polish
   refines the approved layout and never redraws it. Motion stays under rule
   R6: every animation has its reduced-motion path. Without the skill,
   polish by hand against the checklists and add no motion the spec does
   not ask for.
   Capture again whatever changed (step 6), and write into the spec which
   skill drew or polished what, and at which version.
8. **Grill.** One round per screen. In each round, put the nine rules in
   order as numbered questions, each with what the mockup shows and the
   answer you recommend, then wait. A rule the mockup already meets is stated
   as met with the evidence, not asked. Facts are yours to look up (a
   contrast ratio, the longest real string, the component that already
   exists); decisions are the owner's. After the last screen, one free round:
   what the rules did not ask, starting with the screen you would least like
   to ship. With `mattpocock-skills:grilling`, take its form for a round and
   let its design tree drive the free round; the screens and the nine rules
   still fix the rounds before it.
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
