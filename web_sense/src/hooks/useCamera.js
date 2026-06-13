import { useEffect, useRef, useState } from 'react'

export default function useCamera() {
  const streamRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        streamRef.current = stream
        setReady(true)
      } catch {
        setError('Camera or microphone access denied.')
      }
    }
    start()
    return () => streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  return { streamRef, ready, error }
}
