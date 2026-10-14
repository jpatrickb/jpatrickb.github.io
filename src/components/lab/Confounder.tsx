import { useState } from 'react'
import { cn } from '@/lib/utils'

type Node = { id: string; label: string; x: number; y: number; hidden?: boolean }
type Scenario = {
  title: string
  setup: string
  ask: string
  nodes: Node[]
  edges: [string, string][]
  treatment: string
  outcome: string
  answer: string
  why: string
  kind: 'confounder' | 'collider' | 'mediator' | 'front-door'
}

const scenarios: Scenario[] = [
  {
    title: 'Ice cream and drownings',
    setup: 'Cities with higher ice cream sales have more drownings.',
    ask: 'Which variable do you need to adjust for to estimate the effect of ice cream on drownings?',
    nodes: [
      { id: 'temp', label: 'Temperature', x: 50, y: 18 },
      { id: 'ice', label: 'Ice cream sales', x: 18, y: 72 },
      { id: 'drown', label: 'Drownings', x: 82, y: 72 },
      { id: 'lifeguards', label: 'Lifeguards on duty', x: 82, y: 22 },
    ],
    edges: [['temp', 'ice'], ['temp', 'drown'], ['lifeguards', 'drown']],
    treatment: 'ice', outcome: 'drown', answer: 'temp', kind: 'confounder',
    why: 'Temperature causes both, since hot days sell more ice cream and also send more people swimming. Adjusting for it closes the backdoor path ice ← temp → drownings, and the association disappears. Lifeguards only affect the outcome, so adjusting for them is harmless but unnecessary.',
  },
  {
    title: 'Football wins and applications',
    setup: 'Universities with winning football seasons receive more applications the next year.',
    ask: 'Which variable confounds the effect of winning on applications?',
    nodes: [
      { id: 'budget', label: 'Athletics budget', x: 50, y: 16 },
      { id: 'wins', label: 'Win rate', x: 18, y: 70 },
      { id: 'apps', label: 'Applications', x: 82, y: 70 },
      { id: 'media', label: 'TV coverage', x: 50, y: 88 },
    ],
    edges: [['budget', 'wins'], ['budget', 'apps'], ['wins', 'media'], ['media', 'apps']],
    treatment: 'wins', outcome: 'apps', answer: 'budget', kind: 'confounder',
    why: 'A big athletics budget buys wins and also signals a large, well-funded school that attracts applicants on its own. TV coverage is a mediator, since it is part of how winning brings in applications, so you should not adjust for it. (This is the question my team looked at for our case competition project.)',
  },
  {
    title: 'Talent and looks in Hollywood',
    setup: 'Among working actors, the more attractive ones seem to be less talented.',
    ask: 'Conditioning on which variable creates this fake negative correlation?',
    nodes: [
      { id: 'talent', label: 'Talent', x: 18, y: 25 },
      { id: 'looks', label: 'Looks', x: 82, y: 25 },
      { id: 'cast', label: 'Gets cast', x: 50, y: 78 },
      { id: 'training', label: 'Acting classes', x: 18, y: 85 },
    ],
    edges: [['talent', 'cast'], ['looks', 'cast'], ['training', 'talent']],
    treatment: 'talent', outcome: 'looks', answer: 'cast', kind: 'collider',
    why: 'Getting cast is a collider, since both talent and looks cause it. Looking only at actors who were cast means anyone with less of one trait must have more of the other, which induces a correlation that does not exist in the population. This is why you should not adjust for a collider.',
  },
  {
    title: 'Job training and earnings',
    setup: 'A job-training program raises participants’ earnings, partly by teaching skills.',
    ask: 'Adjusting for which variable would hide part of the effect you want to measure?',
    nodes: [
      { id: 'train', label: 'Training', x: 15, y: 50 },
      { id: 'skills', label: 'Skills', x: 50, y: 22 },
      { id: 'earn', label: 'Earnings', x: 85, y: 50 },
      { id: 'region', label: 'Local economy', x: 72, y: 88 },
    ],
    edges: [['train', 'skills'], ['skills', 'earn'], ['train', 'earn'], ['region', 'earn']],
    treatment: 'train', outcome: 'earn', answer: 'skills', kind: 'mediator',
    why: 'Skills are a mediator on the causal path training → skills → earnings. Controlling for them removes the part of the effect that works through skills, so you’d underestimate the program. The local economy only affects earnings and can be adjusted for to reduce noise.',
  },
  {
    title: 'Smoking, tar, and cancer',
    setup: 'An unobserved genotype might cause both smoking and lung cancer, so you can’t adjust for it directly.',
    ask: 'Which observed variable still lets you identify the effect of smoking on cancer?',
    nodes: [
      { id: 'gene', label: 'Genotype (unobserved)', x: 50, y: 14, hidden: true },
      { id: 'smoke', label: 'Smoking', x: 15, y: 70 },
      { id: 'tar', label: 'Tar in lungs', x: 50, y: 70 },
      { id: 'cancer', label: 'Cancer', x: 85, y: 70 },
    ],
    edges: [['gene', 'smoke'], ['gene', 'cancer'], ['smoke', 'tar'], ['tar', 'cancer']],
    treatment: 'smoke', outcome: 'cancer', answer: 'tar', kind: 'front-door',
    why: 'Tar satisfies Pearl’s front-door criterion. Smoking affects cancer only through tar, nothing unobserved points into tar, and the backdoor from tar to cancer is blocked by smoking. Chaining smoking → tar with tar → cancer recovers the causal effect without measuring the genotype.',
  },
]

export default function Confounder({ onLearn }: { onLearn?: () => void }) {
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<string | null>(null)
  const [score, setScore] = useState<boolean[]>([])
  const s = scenarios[i]
  const answered = pick !== null
  const correct = pick === s.answer
  const byId = Object.fromEntries(s.nodes.map((n) => [n.id, n]))

  const choose = (id: string) => {
    if (answered || id === s.treatment || id === s.outcome) return
    setPick(id)
    setScore((sc) => { const n = [...sc]; n[i] = id === s.answer; return n })
  }
  const next = () => { setI((i + 1) % scenarios.length); setPick(null) }

  return (
    <div className="flex h-full flex-col gap-3 p-4 text-sm">
      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span>case {i + 1}/{scenarios.length} · {s.title}</span>
        <span className="flex gap-1" aria-label="Score">
          {scenarios.map((_, j) => (
            <span key={j} className={cn('size-2 rounded-full', score[j] === true ? 'bg-good' : score[j] === false ? 'bg-bad' : 'bg-border')} />
          ))}
        </span>
      </div>
      <div>
        <p>{s.setup}</p>
        <p className="mt-1 font-medium">{s.ask}</p>
      </div>

      <div className="relative min-h-[220px] flex-1 rounded-lg border border-border bg-card/40">
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>
          {s.edges.map(([a, b]) => {
            const A = byId[a], B = byId[b]
            // shorten the line so arrowheads stop at the node edge
            const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy)
            const sx = A.x + (dx / len) * 9, sy = A.y + (dy / len) * 9
            const ex = B.x - (dx / len) * 11, ey = B.y - (dy / len) * 11
            return <line key={a + b} x1={`${sx}%`} y1={`${sy}%`} x2={`${ex}%`} y2={`${ey}%`} stroke="var(--muted-foreground)" strokeWidth="1.5" strokeDasharray={A.hidden ? '4 4' : undefined} markerEnd="url(#arrow)" />
          })}
        </svg>
        {s.nodes.map((n) => {
          const role = n.id === s.treatment ? 'treatment' : n.id === s.outcome ? 'outcome' : null
          const isAnswer = answered && n.id === s.answer
          const isWrong = answered && n.id === pick && !correct
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => choose(n.id)}
              disabled={!!role || answered}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border bg-background px-3 py-1.5 text-xs transition-colors',
                role ? 'border-primary text-primary' : 'border-border hover:border-foreground',
                n.hidden && 'border-dashed text-muted-foreground',
                isAnswer && 'border-good bg-good/15 text-foreground',
                isWrong && 'border-bad bg-bad/15',
                !role && !answered && 'cursor-pointer',
              )}
            >
              {n.label}
              {role && <span className="ml-1.5 font-mono text-[10px] opacity-70">{role === 'treatment' ? 'X' : 'Y'}</span>}
            </button>
          )
        })}
      </div>

      {answered ? (
        <div className="rounded-md border border-border p-3" aria-live="polite">
          <p className={cn('font-medium', correct ? 'text-good' : 'text-bad')}>
            {correct ? 'Correct' : `Not quite. The answer is ${byId[s.answer].label}`} <span className="font-mono text-xs text-muted-foreground">· {s.kind}</span>
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{s.why}</p>
          <button type="button" onClick={next} className="mt-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
            {i === scenarios.length - 1 ? 'Start over' : 'Next case →'}
          </button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Click a bubble to answer. X is the treatment and Y is the outcome, and a dashed bubble is something we can't measure.{' '}
          {onLearn && <button type="button" onClick={onLearn} className="link">What do these words mean?</button>}
        </p>
      )}
    </div>
  )
}
