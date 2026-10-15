---
title: Lumen List
summary: A family gift registry that keeps gifts a surprise at the database level, so a gift owner can never see who claimed the items on their own list.
lane: system
stages: [eval, serve]
outcome: Live at lumenlist.app and used by a few families. Runs on AWS for pennies a month, and a database test suite proves on every PR that owners can't see claims.
tech: [Next.js, TypeScript, PostgreSQL, Row Level Security, Neon, Drizzle, Better Auth, AWS Lambda, CloudFront, Terraform]
year: 2026
liveUrl: https://lumenlist.app
repoUrl: https://github.com/pateastudio/lumenlist
order: 20
featured: true
---

Families share wishlists and claim gifts for each other so nobody buys the same thing twice. The rule that keeps gifts a surprise is enforced with Postgres row-level security policies, so even a bug in the app can't show someone who claimed the items on their own list.

I designed and built it with Claude Code.

## Architecture

<div style="overflow-x:auto;margin-block:0 1rem"><svg viewBox="0 0 800 320" role="img" aria-label="Request flow. A browser reaches CloudFront. Static assets come from S3. Everything else goes to a Lambda running the Next.js app, which talks to one Neon branch through two database roles and sends email through Resend." style="width:100%;min-width:700px;height:auto;font-family:var(--font-mono,monospace);font-size:12px">
<defs><marker id="ll-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--muted-foreground)"/></marker></defs>
<g fill="var(--card)" stroke="var(--border)" stroke-width="1.5">
<rect x="10" y="130" width="100" height="50" rx="8"/>
<rect x="150" y="130" width="110" height="50" rx="8"/>
<rect x="150" y="30" width="110" height="46" rx="8"/>
<rect x="350" y="105" width="170" height="100" rx="8"/>
<rect x="350" y="250" width="170" height="44" rx="8"/>
<rect x="580" y="20" width="210" height="280" rx="10" fill="none" stroke-dasharray="5 4"/>
</g>
<g fill="var(--muted)" stroke="var(--primary)" stroke-width="1.5">
<rect x="600" y="75" width="170" height="70" rx="8"/>
<rect x="600" y="175" width="170" height="70" rx="8"/>
</g>
<g fill="none" stroke="var(--muted-foreground)" stroke-width="1.5" marker-end="url(#ll-arrow)">
<path d="M110 155H148"/>
<path d="M205 128V78"/>
<path d="M260 155H348"/>
<path d="M520 135C555 135 565 110 598 110"/>
<path d="M520 175C555 175 565 210 598 210"/>
<path d="M435 207V248"/>
</g>
<g fill="var(--foreground)" text-anchor="middle">
<text x="60" y="160">Browser</text>
<text x="205" y="160">CloudFront</text>
<text x="205" y="57">S3</text>
<text x="435" y="130">Lambda</text>
<text x="435" y="276">Resend</text>
<text x="685" y="104">app tables</text>
<text x="685" y="204">auth tables</text>
<text x="685" y="40">Neon Postgres branch</text>
</g>
<g fill="var(--muted-foreground)" text-anchor="middle">
<text x="435" y="150">Next.js server actions</text>
<text x="435" y="170">and route handlers</text>
<text x="435" y="190">withUser() and Better Auth</text>
<text x="685" y="124">row-level security</text>
<text x="685" y="140">role: app_user</text>
<text x="685" y="224">sessions and passwords</text>
<text x="685" y="240">role: auth_service</text>
<text x="435" y="292">invites and verification</text>
<text x="215" y="108" text-anchor="start">static files</text>
<text x="304" y="147">dynamic</text>
</g>
</svg></div>

A page request reaches CloudFront, which serves static files straight from S3 and sends everything else to one Lambda running the Next.js app. The Lambda is stateless, so a request carries everything it needs and nothing is kept between invocations.

The Lambda talks to a single Neon database through two doors that never overlap. Better Auth uses the `auth_service` role to read and write sessions and passwords, and it can't see a gift. Every other query goes through `app_user`, which can't see the auth tables and can't skip row-level security. A third role, the database owner, only runs migrations from the pipeline and never exists inside the Lambda.

## How data flows

1. A request arrives with a session cookie. Better Auth checks it and caches the result for five minutes so most requests skip the auth tables.
2. A server action calls `withUser(userId)`, which opens a transaction and sets the user id on it.
3. Postgres applies the policies to every query in that transaction. Without a user set, each app table returns zero rows.
4. Anything that has to cross a family boundary, such as accepting an invite or previewing who invited you, goes through a small `SECURITY DEFINER` function that checks its own inputs and returns only what the caller needs.

## How the surprise is protected

The policy on claims lets you see a claim if you made it, or if you share a family with the gift's owner and aren't the owner. The owner is excluded by the database, so a bug in a page, an API route or a future feature can't leak a claim. A database test suite runs the policies against Postgres 18 in Docker on every pull request and proves it. Playwright end-to-end tests cover the full flows, and refuse to run against production.

## Environments

Dev, staging and production each get their own Neon branch, and `develop`, the release branches and `main` deploy to the matching one. The dev and staging branches are created empty from an empty production branch, so no real wishlist or email address exists outside production. Since auth lives in the same database, branching copies the auth data and the app data together. A demo family seed fills a dev branch for testing, and a nightly job dumps production and checks row counts.

## Cost

Neon runs on its free tier and AWS costs pennies a month, since Lambda and CloudFront only bill for use. The one fixed cost is the yearly domain registration at Cloudflare.

## Decisions and tradeoffs

- **Supabase to Neon and Better Auth.** I wanted more control over the data, and I wanted to avoid the pauses Supabase applies to inactive projects. The row-level security policies moved over without trouble, and an importer kept every user's id and password hash so nobody had to sign up again. It checked row counts, logins and the surprise rule against the backup before cutover.
- **Self-hosted auth.** Auth data lives in the same database as everything else, so it branches and tests locally with it, and there is no per-user billing.
- **Hosting on AWS.** Vercel's free plan doesn't build repositories owned by an organization, so the move to AWS happened when the repo moved to one.

## What I'd do differently

I started building from an idea without thinking through edge cases, administration, or where the app was going. I made some easy early choices and had to reverse them later. Planning more up front would have saved that rework, as long as I picked scalable options without over-engineering for users I don't have.
