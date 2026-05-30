import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { Gauge, Navigation, ArrowUp, Satellite } from 'lucide-react'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface ISSData {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: number
}

export default function ISSTracker() {
  const [iss, setIss] = useState<ISSData | null>(null)
  const [trail, setTrail] = useState<[number, number][]>([])
  const [updated, setUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
        const data: ISSData = await res.json()
        setIss(data)
        setUpdated(new Date())
        setTrail(prev => {
          const next: [number, number][] = [...prev, [data.longitude, data.latitude]]
          return next.slice(-35)
        })
      } catch {
        // ignore network errors
      }
    }
    fetchISS()
    const interval = setInterval(fetchISS, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="iss" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="live-dot" />
            <span className="text-green-400 font-mono text-xs tracking-widest">LIVE TRACKING</span>
          </div>
          <h2 className="section-title flex items-center gap-3">
            <Satellite className="text-cyan-400" size={32} />
            ISS Live Tracker
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Internationale Ruimtestation — elke 5 seconden bijgewerkt
          </p>
        </motion.div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="relative bg-[#060e1f]">
            <ComposableMap
              projection="geoNaturalEarth1"
              style={{ width: '100%', height: '420px', background: 'transparent' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#0f2744"
                      stroke="#0a1e38"
                      strokeWidth={0.5}
                    />
                  ))
                }
              </Geographies>

              {trail.map((pos, i) => (
                <Marker key={i} coordinates={pos}>
                  <circle
                    r={2.5}
                    fill="#22d3ee"
                    opacity={((i + 1) / trail.length) * 0.55}
                  />
                </Marker>
              ))}

              {iss && (
                <Marker coordinates={[iss.longitude, iss.latitude]}>
                  <g>
                    <circle r={18} fill="#22d3ee" opacity={0.08} />
                    <circle r={10} fill="#22d3ee" opacity={0.18} />
                    <circle r={5} fill="#22d3ee" />
                    <circle r={5} fill="none" stroke="#22d3ee" strokeWidth={1} opacity={0.6}>
                      <animate attributeName="r" from="5" to="20" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text
                      textAnchor="middle"
                      y={-16}
                      style={{ fill: '#22d3ee', fontSize: '9px', fontFamily: 'Space Mono, monospace', fontWeight: 'bold' }}
                    >
                      ISS
                    </text>
                  </g>
                </Marker>
              )}
            </ComposableMap>

            {updated && (
              <div className="absolute bottom-3 right-4 text-xs text-gray-600 font-mono">
                ⟳ {updated.toLocaleTimeString('nl-NL')}
              </div>
            )}
          </div>

          {iss ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
              <Stat icon={<Navigation size={16} />} label="Breedtegraad" value={`${iss.latitude.toFixed(3)}°`} color="cyan" />
              <Stat icon={<Navigation size={16} className="rotate-90" />} label="Lengtegraad" value={`${iss.longitude.toFixed(3)}°`} color="cyan" />
              <Stat icon={<ArrowUp size={16} />} label="Hoogte" value={`${Math.round(iss.altitude)} km`} color="purple" />
              <Stat icon={<Gauge size={16} />} label="Snelheid" value={`${(iss.velocity / 3600).toFixed(2)} km/s`} color="amber" />
            </div>
          ) : (
            <div className="p-5 text-center text-gray-500 font-mono text-sm">
              Verbinden met ISS telemetrie...
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: string
  color: 'cyan' | 'purple' | 'amber'
}) {
  const cls = { cyan: 'text-cyan-400', purple: 'text-purple-400', amber: 'text-amber-400' }[color]
  return (
    <div className="flex flex-col items-center gap-1 p-5 bg-[#060e1f]">
      <div className={cls}>{icon}</div>
      <div className={`font-mono text-xl font-bold ${cls}`}>{value}</div>
      <div className="text-gray-500 text-xs">{label}</div>
    </div>
  )
}
