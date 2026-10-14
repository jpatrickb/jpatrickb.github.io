import { describe, expect, it } from 'vitest'
import { grad, holes, prepare, scoreName, simulate } from './golf'

const prepared = holes.map(prepare)
const hole = (name: string) => prepared.find((h) => h.name === name)!

describe('grad', () => {
  it('is accurate on a cubic, where a coarse step would show', () => {
    const [gx, gy] = grad((x, y) => x ** 3 + y ** 3, [2, -1])
    expect(gx).toBeCloseTo(12, 4)
    expect(gy).toBeCloseTo(3, 4)
  })

  it('matches the analytic gradient of a quadratic', () => {
    const [gx, gy] = grad((x, y) => x * x + 3 * y * y, [2, -1])
    expect(gx).toBeCloseTo(4, 4)
    expect(gy).toBeCloseTo(-6, 4)
  })
})

describe('prepare', () => {
  it('places the pin at the minimum of the surface', () => {
    for (const h of prepared) {
      expect(h.f(...h.pin)).toBeCloseTo(h.fmin, 10)
      expect(h.fmax).toBeGreaterThan(h.fmin)
    }
  })

  it('puts the bowl pin at its analytic minimum', () => {
    const [x, y] = hole('The Bowl').pin
    expect(x).toBeCloseTo(0.35, 2)
    expect(y).toBeCloseTo(-0.25, 2)
  })
})

describe('simulate', () => {
  it('holes out on the bowl with a sensible learning rate', () => {
    const r = simulate(hole('The Bowl'), 'sgd', 0.3, 0)
    expect(r.outcome).toBe('holed')
    expect(r.steps).toBeLessThanOrEqual(8)
  })

  it('diverges on the bowl when the learning rate is too large', () => {
    expect(simulate(hole('The Bowl'), 'sgd', 1.5, 0).outcome).toBe('diverged')
  })

  it('does not hole out with a tiny learning rate within the step budget', () => {
    expect(simulate(hole('The Bowl'), 'sgd', 0.001, 0).outcome).not.toBe('holed')
  })

  it('records one loss per path point, starting at the tee', () => {
    const h = hole('The Canyon')
    const r = simulate(h, 'momentum', 0.01, 0.9)
    expect(r.path).toHaveLength(r.losses.length)
    expect(r.path[0]).toEqual(h.tee)
  })

  it('is deterministic', () => {
    const h = hole('The Banana')
    expect(simulate(h, 'adam', 0.05, 0.9)).toEqual(simulate(h, 'adam', 0.05, 0.9))
  })
})

describe('scoreName', () => {
  it.each([
    [4, 8, 'Eagle'],
    [6, 8, 'Birdie'],
    [8, 8, 'Par'],
    [12, 8, 'Bogey'],
    [13, 8, 'Double bogey'],
  ])('%i steps on a par %i is a %s', (steps, par, name) => {
    expect(scoreName(steps, par)).toBe(name)
  })
})
