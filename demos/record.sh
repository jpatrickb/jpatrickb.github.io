#!/usr/bin/env bash
# Records the demo videos. Run from the repo root:
#   demos/record.sh              records every tape in demos/
#   demos/record.sh timetracker  records just that one
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p demos/.backgrounds public/demos

names=("$@")
[ ${#names[@]} -eq 0 ] && names=($(ls demos/*.tape | xargs -n1 basename | sed 's/\.tape$//'))

for name in "${names[@]}"; do
  tape="demos/$name.tape"
  w=$(awk '/^Set Width/ {print $3}' "$tape")
  h=$(awk '/^Set Height/ {print $3}' "$tape")
  # The backdrop has to be exactly the size of the recording. If it is a different shape, the video
  # comes out with stretched pixels and looks squished in the browser.
  ffmpeg -y -loglevel error -f lavfi \
    -i "gradients=s=${w}x${h}:c0=0x7aa2f7:c1=0xebbcba:x0=0:y0=0:x1=${w}:y1=${h}:nb_colors=2" \
    -frames:v 1 -update 1 "demos/.backgrounds/$name.png"
  # vhs now and then fails on the first try with no message, so try a couple of times
  for attempt in 1 2 3; do
    vhs "$tape" >/dev/null 2>&1 && break
    [ "$attempt" -eq 3 ] && { echo "recording $name failed three times" >&2; exit 1; }
  done
  sar=$(ffprobe -v error -select_streams v:0 -show_entries stream=sample_aspect_ratio -of csv=p=0 "public/demos/$name.mp4")
  [ "$sar" = "1:1" ] || { echo "$name.mp4 has stretched pixels ($sar)" >&2; exit 1; }
  echo "recorded public/demos/$name.mp4 (${w}x${h})"
done
