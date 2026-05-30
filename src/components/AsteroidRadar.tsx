import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Maximize2 } from 'lucide-react'

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

function sizeLabel(m: number): string {
  if (m < 20) return 'Auto'
  if (m < 100) return 'Huis'
  if (m < 300) return 'Vliegtuig'
  if (m < 600) return 'Wolkenkrabber'
  return 'Berg'
}

export default function AsteroidRadar() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [loading, setLoading] = useState(true)
  const [hazardOnly, setHazardOnly] = useState(false)

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
        setAsteroids(sorted.slice(0, 12))
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchAsteroids()
  }, [])

  const visible = hazardOnly
    ? asteroids.filter(a => a.is_potentially_hazardous_asteroid)
    : asteroids

  return (
    <section id="asteroids" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col md:flex-row md:items-end gap-4 justify-between"
        >
          <div>
            <h2 className="section-title">☄️ Asteroïde Radar</h2>
            <p className="text-gray-400 mt-2 text-sm">
              Objecten die deze week langs de aarde vliegen — gesorteerd op dichtstbijzijnde passage
            </p>
          </div>
          <button
            onClick={() => setHazardOnly(!hazardOnly)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${
              hazardOnly
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'glass-card text-gray-400 hover:text-white'
            }`}
          >
            <AlertTriangle size={13} />
            {hazardOnly ? 'Toon alle' : 'Alleen gevaarlijk'}
          </button>
        </motion.div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((ast, i) => {
              const ca = ast.close_approach_data[0]
              if (!ca) return null
              const km = parseFloat(ca.miss_distance.kilometers)
              const lunar = parseFloat(ca.miss_distance.lunar).toFixed(1)
              const vel = Math.round(parseFloat(ca.relative_velocity.kilometers_per_hour))
              const diam = Math.round(
                (ast.estimated_diameter.meters.estimated_diameter_min +
                  ast.estimated_diameter.meters.estimated_diameter_max) / 2
              )
              const hazard = ast.is_potentially_hazardous_asteroid
              const moonDist = (km / 384_400).toFixed(1)

              return (
                <motion.div
                  key={ast.id}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 glass-card ${
                    hazard ? 'border-red-500/25' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {hazard ? (
                      <AlertTriangle size={20} className="text-red-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-mono font-bold text-white truncate text-sm">
                        {ast.name.replace(/[()]/g, '').trim()}
                      </div>
                      <div className={`text-xs mt-0.5 ${hazard ? 'text-red-400' : 'text-green-500'}`}>
                        {hazard ? '⚠ Potentieel gevaarlijk' : '✓ Veilige passage'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-amber-400 font-mono font-bold text-sm">{moonDist}×</div>
                      <div className="text-gray-500 text-xs">Maanafstand</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-mono font-bold text-sm">{lunar} LD</div>
                      <div className="text-gray-500 text-xs">Lunar Dist.</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-0.5">
                        <Maximize2 size={10} className="text-cyan-400" />
                        <span className="text-cyan-400 font-mono font-bold text-sm">{diam}m</span>
                      </div>
                      <div className="text-gray-500 text-xs">{sizeLabel(diam)}</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-mono font-bold text-sm">
                        {(vel / 1000).toFixed(0)}k
                      </div>
                      <div className="text-gray-500 text-xs">km/uur</div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-white text-sm font-medium">{ca.close_approach_date}</div>
                    <div className="text-gray-500 text-xs">dichtstbijzijnde punt</div>
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
