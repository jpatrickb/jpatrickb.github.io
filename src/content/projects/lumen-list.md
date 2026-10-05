---
title: Lumen List
summary: Family gift registry that enforces "surprise preservation" at the database level, so a gift owner can never see who claimed items on their own list.
lane: system
stages: [serve]
tech: [Next.js, TypeScript, Supabase, PostgreSQL, Row Level Security]
liveUrl: https://lumenlist.app
repoUrl: https://github.com/jpatrickb/family-gift-registry
order: 20
---

The privacy rule lives in Postgres row-level security policies rather than in application code, so no client bug can leak who claimed what.
