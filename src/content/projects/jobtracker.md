---
title: jobtracker
summary: An agent-driven job search pipeline that scores postings, tailors resumes, and tracks applications, with a local CLI and skills for the coding agent you already use.
lane: tool
tech: [Python, Claude Code, Agent Skills, Typst]
repoUrl: https://github.com/jpatrickb/jobtracker
install: curl -fsSL https://jpatrickb.github.io/jobtracker/install.sh | bash
demo: /demos/jobtracker.mp4
order: 31
---

I built this with Claude Code to run my own job search, and then packaged it up so that other people can use it too.

It comes with three agents. One scores a job posting against your own rubric and your hard requirements, one builds a tailored resume and cover letter for a posting, and one reviews any draft as an independent second pass. There are also four skills that walk you through setting up your preferences, building and updating your resume content, and submitting an application.

The agents and skills work with Claude Code, Codex, Kilo Code, Cursor, and Pi. Next to them is a local CLI (`jobtracker`, or `jta` for short) that keeps a record for each job with its score, its status, and where the listing came from. It has reports for the whole funnel, and a `doctor` command that checks the records for consistency.

Your job search data lives in its own directory that you control, so none of it ends up inside the package.

The scores and statuses in the recording above are example data.
