---
title: Voice-to-CRM iOS App
summary: Native SwiftUI app that transcribes a consultant's voice note, extracts the company, contact, and a summary with Claude, and writes them straight into the CRM.
lane: system
stages: [data, model, serve]
outcome: Shipped. Approved by Apple and live on TestFlight, with SAML SSO through a custom-scheme deep-link callback.
tech: [Swift, SwiftUI, AWS Transcribe, AWS Bedrock, Claude, SAML SSO]
year: 2025
order: 4
---

Built at TechForce Advisors for door-to-door sales consultants who needed to log conversations without typing.

## Flow

1. Record a voice note in the app.
2. AWS Transcribe turns it into text.
3. Claude on Bedrock extracts company, contact, and a discussion summary.
4. The app writes the result directly into the CRM.

Authentication uses SAML SSO through a custom-scheme deep-link callback.
