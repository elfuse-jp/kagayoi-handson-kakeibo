# .kagayoi

This directory holds settings that KAGAYOI Engineering reads from this repository.

## Phase instructions

`instructions/design.md`, `instructions/implement.md` and `instructions/review.md` replace the default instructions the Host gives the Agent for each phase.
Only the phase instructions are replaced; the common rules and the phase contracts (such as how to report) always apply.

- The Host reads these files from the default branch, not from the working tree or from PR branches. Commit them to the default branch for them to take effect.
- Delete a file or leave it empty to go back to the default instructions.
- Symbolic links are not read; place regular files.

`kagayoi init` wrote the default instructions of the version you ran. Later changes to the defaults do not update these files.

## App launch

`launch.json` tells KAGAYOI Engineering how to start the app for previews while a review waits for a human decision.
It holds only the single-line command to start the app, run from the repository root, and the port the app listens on:

```json
{"command": "pnpm dev --host 0.0.0.0", "port": 5173}
```

- The Host reads it from the head of the PR under review (the issue branch), not from the default branch, so a PR that changes how the app starts is previewed with its own setting.
- It takes precedence over the command and port the review Agent reports. Without it, the Agent's report is used.
- If it is not valid JSON or has other fields, the Host ignores it, logs the reason, and uses the Agent's report instead.
- Symbolic links are not read; place a regular file. `kagayoi init` does not create this file.
