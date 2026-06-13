import { useEffect } from 'react'

export default function useMotionSocket(onAlert) {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765')

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'motion') {
        onAlert(data.time)
      }
    }

    ws.onerror = () => console.warn('Motion socket unavailable')

    return () => ws.close()
  }, [])
}
