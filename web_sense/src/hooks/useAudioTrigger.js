import { useEffect, useRef } from 'react'
import { AudioTriggerEngine } from '../../../backend/normal_mode/audioTriggerEngine.js'

export default function useAudioTrigger(isMonitoring, onTrigger) {
  const engineRef = useRef(null)

  useEffect(() => {
    if (isMonitoring) {
      engineRef.current = new AudioTriggerEngine({
        SPIKE_THRESHOLD_DB: 38,   // high enough to ignore indoor voice
        MIN_SPIKE_DURATION_MS: 50, // low enough to catch short sharp sounds like claps
        MIN_LOUDNESS_FLOOR_DB: -45,
        COOLDOWN_MS: 5000,
        onTrigger: (event) => onTrigger(event),
      })
      engineRef.current.start()
    } else {
      if (engineRef.current) {
        engineRef.current.stop()
        engineRef.current = null
      }
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stop()
        engineRef.current = null
      }
    }
  }, [isMonitoring])
}
