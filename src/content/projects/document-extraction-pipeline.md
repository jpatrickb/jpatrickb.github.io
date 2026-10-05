---
title: Grounded Document Extraction
summary: Pipeline that extracts financial data from real-estate broker documents (offering memos, rent rolls, financials) into acquisition underwriting models.
lane: system
stages: [data, model, eval, serve]
outcome: In progress. Grounded extraction so every number in the model traces back to a page in the source document.
tech: [Python, Docling, AWS Bedrock, LLM extraction]
featured: true
order: 2
---

Currently building at TechForce Advisors. Broker documents arrive as PDFs in inconsistent formats; underwriting needs clean, structured numbers.

## Approach

- Parse documents with Docling into structured layout (tables, sections, page references).
- Run grounded LLM extraction on Bedrock so each extracted field carries its source location.
- Load results into the acquisition underwriting model.
