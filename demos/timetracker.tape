# The timetracker demo. Record it from the repo root with: demos/record.sh timetracker
# Recorded as 4K-wide video, several times the size it is shown, so the text stays sharp.
Output public/demos/timetracker.mp4
Set Shell "zsh"
Set Theme "Rose Pine"
Set FontSize 52
Set FontFamily "JetBrainsMono Nerd Font"
Set Width 3840
Set Height 2240
Set Padding 72
Set WindowBar Colorful
# The window sits on a colored backdrop. MarginFill takes a color like "#7aa2f7" or an image file.
Set Margin 140
Set MarginFill "demos/.backgrounds/timetracker.png"
Set BorderRadius 28
Set WindowBarSize 120
Set Framerate 30
Set TypingSpeed 45ms

Hide
Type "source demos/seed.sh && source /opt/homebrew/opt/zsh-fast-syntax-highlighting/share/zsh-fast-syntax-highlighting/fast-syntax-highlighting.plugin.zsh && PROMPT='$ ' && clear" Enter
Sleep 2s
Show

Type "tt in --project 'Playlist Insights' --desc 'Reviewing the charts page'" Sleep 600ms Enter
Sleep 2s
Type "tt status" Sleep 500ms Enter
Sleep 2.5s
Type "tt out --id 5 --desc 'Reviewed the charts page'" Sleep 600ms Enter
Sleep 2.5s
Type "clear" Enter
Type "tt report --start $(date -v-6d +%F) --group-by day" Sleep 600ms Enter
Sleep 6s
