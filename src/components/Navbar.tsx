import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NAV = [
  { id: 'apod', label: 'Dagfoto' },
  { id: 'iss', label: 'ISS' },
  { id: 'mars', label: 'Mars' },
  { id: 'asteroids', label: 'Asteroïden' },
  { id: 'news', label: 'Nieuws' },
  { id: 'launches', label: 'Lanceringen' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const current = NAV.find(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= 120 && rect.bottom >= 120
      })
      setActive(current?.id ?? '')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/70 backdrop-blur-xl border-b border-white/8' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5">
          <span className="text-xl">🌌</span>
          <span className="font-mono font-bold text-lg tracking-[0.2em] text-white">
            COSMOS
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                active === id
                  ? 'bg-cyan-500/15 text-cyan-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
