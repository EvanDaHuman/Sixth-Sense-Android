const ALERT_CONFIG = {
  motion:   { icon: '⚡', label: 'Fast movement detected' },
  audio:    { icon: '🔊', label: 'Loud sound detected' },
  alert:    { icon: '🚨', label: 'Emergency alert triggered' },
}

export default function AlertFeed({ alerts }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
      <h3 className="text-white text-sm font-semibold mb-4">Recent Alerts</h3>

      {alerts.length === 0 ? (
        <p className="text-gray-600 text-sm">No alerts yet — all clear.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {alerts.map((alert) => {
            const config = ALERT_CONFIG[alert.type] ?? ALERT_CONFIG.motion
            return (
              <li key={alert.id} className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-lg">{config.icon}</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-gray-200 font-medium">{config.label}</span>
                  {alert.confidence !== undefined && (
                    <span className="text-xs text-red-400">Confidence: {alert.confidence}/10</span>
                  )}
                  <span className="text-xs text-gray-600">{alert.time}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
