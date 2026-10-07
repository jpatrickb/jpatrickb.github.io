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

- Built a production agentic research system that turns a visitor's email into a personalized company report in about 78 seconds for about $0.10 in LLM cost, with full CI/CD, a cost-monitoring dashboard, and a verifier pass that strips unsupported claims before it goes out (Next.js, AWS Bedrock AgentCore, Claude)
- Extended that same research system into an automated outbound pipeline that sources prospects and generates a personalized report for each in parallel, then emails them with automated bounce detection and suppression to protect deliverability (Apollo, Gmail API, GoHighLevel)
- Built and released a native iOS app (SwiftUI) that transcribes a consultant's voice note (AWS Transcribe), extracts the company, contact, and a summary of the discussion (Bedrock Claude), and writes them directly into the CRM, authenticated via SAML SSO through a custom-scheme deep-link callback
- Designed and built a shared AWS test-infrastructure platform for three production apps (Terraform-managed VPC, Aurora Serverless v2, host-based ALB routing), and traced a production outage to a broken health check, fixing it by swapping curl for wget
- Developed a retrieval-augmented chatbot platform that ingests a client's own documents (PDFs, Word files, web pages) and answers questions grounded in that content across a web chat widget, SMS, WhatsApp, and email (Next.js, pgvector, Gemini embeddings)
- Scoped and proposed AI-based solution designs for prospective clients across service, legal, nonprofit, and entertainment industries, from discovery calls through a plan for what to build
- Worked on an AI pipeline that extracts financial data from real estate broker documents (offering memos, rent rolls, financials) into acquisition underwriting models, using document parsing and grounded LLM extraction (Docling, AWS Bedrock, Python)
