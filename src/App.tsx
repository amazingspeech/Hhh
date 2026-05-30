import StarField from './components/StarField'
import Navbar from './components/Navbar'
import APODSection from './components/APODSection'
import ISSTracker from './components/ISSTracker'
import MarsGallery from './components/MarsGallery'
import AsteroidRadar from './components/AsteroidRadar'
import DutchNews from './components/DutchNews'
import LaunchSchedule from './components/LaunchSchedule'

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#030712] font-space">
      <StarField />
      <Navbar />
      <main className="relative z-10">
        <APODSection />
        <ISSTracker />
        <MarsGallery />
        <AsteroidRadar />
        <DutchNews />
        <LaunchSchedule />
      </main>
      <footer className="relative z-10 text-center py-10 border-t border-white/5">
        <p className="text-gray-600 font-mono text-xs tracking-widest">
          COSMOS © 2024 — Gebouwd met NASA Open APIs &amp; Liefde voor de Ruimte
        </p>
      </footer>
    </div>
  )
}
