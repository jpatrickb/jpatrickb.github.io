export default function Photos() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="grid grid-cols-3 gap-1.5 opacity-60" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="size-12 rounded-md border border-dashed border-border bg-muted/40" />
        ))}
      </div>
      <p className="font-medium">Highlights coming soon</p>
      <p className="max-w-[36ch] text-sm text-muted-foreground">
        Patrick is choosing photos to share: case competition, performances, and a few things built along the way.
      </p>
    </div>
  )
}
