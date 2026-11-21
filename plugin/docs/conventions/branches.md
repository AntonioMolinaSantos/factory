# Convention: branches

The factory works in a repo with two long-lived branches.

- **`dev` integrates.** It is the default branch. Every pull request the
  factory opens targets `dev`, and the only merge it ever makes is into `dev`,
  and only when asked (`merge: true`, never with `pick`, never in the high
  tier).
- **`main` deploys.** It moves only when the owner says so. The factory reads
  `main` once, to report whether it moved during a run (`mainMoved`); it never
  pushes to it, opens a pull request to it or merges into it.
- **Work branches** come off `origin/dev`: `fix/<outcome>` for a bug,
  `feat/<outcome>` otherwise, `docs/plan-<slug>` for a plan, `docs/<slug>` for
  a design.

## Why the limits are in code

Branch protection on a private repo needs a paid GitHub plan, so many repos
cannot protect `main` on GitHub. The factory therefore enforces its own
limits in its script (`plugin/docs/method/factory.md`, section 5), and its tests
check that `main` is only ever read. Where the plan allows it, protect `main`
as well: the two layers do not overlap.

A local guard helps too: a pre-push hook that refuses a push to `main` unless
an explicit variable is set, and permission rules in Claude Code that ask
before `git push` to `main` and before `gh pr merge`.
