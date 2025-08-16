import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { GlowFilter } from '@pixi/filter-glow'

const width = 390
const height = 500

const createPathGraphic = (path, color) => {
  const g = new PIXI.Graphics()
  g.lineStyle(4, color, 1)
  g.moveTo(path[0].x, path[0].y)
  for (let i = 1; i < path.length; i++) {
    g.lineTo(path[i].x, path[i].y)
  }
  g.filters = [new GlowFilter({ distance: 15, outerStrength: 2, color })]
  return g
}

export default function SimulationCanvas({ playTrigger, stepTrigger, resetTrigger, overrun, onComplete }) {
  const containerRef = useRef(null)
  const appRef = useRef(null)
  const ballsRef = useRef([])

  const pathsRef = useRef({})

  useEffect(() => {
    const app = new PIXI.Application({ width, height, backgroundColor: 0x1e1e1e })
    containerRef.current.appendChild(app.view)
    appRef.current = app

    // draw diagram blocks
    const g = new PIXI.Graphics()
    g.beginFill(0x333333)
    g.drawRect(20, 420, 80, 60) // carter
    g.drawRect(150, 260, 80, 60) // separator
    g.drawRect(300, 40, 70, 60) // collector
    g.drawRect(150, 40, 80, 60) // inlet
    g.drawRect(300, 420, 70, 60) // return
    g.endFill()
    app.stage.addChild(g)

    // define paths
    const blowbyPath = [
      { x: 60, y: 420 },
      { x: 190, y: 290 },
      { x: 190, y: 70 },
    ]
    const oilReturnPath = [
      { x: 60, y: 420 },
      { x: 190, y: 290 },
      { x: 335, y: 420 },
    ]
    const collectorPath = [
      { x: 60, y: 420 },
      { x: 190, y: 290 },
      { x: 335, y: 70 },
    ]

    pathsRef.current = { blowbyPath, oilReturnPath, collectorPath }

    // draw path graphics
    app.stage.addChild(createPathGraphic(blowbyPath, 0x3399ff))
    app.stage.addChild(createPathGraphic(oilReturnPath, 0xff9933))
    app.stage.addChild(createPathGraphic(collectorPath, 0xaa55ff))

    // ticker for animation
    app.ticker.add((delta) => {
      const toRemove = []
      ballsRef.current.forEach((b) => {
        b.progress += 0.005 * delta
        const p = getPointAlong(b.path, b.progress)
        b.sprite.position.set(p.x, p.y)
        if (b.progress >= 1) {
          app.stage.removeChild(b.sprite)
          toRemove.push(b)
          onComplete && onComplete(b.type, b.path === collectorPath ? 'collector' : b.path === oilReturnPath ? 'return' : 'inlet')
          if (b.path === collectorPath && b.type === 'oil') {
            showSmoke(app, p)
          }
        }
      })
      ballsRef.current = ballsRef.current.filter((b) => !toRemove.includes(b))
    })

    return () => {
      app.destroy(true, true)
    }
  }, [])

  const showSmoke = (app, pos) => {
    const smoke = new PIXI.Graphics()
    smoke.beginFill(0x9933ff, 0.5)
    smoke.drawCircle(0, 0, 20)
    smoke.endFill()
    smoke.position.set(pos.x, pos.y)
    app.stage.addChild(smoke)
    let life = 1
    app.ticker.add(function fade(delta) {
      life -= 0.01 * delta
      smoke.alpha = life
      if (life <= 0) {
        app.ticker.remove(fade)
        app.stage.removeChild(smoke)
      }
    })
  }

  const getPointAlong = (path, t) => {
    if (t <= 0) return path[0]
    if (t >= 1) return path[path.length - 1]
    const total = path.length - 1
    const idx = Math.min(Math.floor(t * total), total - 1)
    const localT = t * total - idx
    const p0 = path[idx]
    const p1 = path[idx + 1]
    return {
      x: p0.x + (p1.x - p0.x) * localT,
      y: p0.y + (p1.y - p0.y) * localT,
    }
  }

  const inject = () => {
    const { blowbyPath, oilReturnPath, collectorPath } = pathsRef.current
    addBall('blowby', 0x3399ff, blowbyPath)
    addBall('oil', 0xff9933, overrun ? collectorPath : oilReturnPath)
  }

  const addBall = (type, color, path) => {
    const sprite = new PIXI.Graphics()
    sprite.beginFill(color)
    sprite.drawCircle(0, 0, 8)
    sprite.endFill()
    const start = path[0]
    sprite.position.set(start.x, start.y)
    appRef.current.stage.addChild(sprite)
    ballsRef.current.push({ sprite, path, type, progress: 0 })
  }

  useEffect(() => {
    if (playTrigger > 0) inject()
  }, [playTrigger])

  useEffect(() => {
    if (stepTrigger > 0) inject()
  }, [stepTrigger])

  useEffect(() => {
    if (resetTrigger > 0) {
      ballsRef.current.forEach((b) => appRef.current.stage.removeChild(b.sprite))
      ballsRef.current = []
    }
  }, [resetTrigger])

  return <div ref={containerRef} className="w-full" />
}
