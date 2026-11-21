# Convention: a repo the factory can work in

A repo is factory-ready when the factory can build, gate and look at a change
there without anyone filling a gap by hand, and has shown it.

## The contract

1. **A CI workflow** that runs the repo's tests on every pull request to
   `dev`. The gate is green CI on the pull request's head commit; without it
   there is no gate.
2. **A verification skill** named `verify-<product>` under
   `.claude/skills/`: how to start the product and look at a screen. The
   product reviewer reads it and follows it.
3. **The issue labels** of `issues.md`. The factory only takes issues
   labelled `ready-for-agent`, and hands work back as `needs-info`,
   `ready-for-human` or `needs-triage`.
4. **The Codex GitHub app** installed on the repo. Without it every run
   reports Codex as not available, which blocks any merge.
5. **A `dev` branch** that integrates, beside `main` (`branches.md`).
6. **Two factory runs judged sound** there, recorded in the repo's
   calibration record (`plugin/docs/runbook/factory.md`, "Calibration").

A repo's `CLAUDE.md` may name its install and test commands (the factory uses
`npm ci` and `npm test` when it names none) and its own high-risk areas (the
spec proposes the high tier for a change there).

## Why

The factory's value is that it runs unattended. Each missing piece turns an
unattended step into a question for the owner at the worst moment: no CI
means no gate, no verification skill means a visual change ships unseen, no
labels means the factory cannot find its work, no Codex means nothing can
merge.
