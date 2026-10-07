"""Writes example job-search records for the jobtracker demo recording.

The companies are real ones picked as examples. The roles, scores, pay ranges, notes, and dates are
all made up, and the dates are counted back from today so the history always looks recent.
Usage: python3 demos/seed_jobs.py <data root>
"""
import json
import sys
from datetime import date, timedelta
from pathlib import Path

today = date.today()
ago = lambda days: (today - timedelta(days=days)).isoformat()


def job(company, role, score, band, source, location, work_format, pay, history, notes=""):
    slug = f"{company}-{role}".lower().replace(",", "").replace(" ", "-")
    steps = [{"status": s, "date": ago(d), "note": n} for s, d, n in history]
    return {
        "id": slug, "company": company, "role": role, "score": score, "band": band,
        "scorer_version": "v1",
        "score_history": [{"score": score, "band": band, "version": "v1", "date": steps[0]["date"], "note": ""}],
        "url": None, "source": source, "listing_file": None,
        "facts": {
            "location": location, "work_format": work_format, "employment_type": "Full-time",
            "years_experience_min": 2, "pay_annual_min": pay[0], "pay_annual_max": pay[1],
            "cover_letter_requested": "No",
        },
        "folder": None, "status": steps[-1]["status"], "status_history": steps, "notes": notes,
        "created_at": steps[0]["date"], "updated_at": steps[-1]["date"],
    }


jobs = [
    job("Stripe", "Machine Learning Engineer", 86, "Strong fit", "Company careers page", "Remote (US)", "Remote", (150000, 190000), [
        ("Scored", 34, ""), ("Tailored", 33, "Led with the recommendations project"),
        ("Applied", 32, "Sent the tailored resume"), ("Screening", 24, "Recruiter call went well"),
        ("Interviewing", 11, "Technical screen passed, onsite loop is next week"),
    ]),
    job("Duolingo", "Data Scientist", 81, "Strong fit", "LinkedIn", "Pittsburgh, PA", "Hybrid", (135000, 165000), [
        ("Scored", 27, ""), ("Tailored", 26, ""), ("Applied", 26, ""), ("Screening", 13, "Take-home due Friday"),
    ]),
    job("Figma", "Software Engineer, AI", 78, "Good fit", "Referral", "Remote (US)", "Remote", (145000, 180000), [
        ("Scored", 20, ""), ("Tailored", 18, "Referral from a former teammate"), ("Applied", 18, ""),
    ]),
    job("Notion", "Software Engineer, AI", 74, "Good fit", "LinkedIn", "Remote (US)", "Remote", (140000, 175000), [
        ("Scored", 9, ""), ("Tailored", 7, ""), ("Applied", 6, ""),
    ]),
    job("Shopify", "Applied ML Engineer", 72, "Good fit", "Company careers page", "Remote (Americas)", "Remote", (130000, 170000), [
        ("Scored", 30, ""), ("Tailored", 29, ""), ("Applied", 29, "No reply yet"),
    ]),
    job("Airbnb", "Data Scientist, Inference", 69, "Decent fit", "Company careers page", "Remote (US)", "Remote", (140000, 185000), [
        ("Scored", 3, ""), ("Tailored", 1, "Used the causal inference projects"),
    ]),
    job("GitHub", "Software Engineer", 66, "Decent fit", "Hacker News", "Remote (US)", "Remote", (125000, 160000), [
        ("Scored", 2, ""),
    ]),
    job("Spotify", "Research Scientist", 64, "Decent fit", "Company careers page", "New York, NY", "Hybrid", (140000, 180000), [
        ("Scored", 36, ""), ("Tailored", 35, ""), ("Applied", 35, ""), ("Rejected", 21, "Wanted a PhD for this team"),
    ]),
    job("Datadog", "Software Engineer", 40, "REJECTED (gate: location)", "Indeed", "New York, NY", "Onsite", (135000, 170000), [
        ("Scored", 15, ""), ("Skipped", 15, "Onsite only"),
    ]),
]

root = Path(sys.argv[1]) / ".jobtracker"
root.mkdir(parents=True, exist_ok=True)
(root / "applications.json").write_text(json.dumps(jobs, indent=2))
