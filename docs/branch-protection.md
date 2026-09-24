# Main branch protection handoff

Configure these settings in the remote Git-hosting repository before production work begins:

1. Require pull requests before merging into `main`.
2. Require at least one approval from a repository maintainer.
3. Require the `quality` and `secret-scan` CI jobs to pass.
4. Require branches to be up to date before merge.
5. Restrict direct pushes and force pushes to `main`.
6. Require signed commits if the organization policy supports them.
7. Include administrators in protection rules.

This setting must be changed by a repository administrator because it affects every collaborator.
