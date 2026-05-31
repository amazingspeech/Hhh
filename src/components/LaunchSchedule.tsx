import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Satellite, Radio, Users, Rocket, Lightbulb, Flame, ChevronRight, type LucideIcon } from 'lucide-react'

interface Launch {
  id: string
  naam: string
  raket: string
  organisatie: string
  locatie: string
  datum: Date
  uitleg: string
  kleur: string
  Icon: LucideIcon
  kinderfeit: string
}

const LANCERINGEN: Launch[] = [
  {
    id: '1',
    naam: 'Starlink Groep 10-8',
    raket: 'Falcon 9',
    organisatie: 'SpaceX',
    locatie: 'Kennedy Space Center, Florida',
    datum: new Date(Date.now() + 2.5 * 86_400_000),
    uitleg: '23 internet-satellieten de ruimte in',
    kleur: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/30',
    Icon: Satellite,
    kinderfeit: 'Dankzij deze satellieten kan straks iedereen op aarde internet hebben!',
  },
  {
    id: '2',
    naam: 'Eutelsat 36D',
    raket: 'Ariane 62',
    organisatie: 'Arianespace',
    locatie: 'Kourou, Frans-Guyana',
    datum: new Date(Date.now() + 6 * 86_400_000),
    uitleg: 'Europese televisiesatelliet',
    kleur: 'from-purple-500/20 to-purple-900/10 border-purple-500/30',
    Icon: Radio,
    kinderfeit: 'Via deze satelliet kunnen mensen TV kijken in Afrika en Europa!',
  },
  {
    id: '3',
    naam: 'Crew-11 naar het ISS',
    raket: 'Falcon 9',
    organisatie: 'SpaceX & NASA',
    locatie: 'Kennedy Space Center, Florida',
    datum: new Date(Date.now() + 14 * 86_400_000),
    uitleg: '4 astronauten naar het ruimtestation',
    kleur: 'from-amber-500/20 to-amber-900/10 border-amber-500/30',
    Icon: Users,
    kinderfeit: 'Deze 4 mensen gaan 6 maanden in de ruimte leven en slapen in de ISS!',
  },
  {
    id: '4',
    naam: 'ISAR Spectrum-1',
    raket: 'Spectrum',
    organisatie: 'ISAR Aerospace',
    locatie: 'Andøya, Noorwegen',
    datum: new Date(Date.now() + 22 * 86_400_000),
    uitleg: 'Eerste lancering van een Europese privéraket',
    kleur: 'from-green-500/20 to-green-900/10 border-green-500/30',
    Icon: Rocket,
    kinderfeit: 'Dit is de allereerste vlucht van deze nieuwe raket — spannend!',
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

function LaunchCard({ launch, isNext }: { launch: Launch; isNext: boolean }) {
  const t = useCountdown(launch.datum)
  const { Icon } = launch

  return (
    <div className={`fun-card p-5 bg-gradient-to-br ${launch.kleur} flex flex-col gap-4`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-white/10 text-gray-300">
              {launch.organisatie}
            </span>
            {isNext && (
              <span className="flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-green-400/20 text-green-300 border border-green-400/40 animate-glow-pulse">
                <ChevronRight size={11} />
                VOLGENDE LANCERING
              </span>
            )}
          </div>
          <h3 className="font-black text-white text-lg">{launch.naam}</h3>
          <p className="text-gray-300 text-sm font-semibold mt-1">{launch.uitleg}</p>
        </div>
        <Icon size={28} className="text-white/60 flex-shrink-0 mt-1" />
      </div>

      <div className="p-3 rounded-2xl bg-white/10 flex items-start gap-2">
        <Lightbulb size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-200 text-xs font-bold leading-relaxed">{launch.kinderfeit}</p>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
        <MapPin size={11} />
        {launch.locatie}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { v: t.d, l: 'Dagen' },
          { v: t.h, l: 'Uren' },
          { v: t.m, l: 'Min' },
          { v: t.s, l: 'Sec' },
        ].map(({ v, l }) => (
          <div key={l} className="text-center p-2 rounded-xl bg-black/30">
            <div className="font-mono font-black text-xl text-white">{String(v).padStart(2, '0')}</div>
            <div className="text-xs text-gray-500 font-bold">{l}</div>
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
          className="mb-6"
        >
          <h2 className="section-title flex items-center gap-3">
            <Rocket className="text-amber-400" size={32} />
            Raketten
          </h2>
          <p className="text-gray-400 mt-2 font-semibold">
            Hoe lang nog voordat de volgende raket vertrekt?
          </p>
        </motion.div>

        <div className="mb-8 p-4 rounded-3xl bg-orange-500/15 border-2 border-orange-500/30 flex items-start gap-3">
          <Flame size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
          <p className="text-orange-200 font-bold text-sm">
            Weet jij waarom we raketten gebruiken? Een raket heeft zulke krachtige motoren dat het hard genoeg kan gaan om de zwaartekracht te overwinnen. Dat is meer dan 28.000 km/u!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {LANCERINGEN.map((launch, i) => (
            <motion.div
              key={launch.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <LaunchCard launch={launch} isNext={i === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
