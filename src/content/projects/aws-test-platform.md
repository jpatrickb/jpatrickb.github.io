---
title: Shared AWS Test Platform
summary: Terraform-managed test infrastructure shared by three production apps, with host-based routing and serverless Postgres.
lane: system
stages: [serve, monitor]
outcome: One platform for three apps. Traced a production outage to a broken container health check and fixed it.
tech: [Terraform, AWS ECS Fargate, Aurora Serverless v2, ALB, VPC]
year: 2025
featured: true
order: 3
---

Designed and built at TechForce Advisors so three production apps could share one test environment instead of each maintaining its own.

## Details

- Terraform-managed VPC, Aurora Serverless v2, and an Application Load Balancer with host-based routing per app.
- Services run on ECS Fargate.
- Traced a production outage to a broken container health check and fixed it by swapping `curl` for `wget`.
