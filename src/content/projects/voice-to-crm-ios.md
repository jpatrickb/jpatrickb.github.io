---
title: Voice-to-CRM iOS App
summary: A native iOS app (SwiftUI) that transcribes a consultant's voice note, extracts the company, contact, and a summary of the discussion, and writes them directly into the CRM.
lane: system
stages: [data, model, serve]
outcome: Approved by Apple and released on TestFlight.
tech: [Swift, SwiftUI, AWS Transcribe, AWS Bedrock, Claude, SAML SSO]
year: 2025
order: 4
---

I built this at TechForce Advisors for consultants who visit businesses door to door, so that they could log a conversation without having to type it up afterwards.

A consultant records a voice note after a visit, and the app transcribes it with AWS Transcribe. Then Claude on Bedrock extracts the company, the contact, and a summary of the discussion, and the app writes them directly into the CRM.

Consultants sign in with SAML SSO, which goes through a custom-scheme deep-link callback.
