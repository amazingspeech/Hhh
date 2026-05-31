import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Search } from 'lucide-react'

const NASA_KEY = import.meta.env.VITE_NASA_API_KEY ?? 'DEMO_KEY'

interface MarsPhoto {
  id: number
  img_src: string
  earth_date: string
  sol: number
  camera: { name: string; full_name: string }
  rover: { name: string }
}

const CAMERAS = ['ALL', 'FHAZ', 'RHAZ', 'MAST', 'NAVCAM']
const ONTDEK_PROMPTS = [
  'Zie jij een steen?',
  'Vind je een schaduw!',
  'Zoek het spoor van de rover',
  'Zie je het stof?',
  'Vind de horizon!',
]

export default function MarsGallery() {
  const [photos, setPhotos] = useState<MarsPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [camera, setCamera] = useState('ALL')
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true)
      try {
        const camParam = camera !== 'ALL' ? `&camera=${camera.toLowerCase()}` : ''
        const res = await fetch(
          `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${NASA_KEY}${camParam}`
        )
        const data = await res.json()
        setPhotos(((data.latest_photos as MarsPhoto[]) || []).slice(0, 12))
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    fetchPhotos()
  }, [camera])

  const filtered = camera === 'ALL' ? photos : photos.filter(p => p.camera.name === camera)

  const closeLightbox = useCallback(() => setLightbox(null), [])
  const prev = useCallback(() => setLightbox(i => (i !== null ? Math.max(0, i - 1) : null)), [])
  const next = useCallback(() => setLightbox(i => (i !== null ? Math.min(filtered.length - 1, i + 1) : null)), [filtered.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeLightbox, prev, next])

  return (
    <section id="mars" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="section-title">🔴 Foto's van Mars</h2>
          <p className="text-gray-400 mt-2 font-semibold">
            Echte foto's gemaakt door de Curiosity Rover — een robotauto op Mars!
          </p>
        </motion.div>

        {/* Fun Mars fact */}
        <div className="mb-6 p-4 rounded-3xl bg-red-500/15 border-2 border-red-500/30">
          <p className="text-red-200 font-bold text-sm">
            🤖 Curiosity rijdt al meer dan 10 jaar rond op Mars en stuurt elke dag nieuwe foto's naar de aarde. Het duurt 20 minuten voordat een foto hier aankomt!
          </p>
        </div>

        {/* Camera filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CAMERAS.map(cam => (
            <button
              key={cam}
              onClick={() => setCamera(cam)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all duration-200 border-2 ${
                camera === cam
                  ? 'bg-red-500/25 border-red-500/60 text-red-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
              }`}
            >
              {cam === 'ALL' ? '📷 Alle camera\'s' : `📷 ${cam}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-20 text-gray-500 font-bold">Geen foto's voor deze camera 🤔</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((photo, i) => {
              const prompt = ONTDEK_PROMPTS[i % ONTDEK_PROMPTS.length]
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setLightbox(i)}
                  className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer group"
                >
                  <img
                    src={photo.img_src}
                    alt={`Mars ${photo.camera.name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-3">
                    <Search size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-white text-xs font-black text-center opacity-0 group-hover:opacity-100 transition-opacity leading-tight">
                      🔍 {prompt}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="text-xs bg-red-500/80 text-white px-2 py-0.5 rounded-full font-bold">
                      Sol {photo.sol}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="relative max-w-3xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img src={filtered[lightbox].img_src} alt="Mars" className="w-full rounded-3xl" />
              <button onClick={closeLightbox} className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black">
                <X size={18} />
              </button>
              <button onClick={prev} disabled={lightbox === 0} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white disabled:opacity-20">
                <ChevronLeft size={22} />
              </button>
              <button onClick={next} disabled={lightbox === filtered.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white disabled:opacity-20">
                <ChevronRight size={22} />
              </button>
              <div className="mt-3 text-center p-3 rounded-2xl bg-red-500/15 border border-red-500/30">
                <p className="text-red-200 font-bold text-sm">
                  🤖 {filtered[lightbox].rover.name} · {filtered[lightbox].camera.full_name} · Sol {filtered[lightbox].sol} ({filtered[lightbox].earth_date})
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
