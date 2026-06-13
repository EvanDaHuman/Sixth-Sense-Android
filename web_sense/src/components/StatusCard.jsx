export default function StatusCard({ isMonitoring, onToggle, detectionCount }) {
  return (
    <div className={`rounded-2xl p-8 text-center border transition-colors ${
      isMonitoring
        ? 'bg-green-500/[0.04] border-green-500/20'
        : 'bg-white/[0.02] border-white/5'
    }`}>
      <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl border bg-[#16161c] ${
        isMonitoring ? 'border-green-500/30 shadow-[0_0_24px_rgba(34,197,94,0.12)]' : 'border-white/5'
      }`}>
        {isMonitoring ? '🛡️' : '🔴'}
      </div>

      <h2 className="text-white text-xl font-semibold mb-2">
        {isMonitoring ? 'Monitoring Active' : 'Monitoring Off'}
      </h2>
      <p className="text-gray-500 text-sm mb-7">
        {isMonitoring
          ? `Watching for sudden movement — ${detectionCount} alert${detectionCount !== 1 ? 's' : ''} today`
          : 'Click below to start monitoring your space'}
      </p>

      <button
        onClick={onToggle}
        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 cursor-pointer ${
          isMonitoring
            ? 'bg-red-500/10 text-red-400'
            : 'bg-green-500 text-black'
        }`}
      >
        {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
      </button>
    </div>
  )
}
