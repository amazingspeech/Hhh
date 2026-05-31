import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Mascotte from './Mascotte'

const NAV = [
  { id: 'apod', label: '📸 Dagfoto' },
  { id: 'planeten', label: '🪐 Planeten' },
  { id: 'iss', label: '🛰 Ruimtestation' },
  { id: 'mars', label: '🔴 Mars' },
  { id: 'asteroids', label: '☄️ Ruimterotsen' },
  { id: 'weetjes', label: '💡 Weetjes' },
  { id: 'launches', label: '🚀 Raketten' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 group"
        >
          <Mascotte size={38} animated={false} className="group-hover:animate-wiggle" />
          <div className="flex flex-col leading-none">
            <span className="font-black text-lg tracking-tight text-white">STERRENSLIM</span>
            <span className="text-[10px] text-amber-400 font-bold tracking-widest">RUIMTE EXPLORER</span>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-200"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 grid grid-cols-2 gap-2">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-3 py-2 rounded-xl text-sm font-bold text-gray-300 hover:text-amber-400 hover:bg-amber-400/10 transition-all text-left"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </motion.nav>
  )
}
