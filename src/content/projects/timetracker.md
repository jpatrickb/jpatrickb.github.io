---
title: Time Tracker
summary: A command line tool for tracking billable time from the terminal and turning it into invoices.
lane: tool
tech: [Python, SQLite, Typer, Textual, Typst]
repoUrl: https://github.com/jpatrickb/timetracker
install: uv tool install git+https://github.com/jpatrickb/timetracker
demo: /demos/timetracker.mp4
order: 30
---

I built this to keep track of my own billable hours. You clock in and out from the terminal with `tt in` and `tt out`, or you can log an entry after the fact with a client, a project, and a description.

Clients and projects each have an hourly rate, and a project follows its client's rate unless you give it its own. Reports can be filtered by client, project, and date, and grouped by entry, day, week, or month. They come out as a terminal table, Markdown, JSON, CSV, TSV, PDF, or Excel.

It also makes invoices as PDF or Excel files, with numbering for each client. Once an invoice is issued, its entries are locked so they can't be changed by accident until the invoice is voided.

Everything is stored in one SQLite file, and times are kept in UTC so that daylight saving changes never alter a duration.

The hours and amounts in the recording above are example data.
