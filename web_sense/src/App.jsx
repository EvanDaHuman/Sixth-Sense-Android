import { useState, useRef, useCallback } from 'react'
import Navbar from './components/Navbar'
import StatusCard from './components/StatusCard'
import AlertFeed from './components/AlertFeed'
import CameraFeed from './components/CameraFeed'
import SuspiciousPanel from './components/SuspiciousPanel'
import useMotionSocket from './hooks/useMotionSocket'
import useAudioTrigger from './hooks/useAudioTrigger'
import useCamera from './hooks/useCamera'
import useSuspiciousMode from './hooks/useSuspiciousMode'
import './App.css'

export default function App() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [isSuspicious, setIsSuspicious] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [alerts, setAlerts] = useState([])

  const { streamRef, ready, error } = useCamera()
  const { analyze } = useSuspiciousMode()
  const analyzingRef = useRef(false)

  const enterSuspiciousMode = useCallback(async () => {
    if (analyzingRef.current) return
    analyzingRef.current = true
    setIsSuspicious(true)
    setAnalysisResult(null)
    setCountdown(30)

    try {
      const result = await analyze(streamRef, setCountdown)
      setAnalysisResult(result)

      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

      if (result.decision === 'send_alert') {
        setAlerts(prev => [{ id: Date.now(), time, type: 'alert', confidence: result.confidence }, ...prev])
      } else if (result.decision === 'continue_analyzing') {
        analyzingRef.current = false
        setTimeout(() => enterSuspiciousMode(), 1000)
      } else {
        // return_to_normal — wait for user to click Proceed
      }
    } catch (err) {
      console.error('Analysis failed:', err)
      setIsSuspicious(false)
      analyzingRef.current = false
    }
  }, [analyze, streamRef])

  const handleTrigger = useCallback((type) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setAlerts(prev => [{ id: Date.now(), time, type }, ...prev])
    if (!isSuspicious) enterSuspiciousMode()
  }, [isSuspicious, enterSuspiciousMode])

  useMotionSocket((time) => handleTrigger('motion'))
  useAudioTrigger(isMonitoring && !isSuspicious, () => handleTrigger('audio'))

  function dismissAlert() {
    setIsSuspicious(false)
    setAnalysisResult(null)
    analyzingRef.current = false
  }

  return (
    <div className="min-h-screen bg-[#0d0d10] text-gray-300 font-sans flex flex-col">
      <Navbar isLive={isMonitoring} />
      <main className="flex-1 max-w-xl w-full mx-auto px-5 py-10 flex flex-col gap-8">
        <StatusCard
          isMonitoring={isMonitoring}
          onToggle={() => setIsMonitoring(prev => !prev)}
          detectionCount={alerts.length}
        />
        <CameraFeed streamRef={streamRef} ready={ready} error={error} />
        {isSuspicious && (
          <SuspiciousPanel
            countdown={countdown}
            result={analysisResult}
            onDismiss={dismissAlert}
          />
        )}
        <AlertFeed alerts={alerts} />
      </main>
    </div>
  )
}
