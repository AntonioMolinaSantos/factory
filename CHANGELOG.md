# Changelog

## 0.6.0, 21 November 2026

First public release, extracted from the private repository where the
factory was built and calibrated. Fresh history.

- **The UI/UX verdict** (method section 15). The spec returns `needed` or
  `not-needed`; a new screen file raises it to `needed` in code, never lowered.
  A `needed` spec builds only on a design spec, a mockup folder and a complete
  grill record that a writer merged; otherwise the issue goes back
  `ready-for-human` naming each missing piece.
- **The product reviewer reads the mockup** for a `needed` spec, at 375 px
  and 1280 px, only the screens the issue covers; the check fails closed when
  the scope is empty. It uses the design skills on every visual change.
- **`/factory:ux-grill`**: the verdict, the before, research, the mockup,
  the grill against the nine rules, the record, one pull request.
- The report carries `ux` and `uxMissing`.

Carried from earlier private releases: risk tiers (light, standard, high),
past decisions read before grading, P1-only confirmation rounds, Codex
collected beside the panel and required on the head commit, the P2 re-grade
and bundled tickets, the AI governance guardrail, spec mode (plan, then
issues), the Fable fallback on Opus, and the measurement fields of the report.
