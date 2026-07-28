# Headrust Deployment Runbook

Use this runbook for every storefront release, domain change, or production
incident.

## 1. Separate design work from publishing

Image generation and editing must happen in a disposable image-only task. Save
and checkpoint the approved result in the repository before opening a clean
implementation or publishing task. Never publish from a task containing inline
generated-image results.

## 2. Establish the release state

1. Inspect the worktree and preserve unrelated user changes.
2. Fetch the remote and identify the exact `origin/main` commit intended for
   production.
3. Confirm that only approved files are included in the release commit or pull
   request.
4. Run `npm run check` and `npm run build`. If a check has a known unrelated
   failure, record it explicitly and run the narrowest meaningful release test.
5. Confirm the pull request is merged. Do not describe the site as live yet.

## 3. Confirm hosting access before deployment

1. Resolve the existing Headrust Replit app; never create a replacement app.
2. Confirm the Replit connection is authenticated.
3. Confirm the app uses the repository's Autoscale deployment configuration.
4. Stop if authentication is expired, the app cannot be resolved, or the
   intended Git commit cannot be identified.

## 4. Deploy and prove production

1. Deploy the exact merged `origin/main` commit.
2. Wait for Replit to report a completed deployment.
3. Request `https://headrust.com/` and require HTTP 200.
4. Request the production API route affected by the release and compare its
   response with the intended source state.
5. Request every newly referenced production asset and require HTTP 200.
6. Record the deployed commit, verification time, and any remaining mismatch.
7. Do not mark the release complete while production still serves the previous
   API response or asset.

## 5. Verify domains and HTTPS

1. Treat `headrust.com` as the canonical hostname.
2. Add `www.headrust.com` as a custom domain in Replit, even when its DNS CNAME
   already exists. DNS alone does not provision a certificate or bind the
   hostname to the deployment.
3. Use the DNS targets supplied by Replit; do not rely on a previously observed
   target if Replit provides a replacement.
4. Require a valid HTTPS certificate for both hostnames.
5. Redirect `https://www.headrust.com/` permanently to
   `https://headrust.com/`.
6. Verify the redirect from an external request. A successful DNS lookup or TCP
   connection is insufficient.

## 6. Verify search discovery

1. Require HTTP 200 for `/robots.txt` and `/sitemap.xml`.
2. Confirm the homepage canonical URL is `https://headrust.com/` and robots
   metadata allows indexing.
3. Submit `https://headrust.com/sitemap.xml` in Google Search Console.
4. Inspect the homepage URL and request indexing.
5. Treat Search Console acceptance as submitted, not indexed. Google controls
   crawl timing; verify the indexed result later.

## 7. Incident recovery

- If the publishing task repeatedly disconnects, inspect its session size and
  recent request size. Start a clean task from file paths rather than forking
  the failing history.
- If GitHub is current but production is stale, check Replit authentication and
  deployment status before changing source code.
- If the apex works but `www` fails, inspect authoritative DNS, TLS certificate
  coverage, and custom-domain attachment separately.
- Preserve the last known-good deployment until the replacement passes all
  production checks.
