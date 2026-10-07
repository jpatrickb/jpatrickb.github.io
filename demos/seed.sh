#!/usr/bin/env bash
# Builds a throwaway set of example data for the demo recordings, so the real time log and the real
# job search never show up in a recording. The companies are real ones picked as examples; none of
# them are places Patrick has worked, and the projects, rates, hours, scores, and statuses are made up. Usage: source demos/seed.sh
# a fresh temp folder every run, so nothing ever has to be deleted
export DEMO_DIR="$(mktemp -d "${TMPDIR:-/tmp}/site-demos.XXXXXX")"

# time tracker
export TIMETRACKER_DB="$DEMO_DIR/tt.db"
tt client add "Spotify" --alias SPOT --pay-rate-hourly 60 >/dev/null
tt project add SPOT "Playlist Insights" >/dev/null
tt client add "Duolingo" --alias DUO --pay-rate-hourly 75 >/dev/null
tt project add DUO "Lesson Analytics" >/dev/null
d() { date -v-"$1"d +%F; }
tt add --project "Playlist Insights" --start-time "$(d 3) 09:00" --end-time "$(d 3) 11:45" --desc "Set up the charts page" >/dev/null
tt add --project "Lesson Analytics" --start-time "$(d 3) 13:00" --end-time "$(d 3) 16:30" --desc "Wrote the nightly import job" >/dev/null
tt add --project "Playlist Insights" --start-time "$(d 2) 08:30" --end-time "$(d 2) 12:00" --desc "Added filters and CSV export" >/dev/null
tt add --project "Lesson Analytics" --start-time "$(d 1) 10:00" --end-time "$(d 1) 15:15" --desc "Fixed duplicate rows in the import" >/dev/null

# job tracker
export JOBTRACKER_DATA_ROOT="$DEMO_DIR/jobs"
jobtracker init "$JOBTRACKER_DATA_ROOT" >/dev/null 2>&1
python3 "$(dirname "${BASH_SOURCE[0]:-${(%):-%x}}")/seed_jobs.py" "$JOBTRACKER_DATA_ROOT"
cd "$DEMO_DIR"
