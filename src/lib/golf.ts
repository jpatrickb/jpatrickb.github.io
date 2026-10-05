// Gradient Descent Golf: loss surfaces, optimizers, and the simulation. Pure functions, no DOM.
export type Vec2 = [number, number]
export type Hole = {
  name: string
  par: number
  tee: Vec2
  hint: string
  f: (x: number, y: number) => number
  // filled in by prepare()
  pin?: Vec2
  fmin?: number
  fmax?: number
}

const g = (x: number, y: number, cx: number, cy: number, s: number) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * s * s))

export const holes: Hole[] = [
  {
    name: 'The Bowl',
    par: 8,
    tee: [-0.8, 0.75],
    hint: 'A plain convex bowl. Too small a learning rate crawls; too big overshoots and diverges.',
    f: (x, y) => (x - 0.35) ** 2 + 1.4 * (y + 0.25) ** 2,
  },
  {
    name: 'The Canyon',
    par: 30,
    tee: [-0.85, -0.3],
    hint: 'Steep walls, flat floor. Plain gradient descent zig-zags. Momentum smooths it out.',
    f: (x, y) => {
      // ill-conditioned quadratic rotated 30°
      const c = Math.cos(0.52), s = Math.sin(0.52)
      const u = c * (x - 0.45) + s * (y - 0.3)
      const v = -s * (x - 0.45) + c * (y - 0.3)
      return 0.4 * u * u + 12 * v * v
    },
  },
  {
    name: 'The Trap',
    par: 25,
    tee: [-0.85, 0.7],
    hint: 'A shallow local minimum sits between you and the hole. You need enough momentum to roll through it.',
    f: (x, y) => 0.35 * ((x - 0.1) ** 2 + (y - 0.05) ** 2) - 0.55 * g(x, y, -0.4, 0.35, 0.2) - 1.0 * g(x, y, 0.55, -0.5, 0.22),
  },
  {
    name: 'The Banana',
    par: 60,
    tee: [-0.75, 0.75],
    hint: 'Rosenbrock’s curved valley. Finding it is easy; following it to the end is not. Adam adapts per coordinate.',
    f: (x, y) => {
      const X = 1.6 * x + 0.4, Y = 1.6 * y + 0.6
      return ((1 - X) ** 2 + 20 * (Y - X * X) ** 2) / 10
    },
  },
]

export function prepare(h: Hole): Required<Hole> {
  let best = Infinity, worst = -Infinity, pin: Vec2 = [0, 0]
  const N = 240
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
    const x = -1 + (2 * i) / N, y = -1 + (2 * j) / N
    const v = h.f(x, y)
    if (v < best) { best = v; pin = [x, y] }
    if (v > worst) worst = v
  }
  // polish the pin with a few hundred tiny GD steps so it sits exactly at the minimum
  for (let k = 0; k < 2000; k++) {
    const gr = grad(h.f, pin)
    pin = [pin[0] - 1e-3 * gr[0], pin[1] - 1e-3 * gr[1]]
  }
  return { ...h, pin, fmin: h.f(pin[0], pin[1]), fmax: worst } as Required<Hole>
}

export function grad(f: Hole['f'], [x, y]: Vec2): Vec2 {
  const e = 1e-5
  return [(f(x + e, y) - f(x - e, y)) / (2 * e), (f(x, y + e) - f(x, y - e)) / (2 * e)]
}

export type Optimizer = 'sgd' | 'momentum' | 'adam'
export type Outcome = 'holed' | 'diverged' | 'stuck' | 'timeout'
export type Result = { path: Vec2[]; losses: number[]; outcome: Outcome; steps: number }

export const MAX_STEPS = 300
export const CUP = 0.035

export function simulate(h: Required<Hole>, opt: Optimizer, lr: number, beta: number): Result {
  let p: Vec2 = [...h.tee]
  let v: Vec2 = [0, 0]
  let m: Vec2 = [0, 0]
  let s: Vec2 = [0, 0]
  const path: Vec2[] = [p]
  const losses: number[] = [h.f(p[0], p[1]) - h.fmin]
  let still = 0
  for (let t = 1; t <= MAX_STEPS; t++) {
    const gr = grad(h.f, p)
    let step: Vec2
    if (opt === 'sgd') step = [lr * gr[0], lr * gr[1]]
    else if (opt === 'momentum') {
      v = [beta * v[0] + gr[0], beta * v[1] + gr[1]]
      step = [lr * v[0], lr * v[1]]
    } else {
      const b2 = 0.999
      m = [beta * m[0] + (1 - beta) * gr[0], beta * m[1] + (1 - beta) * gr[1]]
      s = [b2 * s[0] + (1 - b2) * gr[0] ** 2, b2 * s[1] + (1 - b2) * gr[1] ** 2]
      const mh = [m[0] / (1 - beta ** t), m[1] / (1 - beta ** t)]
      const sh = [s[0] / (1 - b2 ** t), s[1] / (1 - b2 ** t)]
      step = [(lr * mh[0]) / (Math.sqrt(sh[0]) + 1e-8), (lr * mh[1]) / (Math.sqrt(sh[1]) + 1e-8)]
    }
    p = [p[0] - step[0], p[1] - step[1]]
    path.push(p)
    const loss = h.f(p[0], p[1]) - h.fmin
    losses.push(loss)
    if (!Number.isFinite(loss) || Math.abs(p[0]) > 2.5 || Math.abs(p[1]) > 2.5) return { path, losses, outcome: 'diverged', steps: t }
    if (Math.hypot(p[0] - h.pin[0], p[1] - h.pin[1]) < CUP) return { path, losses, outcome: 'holed', steps: t }
    still = Math.hypot(step[0], step[1]) < 2e-4 ? still + 1 : 0
    if (still > 12) return { path, losses, outcome: 'stuck', steps: t }
  }
  return { path, losses, outcome: 'timeout', steps: MAX_STEPS }
}

export function scoreName(steps: number, par: number) {
  const r = steps / par
  if (r <= 0.5) return 'Eagle'
  if (r <= 0.8) return 'Birdie'
  if (r <= 1) return 'Par'
  if (r <= 1.5) return 'Bogey'
  return 'Double bogey'
}
