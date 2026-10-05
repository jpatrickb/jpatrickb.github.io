---
company: TechForce Advisors
role: Founding Engineer
location: Remote
start: Aug 2025
end: Sep 2026
kind: engineering
lane: both
metrics:
  - { label: report latency, value: "78 s" }
  - { label: LLM cost / report, value: "$0.10" }
  - { label: apps on shared infra, value: "3" }
tags: [AWS, Bedrock, Claude, Terraform, Next.js, SwiftUI]
order: 1
---

- Built and shipped a production agentic research system that turns a visitor's email into a personalized company report, with full CI/CD, a cost-monitoring dashboard, and a verifier pass that strips unsupported claims before anything ships (about 78 seconds and $0.10 in LLM cost per report).
- Built and shipped a native iOS app (SwiftUI) that transcribes a consultant's voice note (AWS Transcribe), extracts the company, contact, and a discussion summary (Bedrock Claude), and writes them directly into the CRM, authenticated via SAML SSO through a custom-scheme deep-link callback.
- Extended the research system into an automated outbound pipeline that sources prospects, pre-generates a report for each in parallel, and emails them with bounce detection and suppression, tracking engagement (dwell time, link clicks) back into the CRM.
- Designed and built a shared AWS test-infrastructure platform for three production apps (Terraform-managed VPC, Aurora Serverless v2, host-based ALB routing), and traced a production outage to a broken health check.
- Worked on an AI pipeline that extracts financial data from real estate broker documents into acquisition underwriting models, using document parsing and grounded LLM extraction (Docling, AWS Bedrock).
