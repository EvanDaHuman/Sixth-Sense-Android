export default function Navbar({ isLive }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">👁</span>
        <span className="text-white font-semibold text-lg tracking-tight">Sixth Sense</span>
      </div>
      <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full ${
        isLive
          ? 'bg-green-500/10 text-green-400'
          : 'bg-white/5 text-gray-500'
      }`}>
        <span className={`w-2 h-2 rounded-full bg-current ${isLive ? 'animate-pulse-dot' : ''}`} />
        {isLive ? 'Live' : 'Offline'}
      </div>
    </nav>
  )
}
