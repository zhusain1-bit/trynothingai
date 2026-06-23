interface Props { src?: string; className?: string }

export function BoardingPass({ src, className = '' }: Props) {
  if (src) return <img src={src} alt="Boarding pass" className={`object-cover w-full h-full ${className}`} />
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(160deg,#1a2740,#0f1830)', color: '#dfe6f2', position: 'absolute', inset: 0, padding: 7, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header — stacked so neither label gets cut off */}
      <div style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 6, color: '#8fa6cc', lineHeight: 1.4 }}>
        <div>BOARDING PASS</div>
        <div>AEROMEXICO</div>
      </div>

      {/* Route */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-.01em' }}>JFK</span>
        <div style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(90deg,#5e76a8 0 2px,transparent 2px 5px)', position: 'relative' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ position: 'absolute', right: -1, top: -4, width: 8, height: 8, color: '#9fb6e0' }}>
            <path d="M2 16l20-8-9 9-3-3z" />
          </svg>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-.01em' }}>CUN</span>
      </div>

      <div style={{ fontSize: 6.5, color: '#9fb6e0', marginTop: 2 }}>New York → Cancún</div>

      {/* Meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 6, color: '#8fa6cc', fontFamily: 'var(--font-jetbrains,monospace)' }}>
        <span>JUL 25</span>
        <span>14A</span>
      </div>

      {/* Barcode */}
      <div style={{ marginTop: 'auto', height: 11, background: 'repeating-linear-gradient(90deg,#cdd8ee 0 1.5px,transparent 1.5px 3px)', borderRadius: 2 }} />
    </div>
  )
}
