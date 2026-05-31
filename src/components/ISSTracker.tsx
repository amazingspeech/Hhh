import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { Satellite, MapPin, Map, Rocket, Zap, Info, type LucideIcon } from 'lucide-react'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface ISSData {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: number
}

const FUNFEITEN = [
  'De ISS is zo groot als een voetbalveld!',
  'Er wonen altijd 6 mensen in de ruimte op de ISS.',
  'De ISS maakt 16 zonsopgangen per dag mee.',
  'In de ISS zweef je — net als een vlieg!',
  'De ISS is al meer dan 20 jaar in de ruimte.',
]

export default function ISSTracker() {
  const [iss, setIss] = useState<ISSData | null>(null)
  const [trail, setTrail] = useState<[number, number][]>([])
  const [updated, setUpdated] = useState<Date | null>(null)
  const [feitIdx] = useState(Math.floor(Math.random() * FUNFEITEN.length))

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
      } catch { /* ignore */ }
    }
    fetchISS()
    const interval = setInterval(fetchISS, 5000)
    return () => clearInterval(interval)
  }, [])

  const speedKmh = iss ? Math.round(iss.velocity) : 0
  const planes = iss ? Math.round(iss.velocity / 900) : 0

  return (
    <section id="iss" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="live-dot" />
            <span className="text-green-400 font-mono text-xs font-bold tracking-widest">LIVE TRACKING</span>
          </div>
          <h2 className="section-title flex items-center gap-3">
            <Satellite className="text-amber-400" size={32} />
            Ruimtestation ISS
          </h2>
          <p className="text-gray-400 mt-2 font-semibold">Kijk waar de ISS nu is — elke 5 seconden bijgewerkt!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-6 p-4 rounded-3xl bg-amber-400/15 border-2 border-amber-400/30 flex items-center gap-3"
        >
          <Info size={18} className="text-amber-400 flex-shrink-0" />
          <p className="text-amber-200 font-bold text-sm">{FUNFEITEN[feitIdx]}</p>
        </motion.div>

        <div className="glass-card overflow-hidden">
          <div className="relative bg-[#060e1f]">
            <ComposableMap
              projection="geoNaturalEarth1"
              style={{ width: '100%', height: '380px', background: 'transparent' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography key={geo.rsmKey} geography={geo} fill="#0f2744" stroke="#0a1e38" strokeWidth={0.5} />
                  ))
                }
              </Geographies>

              {trail.map((pos, i) => (
                <Marker key={i} coordinates={pos}>
                  <circle r={2.5} fill="#fbbf24" opacity={((i + 1) / trail.length) * 0.5} />
                </Marker>
              ))}

              {iss && (
                <Marker coordinates={[iss.longitude, iss.latitude]}>
                  <g>
                    <circle r={18} fill="#fbbf24" opacity={0.1} />
                    <circle r={10} fill="#fbbf24" opacity={0.2} />
                    <circle r={5} fill="#fbbf24" />
                    <circle r={5} fill="none" stroke="#fbbf24" strokeWidth={1} opacity={0.6}>
                      <animate attributeName="r" from="5" to="22" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text textAnchor="middle" y={-14} style={{ fill: '#fbbf24', fontSize: '9px', fontFamily: 'Space Mono', fontWeight: 'bold' }}>
                      ISS
                    </text>
                  </g>
                </Marker>
              )}
            </ComposableMap>
            {updated && (
              <div className="absolute bottom-3 right-4 text-xs text-gray-600 font-mono">
                bijgewerkt: {updated.toLocaleTimeString('nl-NL')}
              </div>
            )}
          </div>

          {iss ? (
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <FunStat Icon={MapPin}  label="Breedtegraad" value={`${iss.latitude.toFixed(2)}°`} />
              <FunStat Icon={Map}     label="Lengtegraad"  value={`${iss.longitude.toFixed(2)}°`} />
              <FunStat Icon={Rocket}  label="Hoogte"       value={`${Math.round(iss.altitude)} km`} sub="boven de aarde" />
              <FunStat
                Icon={Zap}
                label="Snelheid"
                value={`${speedKmh.toLocaleString('nl')} km/u`}
                sub={`${planes}× sneller dan een vliegtuig`}
              />
            </div>
          ) : (
            <div className="p-5 text-center text-gray-500 font-bold">Verbinden met ISS telemetrie...</div>
          )}
        </div>
      </div>
    </section>
  )
}

function FunStat({ Icon, label, value, sub }: {
  Icon: LucideIcon
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="text-center p-4 rounded-2xl bg-white/5">
      <Icon size={18} className="text-amber-400 mx-auto mb-2" />
      <div className="font-black text-white text-lg font-mono">{value}</div>
      <div className="text-gray-400 text-xs font-bold mt-0.5">{label}</div>
      {sub && <div className="text-amber-400 text-xs font-bold mt-1">{sub}</div>}
    </div>
  )
}
