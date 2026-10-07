# The jobtracker demo. Record it from the repo root with: demos/record.sh jobtracker
# Recorded as 4K-wide video, several times the size it is shown, so the text stays sharp.
Output public/demos/jobtracker.mp4
Set Shell "zsh"
Set Theme "Rose Pine"
Set FontSize 52
Set FontFamily "JetBrainsMono Nerd Font"
Set Width 3840
Set Height 2720
Set Padding 72
Set WindowBar Colorful
# The window sits on a colored backdrop. MarginFill takes a color like "#7aa2f7" or an image file.
Set Margin 140
Set MarginFill "demos/.backgrounds/jobtracker.png"
Set BorderRadius 28
Set WindowBarSize 120
Set Framerate 30
Set TypingSpeed 45ms

Hide
Type "source demos/seed.sh && source /opt/homebrew/opt/zsh-fast-syntax-highlighting/share/zsh-fast-syntax-highlighting/fast-syntax-highlighting.plugin.zsh && PROMPT='$ ' && clear" Enter
Sleep 3s
Show

Type "jobtracker list" Sleep 600ms Enter
Sleep 4.5s
Type "clear" Enter
Type "jobtracker show stripe" Sleep 600ms Enter
Sleep 6s
Type "clear" Enter
Type "jobtracker stale --days 14" Sleep 600ms Enter
Sleep 4s
Type "clear" Enter
Type "jobtracker report" Sleep 600ms Enter
Sleep 8s
