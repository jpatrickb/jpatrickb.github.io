---
title: Agentic Company Research System
summary: Production agent that turns a visitor's email into a personalized company report, with a verifier pass that strips unsupported claims before anything ships.
lane: system
stages: [data, model, eval, serve, monitor]
outcome: About 78 seconds and $0.10 in LLM cost per report, with full CI/CD and a cost-monitoring dashboard.
tech: [Next.js, AWS Bedrock AgentCore, Claude, TypeScript, CI/CD]
year: 2025
featured: true
order: 1
---

Built at TechForce Advisors as the founding engineer. A visitor enters a work email; the system researches the company, drafts a personalized report, and runs a separate verifier pass that removes any claim it can't ground in a source.

## What I built

- The agent loop on AWS Bedrock AgentCore with Claude, from research through drafting.
- A verifier stage that checks every claim against retrieved sources and strips the unsupported ones.
- CI/CD and a cost-monitoring dashboard so per-report spend stays visible.
- An extension into an automated outbound pipeline: it sources prospects (Apollo), pre-generates a report for each in parallel, emails them with bounce detection and suppression, and tracks engagement (dwell time, link clicks) back into the CRM.

## Why it matters

Grounding and cost were design constraints from day one, not afterthoughts. The verifier is what makes it safe to send generated reports to real prospects.
