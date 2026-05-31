import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NASA_KEY = import.meta.env.VITE_NASA_API_KEY ?? 'DEMO_KEY'

interface CloseApproach {
  close_approach_date: string
  miss_distance: { kilometers: string; lunar: string }
  relative_velocity: { kilometers_per_hour: string }
}

interface Asteroid {
  id: string
  name: string
  is_potentially_hazardous_asteroid: boolean
  estimated_diameter: {
    meters: { estimated_diameter_min: number; estimated_diameter_max: number }
  }
  close_approach_data: CloseApproach[]
}

function grootteVergelijking(m: number): { label: string; emoji: string } {
  if (m < 5) return { label: 'Zo groot als een bal', emoji: '⚽' }
  if (m < 15) return { label: 'Zo groot als een auto', emoji: '🚗' }
  if (m < 40) return { label: 'Zo groot als een huis', emoji: '🏠' }
  if (m < 100) return { label: 'Zo groot als een flat', emoji: '🏢' }
  if (m < 300) return { label: 'Zo groot als een stadion', emoji: '🏟' }
  if (m < 600) return { label: 'Zo groot als een berg', emoji: '⛰' }
  return { label: 'Gigantisch — groter dan een berg!', emoji: '🌋' }
}

export default function AsteroidRadar() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const end = new Date(Date.now() + 7 * 86_400_000).toISOString().split('T')[0]
        const res = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${end}&api_key=${NASA_KEY}`
        )
        const data = await res.json()
        const raw = data.near_earth_objects as Record<string, Asteroid[]>
        const all = Object.values(raw || {}).flat()
        const sorted = all.sort((a, b) => {
          const da = parseFloat(a.close_approach_data[0]?.miss_distance.kilometers ?? '999999999')
          const db = parseFloat(b.close_approach_data[0]?.miss_distance.kilometers ?? '999999999')
          return da - db
        })
        setAsteroids(sorted.slice(0, 8))
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    fetchAsteroids()
  }, [])

  return (
    <section id="asteroids" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="section-title">☄️ Ruimterotsen</h2>
          <p className="text-gray-400 mt-2 font-semibold">
            Deze rotsblokken vliegen deze week langs de aarde!
          </p>
        </motion.div>

        {/* Uitleg banner */}
        <div className="mb-6 p-4 rounded-3xl bg-purple-500/15 border-2 border-purple-500/30">
          <p className="text-purple-200 font-bold text-sm">
            🪨 Asteroïden zijn grote rotsblokken die door het heelal zweven. De meeste vliegen veilig langs — NASA houdt ze allemaal in de gaten!
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {asteroids.map((ast, i) => {
              const ca = ast.close_approach_data[0]
              if (!ca) return null
              const km = parseFloat(ca.miss_distance.kilometers)
              const lunar = parseFloat(ca.miss_distance.lunar).toFixed(1)
              const vel = Math.round(parseFloat(ca.relative_velocity.kilometers_per_hour))
              const diam = Math.round(
                (ast.estimated_diameter.meters.estimated_diameter_min +
                  ast.estimated_diameter.meters.estimated_diameter_max) / 2
              )
              const { label, emoji } = grootteVergelijking(diam)
              const gevaarlijk = ast.is_potentially_hazardous_asteroid
              const moonDist = (km / 384_400).toFixed(1)

              return (
                <motion.div
                  key={ast.id}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`fun-card p-4 flex flex-col md:flex-row md:items-center gap-4 ${
                    gevaarlijk ? 'border-red-400/40 bg-red-500/5' : 'border-white/10'
                  }`}
                >
                  {/* Size visual */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-3xl">{emoji}</div>
                    <div className="min-w-0">
                      <div className="font-black text-white truncate text-sm">
                        {ast.name.replace(/[()]/g, '').trim()}
                      </div>
                      <div className="font-bold text-xs mt-0.5" style={{ color: gevaarlijk ? '#f87171' : '#4ade80' }}>
                        {gevaarlijk ? '⚠️ NASA houdt dit goed in de gaten' : '✅ Vliegt veilig langs'}
                      </div>
                      <div className="text-amber-300 font-bold text-xs mt-1">{label}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center flex-shrink-0">
                    <MiniStat emoji="🌙" label="Maanafstand" value={`${moonDist}×`} />
                    <MiniStat emoji="📏" label="Grootte" value={`${diam}m`} />
                    <MiniStat emoji="💨" label="Snelheid" value={`${(vel / 1000).toFixed(0)}k km/u`} />
                  </div>

                  <div className="text-right flex-shrink-0 hidden md:block">
                    <div className="text-white font-black text-sm">{ca.close_approach_date}</div>
                    <div className="text-gray-500 text-xs font-bold">{lunar} maanafstanden</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function MiniStat({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-2xl p-2">
      <div className="text-lg">{emoji}</div>
      <div className="font-black text-white text-xs">{value}</div>
      <div className="text-gray-500 text-xs font-bold">{label}</div>
    </div>
  )
}
