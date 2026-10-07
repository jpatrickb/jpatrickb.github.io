---
title: Lumen List
summary: A family gift registry built with Next.js and Supabase that keeps gifts a surprise at the database level, so a gift owner can never see who claimed the items on their own list.
lane: system
stages: [serve]
tech: [Next.js, TypeScript, Supabase, PostgreSQL, Row Level Security]
liveUrl: https://lumenlist.app
repoUrl: https://github.com/jpatrickb/family-gift-registry
order: 20
---

The rule that keeps gifts a surprise is enforced with Postgres row-level security policies, so that even a bug in the app can't show someone who claimed the items on their own list.
