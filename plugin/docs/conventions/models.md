# Convention: which model, at which effort

The factory names a model and an effort for every agent it starts. Nothing
is left to a default: the defaults differ between models and between the API
and Claude Code, and a subagent on another model than the session's runs at
that model's own default, which is medium.

| Work | Model | Effort |
| --- | --- | --- |
| Reviewing code and plans: security, spec fit, plan review | Fable | high |
| Every other judgement: spec, plan, correctness and product review, re-grade, approver | Opus | high |
| Building and fixing | Opus | high |
| Reading facts that drive a decision: issue state, blockers, CI, Codex's answer, the merge check | Opus | high |
| Fixed-text actions: tickets, reports, labels, the merge command | Haiku | medium |

Documents say Fable, Opus or Haiku without a version, so a new release
changes code, not prose. No stage runs on the session's model.

A Fable reviewer that returns nothing is asked once more on Opus, and the
report counts it (`fableFallbacks`): Fable's weekly limit is the one that
binds first.
