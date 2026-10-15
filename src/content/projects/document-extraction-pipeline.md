---
title: Grounded Document Extraction
summary: A pipeline that extracts financial data from real estate broker documents, where every value has to cite the page and text it came from.
lane: system
stages: [data, model, eval]
outcome: I built the parser, the routing, the citation checks and the evaluation, and the agent loop has not yet accepted values on real documents. The project is stalled.
tech: [Python, AWS Textract, AWS Bedrock, Next.js, Terraform]
year: 2026
featured: true
order: 2
---

I built this at TechForce Advisors for analysts who underwrite acquisitions from broker documents. Those arrive as PDFs and scans in inconsistent formats, and an underwriting model needs clean numbers. The goal was values an analyst could trust because each one points to where it came from. The project is stalled now, and this page says where it got to and where it stopped.

## Architecture

<div style="overflow-x:auto;margin-block:0 1rem"><svg viewBox="0 0 800 130" role="img" aria-label="Pipeline. Documents are parsed with Textract, routed by tier, passed through a bounded agent loop for the hard cases, checked so every quote is on its cited page, and then shown to a person in a review app. Every value carries an anchor, a quote and how it was derived." style="width:100%;min-width:700px;height:auto;font-family:var(--font-mono,monospace);font-size:11.5px">
<defs><marker id="ex-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--muted-foreground)"/></marker></defs>
<g fill="var(--card)" stroke="var(--border)" stroke-width="1.5"><rect x="10" y="20" width="100" height="64" rx="8"/><rect x="146" y="20" width="100" height="64" rx="8"/><rect x="282" y="20" width="100" height="64" rx="8"/><rect x="418" y="20" width="100" height="64" rx="8"/><rect x="554" y="20" width="100" height="64" rx="8"/><rect x="690" y="20" width="100" height="64" rx="8"/></g>
<g fill="none" stroke="var(--muted-foreground)" stroke-width="1.5" marker-end="url(#ex-arrow)"><path d="M110 52H144"/><path d="M246 52H280"/><path d="M382 52H416"/><path d="M518 52H552"/><path d="M654 52H688"/></g>
<g fill="var(--foreground)" text-anchor="middle"><text x="60" y="48">Documents</text><text x="196" y="48">Parse</text><text x="332" y="48">Extract</text><text x="468" y="48">Agent loop</text><text x="604" y="48">Cite check</text><text x="740" y="48">Review app</text></g>
<g fill="var(--muted-foreground)" text-anchor="middle"><text x="60" y="68">PDFs, scans</text><text x="196" y="68">AWS Textract</text><text x="332" y="68">route by tier</text><text x="468" y="68">bounded turns</text><text x="604" y="68">quote on page</text><text x="740" y="68">person checks</text><text x="400" y="116">every value carries an anchor, a quote and how it was derived</text></g>
</svg></div>

There are two repos joined by one schema. A Python agent reads documents, and a Next.js app lets a person review the results next to the source. Documents land in S3, a queue triggers an extraction worker, and results go into a Postgres event log that the app reads. Terraform defines all of it.

## How grounding works

- Every value carries an anchor to a cell or block in the parsed document, the exact text it was read from, and how it was derived, whether read straight off the page, computed from other values, or reasoned.
- A router written in code decides each value's tier, and the model never does. A value with no anchor is rejected. A reasoned value, an unstated basis or a low-fidelity parse gets flagged. A literal value, or one computed from located inputs, is accepted.
- No model judges a number. Arithmetic checks are plain Python, and the schema bans numeric confidence scores.
- A citation checker confirms the quoted text is on the page it cites. It caught a real bug where page numbers were off by one on one record type, which pointed 84 citations at the wrong page.

## Evaluation

I refused to report an accuracy number until the ground truth was trustworthy, and it wasn't at first. The legacy labels were unverified, and when I re-checked 32 of them myself, 6 were wrong. I also found that one holdout deal was byte-identical to a development deal, so I recorded the contamination and re-cut the split, which left a single clean holdout deal.

On real documents, the bounded agent loop accepted no values, and I wrote that result down instead of tuning around it.

## Decisions and tradeoffs

- **Textract over Docling.** Docling misread eight of eight figures on a scanned year-end statement at 74 to 78 percent of their true value while the column still added up. That made parse fidelity a routing input, and I moved to Textract in August for its geometry.
- **Parsers inside the AWS account only.** Hosted document-AI services would send client documents outside the company's account, so I ruled them out.
- **Rulings that carry guards.** Each of 19 architecture rulings has a check or a stated gap, and CI fails when a ruling has neither.

## Where it stands

It stopped in early September 2026. The parser, the router, the citation checker, the schema validator and the review app are built. The stages that reconcile values and fill the underwriting model are not, and the agent loop still has to prove itself on real documents.
