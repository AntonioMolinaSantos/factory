# The nine rules, checked by hand

Moved here from the convention ([`ux-design.md`](ux-design.md)) in 0.6.2, so
that a grill loads it only when it needs it. Read it only for a rule whose
skill is not installed, or not at the vetted version, and for the three
checks no skill makes: R1's states against the data model, R4's decoration
over text, R6's focus under sticky parts.

The rules are the contract: the record has one line per rule and nothing
else is parsed. Skills that already exist are how a rule gets checked, not a
replacement for it. Each one below is named by plugin and skill. A repo may
not have them, so every rule keeps a checklist by hand, and the grill works
with no other plugin installed. A skill's finding is evidence for a rule's
line; it is never the line.

- **R1.** By hand: list from the data model the states the screen can be in;
  tick each against a drawing; a state not drawn has its reason in the spec.
  Read each error drawing: it says what went wrong and how to fix it, in
  text, beside the field it concerns when there is one. With skills: `design:ux-copy` writes the empty and the error state (what
  this is, why, what to do next).

- **R2.** By hand: open each file at 375 px and 1280 px, then squeeze the
  narrow one to 320 px; the page is never wider than its window; measure the
  box of every button, link and control. With skills:
  `design:accessibility-review`, its findings graded with this rule's
  figures, not the skill's (it audits WCAG 2.1 and knows neither the 24 px
  floor nor which level 44 px belongs to).

- **R3.** By hand: name the primary action of the screen; count what is
  drawn in the primary style; say what the eye lands on first and whether
  that is the most important thing; find every destructive action (delete,
  remove, revoke) and check that none wears the primary style. With skills: `design:design-critique`,
  its first impression and visual hierarchy parts.

- **R4.** By hand: search the mockup's styles for a colour, a spacing or a
  radius that is not a token; compute the ratio of every pair of text and
  background, and of every control border, icon and focus ring; compare the
  text boxes with the decoration's edges at both widths; view each file in
  greyscale and check that nothing is told by colour alone (an error, a
  status, a required field, a link in a sentence, a series of a chart): each
  also has words, an icon or a shape. With skills:
  `design:design-system` in audit mode for values typed by hand,
  `design:accessibility-review` for the table of ratios.

- **R5.** By hand: one capture per locale the repo ships; put the longest
  real string of the data or the catalogue in every slot; search for filler
  text. With skills: `design:ux-copy`, its notes on what grows in
  translation.

- **R6.** By hand: press Tab through each file; every action is reached and
  the focus is seen at each stop, and where the screen has sticky or
  overlaid parts (a header, a cookie bar, a sheet), scroll so that each
  focused control passes under them: it is never wholly hidden; every input
  has a visible label tied to it that stays when the field is filled, so a
  placeholder is at most an example; anything that moves stops under the
  reduced-motion setting. With skills: `design:accessibility-review`, its
  keyboard table (it audits WCAG 2.1, so the sticky check stays by hand). Its
  screen reader table waits for the built screen: a mockup cannot show it.

- **R7.** By hand: for each part of the screen, the path of the component it
  reuses; for a new one, what was looked at and why it did not fit, and a
  sheet in the mockup that draws its interaction states side by side (hover,
  focus, active, disabled), each one labelled, a state that cannot apply
  left out with the reason. With skills: `design:design-system` in extend mode, whose table of existing
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
