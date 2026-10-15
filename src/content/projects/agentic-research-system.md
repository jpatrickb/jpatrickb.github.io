---
title: Agentic Company Research System
summary: A production system that turns a visitor's email into a personalized company report, with a verifier and a grounding pass that strip unsupported claims before anything is sent.
lane: system
stages: [data, model, eval, serve, monitor]
outcome: A production system that checks its own reports twice before sending them and shows what each report costs.
tech: [Next.js, AWS Bedrock AgentCore, Claude, TypeScript, PostgreSQL]
year: 2026
featured: true
order: 1
---

I built this at TechForce Advisors as the founding engineer. A visitor enters their work email, and the system researches their company and sends them a personalized report. Since these reports go to prospects, the main design question was how to keep the model from sending something it made up.

## Architecture

<div style="overflow-x:auto;margin-block:0 1rem"><svg viewBox="0 0 800 300" role="img" aria-label="Request flow. A lead form posts to a control plane, which writes a job and invokes a worker container. The worker researches, writes, verifies and grounds a report, then sends it. Jobs live in Postgres, and a sweeper re-drives stuck jobs." style="width:100%;min-width:700px;height:auto;font-family:var(--font-mono,monospace);font-size:12px">
<defs><marker id="ag-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--muted-foreground)"/></marker></defs>
<g fill="var(--card)" stroke="var(--border)" stroke-width="1.5">
<rect x="10" y="115" width="110" height="60" rx="8"/>
<rect x="165" y="115" width="150" height="60" rx="8"/>
<rect x="165" y="220" width="150" height="56" rx="8"/>
<rect x="365" y="14" width="270" height="272" rx="10" fill="none" stroke-dasharray="5 4"/>
<rect x="395" y="56" width="210" height="48" rx="8"/>
<rect x="395" y="124" width="210" height="48" rx="8"/>
<rect x="395" y="192" width="210" height="48" rx="8"/>
<rect x="680" y="115" width="110" height="60" rx="8" fill="var(--muted)" stroke="var(--primary)"/>
</g>
<g fill="none" stroke="var(--muted-foreground)" stroke-width="1.5" marker-end="url(#ag-arrow)">
<path d="M120 145H163"/>
<path d="M315 145H363"/>
<path d="M500 106V122"/>
<path d="M500 174V190"/>
<path d="M240 218V177"/>
<path d="M637 145H678"/>
</g>
<g fill="var(--foreground)" text-anchor="middle">
<text x="65" y="141">Lead form</text>
<text x="240" y="141">Control plane</text>
<text x="240" y="244">Sweeper</text>
<text x="500" y="34">Worker container</text>
<text x="500" y="78">Research</text>
<text x="500" y="146">Verify</text>
<text x="500" y="214">Ground and send</text>
<text x="735" y="141">Postgres</text>
</g>
<g fill="var(--muted-foreground)" text-anchor="middle">
<text x="65" y="159">website</text>
<text x="240" y="159">writes the job</text>
<text x="240" y="262">re-drives stuck jobs</text>
<text x="500" y="94">search and a managed browser</text>
<text x="500" y="162">a second model checks claims</text>
<text x="500" y="230">strip, store, then email</text>
<text x="735" y="159">jobs, reports</text>
</g>
</svg></div>

A control plane built in Next.js on Amplify takes the lead webhook, writes a job to Postgres and invokes a worker container on AgentCore Runtime. AgentCore hosts the container and gives it a managed browser, and the agent loop itself is TypeScript I wrote on Bedrock's tool-use API. A scheduled sweeper re-drives anything that gets stuck.

## How a request flows

1. The webhook writes a job with an idempotency key and answers right away, since the sender retries on anything but a success, and then invokes the worker.
2. The worker claims the job and sends an acknowledgement.
3. A research loop searches the web and reads the company's site and review pages in the managed browser, under a cap of 200,000 tokens and 240 seconds per lead.
4. A synthesis step drafts the report, on a larger model for hot leads.
5. A verifier on a smaller model checks the draft against what the research found. It can pass the report, pass it with fixes that strip the unsupported claims, or escalate for one rewrite.
6. A deterministic grounding pass then removes numeric claims whose source isn't in the research.
7. The report is stored before it is sent, and only then emailed.

## The same worker, outbound

The worker also generates reports in parallel for outbound campaigns. Each prospect gets a hosted report page, and dwell time and link clicks flow back to the CRM as engagement. Bounce detection and suppression protect deliverability.

## Decisions and tradeoffs

- **The verifier can fail, and the pipeline survives.** If the verifier errors out, the original report passes through, since an outage shouldn't block every report. Because an LLM verifier misses things, the deterministic grounding pass runs even then. I added that pass after an evaluation showed the verifier under-detecting fabricated numbers.
- **The verifier never grades itself.** It runs on a different model from the writer.
- **Store, then send.** A crash between the two can repeat an email but can never lose a report.
- **Budgets fail open and are recorded.** A lead that hits its token or time cap still gets a report from what was found, and the telemetry notes it.
