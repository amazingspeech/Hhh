import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Cloud, Sun, Star, VolumeX, Sparkles, HelpCircle, EyeOff, MessageCircle, type LucideIcon } from 'lucide-react'

interface Weetje {
  id: number
  vraag: string
  antwoord: string
  Icon: LucideIcon
  kleur: string
  categorie: string
}

const WEETJES: Weetje[] = [
  {
    id: 1,
    vraag: 'Hoe ver is de maan van de aarde?',
    antwoord: 'De maan is gemiddeld 384.400 km van de aarde. Als je met een auto zou rijden (zonder te stoppen) zou je er 5 maanden over doen!',
    Icon: Moon,
    kleur: 'border-yellow-400/40 bg-yellow-400/5',
    categorie: 'Maan',
  },
  {
    id: 2,
    vraag: 'Waarom is de lucht blauw?',
    antwoord: 'Zonlicht bestaat uit alle kleuren van de regenboog. Als het door de lucht schijnt, springt het blauwe licht het meest rond — daardoor zien we de hemel blauw!',
    Icon: Cloud,
    kleur: 'border-blue-400/40 bg-blue-400/5',
    categorie: 'Aarde',
  },
  {
    id: 3,
    vraag: 'Hoe groot is de zon vergeleken met de aarde?',
    antwoord: 'De zon is zo groot dat er ongeveer 1,3 miljoen aardes in passen! Als de zon een voetbal was, zou de aarde een kleine knikker zijn.',
    Icon: Sun,
    kleur: 'border-orange-400/40 bg-orange-400/5',
    categorie: 'Zon',
  },
  {
    id: 4,
    vraag: 'Wat zijn sterren eigenlijk?',
    antwoord: 'Sterren zijn enorme bollen van gloeiend gas, net zoals onze zon! Ze staan zo ver weg dat het licht er duizenden jaren over doet om ons te bereiken.',
    Icon: Star,
    kleur: 'border-amber-400/40 bg-amber-400/5',
    categorie: 'Sterren',
  },
  {
    id: 5,
    vraag: 'Kan het geluid in de ruimte?',
    antwoord: 'Nee! In de ruimte is geen lucht, en geluid heeft lucht nodig om te reizen. Explosies in de ruimte zijn dus helemaal stil — net als in een film zonder volume!',
    Icon: VolumeX,
    kleur: 'border-purple-400/40 bg-purple-400/5',
    categorie: 'Ruimte',
  },
  {
    id: 6,
    vraag: 'Hoeveel sterren zijn er?',
    antwoord: 'Meer dan alle zandkorrels op alle stranden van de aarde bij elkaar! Astronomen schatten dat er zo\'n 200 biljoen sterren zijn — dat is een 2 met 23 nullen!',
    Icon: Sparkles,
    kleur: 'border-cyan-400/40 bg-cyan-400/5',
    categorie: 'Heelal',
  },
]

export default function DutchNews() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="weetjes" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="section-title">Ruimteweetjes</h2>
          <p className="text-gray-400 mt-2 font-semibold">
            Klik op een vraag — durf jij te gokken voordat je het antwoord leest?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {WEETJES.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                onClick={() => setOpen(open === w.id ? null : w.id)}
                className={`w-full text-left fun-card p-5 ${w.kleur} hover:scale-[1.02] active:scale-[0.98]`}
              >
                <div className="flex items-start gap-3">
                  <w.Icon size={26} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                        {w.categorie}
                      </span>
                      {open === w.id
                        ? <EyeOff size={16} className="text-gray-400 flex-shrink-0" />
                        : <HelpCircle size={16} className="text-gray-400 flex-shrink-0" />
                      }
                    </div>
                    <h3 className="font-black text-white text-base leading-snug">
                      {w.vraag}
                    </h3>

                    <AnimatePresence>
                      {open === w.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-start gap-2 mt-3 border-t border-white/10 pt-3">
                            <MessageCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-200 text-sm font-semibold leading-relaxed">
                              {w.antwoord}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
