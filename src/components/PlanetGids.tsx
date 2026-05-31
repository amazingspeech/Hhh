import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Planet {
  naam: string
  emoji: string
  kleur: string
  gradient: string
  grootte: number
  afstand: string
  jaar: string
  feit: string
  weetje: string
}

const PLANETEN: Planet[] = [
  {
    naam: 'Mercurius',
    emoji: '⚫',
    kleur: 'text-gray-400',
    gradient: 'from-gray-500 to-gray-700',
    grootte: 18,
    afstand: '77 miljoen km',
    jaar: '88 dagen',
    feit: 'Kleinste planeet van ons zonnestelsel',
    weetje: 'Overdag is het hier 430°C heet, maar \'s nachts -180°C koud. Geen jas groot genoeg! 🧣',
  },
  {
    naam: 'Venus',
    emoji: '🟡',
    kleur: 'text-yellow-400',
    gradient: 'from-yellow-500 to-orange-600',
    grootte: 28,
    afstand: '261 miljoen km',
    jaar: '225 dagen',
    feit: 'Heetste planeet — zelfs heter dan Mercurius!',
    weetje: 'Venus draait de verkeerde kant op! De zon gaat er in het westen op. Gek hè? 🌅',
  },
  {
    naam: 'Aarde',
    emoji: '🌍',
    kleur: 'text-blue-400',
    gradient: 'from-blue-500 to-green-600',
    grootte: 30,
    afstand: '0 km',
    jaar: '365 dagen',
    feit: 'De enige planeet met leven — voor zover we weten!',
    weetje: '71% van de aarde is bedekt met water. We wonen eigenlijk op een waterplaneet! 🌊',
  },
  {
    naam: 'Mars',
    emoji: '🔴',
    kleur: 'text-red-400',
    gradient: 'from-red-600 to-red-800',
    grootte: 24,
    afstand: '225 miljoen km',
    jaar: '687 dagen',
    feit: 'Thuis van de grootste vulkaan in het zonnestelsel',
    weetje: 'Olympus Mons op Mars is 3x zo hoog als de Mount Everest. DAT is een echte berg! 🌋',
  },
  {
    naam: 'Jupiter',
    emoji: '🟠',
    kleur: 'text-orange-400',
    gradient: 'from-orange-400 to-amber-700',
    grootte: 64,
    afstand: '629 miljoen km',
    jaar: '12 jaar',
    feit: 'Zo groot dat alle andere planeten erin passen!',
    weetje: 'De Grote Rode Vlek is een storm die al minstens 350 jaar woedt. Eén storm! 🌀',
  },
  {
    naam: 'Saturnus',
    emoji: '🪐',
    kleur: 'text-amber-400',
    gradient: 'from-amber-400 to-yellow-700',
    grootte: 56,
    afstand: '1,3 miljard km',
    jaar: '29 jaar',
    feit: 'De ringen zijn van ijs en rotsblokken',
    weetje: 'Saturnus is zo licht dat het zou drijven op water — als je een bad groot genoeg had! 🛁',
  },
  {
    naam: 'Uranus',
    emoji: '🔵',
    kleur: 'text-teal-400',
    gradient: 'from-teal-400 to-cyan-700',
    grootte: 44,
    afstand: '2,7 miljard km',
    jaar: '84 jaar',
    feit: 'Rolt op zijn zij door het heelal',
    weetje: 'Het is zo koud op Uranus (-224°C) dat zelfs het gas bevroren is. IJzige planeet! 🧊',
  },
  {
    naam: 'Neptunus',
    emoji: '🫐',
    kleur: 'text-blue-500',
    gradient: 'from-blue-600 to-indigo-900',
    grootte: 42,
    afstand: '4,4 miljard km',
    jaar: '165 jaar',
    feit: 'Verste planeet van de zon',
    weetje: 'De wind op Neptunus waait met 2.100 km/u — 7x zo hard als de zwaarste orkaan op aarde! 💨',
  },
]

export default function PlanetGids() {
  const [actief, setActief] = useState<Planet | null>(null)

  return (
    <section id="planeten" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="section-title">🪐 Planeetgids</h2>
          <p className="text-gray-400 mt-2 text-base font-semibold">
            Tik op een planeet om meer te ontdekken!
          </p>
        </motion.div>

        {/* Planets row */}
        <div className="flex items-end justify-center gap-3 md:gap-5 mb-8 flex-wrap">
          {PLANETEN.map((p, i) => (
            <motion.button
              key={p.naam}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setActief(actief?.naam === p.naam ? null : p)}
              className="planet-btn group"
            >
              <div
                className={`rounded-full bg-gradient-to-br ${p.gradient} transition-all duration-200 ${
                  actief?.naam === p.naam ? 'ring-4 ring-white/40 scale-110' : 'group-hover:scale-110'
                }`}
                style={{ width: p.grootte, height: p.grootte }}
              />
              <span className={`text-xs font-bold ${actief?.naam === p.naam ? 'text-white' : 'text-gray-400'}`}>
                {p.naam}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Detail card */}
        <AnimatePresence>
          {actief && (
            <motion.div
              key={actief.naam}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              className={`glass-card p-6 md:p-8 border-2 bg-gradient-to-br ${actief.gradient} bg-opacity-10`}
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Planet visual */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  <div
                    className={`rounded-full bg-gradient-to-br ${actief.gradient} shadow-2xl`}
                    style={{ width: 100, height: 100 }}
                  />
                  <span className="text-2xl font-black text-white">{actief.naam}</span>
                </div>

                <div className="flex-1">
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                    <StatPill label="📏 Grootte" value={`${actief.grootte}× kleiner`} sub="dan Jupiter" />
                    <StatPill label="📍 Afstand" value={actief.afstand} sub="van de aarde" />
                    <StatPill label="📅 1 jaar duurt" value={actief.jaar} sub="op aarde" />
                  </div>

                  {/* Feit */}
                  <div className="p-4 rounded-2xl bg-white/10 mb-4">
                    <p className="text-white font-bold text-sm">💫 {actief.feit}</p>
                  </div>

                  {/* Weetje */}
                  <div className="p-4 rounded-2xl bg-amber-400/15 border border-amber-400/30">
                    <p className="text-amber-200 font-bold text-sm leading-relaxed">
                      🤩 Wist je dat... {actief.weetje}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!actief && (
          <div className="text-center py-8 text-gray-500 font-bold">
            👆 Klik op een planeet hierboven!
          </div>
        )}
      </div>
    </section>
  )
}

function StatPill({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/10 rounded-2xl p-3 text-center">
      <div className="text-xs text-gray-400 font-bold mb-1">{label}</div>
      <div className="text-white font-black text-sm">{value}</div>
      <div className="text-gray-500 text-xs">{sub}</div>
    </div>
  )
}
