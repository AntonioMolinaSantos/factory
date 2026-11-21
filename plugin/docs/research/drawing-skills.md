# Research: third-party skills for drawing and polishing the mockup

Read on 21 November 2026. The question: can the grill's drawing step and its
polish step lean on skills other people publish, without the factory
depending on any of them? Four were named by the owner. Each was vetted
before being written into the grill
([`../../skills/ux-grill/SKILL.md`](../../skills/ux-grill/SKILL.md)) and the
convention ([`../conventions/ux-design.md`](../conventions/ux-design.md)).

## How to read this file

- **How they were read.** Each repository was cloned at the commit named
  below and read as text. Nothing was installed, no script was run and no
  binary was downloaded: what a script does is stated from its source, what a
  prebuilt binary does is stated from the upstream documentation, and is
  marked as such.
- **Every skill is optional.** The grill works with none of them, drawing by
  hand as the convention says. A skill is used only when the session already
  has it. The grill never installs one.
- **No install command is given here.** None was run, so none is verified.
  The upstream README of each repository carries its own; read it, and what
  this file says the install writes, before running it.
- **A verdict holds for the version read.** A later version is not vetted. A
  skill that runs scripts or brings other skills with it is used at the
  pinned version or commit, or read again first.
- **Verdicts.** *Recommended*: safe to use as described. *Recommended with
  conditions*: it runs code, writes files or calls the network, each stated
  plainly, and it is used only inside the conditions listed. *Not vetted*: it
  could not be read, and is not recommended.

## Summary

| Skill | Upstream | Licence | Version read | Step of the grill | Verdict |
| --- | --- | --- | --- | --- | --- |
| `frontend-design` | `anthropics/claude-plugins-official`, `plugins/frontend-design` | Apache-2.0 | plugin 1.1.1, commit `73c8cf3` | 5, drawing (the default) | **Recommended** |
| `design-taste-frontend` | `Leonxlnx/taste-skill` | MIT | 2.5.1, tag `v2.5.1`, commit `f6b7657` | 5, a style option | **Recommended with conditions** |
| `ui-ux-pro-max` | `nextlevelbuilder/ui-ux-pro-max-skill` | MIT | 2.15.0, `main` at commit `f76d165` | 5, a style option | **Recommended with conditions** |
| `impeccable`, its `polish` and `animate` commands | `pbakaus/impeccable` | Apache-2.0 | skill 4.10.0, engine 0.1.27, commit `b49177d` | 7, polish and motion | **Recommended with conditions** |

None was unreadable, so none is listed as not vetted. Three of the four do
far more than their name suggests: read the conditions.

## frontend-design

- **Upstream.** `github.com/anthropics/claude-plugins-official`, plugin path
  `plugins/frontend-design`. It is Anthropic's own plugin and is listed in
  that repository's marketplace file.
- **Licence.** Apache-2.0 (`LICENSE` in the plugin, `LICENSE.txt` beside the
  skill).
- **What it installs.** Five files: the plugin manifest, a README, the two
  licence files and one `SKILL.md` of about 9 kB. No script, no hook, no
  agent, no data, no network call, nothing written anywhere.
- **What it does.** Text only. It asks for a design plan before code (a
  palette of four to six named colours, typefaces and their roles, a layout
  concept, the principles), a review of that plan against the brief, then the
  build and a self-critique. It lists the looks that mark a generated page so
  they are chosen, never defaulted to. Its quality floor names the same
  things as R2 and R6: responsive down to mobile, visible keyboard focus,
  reduced motion respected. Its writing section says an error explains what
  went wrong and how to fix it, which is R1.
- **Where it pulls against the convention.** Left free, it chooses its own
  palette and typefaces. The convention draws on the repo's real tokens
  (R4). The skill itself says the brief's own words always win, so the brief
  must pin the tokens: the repo's colours, type, spacing and radius are the
  palette, and the skill's freedom is layout, hierarchy, copy and the one
  bold element. It also invents copy when the brief has none; R5 wants the
  real copy in every locale, so the brief carries it.
- **Verdict: recommended, the default for drawing.** Nothing in it can harm
  a repo. Its output is still graded by the nine rules.

## design-taste-frontend (taste-skill)

- **Upstream.** `github.com/Leonxlnx/taste-skill`. The repository holds one
  skill, in the folder `skills/taste-skill`, whose name is
  `design-taste-frontend`. The older skills that carried other names moved
  to other repositories, which were not read and are not vetted.
- **Licence.** MIT.
- **What it installs.** About 1,630 files and 40 MB under the skill folder:
  a `SKILL.md` of 381 lines, twenty-two reference files, ten Node scripts
  under `scripts/` plus dealers and checkers under `assets/`, and a kit of
  CSS, JavaScript, HTML fragments, shaders, bundled photographs and icons.
  Upstream documents three ways in (the `npx skills` installer, a Claude
  Code plugin, and `install.sh`, which links the folder into
  `~/.claude/skills`). No script runs at install. It needs Node 22 or newer
  and Chrome, Edge or Chromium at use.
- **What runs at use.** The skill tells the agent to copy its `assets/`
  folder into the project (the `public` folder of a framework project), to
  run its dealers, which choose the palette, the font pairing, the hero
  layout and the motion, and to run its checkers, each starting a headless
  Chrome on a local page. It writes a `.taste-skill/` folder in the project
  (history, the gate's state, waivers) and screenshots under `shots/`.
- **A Stop hook.** The `SKILL.md` front matter declares a Stop hook: once the
  skill has been invoked in Claude Code, `scripts/gate.mjs` runs each time
  the agent finishes, with a timeout of 600 seconds, and holds the finish
  while a build is open and a check fails (three rounds at most).
- **Network.** Upstream states it needs no API key and installs nothing. At
  use it loads Google Fonts in the pages it builds, and its photograph and
  icon scripts fetch from Wikimedia Commons, Unsplash and an icon CDN when
  the bundled sets do not cover the page. No telemetry was found in the
  scripts searched.
- **Where it pulls against the convention.** It is a builder of public
  company websites, not of product screens: one section per screen at
  1440 by 900, a dealt palette (the repo's colours can be passed in with its
  `brand` command, the fonts are still dealt), photographs and effects by
  trade. Its widths are 1440, 1024, 768 and 390, not 375 and 1280. Its kit
  must not be edited, so a mockup built with it sits on the kit's tokens
  unless the repo's are passed in.
- **Verdict: recommended with conditions.** Only when the owner asks for a
  direction, only for a public marketing or landing screen, and only as a
  direction: the mockup is still drawn on the repo's tokens at the
  convention's two widths. Its kit is not copied into the repo, and its gate
  is not armed there, unless the owner says so. Pinned to 2.5.1 (commit
  `f6b7657`). For an application screen it is the wrong tool: use the
  default.

## ui-ux-pro-max

- **Upstream.** `github.com/nextlevelbuilder/ui-ux-pro-max-skill`.
- **Licence.** MIT.
- **What it installs.** As a Claude Code plugin, the manifest points at the
  whole folder `.claude/skills/`, so it brings **seven** skills, not one:
  `ui-ux-pro-max`, `design`, `design-system`, `ui-styling`, `brand`,
  `slides` and `banner-design`, about 11 MB. The skill vetted here,
  `ui-ux-pro-max`, is a `SKILL.md` of about 19 kB, two reference files, CSV
  data (styles, palettes, font pairings, UX guidelines, charts, one file per
  stack) and five Python scripts. No hook, and no script that runs at
  install.
- **The installer.** Upstream also ships an npm command-line installer
  (package `ui-ux-pro-max-cli`, command `uipro`). Read from its source: it
  copies bundled files into the project folder of the chosen assistant, or
  into the home folder with `--global`, which is a write outside the
  project; with `--legacy` it downloads a release archive from GitHub and
  unpacks it; its `update` command runs a global npm install of itself. It
  has no install script of its own in `package.json`.
- **What runs at use.** `python scripts/search.py "<query>"` with a domain,
  a stack or `--design-system`. The five scripts import the Python standard
  library only and open no connection (their imports were read; the one
  `urllib` import is the URL parser). It needs Python 3. With `--persist` it
  writes `design-system/<project>/MASTER.md`, page files, and optionally
  token files and a `preview.html`, under the output folder it is given, or
  under the current folder when none is given. The preview page links
  Google Fonts.
- **The six other skills were not read in full.** A search of their scripts
  found one that calls external image-generation services with API keys read
  from the environment (in `design`), one that names stock-photograph URLs
  for backgrounds (in `design-system`) and one that runs `npx` to add
  components to a project (in `ui-styling`). They are not vetted and the grill does not use them.
- **Where it pulls against the convention.** It proposes palettes, font
  pairings and a generated design system. The convention draws on the repo's
  tokens, so those outputs are a direction to discuss, never values to paste.
  Its UX guidelines repeat much of the nine rules (4.5 to 1, 44 by 44 px, a
  visible label, an error near its field, colour never alone) and are useful
  as a second lens.
- **Verdict: recommended with conditions.** Only when the owner asks for a
  direction, only the `ui-ux-pro-max` skill of the seven, only as a lookup
  (a domain or `--design-system` search), never with `--persist` in the repo
  unless the owner asks for the files. Stated plainly: it runs Python
  scripts, and the plugin installs six more skills, some of which call
  outside services. Pinned to 2.15.0 (upstream tags it `v2.15.0`; the text
  read was `main` at `f76d165`, whose manifests say 2.15.0).

## impeccable, the polish and animate commands

- **Upstream.** `github.com/pbakaus/impeccable`.
- **Licence.** Apache-2.0. A notice file credits two reference files derived
  from an MIT work.
- **What it installs.** As a Claude Code plugin (folder `plugin/`, 71
  files, about 2.4 MB): one skill, `impeccable`, with 24 commands, each a
  reference file loaded on demand; five sub-agents; a launcher script; and a
  `hooks.json` with **three hooks**: SessionStart, PostToolUse on every Edit
  and Write, and Stop. Each hook runs the launcher. Upstream also documents
  an npm installer, which offers the hook and writes it into the settings of
  the coding tool, and a manual copy of the skill folder, which upstream
  says skips the hook and the sub-agents.
- **A downloaded binary.** The launcher (`scripts/impeccable`, read in full)
  runs a prebuilt engine. When none is beside it, on the PATH or in the
  cache, it downloads the binary for the platform from the repository's
  GitHub releases into `~/.impeccable/bin/<version>/`, checks it against a
  SHA-256 pinned in the plugin, refuses it on a mismatch, and runs it. That
  is a write outside the project and code that was not read here: the
  engine's source is in the repository (Rust), but the binary is prebuilt
  and was neither built nor run for this file.
- **Hooks run without being asked.** Upstream's README says so itself: in
  Claude Code the hooks run even when the model's own commands are denied,
  so the first edit can download the engine. They then scan each edited UI
  file and push findings back into the session.
- **Telemetry and network.** From upstream's README: when a new design
  starts, the skill fetches visual directions from its own service, and
  records anonymously which were shown and which was picked; the project's
  name, files and code are not sent. The record is turned off with
  `DO_NOT_TRACK=1` or `"telemetry": false` in `.impeccable/config.json`; the
  fetch is not. The engine also has an optional account sign-in. Neither the
  polish nor the animate text calls for a new design.
- **Files it writes in the project.** A `.impeccable/` folder (config,
  critiques, captures), and `PRODUCT.md` and `DESIGN.md` when its `init` or
  `document` commands are run. Neither is needed for polish or animate.
- **What the two commands say.** Both reference files were read in full.
  *Polish* is refinement and never a hidden redesign: it classifies each
  drift (missing token, one-off, mismatch, local defect), fixes broken tasks
  and missing states before looks, and checks every control's default,
  hover, focus, active, disabled, loading, error and success behaviour, which
  is R7's new clause. *Animate* asks for a motion plan first, motion that
  explains a state or a relationship, short durations, no element that moves
  out from under the pointer, and a `prefers-reduced-motion` path for every
  animation, which is R6. Both fit "layout first, then atmosphere".
- **Not read.** The other reference files (some forty), the sub-agent
  definitions and the engine's source.
- **Verdict: recommended with conditions, the tool for polish and motion.**
  Stated plainly: installed as a plugin it adds hooks that run a downloaded
  binary on every edit, writes under the home folder, and sends anonymous
  usage records unless told not to. So: the owner installs it knowingly,
  never the grill; telemetry is turned off for the repo; the manual copy
  without hooks is enough for the two commands, which work from their text
  when the launcher is refused (the skill says to read the project's context
  directly and go on). Pinned to skill 4.10.0 (commit `b49177d`). Only
  `polish` and `animate` are used, after the owner approved the layout.

## How the grill uses them

- **Step 5, drawing.** With `frontend-design` when the session has it, on a
  brief that pins the repo's tokens, the real copy and both widths. Without
  it, by hand, as before.
- **Step 5, a direction.** When the owner asks for a style direction, one of
  the two style options, inside its conditions above. Its output is a
  direction on a sheet, then the mockup is drawn on the repo's tokens.
- **Step 7, polish and motion.** After the owner approved the layout, with
  `impeccable` (`polish`, then `animate` where motion earns its place) when
  the session has it. Motion stays under R6.
- **Always.** Every screen still goes through the nine rules and the grill.
  A skill's output is a drawing to be graded, never a result of the record.
  The spec says which skill drew or polished what, and at which version.

## Sources

| Source | How far it was read | Date read |
| --- | --- | --- |
| `anthropics/claude-plugins-official` at `73c8cf3`: `plugins/frontend-design` (manifest, README, `SKILL.md`), and its entry in the marketplace file | read in full | 21 November 2026 |
| `Leonxlnx/taste-skill` at `f6b7657` (tag `v2.5.1`): `skills/taste-skill/SKILL.md`, `README.md`, the plugin manifests | read in full | 21 November 2026 |
| Same repository: `install.sh`, `references/gate.md`, and the scripts under `skills/taste-skill/scripts/` searched for hosts, child processes and telemetry | read in part | 21 November 2026 |
| Same repository: the other reference files, the kit under `assets/`, the scripts line by line | not read | not read |
| `nextlevelbuilder/ui-ux-pro-max-skill` at `f76d165`: `.claude/skills/ui-ux-pro-max/SKILL.md`, `skill.json`, the plugin manifests | read in full | 21 November 2026 |
| Same repository: `README.md` (installation, prerequisites), the installer under `cli/src/` (searched for network calls, child processes and writes; `init.ts` and `github.ts` opened), the imports of the five scripts of the skill | read in part | 21 November 2026 |
| Same repository: the six other skills of the plugin (their scripts searched for network calls only), the CSV data | not read | not read |
| `pbakaus/impeccable` at `b49177d`: `plugin/skills/impeccable/SKILL.md`, `reference/polish.md`, `reference/animate.md`, `scripts/impeccable` (the launcher), `plugin/hooks/hooks.json`, the plugin manifests | read in full | 21 November 2026 |
| Same repository: `README.md` (installation, "Good to know"), `reference/hooks.md`, the Rust sources searched for hosts and telemetry | read in part | 21 November 2026 |
| Same repository: the other reference files, the sub-agents, the engine's source, the prebuilt engine binary | not read | not read |
