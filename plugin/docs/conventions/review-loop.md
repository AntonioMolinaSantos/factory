# Convention: the review loop

When a review finding is fixed, and when it becomes a ticket. The factory's
grading, its fix rounds and its tickets follow this convention.

An automated reviewer never returns "nothing to say". It always finds
something arguable, and every fix creates new text to argue with. The exit
has to be a rule, because nothing in the reviewer will end the loop.

## The rule: two rounds, then ship

1. **Round one.** Fix everything real.
2. **Round two.** Fix P1 findings only. Every P2 becomes a ticket.
3. **Merge**, when the checks are green and no P1 is outstanding.

Anything a reviewer says after round two goes to the issue tracker, linked
to the thread. It is not lost, it is queued.

Round two is a confirmation, not a second full review. It is asked of the
reviewer whose finding was fixed, plus the reviewer that reads every commit
(Codex, where the repo has it). A change that touches money, authentication,
permissions or the schema is the exception: every reviewer sees every round,
and a human reads the code before it merges.

Before grading, a reviewer reads what the repo already decided: its
`CONTEXT.md`, its ADRs (`docs/adr/`), and its issues closed as `wontfix`.
Restating a settled decision is not a finding; showing that the decision
should change is one.

## P1: what stops a merge, at any round

Four things, and only these:

- **A security or privacy exposure.** Data reachable by someone who should
  not reach it, a credential, a legal exposure.
- **A correctness defect with no test.** Fix it and add the test. The test is
  what makes it safe to stop looking.
- **A contradiction inside the artefact**, or between the change and its
  spec. A specification that says two different things is worse than one
  that is consistently wrong.
- **A decision the reviewer shows should change.**

## P2: everything else

A wording improvement, a stale comment, a clearer example, a naming
preference, a test that could be stronger but is not wrong, a preferred
refactor. Round one fixes them when they are real; after that they become
tickets.

When in doubt, ask which is worse: shipping this as it stands, or spending
another hour. If the honest answer is "the hour", it is a ticket.

## Why two

In the rounds that produced this rule, the first two rounds carried nearly
every P1 and the tail was overwhelmingly P2. Past round two the reviewer also
starts finding defects in the fix for its previous finding: the loop
generates most of its own work.

## Design documents get one round

They are prose, so a reviewer has infinite surface. Fix what round one finds,
merge, and let the implementation test the design. The exception is a
security exposure: it is worth however many rounds it takes.

## How the factory applies it

The factory runs at most four review rounds, because a P1 stops a merge at
any round and only P1 keep the loop going: round one fixes every real finding
in scope, each later round fixes the P1 the round before found, and a P1 still
open after the last round escalates. P2 left at the end are re-graded on the
final commit and filed as tickets (method sections 3 and 4).
