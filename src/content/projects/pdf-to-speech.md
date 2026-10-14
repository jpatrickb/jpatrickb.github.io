---
title: PDF-to-Speech Audiobooks
summary: A Python tool that converts PDF documents into audiobooks, using Google Gemini for text cleanup and speech synthesis, available as both a CLI and a Flask web app.
lane: system
stages: [data, serve]
tech: [Python, Flask, Gemini API, SQLAlchemy]
repoUrl: https://github.com/jpatrickb/pdf-to-speech
order: 21
---

I built and open-sourced this as a personal project. It extracts the text from a PDF and uses Gemini to clean up the OCR text, and then it generates the audio with Gemini's text-to-speech. Long documents are processed in chunks so that they stay within the API quota limits.

The web app has an upload and progress interface, an in-browser audio player, and job history, with persistent storage through SQLAlchemy against SQLite or PostgreSQL.
