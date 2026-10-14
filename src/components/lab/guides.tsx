// The "Learn" tab for each game: a short explanation in plain language, with small pictures.
import type { ReactNode } from 'react'

function Guide({ title, intro, children, onPlay }: { title: string; intro: string; children: ReactNode; onPlay: () => void }) {
  return (
    <article className="mx-auto max-w-[68ch] space-y-7 p-5 text-[15px] leading-relaxed">
      <header>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-muted-foreground">{intro}</p>
      </header>
      {children}
      <div className="border-t border-border pt-5">
        <button type="button" onClick={onPlay} className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90">Start playing →</button>
      </div>
    </article>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2.5">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </section>
  )
}

function Card({ title, picture, children }: { title: string; picture?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      {picture && <div className="mb-3">{picture}</div>}
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}

/* ---------- Gradient Descent Golf ---------- */

// a valley with the path a ball takes for a given step size
function Valley({ steps, label }: { steps: number[]; label: string }) {
  const W = 150
  const H = 74
  const px = (x: number) => W / 2 + x * 62
  const py = (x: number) => 62 - x * x * 50
  const curve = Array.from({ length: 41 }, (_, i) => -1.05 + (i * 2.1) / 40).map((x, i) => `${i ? 'L' : 'M'}${px(x).toFixed(1)},${py(x).toFixed(1)}`).join('')
  return (
    <figure className="min-w-0 flex-1 text-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={label}>
        <path d={curve} fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" />
        <polyline points={steps.map((x) => `${px(x).toFixed(1)},${py(x).toFixed(1)}`).join(' ')} fill="none" stroke="var(--secondary-accent)" strokeWidth="1.2" strokeDasharray="3 2" />
        {steps.map((x, i) => <circle key={i} cx={px(x)} cy={py(x)} r={i === steps.length - 1 ? 4 : 2.5} fill={i === steps.length - 1 ? 'var(--foreground)' : 'var(--secondary-accent)'} />)}
      </svg>
      <figcaption className="text-xs text-muted-foreground">{label}</figcaption>
    </figure>
  )
}

export function GolfGuide({ onPlay }: { onPlay: () => void }) {
  return (
    <Guide
      title="How a model learns, as a round of golf"
      intro="This game is about gradient descent, which is the method most machine learning models use to learn. You don't need to know any of the math to play, so here is the idea in plain terms."
      onPlay={onPlay}
    >
      <Section title="The loss is a landscape">
        <p>
          When a model learns, it is trying to make its mistakes as small as it can. We measure those mistakes with a single
          number called the <b>loss</b>, where a lower loss means the model is doing better.
        </p>
        <p>
          You can picture the loss as a landscape with hills and valleys. Every spot on the map is one possible version of
          the model, and the height at that spot is how wrong that version is. Learning means finding the lowest point on
          the map, which is where the flag is in this game.
        </p>
      </Section>

      <Section title="Gradient descent is walking downhill">
        <p>
          The model can't see the whole map. All it can tell is which direction is downhill from where it is standing right
          now, and that direction is called the <b>gradient</b>. So it takes a step downhill, checks the slope again, and
          keeps repeating that until it stops moving.
        </p>
        <p>In the game the ball is the model, and every step it takes counts as one stroke.</p>
      </Section>

      <Section title="The learning rate is the size of each step">
        <p>
          The <b>learning rate</b> controls how far the ball moves on each step, and most of the game comes down to choosing
          it well.
        </p>
        <div className="flex gap-3 rounded-xl border border-border bg-card/50 p-3">
          <Valley steps={[-0.95, -0.85, -0.76, -0.68, -0.61]} label="Too small, so it barely moves" />
          <Valley steps={[-0.95, -0.38, -0.15, -0.06, 0]} label="About right" />
          <Valley steps={[-0.6, 0.72, -0.85, 1.0]} label="Too big, so it overshoots" />
        </div>
        <p>
          If the steps are too small, the ball runs out of strokes before it gets anywhere. If they are too big, the ball
          jumps past the bottom and bounces back and forth, and it can even fly off the map.
        </p>
      </Section>

      <Section title="The three optimizers">
        <p>An <b>optimizer</b> is the rule for turning the slope into a step. The game has the three most common ones.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card title="SGD">
            The plain version. It steps straight downhill every time, and the step is bigger where the slope is steeper. It
            is simple, but it zigzags in narrow valleys and it stops in the first dip it finds.
          </Card>
          <Card title="Momentum">
            This one remembers which way it has been moving, like a heavy ball that builds up speed. That smooths out the
            zigzags and lets it roll through small dips. The β slider sets how much of its speed it keeps.
          </Card>
          <Card title="Adam">
            Adam keeps the momentum and also adjusts the step size separately for each direction, so it takes bigger steps
            where the ground is flat and smaller ones where it is steep. That helps a lot in long, curved valleys.
          </Card>
        </div>
        <p className="text-sm text-muted-foreground">
          (The S in SGD stands for stochastic, since in real training each step uses a random sample of the data. There is
          no randomness in this game, so the same settings always give you the same shot.)
        </p>
      </Section>

      <Section title="How to play">
        <p>
          Pick a hole, choose an optimizer, set the learning rate, and press Swing. Par is the number of steps a good set of
          choices should take, so fewer steps is better. Each hole is shaped to show off a different problem, and there is
          a hint next to the map if you get stuck.
        </p>
      </Section>
    </Guide>
  )
}

/* ---------- Spot the Confounder ---------- */

type MiniNode = { id: string; label: string; x: number; y: number; hot?: boolean }
function MiniDag({ nodes, edges, label }: { nodes: MiniNode[]; edges: [string, string][]; label: string }) {
  const by = Object.fromEntries(nodes.map((n) => [n.id, n]))
  return (
    <svg viewBox="0 0 160 84" className="w-full max-w-[220px]" role="img" aria-label={label}>
      <defs>
        <marker id="mini-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
        </marker>
      </defs>
      {edges.map(([a, b]) => {
        const A = by[a]
        const B = by[b]
        const dx = B.x - A.x
        const dy = B.y - A.y
        const len = Math.hypot(dx, dy)
        return <line key={a + b} x1={A.x + (dx / len) * 15} y1={A.y + (dy / len) * 15} x2={B.x - (dx / len) * 17} y2={B.y - (dy / len) * 17} stroke="var(--muted-foreground)" strokeWidth="1.5" markerEnd="url(#mini-arrow)" />
      })}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="13" fill={n.hot ? 'color-mix(in srgb, var(--primary) 22%, var(--background))' : 'var(--background)'} stroke={n.hot ? 'var(--primary)' : 'var(--border)'} strokeWidth="1.5" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--foreground)">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}

export function ConfounderGuide({ onPlay }: { onPlay: () => void }) {
  return (
    <Guide
      title="Why correlation is not causation"
      intro="This game is about figuring out whether one thing really causes another. It comes from causal inference, which is the part of statistics and economics that deals with cause and effect."
      onPlay={onPlay}
    >
      <Section title="Two things can move together without one causing the other">
        <p>
          Ice cream sales and drownings both go up at the same time of year. That doesn't mean ice cream causes drowning,
          since hot weather is behind both of them. People buy more ice cream when it's hot, and more people go swimming
          too.
        </p>
        <p>
          So if we want to know whether one thing causes another, we have to think about what else is going on around
          them. That is what the diagrams in this game are for.
        </p>
      </Section>

      <Section title="How to read the diagrams">
        <p>
          Each bubble is a variable, which is anything we can measure. An arrow from one bubble to another means the first
          one causes the second. <b>X</b> is the thing we are asking about (the treatment), and <b>Y</b> is the result we
          care about (the outcome).
        </p>
        <p>
          You will also see the phrase <b>adjusting for</b> a variable, which some people call controlling for it. It means
          only comparing cases where that variable is the same. For the ice cream example, that would mean comparing days
          that had the same temperature.
        </p>
      </Section>

      <Section title="Three kinds of variables to look for">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card
            title="Confounder"
            picture={<MiniDag label="Z causes both X and Y" nodes={[{ id: 'z', label: 'Z', x: 80, y: 18, hot: true }, { id: 'x', label: 'X', x: 26, y: 64 }, { id: 'y', label: 'Y', x: 134, y: 64 }]} edges={[['z', 'x'], ['z', 'y']]} />}
          >
            A confounder causes both X and Y, like the hot weather. It makes X and Y look connected even when they aren't,
            so this is the one you do want to adjust for.
          </Card>
          <Card
            title="Mediator"
            picture={<MiniDag label="X causes M, which causes Y" nodes={[{ id: 'x', label: 'X', x: 22, y: 42 }, { id: 'm', label: 'M', x: 80, y: 42, hot: true }, { id: 'y', label: 'Y', x: 138, y: 42 }]} edges={[['x', 'm'], ['m', 'y']]} />}
          >
            A mediator sits in between, so X causes it and it causes Y. It is part of how X works. If you adjust for it,
            you hide some of the effect you were trying to measure.
          </Card>
          <Card
            title="Collider"
            picture={<MiniDag label="X and Y both cause C" nodes={[{ id: 'x', label: 'X', x: 26, y: 20 }, { id: 'y', label: 'Y', x: 134, y: 20 }, { id: 'c', label: 'C', x: 80, y: 64, hot: true }]} edges={[['x', 'c'], ['y', 'c']]} />}
          >
            A collider is caused by both X and Y. You should leave it alone, since adjusting for it creates a connection
            between X and Y that isn't really there.
          </Card>
        </div>
        <p>
          The collider is the hardest one to believe, so here is an example. Suppose a restaurant only stays open if it has
          either good food or a good location. If you only look at restaurants that are still open, the ones in bad
          locations will mostly have good food, since otherwise they would have closed. It looks like a bad location makes
          the food better, but that pattern only shows up because of which restaurants we chose to look at.
        </p>
      </Section>

      <Section title="One more trick">
        <p>
          Sometimes the confounder is something we can't measure. In some of those cases a mediator that we can measure
          lets us work out the effect anyway. This is called the front-door criterion, and the last case in the game uses
          it.
        </p>
      </Section>

      <Section title="How to play">
        <p>
          Each case gives you a short story, a diagram, and a question. Click the bubble you think answers the question,
          and you'll get an explanation of why it was right or wrong.
        </p>
      </Section>
    </Guide>
  )
}
