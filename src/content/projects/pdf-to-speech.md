---
title: PDF-to-Speech Audiobooks
summary: Flask web app and CLI that turns PDFs into narrated audiobooks, using the Gemini API for OCR cleanup and text-to-speech with chunking to stay within quota.
lane: system
stages: [data, serve]
tech: [Python, Flask, Gemini API, SQLAlchemy]
repoUrl: https://github.com/jpatrickb/pdf-to-speech
order: 21
---

Long documents are split into chunks so OCR cleanup and speech synthesis fit within API quota limits, then stitched back into one audiobook.
