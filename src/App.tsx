import StarField from './components/StarField'
import Navbar from './components/Navbar'
import APODSection from './components/APODSection'
import PlanetGids from './components/PlanetGids'
import ISSTracker from './components/ISSTracker'
import MarsGallery from './components/MarsGallery'
import AsteroidRadar from './components/AsteroidRadar'
import DutchNews from './components/DutchNews'
import LaunchSchedule from './components/LaunchSchedule'
import Mascotte from './components/Mascotte'

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#030712]">
      <StarField />
      <Navbar />
      <main className="relative z-10">
        <APODSection />
        <PlanetGids />
        <ISSTracker />
        <MarsGallery />
        <AsteroidRadar />
        <DutchNews />
        <LaunchSchedule />
      </main>
      <footer className="relative z-10 border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mascotte size={40} animated={false} />
            <div>
              <p className="font-black text-white text-sm">STERRENSLIM</p>
              <p className="text-gray-500 text-xs font-bold">Leren over de ruimte — op jouw tempo</p>
            </div>
          </div>
          <p className="text-gray-600 font-mono text-xs text-center">
            Gebouwd met ❤️ en echte NASA data · © 2024
          </p>
        </div>
      </footer>
    </div>
  )
}
