import { motion } from 'framer-motion'
import { ExternalLink, Clock, Tag } from 'lucide-react'

interface Article {
  id: number
  title: string
  source: string
  time: string
  category: string
  summary: string
  url: string
  color: 'cyan' | 'purple' | 'amber' | 'green'
}

const NEWS: Article[] = [
  {
    id: 1,
    title: 'ESA lanceert nieuwe weersatelliet voor betere klimaatmonitoring boven Europa',
    source: 'NOS',
    time: '2 uur geleden',
    category: 'ESA',
    summary:
      'De Europese Ruimtevaartorganisatie heeft met succes een geavanceerde weersatelliet gelanceerd die Europa beter moet beschermen tegen extreme weersomstandigheden en klimaatverandering.',
    url: '#',
    color: 'cyan',
  },
  {
    id: 2,
    title: 'André Kuipers inspireert leerlingen: "De ruimte is voor iedereen bereikbaar"',
    source: 'NU.nl',
    time: '5 uur geleden',
    category: 'Astronaut',
    summary:
      'Nederlander André Kuipers bezocht scholen in Amsterdam en deelde zijn ervaringen aan boord van het ISS. Hij riep jongeren op een carrière in de ruimtevaart te overwegen.',
    url: '#',
    color: 'purple',
  },
  {
    id: 3,
    title: 'SpaceX lanceert 23 nieuwe Starlink-satellieten boven Europa',
    source: 'Tweakers',
    time: '8 uur geleden',
    category: 'SpaceX',
    summary:
      'SpaceX heeft opnieuw een batch Starlink-satellieten in een lage baan om de aarde gebracht. De Falcon 9 eerste trap landde succesvol terug op het drijvende platform.',
    url: '#',
    color: 'amber',
  },
  {
    id: 4,
    title: 'James Webb Telescoop toont vroeg heelal als nooit tevoren gezien',
    source: 'De Volkskrant',
    time: '1 dag geleden',
    category: 'JWST',
    summary:
      'NASA heeft spectaculaire nieuwe beelden vrijgegeven van sterrenstelsels die slechts 300 miljoen jaar na de oerknal zijn gevormd. De opnamen zetten de kosmologische modellen op hun kop.',
    url: '#',
    color: 'cyan',
  },
  {
    id: 5,
    title: 'Artemis III: eerste vrouw op de maan gepland voor eind 2026',
    source: 'RTL Nieuws',
    time: '2 dagen geleden',
    category: 'NASA',
    summary:
      'NASA bevestigt de tijdlijn voor de Artemis III-missie waarbij voor het eerst een vrouw en een persoon van kleur op het maanoppervlak zal landen nabij de zuidpool.',
    url: '#',
    color: 'purple',
  },
  {
    id: 6,
    title: 'TU Delft studenten winnen internationale ruimtevaartcompetitie met cubesat',
    source: 'AD',
    time: '3 dagen geleden',
    category: 'Nederland',
    summary:
      'Een team van TU Delft won een internationale competitie met hun innovatieve cubesat voor nauwkeurige klimaatmetingen. De satelliet wordt volgend jaar gelanceerd.',
    url: '#',
    color: 'green',
  },
]

const colors = {
  cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
}

export default function DutchNews() {
  return (
    <section id="news" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="section-title">🇳🇱 Nederlands Ruimtenieuws</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Het laatste ruimtevaartnieuws{' '}
            <span className="text-gray-600 font-mono text-xs">
              (demo data — voeg NewsAPI key toe voor live nieuws)
            </span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {NEWS.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-5 flex flex-col group hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-mono font-semibold ${colors[article.color]}`}>
                  <Tag size={9} />
                  {article.category}
                </span>
                <div className="flex items-center gap-1 text-gray-600 text-xs">
                  <Clock size={10} />
                  {article.time}
                </div>
              </div>

              <h3 className="font-semibold text-white text-sm leading-snug mb-3 group-hover:text-cyan-200 transition-colors duration-200">
                {article.title}
              </h3>

              <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-4">
                {article.summary}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-xs text-gray-600 font-mono">{article.source}</span>
                <a
                  href={article.url}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-400 transition-colors duration-200"
                >
                  Lees meer <ExternalLink size={10} />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
