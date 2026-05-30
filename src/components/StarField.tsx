import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  opacity: number
  twinkle: number
  twinkleSpeed: number
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars: Star[] = Array.from({ length: 350 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.4 + 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.012 + 0.003,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.twinkle += s.twinkleSpeed
        const o = s.opacity * (0.55 + 0.45 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 220, 255, ${o})`
        ctx.fill()
      })
      animFrame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
