---
title: GTM Diagnostic Automation
summary: A full-stack application that automated the Go-To-Market Diagnostic at Winning by Design, standardizing CRM, finance, and customer success data into 20+ analyses.
lane: system
stages: [data, model, serve]
outcome: Our three-person team reduced the diagnostic turnaround from 6–8 weeks to 5–15 minutes.
tech: [Python, Flask, SQL, Google APIs, LLMs, Slack]
year: 2025
order: 5
---

I built this during my GTM Strategy & AI internship at Winning by Design, working with a three-person team.

The diagnostic used to be a manual process that took 6–8 weeks. The application standardizes a client's CRM, finance, and customer success data and runs 20+ analyses on it, which brought the turnaround down to 5–15 minutes. That way the consultants could skip running each analysis by hand and spend their time interpreting the results for their clients.

The results are delivered as an interactive Google Sheet with 20+ tabs that consultants can sort and segment by vertical, along with automated slide-deck generation. Consultants run all of it through a Slack interface, where they upload the data and launch the analyses.

I also designed and deployed an LLM-based "Deep Dive" pipeline to analyze client call transcripts. Reviewing calls used to cover about 20 calls over several weeks, and the pipeline could get through as many calls as the model API could process in under 30 minutes.

We presented the results to the company's executives.
