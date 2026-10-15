---
company: TechForce Advisors
role: Founding Engineer
location: Remote
start: Aug 2025
end: Sep 2026
kind: engineering
lane: both
metrics:
  - { label: peak monthly NAT Gateway cost, value: "$109 to $0" }
tags: [AWS, Bedrock, Claude, Terraform, Next.js, SwiftUI]
order: 1
---

- Owned the entire technical surface as the founding engineer. I specified the systems, made the architecture decisions and verified the work, and Claude Code and Cursor wrote the code
- Built a production agentic research system that turns a visitor's email into a personalized company report, with a verifier and a deterministic grounding pass that strip unsupported claims, and durable jobs that survive crashes and retries (Next.js, AWS Bedrock AgentCore, Claude)
- Extended that same research system into an automated outbound pipeline that sources prospects and generates a personalized report for each in parallel, then emails them with automated bounce detection and suppression to protect deliverability
- Built a Slack agent that reads and updates the CRM in plain language, with every write held for a person's approval before it lands on a client record (Python, LangGraph, AWS Bedrock Claude)
- Built a native iOS app (SwiftUI) that transcribes a consultant's voice note (AWS Transcribe), extracts the company, contact, and a summary of the discussion (Bedrock Claude), and writes them directly into the CRM, authenticated via SAML SSO through a custom-scheme deep-link callback. Apple approved it and a TestFlight build existed, and it was cut from scope before it reached any consultants
- Designed and built a shared AWS test platform in Terraform that three apps run on (one VPC, a host-routed load balancer and an Aurora Serverless v2 cluster), and replaced NAT Gateways with NAT instances, taking that cost from as much as $109 a month to a few dollars
- Developed a retrieval-augmented chatbot platform that ingests a client's own documents (PDFs, Word files, web pages) and answers questions grounded in that content across a web chat widget, SMS, WhatsApp, and email (Next.js, pgvector, Gemini embeddings)
- Scoped and proposed AI-based solution designs for prospective clients across service, legal, nonprofit, and entertainment industries, from discovery calls through a plan for what to build
- Built an AI pipeline that extracts financial data from real estate broker documents, where every value cites the page and text it came from, with parsing, a code-based router, citation checks and an evaluation suite. It is stalled, and the agent loop has not yet accepted values on real documents (AWS Textract, AWS Bedrock, Python)
