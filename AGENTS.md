# Headrust Project Rules

## Publishing and production

- Read `docs/deployment-runbook.md` before changing GitHub release state,
  Replit deployment state, custom domains, redirects, or search indexing.
- A commit, push, or merged pull request is not proof that the site is live.
  Verify the exact production behavior on `https://headrust.com` after every
  deployment.
- Verify both the apex domain and `www.headrust.com`, including HTTPS
  certificate validity and the canonical redirect.
- Stop before publishing if the Replit connection is unauthenticated or if the
  production release cannot be tied to the intended Git commit.

## Image-heavy tasks

- Do not generate or edit images inside a long-running implementation or
  publishing task. Use a disposable image-only task, checkpoint its approved
  output to the repository, and continue implementation from the saved path.
- After any task contains inline generated-image results, do not use that task
  for Git, deployment, domain, or production verification work. Start a clean
  file-based task instead.
- Preserve approved source assets and previous versions. Never regenerate an
  existing approved asset merely to reconstruct conversation context.

## Release verification

- Run the repository's targeted checks and production build before publishing.
- Verify user-visible production endpoints after publishing, including any
  changed API response and referenced static asset.
- Keep unrelated local changes out of release commits.
