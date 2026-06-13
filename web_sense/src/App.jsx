import { useState } from 'react'
import Navbar from './components/Navbar'
import StatusCard from './components/StatusCard'
import AlertFeed from './components/AlertFeed'
import CameraFeed from './components/CameraFeed'
import useMotionSocket from './hooks/useMotionSocket'
import './App.css'

export default function App() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [alerts, setAlerts] = useState([])

  useMotionSocket((time) => {
    setAlerts(prev => [{ id: Date.now(), time }, ...prev])
  })

  return (
    <div className="min-h-screen bg-[#0d0d10] text-gray-300 font-sans flex flex-col">
      <Navbar isLive={isMonitoring} />
      <main className="flex-1 max-w-xl w-full mx-auto px-5 py-10 flex flex-col gap-8">
        <StatusCard
          isMonitoring={isMonitoring}
          onToggle={() => setIsMonitoring(prev => !prev)}
          detectionCount={alerts.length}
        />
        <CameraFeed />
        <AlertFeed alerts={alerts} />
      </main>
    </div>
  )
}
