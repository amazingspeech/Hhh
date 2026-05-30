import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ExternalLink, Calendar, Info } from 'lucide-react'

const NASA_KEY = import.meta.env.VITE_NASA_API_KEY ?? 'DEMO_KEY'

interface APOD {
  title: string
  date: string
  explanation: string
  url: string
  hdurl?: string
  media_type: string
  copyright?: string
}

export default function APODSection() {
  const [apod, setApod] = useState<APOD | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const fetchAPOD = async () => {
      setLoading(true)
      setImgLoaded(false)
      try {
        const dateParam = selectedDate ? `&date=${selectedDate}` : ''
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}${dateParam}`
        )
        const data: APOD = await res.json()
        setApod(data)
      } catch {
        // silently handle
      } finally {
        setLoading(false)
      }
    }
    fetchAPOD()
  }, [selectedDate])

  const bgImage = apod?.media_type === 'image' ? apod.url : ''

  return (
    <section id="apod" className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background image */}
      <AnimatePresence>
        {bgImage && (
          <motion.div
            key={bgImage}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: imgLoaded ? 1 : 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <img
              src={bgImage}
              alt=""
              className="hidden"
              onLoad={() => setImgLoaded(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/60 via-transparent to-transparent" />

      {/* Top controls */}
      <div className="absolute top-20 left-6 right-6 z-10 flex justify-between items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-xs font-mono"
        >
          <span className="live-dot" />
          <span className="text-green-400 tracking-widest">NASA APOD</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm"
        >
          <Calendar size={13} className="text-cyan-400" />
          <input
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            min="1995-06-16"
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
          />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-6 md:p-14 max-w-5xl mb-16">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-3 bg-white/10 rounded w-28" />
            <div className="h-12 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/10 rounded w-48" />
          </div>
        ) : apod ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-cyan-400 font-mono text-xs mb-3 tracking-widest uppercase">
              {apod.date}
              {apod.copyright && <span className="text-gray-400"> · © {apod.copyright}</span>}
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl mb-5">
              {apod.title}
            </h1>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-3 transition-colors group"
            >
              <Info size={14} className="text-cyan-400" />
              {showExplanation ? 'Verberg uitleg' : 'Lees uitleg'}
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${showExplanation ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mb-5 p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10">
                    {apod.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {apod.hdurl && (
              <a
                href={apod.hdurl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-sm font-medium transition-all duration-200"
              >
                Bekijk in HD <ExternalLink size={13} />
              </a>
            )}
          </motion.div>
        ) : null}
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 z-10"
      >
        <ChevronDown size={30} />
      </motion.div>
    </section>
  )
}
