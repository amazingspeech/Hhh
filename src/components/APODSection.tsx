import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ExternalLink, Calendar, Sparkles, Eye, EyeOff } from 'lucide-react'
import Mascotte from './Mascotte'

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

const VRAGEN = [
  'Wat zie jij als eerste?',
  'Hoe ver weg zou dit zijn?',
  'Zou jij daar naartoe willen?',
  'Wat vind jij het mooiste aan deze foto?',
  'Hoe groot denk jij dat dit is?',
]

export default function APODSection() {
  const [apod, setApod] = useState<APOD | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [showUitleg, setShowUitleg] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [vraag] = useState(VRAGEN[Math.floor(Math.random() * VRAGEN.length)])

  useEffect(() => {
    const fetchAPOD = async () => {
      setLoading(true)
      setImgLoaded(false)
      try {
        const dateParam = selectedDate ? `&date=${selectedDate}` : ''
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}${dateParam}`)
        const data: APOD = await res.json()
        setApod(data)
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    fetchAPOD()
  }, [selectedDate])

  const bgImage = apod?.media_type === 'image' ? apod.url : ''

  return (
    <section id="apod" className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      <AnimatePresence>
        {bgImage && (
          <motion.div
            key={bgImage}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: imgLoaded ? 1 : 0, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <img src={bgImage} alt="" className="hidden" onLoad={() => setImgLoaded(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />

      <div className="absolute top-20 left-4 right-4 z-10 flex flex-wrap gap-3 justify-between items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-amber-400/30 text-xs font-bold"
        >
          <span className="live-dot" />
          <span className="text-amber-400">NASA FOTO VAN DE DAG</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15"
        >
          <Calendar size={13} className="text-amber-400" />
          <input
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            min="1995-06-16"
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
          />
        </motion.div>
      </div>

      <div className="relative z-10 p-5 md:p-12 max-w-4xl mb-12">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/10 rounded-full w-32" />
            <div className="h-14 bg-white/10 rounded-2xl w-3/4" />
          </div>
        ) : apod ? (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <p className="text-amber-400 font-mono text-xs mb-3 font-bold tracking-widest uppercase">
              {apod.date} {apod.copyright && `· © ${apod.copyright}`}
            </p>

            <h1 className="text-3xl md:text-5xl font-black leading-tight max-w-3xl mb-4">
              {apod.title}
            </h1>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400/20 border border-amber-400/40 mb-5">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-amber-300 text-sm font-bold">{vraag}</span>
            </div>

            <button
              onClick={() => setShowUitleg(!showUitleg)}
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold mb-3 transition-colors"
            >
              {showUitleg ? <EyeOff size={15} className="text-amber-400" /> : <Eye size={15} className="text-amber-400" />}
              {showUitleg ? 'Verberg uitleg' : 'Wat is dit precies?'}
              <ChevronDown size={14} className={`transition-transform duration-300 ${showUitleg ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showUitleg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-200 text-sm leading-relaxed max-w-2xl mb-5 p-4 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 text-sm font-bold transition-all"
              >
                Bekijk grote versie <ExternalLink size={13} />
              </a>
            )}
          </motion.div>
        ) : null}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', bounce: 0.5 }}
        className="absolute bottom-24 right-6 z-20 hidden md:block"
      >
        <Mascotte size={80} />
        <div className="absolute -top-10 -left-24 bg-amber-400 text-black text-xs font-black px-3 py-1.5 rounded-2xl rounded-br-none whitespace-nowrap">
          Hoi! Ik ben Slim!
        </div>
      </motion.div>

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
