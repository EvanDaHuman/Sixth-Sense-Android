import { useEffect, useRef } from 'react'

export default function CameraFeed({ streamRef, ready, error }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [ready])

  if (error) {
    return (
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center">
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="text-white text-sm font-semibold">Live Camera</span>
        <div className="flex items-center gap-2 text-xs text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          REC
        </div>
      </div>
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-600 text-sm">Starting camera...</span>
          </div>
        )}
      </div>
    </div>
  )
}
