---
title: Grounded Document Extraction
summary: An AI pipeline that extracts financial data from real estate broker documents (offering memos, rent rolls, financials) into acquisition underwriting models.
lane: system
stages: [data, model, eval]
tech: [Python, Docling, AWS Bedrock, LLM extraction]
featured: true
order: 2
---

I worked on this at TechForce Advisors, and it was still in progress when I left.

Broker documents usually arrive as PDFs in inconsistent formats, and an underwriting model needs clean, structured numbers. The pipeline parses each document with Docling to get its tables, sections, and page references. Then it runs grounded LLM extraction on AWS Bedrock, so that each extracted value points back to the place in the source document it came from.

The goal is for those values to fill in the acquisition underwriting model, so that an analyst can check where every number came from.
