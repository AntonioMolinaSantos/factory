# Security policy

## Reporting a vulnerability

Please report a vulnerability privately through GitHub: on this repository,
open the Security tab and choose "Report a vulnerability". Do not open a
public issue for it.

Say what you found, how to reproduce it, and what it lets an attacker do.
You will get an answer as soon as the report has been read, and credit in the
release notes unless you ask otherwise.

## What counts

The factory runs agents that read issues, write code and comment on GitHub
with the permissions of the session that runs it. Of particular interest:

- a way for issue text, a comment or a file in the target repo to act as
  instructions: widen what an agent reads, writes or runs, or make the run
  write outside its scope;
- a way to get past a check held in code: who queued the issue, the
  denylist, the scope, the head and CI checks, Codex on the head commit, the
  merge rule, the high tier;
- a path that lets the run read a `.env` file or a file outside the tracked
  tree, or post something it should not.

## Supported versions

Fixes land on the latest release.
