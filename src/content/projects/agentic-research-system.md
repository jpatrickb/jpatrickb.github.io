---
title: Agentic Company Research System
summary: A production agentic research system that turns a visitor's email into a personalized company report, with a verifier pass that strips unsupported claims before the report goes out.
lane: system
stages: [data, model, eval, serve, monitor]
outcome: Each report takes about 78 seconds and about $0.10 in LLM cost, with full CI/CD and a cost-monitoring dashboard.
tech: [Next.js, AWS Bedrock AgentCore, Claude, TypeScript, CI/CD]
year: 2025
featured: true
order: 1
---

I built this at TechForce Advisors as the founding engineer. A visitor enters their work email, and the system researches their company and sends them a personalized report.

The research agent runs on AWS Bedrock AgentCore with Claude. It looks through the company's website and review sites, and then drafts the report from what it found. Before the report goes out, a separate verifier pass checks the claims against the sources and strips any that aren't supported, since these reports go to prospects and we didn't want to send them something the model made up.

I also set up full CI/CD and a cost-monitoring dashboard, so we could see what each report was costing us.

Later on I extended the same system into an automated outbound pipeline. It sources prospects through Apollo and generates a personalized report for each of them in parallel. Then it emails them, with automated bounce detection and suppression to protect deliverability, and tracks engagement (dwell time and link clicks) back into the CRM.
