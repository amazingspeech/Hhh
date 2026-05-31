import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Moon, Maximize2, Wind, Car, Home, Building2, Building, Mountain, Flame, Circle, Info } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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

function grootteVergelijking(m: number): { label: string; Icon: LucideIcon } {
  if (m < 5)   return { label: 'Zo groot als een bal',     Icon: Circle    }
  if (m < 15)  return { label: 'Zo groot als een auto',    Icon: Car       }
  if (m < 40)  return { label: 'Zo groot als een huis',    Icon: Home      }
  if (m < 100) return { label: 'Zo groot als een flat',    Icon: Building2 }
  if (m < 300) return { label: 'Zo groot als een stadion', Icon: Building  }
  if (m < 600) return { label: 'Zo groot als een berg',    Icon: Mountain  }
  return               { label: 'Groter dan een berg!',    Icon: Flame     }
}

export default function AsteroidRadar() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [loading, setLoading] = useState(true)
  const [gevaarOnly, setGevaarOnly] = useState(false)

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

  const visible = gevaarOnly ? asteroids.filter(a => a.is_potentially_hazardous_asteroid) : asteroids

  return (
    <section id="asteroids" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 flex flex-col md:flex-row md:items-end gap-4 justify-between"
        >
          <div>
            <h2 className="section-title">Ruimterotsen</h2>
            <p className="text-gray-400 mt-2 font-semibold">
              Deze rotsblokken vliegen deze week langs de aarde!
            </p>
          </div>
          <button
            onClick={() => setGevaarOnly(!gevaarOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all ${
              gevaarOnly
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'glass-card text-gray-400 hover:text-white'
            }`}
          >
            <AlertTriangle size={14} />
            {gevaarOnly ? 'Toon alle' : 'Alleen gevaarlijk'}
          </button>
        </motion.div>

        <div className="mb-6 p-4 rounded-3xl bg-purple-500/15 border-2 border-purple-500/30 flex items-start gap-3">
          <Info size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-purple-200 font-bold text-sm">
            Asteroïden zijn grote rotsblokken die door het heelal zweven. De meeste vliegen veilig langs — NASA houdt ze allemaal in de gaten!
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
              const { label, Icon: SizeIcon } = grootteVergelijking(diam)
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
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <SizeIcon size={28} className={gevaarlijk ? 'text-red-400 flex-shrink-0' : 'text-gray-400 flex-shrink-0'} />
                    <div className="min-w-0">
                      <div className="font-black text-white truncate text-sm">
                        {ast.name.replace(/[()]/g, '').trim()}
                      </div>
                      <div className={`flex items-center gap-1 font-bold text-xs mt-0.5 ${gevaarlijk ? 'text-red-400' : 'text-green-400'}`}>
                        {gevaarlijk
                          ? <><AlertTriangle size={11} /> NASA houdt dit goed in de gaten</>
                          : <><CheckCircle size={11} /> Vliegt veilig langs</>
                        }
                      </div>
                      <div className="text-amber-300 font-bold text-xs mt-1">{label}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center flex-shrink-0">
                    <MiniStat Icon={Moon}      label="Maanafstand" value={`${moonDist}×`} />
                    <MiniStat Icon={Maximize2} label="Grootte"     value={`${diam}m`} />
                    <MiniStat Icon={Wind}      label="Snelheid"    value={`${(vel / 1000).toFixed(0)}k km/u`} />
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

function MiniStat({ Icon, label, value }: { Icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-2xl p-2 flex flex-col items-center gap-1">
      <Icon size={14} className="text-amber-400" />
      <div className="font-black text-white text-xs">{value}</div>
      <div className="text-gray-500 text-xs font-bold">{label}</div>
    </div>
  )
}
