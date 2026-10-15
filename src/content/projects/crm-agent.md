---
title: Slack CRM Agent
summary: A Slack agent that lets the team look up and update the CRM in plain language, with every change held for a person to approve before it lands on a client record.
lane: system
stages: [model, serve, monitor]
outcome: Runs in production as an agent on one ECS task, and no write reaches the CRM until a person approves it in Slack.
tech: [Python, LangGraph, AWS Bedrock, Claude, Slack, ECS Fargate, Terraform]
year: 2026
order: 5
---

I built this at TechForce Advisors so the team could ask for what they needed from the CRM in a Slack message. The agent can search and read contacts, companies, opportunities and tasks, and it has ten write tools such as updating a stage, logging a call or creating a task. Every write pauses for a person to approve it.

## Architecture

<div style="overflow-x:auto;margin-block:0 1rem"><svg viewBox="0 0 800 290" role="img" aria-label="Request flow. Slack messages reach an agent running on one ECS task. The agent loops between a Claude model step, an approval gate that pauses for a human to approve in Slack, and tools that call the CRM. Token counts go to Redis." style="width:100%;min-width:700px;height:auto;font-family:var(--font-mono,monospace);font-size:12px">
<defs><marker id="ca-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--muted-foreground)"/></marker></defs>
<g fill="var(--card)" stroke="var(--border)" stroke-width="1.5">
<rect x="10" y="110" width="120" height="64" rx="8"/>
<rect x="170" y="14" width="390" height="262" rx="10" fill="none" stroke-dasharray="5 4"/>
<rect x="200" y="56" width="160" height="50" rx="8"/>
<rect x="200" y="132" width="160" height="50" rx="8"/>
<rect x="200" y="208" width="160" height="50" rx="8"/>
<rect x="395" y="132" width="140" height="50" rx="8"/>
<rect x="620" y="56" width="160" height="50" rx="8"/>
<rect x="620" y="208" width="160" height="50" rx="8"/>
</g>
<g fill="none" stroke="var(--muted-foreground)" stroke-width="1.5" marker-end="url(#ca-arrow)">
<path d="M130 128C165 128 165 81 198 81"/>
<path d="M280 108V130"/>
<path d="M280 184V206"/>
<path d="M198 157C165 157 165 160 132 160"/>
<path d="M362 90C395 100 430 105 465 130"/>
<path d="M362 81H618"/>
<path d="M362 233H618"/>
</g>
<g fill="var(--foreground)" text-anchor="middle">
<text x="70" y="138">Slack</text>
<text x="365" y="34">one ECS Fargate task</text>
<text x="280" y="78">Model step</text>
<text x="280" y="154">Approval gate</text>
<text x="280" y="230">Tools</text>
<text x="465" y="154">Redis</text>
<text x="700" y="78">Claude on Bedrock</text>
<text x="700" y="230">The CRM</text>
</g>
<g fill="var(--muted-foreground)" text-anchor="middle">
<text x="70" y="156">DMs, mentions,</text>
<text x="70" y="171">approve buttons</text>
<text x="280" y="96">picks the next action</text>
<text x="280" y="172">writes pause here</text>
<text x="280" y="248">reads and writes</text>
<text x="465" y="172">cost counters</text>
<text x="700" y="96">the model</text>
<text x="700" y="248">via its API</text>
</g>
</svg></div>

The agent runs as one container on ECS Fargate and holds a socket connection to Slack. A LangGraph graph drives the loop. Claude on Bedrock picks the next action, the approval gate stops any write tool, and the tools call the CRM through its API. Token counts go to Redis, which feeds a 30-day cost view on the bot's Slack home tab. Terraform defines the infrastructure, and a small NAT instance gives the container outbound access.

## How a request flows

1. A message arrives over Slack's socket connection, and the thread keeps the conversation together.
2. The model step reads the conversation and picks a tool.
3. Reads run right away. A write tool triggers a LangGraph interrupt, so the graph stops and posts Approve and Reject buttons in the thread.
4. If someone approves, the graph resumes and the write runs. If someone rejects, the agent is told the operation was cancelled and carries on from there.
5. Token counts are recorded, so the cost of every conversation is visible.

## Why a person approves every write

The agent works with sensitive data about clients, and what it writes ends up on a client record that people use to make decisions about that client. I wanted the agent to take the work off the team while a person still checked each change before it landed, so the humans keep control and the burden is lighter.

## How it changed

- **A hand-built loop, then a framework.** I started with a Node app on the Anthropic SDK with a custom agent loop and model calls instead of a framework, and moved the calls to Bedrock the same day. A week later I rebuilt it in Python on LangGraph, since a supported and proven framework gave me room to specify a proper loop where the custom one boxed me in. It also removed about 700 lines of loop code and gave me native interrupts, which the approval gate is built on.
- **A new CRM.** The company decided to use a different CRM for other work and ported its data over, so I moved the agent's tools onto the new CRM's API.
- **A hosting move I didn't make.** I planned to move the agent onto AgentCore Runtime, which is built for agents and opens up other agent features, instead of running it on ECS. I didn't do it because there was no demand for it.
