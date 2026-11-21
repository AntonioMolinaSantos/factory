# Research: the nine UI/UX rules against their primary sources

Read on 21 November 2026. The question: do the nine rules of
[`../conventions/ux-design.md`](../conventions/ux-design.md) stand on the
primary texts, or only on general knowledge? Each rule is checked below
against the texts that own the claim.

## How to read this file

- **What was reachable.** The session that did this reading could not reach
  `www.w3.org`, `www.nngroup.com` or `m3.material.io`: all three were outside
  its allowed network. It could reach `developer.apple.com` and GitHub.
- **WCAG 2.2** was therefore read from the W3C's own source repository,
  `w3c/wcag` on GitHub (branch `main`, commit `2766fae`, dated 16 November
  2026), which holds the text the published Recommendation is built from:
  one file per success criterion under `guidelines/sc/`, the definitions
  under `guidelines/terms/`, and the Understanding documents under
  `understanding/`. This is first-party text, but it is the editors' source,
  not the dated Recommendation at `https://www.w3.org/TR/WCAG22/`: it can
  carry errata the published page does not. Criterion numbers are not in
  those files; they are given here from memory of the published numbering
  and should be confirmed against the published page.
- **Apple's Human Interface Guidelines** were read from the page data that
  `developer.apple.com` serves for each page (the rendered page is empty
  without JavaScript).
- **Nielsen Norman Group's ten heuristics and Material Design 3 were not
  read.** Whatever this file says of them is marked "not read, from memory"
  and carries no quotation. No verdict below rests on them alone.
- **Quotations** are verbatim, with two changes forced by this repo's writing
  rule: a long dash inside a quotation is written as a comma, and typographic
  apostrophes are written plain.
- **Verdicts.** *Supported*: a primary text read here says the same, or the
  rule is stricter than the text and contradicts nothing. *Needs correction*:
  a primary text read here contradicts the wording, or the wording lets a
  screen pass the rule and fail the text at the level the rule aims at (WCAG
  AA). *Unsupported*: no primary text read here bears on it.

The rules are a design review, not a conformance audit. A screen that meets
all nine is not thereby WCAG conformant: criteria that no mockup can show
(names and roles, focus order, text alternatives) are left to the
accessibility review of the built screen.

## The rules

### R1: Every state is drawn

| | |
| --- | --- |
| The rule | Empty, loading, error, long or partial content, success. One drawing per state. Only the states the data model supports. |
| WCAG 2.2 | The definition of *status message* names the same family of states: "change in content that is not a change of context, and that provides information to the user on the success or results of an action, on the waiting state of an application, on the progress of a process, or on the existence of errors". Error Identification (3.3.1, Level A): "If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text." |
| Apple HIG | Loading: "Show something as soon as possible. If you make people wait for loading to complete before displaying anything, they can interpret the lack of content as a problem with your app or game. Instead, consider showing placeholder text, graphics, or animations as content loads". Feedback lists "The current status of something" first among what feedback communicates. |
| Not read, from memory | NN/g heuristic 1 (visibility of system status); Material Design 3 on component states. |
| Verdict | **supported**. The texts require that loading, error and success be communicated; none lists "empty" or "long content" as such. Those two are design practice, consistent with the texts and contradicted by none. |
| Correction | None. |

### R2: Two widths

| | |
| --- | --- |
| The rule | 375 px and 1280 px, no horizontal scroll, touch targets of at least 44 px. |
| WCAG 2.2, reflow | Reflow (1.4.10, Level AA): "Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions for: Vertical scrolling content at a width equivalent to 320 CSS pixels; Horizontal scrolling content at a height equivalent to 256 CSS pixels. Except for parts of the content which require two-dimensional layout for usage or meaning." Its note: "320 CSS pixels is equivalent to a starting viewport width of 1280 CSS pixels wide at 400% zoom." And: "Examples of content which requires two-dimensional layout are images required for understanding (such as maps and diagrams), video, games, presentations, data tables (not individual cells), and interfaces where it is necessary to keep toolbars in view while manipulating content." |
| WCAG 2.2, targets | Target Size (Minimum) (2.5.8, Level AA, new in 2.2): "The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except when", then five exceptions: spacing, equivalent, inline ("The target is in a sentence or its size is otherwise constrained by the line-height of non-target text"), user agent control, essential. Target Size (Enhanced) (2.5.5, Level AAA): "The size of the target for pointer inputs is at least 44 by 44 CSS pixels except when", with an inline exception: "The target is in a sentence or block of text". The Understanding document for 2.5.8: "For important links/controls, consider aiming for the stricter 2.5.5 Target Size (Enhanced)." |
| Apple HIG | Buttons: "As a general rule, a button needs a hit region of at least 44x44 pt, in visionOS, 60x60 pt, to ensure that people can select it easily, whether they use a fingertip, a pointer, their eyes, or a remote." Accessibility gives a table: iOS and iPadOS default control size 44x44 pt, minimum 28x28 pt; macOS default 28x28 pt, minimum 20x20 pt. Layout: "Apps and games need to adapt to different display sizes, orientation changes, window sizes, and multitasking states." |
| Not read, from memory | Material Design 3 asks for touch targets of 48 by 48 dp. |
| Verdict | **needs correction**, on two points. (1) The narrow width of the rule is 375 px, the AA threshold is 320 px: a screen with no horizontal scroll at 375 px can still fail 1.4.10. Both drawing widths are sound (1280 px is the very width the criterion's note starts from), but the reflow floor is missing, and so is the exception for content that needs two dimensions. (2) "44 px" is a real figure, but it is the AAA figure (2.5.5) and Apple's general rule, not the AA floor, which is 24 by 24 px (2.5.8). Keeping 44 is a defensible choice above AA and both sources back it; the wording must say it is two-dimensional, and must carry the inline exception both criteria give, or every link inside a sentence breaks the rule. |
| Correction | "375 px and 1280 px, no horizontal scroll, and none when the narrow screen is squeezed to 320 px (a data table, a map or a diagram may scroll inside its own box); touch targets of at least 44 by 44 px, a link inside a sentence excepted" |

### R3: One primary action

| | |
| --- | --- |
| The rule | One per screen, and the order of importance reads at a glance. |
| Apple HIG | Buttons: "In general, use a button that has a prominent visual style for the most likely action in a view." And: "Keep the number of prominent buttons to one or two per view. Presenting too many prominent buttons increases cognitive load, requiring people to spend more time considering options before making a choice." Layout: "Order content by relative importance. People often start by viewing content in reading order [...] so place the most important items near the top and leading side of the window or display." |
| WCAG 2.2 | Nothing: hierarchy of actions is not an accessibility criterion. |
| Not read, from memory | NN/g heuristic 8 (aesthetic and minimalist design); Material Design 3 on emphasis levels of buttons. |
| Verdict | **supported**. The rule is stricter than Apple, which allows "one or two" prominent buttons; a second one is a waiver with a reason, which the record format already allows. |
| Correction | None. |

### R4: Tokens only

| | |
| --- | --- |
| The rule | No colour, spacing or radius typed by hand; text contrast of at least 4.5 to 1, measured; no decoration crosses a line of text, checked by geometry. |
| WCAG 2.2, text | Contrast (Minimum) (1.4.3, Level AA): "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following: Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 3:1", plus incidental text and logotypes. Large scale is defined as "at least 18 point or 14 point bold". |
| WCAG 2.2, non-text | Non-text Contrast (1.4.11, Level AA): "The visual presentation of the following have a contrast ratio of at least 3:1 against adjacent color(s): User Interface Components: Visual information required to identify user interface components and states, except for inactive components or where the appearance of the component is determined by the user agent and not modified by the author; Graphical Objects: Parts of graphics required to understand the content". The Understanding document for Focus Visible adds that focus indicators "are also subject to Success Criterion 1.4.11 Non-text Contrast (Level AA)". |
| Apple HIG | Accessibility: "Strive to meet color contrast minimum standards. [...] Use standard contrast calculators to ensure your UI meets acceptable levels." Its table, "from WCAG Level AA": 4.5:1 for text up to 17 pt, 3:1 for 18 pt and for bold. "Prefer system-defined colors." "If your app supports Dark Mode, make sure to check the minimum contrast in both light and dark appearances." |
| Not read, from memory | Material Design 3 on design tokens. |
| Verdict | **needs correction**, on one point. The 4.5 to 1 figure is exactly 1.4.3 AA, and applying it to all text is stricter than the criterion (which lets large text drop to 3 to 1): supported. "Measured rather than judged by eye" matches Apple's "Use standard contrast calculators". But the rule measures text only: the same level, AA, sets 3 to 1 for what identifies a control or its state (1.4.11), and a screen can meet R4 with an input border or a focus ring nobody can see. "Tokens only" itself has no criterion behind it: the nearest primary text is Apple's "Prefer system-defined colors"; it stands as design-system practice. "No decoration crosses a line of text" has no primary source either: it is the lesson of the first grill, consistent with 1.4.3, whose ratio is taken against the background the text really sits on. |
| Correction | "text contrast of at least 4.5 to 1, and at least 3 to 1 for what identifies a control or its state (an input's border, an icon, the focus ring), both measured rather than judged by eye" |

### R5: Real content

| | |
| --- | --- |
| The rule | Real copy in every locale the repo ships, the longest realistic strings, no placeholder text. |
| Apple HIG | Layout: "Preview your app on multiple devices, using different size classes, localizations, and text sizes. You can streamline the testing process by first testing versions of your experience that use the largest and the smallest layouts." |
| WCAG 2.2 | Resize Text (1.4.4, Level AA): "Except for captions and images of text, text can be resized without assistive technology up to 200 percent without loss of content or functionality." Text Spacing (1.4.12, Level AA) likewise requires that no content is lost when spacing grows. Both say a layout must survive text longer or larger than the one drawn. |
| Not read, from memory | NN/g heuristic 2 (match between the system and the real world). |
| Verdict | **supported**. No text read here says "no placeholder text" in those words; it follows from testing with real localizations and sizes. |
| Correction | None. |

### R6: Keyboard and focus

| | |
| --- | --- |
| The rule | Every action reachable by keyboard, a visible focus, labelled inputs, reduced motion respected. |
| WCAG 2.2 | Keyboard (2.1.1, Level A): "All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes, except where the underlying function requires input that depends on the path of the user's movement and not just the endpoints." Focus Visible (2.4.7, Level AA): "Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible." Labels or Instructions (3.3.2, Level A): "Labels or instructions are provided when content requires user input." Info and Relationships (1.3.1, Level A): "Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text." Animation from Interactions (2.3.3, Level AAA): "Motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed." Its Understanding document offers as one way to meet it: "Take advantage of the reduce motion feature in the user agent or operating system." |
| WCAG 2.2, beyond the rule | Focus Appearance (2.4.13, Level AAA, new in 2.2) sets a size (a 2 CSS pixel perimeter) and a 3:1 change of contrast for the indicator. Focus Not Obscured (Minimum) (2.4.11, Level AA, new in 2.2): "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content." |
| Apple HIG | Accessibility: "Let people use the keyboard alone to navigate and interact with your app." And on motion: "People who are prone to these effects can turn on the Reduce Motion accessibility setting. When this setting is active, ensure your app or game responds by reducing automatic and repetitive animations, including zooming, scaling, and peripheral motion." Motion: "Make motion optional." The Accessibility page has no statement on the look of a focus indicator. |
| Verdict | **supported**. Three of the four parts are Level A or AA. The fourth, reduced motion, is Level AAA in WCAG (2.3.3), so it is not an AA requirement; Apple asks for it without qualification, and the rule keeps it as a choice above AA. The contrast of the focus ring is now measured under R4. |
| Correction | None. Two things the rule does not ask are listed as candidates: focus hidden by a sticky bar (2.4.11 AA), and a label that is only a placeholder. |

### R7: Reuse before invent

| | |
| --- | --- |
| The rule | The spec names the existing component each part reuses; a new component says why none fitted. |
| WCAG 2.2 | Consistent Identification (3.2.4, Level AA): "Components that have the same functionality within a set of web pages are identified consistently." Consistent Navigation (3.2.3, Level AA): repeated navigation occurs "in the same relative order each time". |
| Apple HIG | Layout: "prefer standard system components". Accessibility: "Prefer system gestures and behaviors people are already familiar with over creating custom gestures people must learn and retain." Buttons: "System buttons offer a range of styles that support customization while providing built-in interaction states, accessibility support, and appearance adaptation." |
| Not read, from memory | NN/g heuristic 4 (consistency and standards). |
| Verdict | **supported**. The texts ask for the outcome (the same thing looks and behaves the same); the rule asks for the practice that produces it. Naming the component in the spec is the repo's own method, not a quoted requirement. |
| Correction | None. |

### R8: The journey

| | |
| --- | --- |
| The rule | Where the user arrives from, what happens after, how to go back or undo. |
| WCAG 2.2 | Error Prevention (Legal, Financial, Data) (3.3.4, Level AA) lists as its first way out: "Reversible: Submissions are reversible." Consistent Navigation (3.2.3, Level AA), quoted under R7. |
| Apple HIG | Undo and redo: "People expect undo and redo to let them reverse their recent actions". Accessibility: "Offer alternatives to gestures. [...] if you use a swipe gesture to dismiss a view, also make a button available". Alerts: "If there's a destructive action, include a Cancel button to give people a clear, safe way to avoid the action." |
| Not read, from memory | NN/g heuristic 3 (user control and freedom), which is the closest statement of this rule. |
| Verdict | **supported** for "how to go back or undo". "Where the user arrives from" and "what happens after" are flow-design practice: no text read here states them, and none contradicts them. The strongest source for the whole rule, NN/g, was not read. |
| Correction | None. |

### R9: Feedback

| | |
| --- | --- |
| The rule | Every action shows its result on the screen; a destructive one asks first. |
| WCAG 2.2 | Status Messages (4.1.3, Level AA): "In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus." Error Prevention (Legal, Financial, Data) (3.3.4, Level AA): for pages "that cause legal commitments or financial transactions for the user to occur, that modify or delete user-controllable data in data storage systems, or that submit user test responses, at least one of the following is true: Reversible: Submissions are reversible. Checked: Data entered by the user is checked for input errors and the user is provided an opportunity to correct them. Confirmed: A mechanism is available for reviewing, confirming, and correcting information before finalizing the submission." |
| Apple HIG | Alerts: "Avoid displaying alerts for common, undoable actions, even when they're destructive. For example, you don't need to alert people about data loss every time they delete an email or file because they do so with the intention of discarding data, and they can undo the action. In comparison, when people take an uncommon destructive action that they can't undo, it's important to display an alert in case they initiated the action accidentally." Feedback: "Warn people when they initiate a task that can cause data loss that's unexpected and irreversible. In contrast, don't warn people when data loss is the expected result of their action." And: "When it makes sense, confirm that a significant action or task has completed. [...] because people typically expect their action or task to succeed, they only need to know when it doesn't." |
| Not read, from memory | NN/g heuristics 1 (visibility of system status) and 5 (error prevention). |
| Verdict | **needs correction**. The first half is supported (4.1.3 presumes status messages exist and asks that they reach assistive technology; Apple asks for feedback, with the nuance that a routine success needs no ceremony: the result showing on the screen is enough, which is what the rule says). The second half is contradicted as written: Apple says not to ask before a destructive action that is common and can be undone, and WCAG 3.3.4 accepts reversibility as an alternative to confirmation, not confirmation always. Asking every time also trains people to confirm without reading. |
| Correction | "a destructive one that cannot be undone asks first, and one that can be undone offers the undo instead" |

## Candidates for missing rules

Each was found in a primary text or in one of the four design skills (the
second lens, second-hand: `design:accessibility-review`,
`design:design-critique`, `design:ux-copy`, `design:design-system`). The
test for a rule is the convention's own: checkable on a mockup or a
screenshot. None of these clearly requires a tenth rule; the count stays
nine.

| Candidate | Source | Recommendation |
| --- | --- | --- |
| Colour is never the only signal (an error is red and also says so) | WCAG 1.4.1 Use of Color, Level A: "Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element." Apple, Accessibility: "Convey information with more than color alone." | **Fold into R4**, the rule that already measures colour. Level A, visible on a mockup. Not applied here: it is an addition, not a correction, so it is the owner's call. The strongest candidate of the list. |
| Focus is not hidden behind a sticky header, a cookie bar or a sheet | WCAG 2.4.11 Focus Not Obscured (Minimum), Level AA, new in 2.2 | **Fold into R6** when a screen has sticky or overlaid parts. Not applied, same reason. |
| A destructive action is never the primary one | Apple, Buttons: "Don't assign the primary role to a button that performs a destructive action, even if that action is the most likely choice." | **Fold into R3.** Visible on a mockup. Not applied. |
| An error says which field, what happened and how to fix it | WCAG 3.3.1 Error Identification (A) and 3.3.3 Error Suggestion (AA); `design:ux-copy` (second-hand): "What happened + Why + How to fix" | **Fold into R1**: the error state is already drawn, this says what its drawing must contain. Not applied. |
| A visible label, not a placeholder standing in for one | WCAG 3.3.2 (A) asks for "labels or instructions" and does not name placeholders; `design:accessibility-review` (second-hand) lists "Missing form labels" | **Fold into R6** as a reading of "labelled inputs" if the owner wants it: no primary text read here states it in those words. |
| Interaction states of a component: hover, active, disabled, loading | `design:design-system` (second-hand); Material Design 3 on states (not read, from memory) | **Fold into R7**: a new component draws its states. R1 covers the states of the data, not of the control. Not applied. |
| Space between targets | WCAG 2.5.8 spacing exception; Apple, Accessibility: "about 12 points of padding around elements that include a bezel" | **Leave out**: a 44 by 44 px target already clears it. |
| Text resized to 200 percent | WCAG 1.4.4 (AA); `design:accessibility-review` (second-hand): "Zoom to 200%" | **Leave out** as a rule: the 320 px floor now in R2 is the same test at 400 percent of 1280 px. |
| Contrast in the dark theme too | Apple, Accessibility, quoted under R4 | **Leave out** as a rule: R4 applies to every theme the mockup draws. Worth one line in the grill when a product ships a dark theme. |
| Text alternatives, names and roles, focus order, landmarks, screen reader output | WCAG 1.1.1, 4.1.2, 2.4.3 (all Level A); `design:accessibility-review` (second-hand) | **Leave out**: none shows on a mockup or a screenshot. They belong to the accessibility review of the built screen, which the product reviewer already runs. |
| No keyboard trap in a modal | WCAG 2.1.2 (Level A, not read here: from memory); `design:accessibility-review` (second-hand): "Focus traps in modals" | **Leave out**: behaviour of the built screen, same place as above. |
| Autoplaying media, time limits, auto-dismissing messages | WCAG 2.2.2 Pause, Stop, Hide (A); Apple, Accessibility: "Minimize use of time-boxed interface elements." | **Leave out**: applies to few screens. A toast that carries the only copy of a result is worth a question under R9. |
| First impression, emotional reaction, "what draws the eye first" | `design:design-critique` (second-hand) | **Leave out**: a judgement, not a check. The grill's free round is where it is asked. |
| Same term for the same thing everywhere | `design:ux-copy` (second-hand); WCAG 3.2.4 (AA) | **Leave out**: R5 and R7 already carry it. |

One finding about the second lens itself: `design:accessibility-review`
lists "2.5.5 Touch target >= 44x44 CSS pixels" under a heading that says
WCAG 2.1 AA. In the text read here 2.5.5 is Level AAA, and the AA criterion
(2.5.8, 24 by 24 px) exists only from WCAG 2.2. The skill audits against
2.1, so it knows neither 2.5.8 nor 2.4.11. Its findings on target size
should be graded with that in mind.

## What changed in the convention

- R2: the 320 px reflow floor and its exception; "44 by 44 px" and the
  inline exception.
- R4: 3 to 1 for what identifies a control or its state.
- R9: a confirmation only where the action cannot be undone; undo otherwise.
- A "Sources" section pointing here.
- A section "How each rule is checked": the four design skills read here,
  plus `mattpocock-skills:research` and `mattpocock-skills:grilling` (both
  read in full, 21 November 2026), each mapped to the rule or step it
  serves, with a checklist by hand for a repo that has none of them.

The count stays nine, so the script, the skill and the record format are
unchanged.

## Sources

| Source | How far it was read | Date read |
| --- | --- | --- |
| WCAG 2.2, W3C: source text in `w3c/wcag` on GitHub, `main` at `2766fae`. The files of 1.1.1, 1.3.1, 1.3.4, 1.4.1, 1.4.3, 1.4.4, 1.4.10, 1.4.11, 1.4.12, 1.4.13, 2.1.1, 2.2.2, 2.3.3, 2.4.3, 2.4.6, 2.4.7, 2.4.11, 2.4.12, 2.4.13, 2.5.3, 2.5.5, 2.5.7, 2.5.8, 3.2.3, 3.2.4, 3.2.6, 3.3.1, 3.3.2, 3.3.3, 3.3.4, 3.3.6, 3.3.7, 4.1.2, 4.1.3, each whole, and the definitions of large scale, status message, motion animation, target and CSS pixel | read in part (the criteria named, not the whole specification; the published page `https://www.w3.org/TR/WCAG22/` could not be reached) | 21 November 2026 |
| Understanding WCAG 2.2, same repository: Target Size (Minimum), Focus Visible, Reflow, Animation from Interactions | read in part (opening and intent of each) | 21 November 2026 |
| Apple Human Interface Guidelines, Accessibility, `https://developer.apple.com/design/human-interface-guidelines/accessibility` (change log to 9 June 2025) | read in full | 21 November 2026 |
| Apple Human Interface Guidelines: Layout, Buttons, Alerts, Loading, Feedback, Undo and redo, Motion (same site, `/layout`, `/buttons`, `/alerts`, `/loading`, `/feedback`, `/undo-and-redo`, `/motion`) | read in part (the passages on hierarchy, adaptability, hit regions, roles, confirmation, progress and undo) | 21 November 2026 |
| Nielsen Norman Group, "10 Usability Heuristics for User Interface Design", `https://www.nngroup.com/articles/ten-usability-heuristics/` | not read, from memory (host unreachable); heuristic numbers and names only, no quotation | not read |
| Material Design 3, `https://m3.material.io/` (states, hierarchy, touch targets) | not read, from memory (host unreachable); the 48 by 48 dp figure only | not read |
| `design:accessibility-review` skill | second-hand, read in full | 21 November 2026 |
| `design:design-critique` skill | second-hand, read in full | 21 November 2026 |
| `design:ux-copy` skill | second-hand, read in full | 21 November 2026 |
| `design:design-system` skill | second-hand, read in full | 21 November 2026 |

To finish the reading: allow `www.w3.org`, `www.nngroup.com` and
`m3.material.io` in the network of the session, confirm the criterion
numbers and levels against the published Recommendation, and replace the
two "from memory" rows with quotations. R3, R7 and R8 would gain the most:
their closest statements are NN/g's.
