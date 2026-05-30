import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Rocket, MapPin, Calendar, ExternalLink } from 'lucide-react'

interface Launch {
  id: string
  name: string
  rocket: string
  provider: string
  site: string
  date: Date
  description: string
  color: 'cyan' | 'purple' | 'amber' | 'green'
  missionType: string
}

const LAUNCHES: Launch[] = [
  {
    id: '1',
    name: 'Starlink Group 10-8',
    rocket: 'Falcon 9 B5',
    provider: 'SpaceX',
    site: 'SLC-40, Kennedy Space Center',
    date: new Date(Date.now() + 2.5 * 86_400_000),
    description: '23 Starlink internet-satellieten in lage aardbaan',
    color: 'cyan',
    missionType: 'Commercieel',
  },
  {
    id: '2',
    name: 'Eutelsat 36D',
    rocket: 'Ariane 62',
    provider: 'Arianespace',
    site: 'ELA-4, Kourou — Frans-Guyana',
    date: new Date(Date.now() + 6 * 86_400_000),
    description: 'Europese communicatiesatelliet voor TV-distributie',
    color: 'purple',
    missionType: 'GEO Satelliet',
  },
  {
    id: '3',
    name: 'Crew-11 ISS Missie',
    rocket: 'Falcon 9',
    provider: 'SpaceX / NASA',
    site: 'LC-39A, Kennedy Space Center',
    date: new Date(Date.now() + 14 * 86_400_000),
    description: 'Bemande missie naar het ISS — 4 astronauten, 6 maanden verblijf',
    color: 'amber',
    missionType: 'Bemand',
  },
  {
    id: '4',
    name: 'ISAR Spectrum-1',
    rocket: 'Spectrum',
    provider: 'ISAR Aerospace 🇩🇪',
    site: 'Andøya Space Center, Noorwegen',
    date: new Date(Date.now() + 22 * 86_400_000),
    description: 'Eerste vlucht van Europese micro-raket voor kleine satellieten',
    color: 'green',
    missionType: 'Testlancering',
  },
  {
    id: '5',
    name: 'OneWeb L22',
    rocket: 'Falcon 9',
    provider: 'SpaceX',
    site: 'SLC-4E, Vandenberg SFB',
    date: new Date(Date.now() + 30 * 86_400_000),
    description: '36 OneWeb-satellieten voor mondiale breedbanddekking',
    color: 'cyan',
    missionType: 'Constellatie',
  },
  {
    id: '6',
    name: 'Galileo FOC-27/28',
    rocket: 'Ariane 62',
    provider: 'ESA / Arianespace',
    site: 'ELA-4, Kourou — Frans-Guyana',
    date: new Date(Date.now() + 38 * 86_400_000),
    description: 'Twee nieuwe Galileo navigatiesatellieten voor Europees GPS-systeem',
    color: 'purple',
    missionType: 'Navigatie',
  },
]

function useCountdown(target: Date) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return
      setT({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      })
    }
    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [target])
  return t
}

const COLORS = {
  cyan: {
    badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  purple: {
    badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    accent: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  amber: {
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  green: {
    badge: 'bg-green-500/15 text-green-400 border-green-500/30',
    accent: 'text-green-400',
    border: 'border-green-500/30',
  },
}

function LaunchCard({ launch, isNext }: { launch: Launch; isNext: boolean }) {
  const t = useCountdown(launch.date)
  const c = COLORS[launch.color]

  return (
    <div className={`glass-card rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:bg-white/[0.07] ${isNext ? c.border : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono ${c.badge}`}>
              {launch.provider}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-400 font-mono">
              {launch.missionType}
            </span>
            {isNext && (
              <span className="text-xs px-2.5 py-0.5 rounded-full border border-green-500/40 bg-green-500/15 text-green-400 font-mono animate-glow-pulse">
                ● VOLGENDE
              </span>
            )}
          </div>
          <h3 className="font-bold text-white text-base">{launch.name}</h3>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">{launch.description}</p>
        </div>
        <Rocket size={22} className={`flex-shrink-0 mt-1 ${c.accent}`} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <Rocket size={11} className={c.accent} />
          {launch.rocket}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={11} className={c.accent} />
          {launch.site}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={11} className={c.accent} />
          {launch.date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { v: t.d, l: 'Dagen' },
          { v: t.h, l: 'Uren' },
          { v: t.m, l: 'Min' },
          { v: t.s, l: 'Sec' },
        ].map(({ v, l }) => (
          <div key={l} className="text-center p-2 rounded-lg bg-black/30">
            <div className={`font-mono text-xl font-bold ${isNext ? c.accent : 'text-white'}`}>
              {String(v).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-600">{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LaunchSchedule() {
  return (
    <section id="launches" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex items-end justify-between gap-4"
        >
          <div>
            <h2 className="section-title">🚀 Lanceringen</h2>
            <p className="text-gray-400 mt-2 text-sm">
              Aankomende ruimtelanceringen wereldwijd — live aftellen
            </p>
          </div>
          <a
            href="https://www.rocketlaunch.live"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors font-mono"
          >
            Meer lanceringen <ExternalLink size={11} />
          </a>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {LAUNCHES.map((launch, i) => (
            <motion.div
              key={launch.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
            >
              <LaunchCard launch={launch} isNext={i === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
