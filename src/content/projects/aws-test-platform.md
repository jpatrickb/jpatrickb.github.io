---
title: Shared AWS Test Platform
summary: A shared AWS test-infrastructure platform for three production apps, managed in Terraform with a shared VPC, Aurora Serverless v2, and host-based ALB routing.
lane: system
stages: [serve, monitor]
outcome: Three apps moved onto one shared test environment, and replacing managed NAT Gateways with EC2 NAT instances eliminated that cost entirely.
tech: [Terraform, AWS ECS Fargate, Aurora Serverless v2, ALB, VPC]
year: 2025
featured: true
order: 3
---

I designed and built this at TechForce Advisors so that three production apps could share one test environment, since before this each app had its own test infrastructure.

The platform is a Terraform module that manages the VPC, an Aurora Serverless v2 cluster, and an Application Load Balancer, which uses host-based routing to send each hostname to the right app. The services run on ECS Fargate. As part of the same work I replaced the managed NAT Gateways with EC2 NAT instances, which eliminated that cost entirely (I confirmed this in AWS Cost Explorer).

I also traced a production outage to a broken container health check, and fixed it by swapping `curl` for `wget`.
