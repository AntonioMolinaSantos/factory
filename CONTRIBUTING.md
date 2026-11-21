# Contributing

Thank you for improving the factory. The rules below are the ones the factory
itself follows; a change to how it works is reviewed the same way.

## Tests first

- Write the failing test before the code. The workflow's guards are plain
  code, and `tests/factory-workflow.test.mjs` runs the script against a fake
  `agent()` so every guard is proven without spending an agent.
- `npm test` is green before any merge. CI runs it on every pull request.
- A change of method changes `plugin/docs/method/factory.md` in the same pull
  request. Some tests hold the script and the method equal (the denylist, the
  number of review rounds, the version).
- A release bumps `VERSION` in `plugin/workflows/factory.js` and the version
  in `plugin/.claude-plugin/plugin.json` together, and adds a CHANGELOG entry.
- Everything the plugin reads at run time lives in `plugin/`, the folder that
  installs: the docs too, once, as real files in `plugin/docs/`. No symlink
  (a Windows checkout without symlink support breaks on one), and no
  `package.json` in `plugin/` (an install would run npm there).
  `tests/plugin-layout.test.mjs` holds this.

## Review: two rounds, then ship

Pull requests go to `main`. Review follows
[`plugin/docs/conventions/review-loop.md`](plugin/docs/conventions/review-loop.md):

1. **Round one:** fix everything real.
2. **Round two:** fix P1 only. Every P2 becomes an issue.
3. **Merge** when CI is green and no P1 is open.

**P1** is only what stops a merge, at any round: a security or privacy
exposure, a correctness defect without a test, a contradiction inside the
change or with its spec, or a decision the reviewer shows should change.
**P2** is everything else: wording, naming, a test that could be stronger
but is not wrong, a preferred refactor. Design documents get one round.

## Writing

- No em dash and no en dash anywhere: code, comments, docs, commit messages,
  pull request bodies. Use a colon, a comma or a middot; a range takes a
  plain hyphen. Some editors turn a typed sequence into the character, so
  check the bytes of what you write. The workflow test fails on either
  character in the script.
- Plain words, short sentences. A rule says why, once.
- No private names: no client, person, private repository, internal path or
  internal issue number. A calibration lesson keeps its substance and says
  "a calibration run".

## Sign-off

No sign-off line and no contributor agreement are needed. By opening a pull
request you agree that your contribution is licensed under the Apache License
2.0, as section 5 of the license says.

## Issues

Use GitHub Issues. A bug report says what you ran, what happened and what you
expected; a proposal says what problem it solves. Security issues go through
[SECURITY.md](SECURITY.md), not a public issue.
