---
title: Voice-to-CRM iOS App
summary: A native iOS app that turns a consultant's spoken note after a visit into a CRM record, by transcribing it and extracting the company, contact and outcome.
lane: system
stages: [data, model, serve]
outcome: Apple approved it and a TestFlight build existed, and it was cut from scope before it reached any consultants.
tech: [Swift, SwiftUI, AWS Transcribe, AWS Bedrock, Claude, SAML SSO]
year: 2026
order: 4
---

I built this at TechForce Advisors for consultants who visit businesses door to door, so that they could log a conversation without typing it up afterwards. It passed Apple's review and had a TestFlight build. The company cut it from scope in July, before it reached any consultants, so it never had users.

## Architecture

<div style="overflow-x:auto;margin-block:0 1rem"><svg viewBox="0 0 800 130" role="img" aria-label="Flow. The iOS app records a voice note and sends it to an API. The API has Transcribe turn it into text, Claude extract the company, contact and outcome, and then saves the visit and syncs it to the CRM." style="width:100%;min-width:700px;height:auto;font-family:var(--font-mono,monospace);font-size:11.5px">
<defs><marker id="vc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--muted-foreground)"/></marker></defs>
<g fill="var(--card)" stroke="var(--border)" stroke-width="1.5"><rect x="5" y="20" width="130" height="64" rx="8"/><rect x="170" y="20" width="130" height="64" rx="8"/><rect x="335" y="20" width="130" height="64" rx="8"/><rect x="500" y="20" width="130" height="64" rx="8"/><rect x="665" y="20" width="130" height="64" rx="8"/></g>
<g fill="none" stroke="var(--muted-foreground)" stroke-width="1.5" marker-end="url(#vc-arrow)"><path d="M135 52H168"/><path d="M300 52H333"/><path d="M465 52H498"/><path d="M630 52H663"/></g>
<g fill="var(--foreground)" text-anchor="middle"><text x="70" y="48">iOS app</text><text x="235" y="48">API</text><text x="400" y="48">Transcribe</text><text x="565" y="48">Claude</text><text x="730" y="48">Save and sync</text></g>
<g fill="var(--muted-foreground)" text-anchor="middle"><text x="70" y="68">records a note</text><text x="235" y="68">Next.js, Amplify</text><text x="400" y="68">speech to text</text><text x="565" y="68">extracts fields</text><text x="730" y="68">DynamoDB, CRM</text><text x="400" y="116">sign-in is SAML single sign-on through the company portal</text></g>
</svg></div>

A consultant records a voice note in the SwiftUI app, which sends it to an API built in Next.js on Amplify. The API saves the audio to S3 and has AWS Transcribe turn it into text. Claude on Bedrock then extracts the company, the contact, the outcome and the products discussed, and writes a short summary of the visit. The API stores the visit in DynamoDB and syncs it to the CRM as a contact, a pinned note and an opportunity for each product discussed.

## Sign-in

Consultants sign in with SAML single sign-on through the company portal. The app opens the portal's login in a system web session, the portal posts a signed assertion back to the API, and the API hands the app a one-time code through a custom-scheme deep link. The app exchanges that code for a token and keeps it in the iOS Keychain.

## Decisions and tradeoffs

- **The CRM is a downstream copy.** DynamoDB is the record of each visit, and the CRM sync can fail without losing it.
- **AWS-native services.** Transcribe and Bedrock keep the audio and the transcripts inside the company's AWS account, instead of sending them to a separate AI vendor.
- **The model can only choose from known values.** The extraction accepts only a fixed set of outcomes and products, so a bad answer comes back empty and not as free text that lands in the CRM.
