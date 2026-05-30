import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

const NASA_KEY = import.meta.env.VITE_NASA_API_KEY ?? 'DEMO_KEY'

interface MarsPhoto {
  id: number
  img_src: string
  earth_date: string
  sol: number
  camera: { name: string; full_name: string }
  rover: { name: string }
}

const CAMERAS = ['ALL', 'FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'NAVCAM']

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
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchPhotos()
  }, [camera])

  const filtered = camera === 'ALL' ? photos : photos.filter(p => p.camera.name === camera)

  const closeLightbox = useCallback(() => setLightbox(null), [])
  const prev = useCallback(() => setLightbox(i => (i !== null ? Math.max(0, i - 1) : null)), [])
  const next = useCallback(() =>
    setLightbox(i => (i !== null ? Math.min(filtered.length - 1, i + 1) : null)), [filtered.length])

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
          className="mb-10"
        >
          <h2 className="section-title">
            <span className="text-red-400">●</span> Mars Galerij
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Laatste foto's van de Curiosity Rover op het rode planeet
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CAMERAS.map(cam => (
            <button
              key={cam}
              onClick={() => setCamera(cam)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-200 border ${
                camera === cam
                  ? 'bg-red-500/20 border-red-500/50 text-red-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
              }`}
            >
              {cam}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-20 text-gray-500 font-mono text-sm">
            Geen foto's voor deze camera
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setLightbox(i)}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={photo.img_src}
                  alt={`Mars ${photo.camera.name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center gap-1 text-xs text-white">
                    <Camera size={9} />
                    <span>{photo.camera.name}</span>
                  </div>
                  <div className="text-xs text-gray-400">{photo.earth_date}</div>
                </div>
              </motion.div>
            ))}
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
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={filtered[lightbox].img_src}
                alt="Mars"
                className="w-full rounded-2xl shadow-2xl"
              />
              <button
                onClick={closeLightbox}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
              >
                <X size={18} />
              </button>
              <button
                onClick={prev}
                disabled={lightbox === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={next}
                disabled={lightbox === filtered.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white disabled:opacity-20 transition-all"
              >
                <ChevronRight size={22} />
              </button>
              <div className="mt-3 text-center text-xs text-gray-400 font-mono">
                {filtered[lightbox].rover.name} · {filtered[lightbox].camera.full_name} · Sol {filtered[lightbox].sol} · {filtered[lightbox].earth_date}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
