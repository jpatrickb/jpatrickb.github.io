---
title: Shared AWS Test Platform
summary: A Terraform-managed test environment that three apps share, with one load balancer routing by hostname, one Aurora cluster, and a NAT instance in place of NAT Gateways.
lane: system
stages: [serve, monitor]
outcome: Three apps share one test environment, and replacing NAT Gateways with NAT instances cut that line from as much as $109 a month to a few dollars.
tech: [Terraform, AWS ECS Fargate, Aurora Serverless v2, ALB, VPC]
year: 2026
featured: true
order: 3
---

Before this, each app had its own test infrastructure, and each one carried its own VPC, load balancer, database and NAT Gateway. I built one shared test platform that three apps use, and the same Terraform in each app can also run standalone, which is how the two production apps run.

## Architecture

<div style="overflow-x:auto;margin-block:0 1rem"><svg viewBox="0 0 800 340" role="img" aria-label="Shared test platform. Internet traffic reaches one shared load balancer, which routes by hostname to three ECS services inside one VPC. The services share one Aurora cluster, and a single NAT instance handles their outbound traffic." style="width:100%;min-width:700px;height:auto;font-family:var(--font-mono,monospace);font-size:12px">
<defs><marker id="at-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--muted-foreground)"/></marker></defs>
<g fill="var(--card)" stroke="var(--border)" stroke-width="1.5">
<rect x="10" y="140" width="90" height="50" rx="8"/>
<rect x="150" y="110" width="150" height="110" rx="8"/>
<rect x="340" y="15" width="440" height="315" rx="10" fill="none" stroke-dasharray="5 4"/>
<rect x="370" y="48" width="150" height="50" rx="8"/>
<rect x="370" y="115" width="150" height="50" rx="8"/>
<rect x="370" y="182" width="150" height="50" rx="8"/>
<rect x="370" y="268" width="150" height="46" rx="8"/>
</g>
<rect x="610" y="95" width="140" height="120" rx="8" fill="var(--muted)" stroke="var(--primary)" stroke-width="1.5"/>
<g fill="none" stroke="var(--muted-foreground)" stroke-width="1.5" marker-end="url(#at-arrow)">
<path d="M100 165H148"/>
<path d="M300 150C335 150 335 73 368 73"/>
<path d="M300 165H368 "/>
<path d="M300 180C335 180 335 207 368 207"/>
<path d="M520 73C565 73 565 130 608 130"/>
<path d="M520 140C565 140 565 155 608 155"/>
<path d="M520 207C565 207 565 180 608 180"/>
<path d="M445 234V266"/>
</g>
<g fill="var(--foreground)" text-anchor="middle">
<text x="55" y="170">Internet</text>
<text x="225" y="160">Shared ALB</text>
<text x="555" y="34">one shared VPC</text>
<text x="445" y="70">portal</text>
<text x="445" y="137">ai-assessment</text>
<text x="445" y="204">supportforce</text>
<text x="445" y="289">NAT instance</text>
<text x="680" y="150">Aurora</text>
</g>
<g fill="var(--muted-foreground)" text-anchor="middle">
<text x="225" y="182">routes by hostname</text>
<text x="225" y="200">one listener</text>
<text x="445" y="86">ECS Fargate</text>
<text x="445" y="153">ECS Fargate</text>
<text x="445" y="220">ECS Fargate</text>
<text x="445" y="305">outbound for all three</text>
<text x="680" y="170">Serverless v2</text>
<text x="680" y="188">one cluster</text>
</g>
</svg></div>

Each hostname gets one listener rule on a shared load balancer, so adding an app is one rule plus a target group. The apps connect to one Aurora Serverless v2 cluster and reach the internet through a single small NAT instance. All of it is Terraform, and I applied it on 2026-05-26.

## One codebase, two modes

Each app's Terraform has switches for the pieces it can share (`create_vpc`, `create_alb` and an external database endpoint). With the switches off, an app creates everything itself, and with them on it plugs into the shared platform. Test environments run in shared mode. Production for portal and AI assessment runs in standalone mode, each with its own load balancer, so a test change can never take down a production app. Supportforce never reached production.

## Cost

NAT Gateways were the largest avoidable line. AWS Cost Explorer shows NAT Gateway spend of $68 in December, $109 in January, $97 in April and $89 in May, and $0 every month since June, once the last gateway was replaced. Four small `t4g.nano` NAT instances run in their place at a few dollars a month each.

## Decisions and tradeoffs

- **Shared test, separate production.** Sharing saves money where an outage doesn't matter, and production keeps its own stack where it does.
- **NAT instances over NAT Gateways.** A NAT Gateway bills by the hour whether or not traffic flows. An instance is far cheaper, and the tradeoff is that I own its patching and availability, and a single instance in one availability zone is a single point of failure that is fine for test.

## What I'd do differently

The shared platform's Terraform lives only on my machine, with no repository, no CI and no review. I would put it in a repo with a pipeline from the start, so anyone on the team could change it safely.
