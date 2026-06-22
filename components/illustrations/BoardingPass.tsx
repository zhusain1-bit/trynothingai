interface Props { src?: string; className?: string }

export function BoardingPass({ src, className = '' }: Props) {
  if (src) return <img src={src} alt="Boarding pass" className={`object-cover w-full h-full ${className}`} />
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(160deg,#1a2740,#0f1830)', color: '#dfe6f2', position: 'absolute', inset: 0, padding: 8, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 6.5, color: '#8fa6cc', fontFamily: 'var(--font-jetbrains,monospace)' }}>
        <span>BOARDING PASS</span>
        <span>AEROMEXICO</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-.01em' }}>JFK</span>
        <div style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(90deg,#5e76a8 0 3px,transparent 3px 6px)', position: 'relative' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ position: 'absolute', right: -2, top: -5, width: 9, height: 9, color: '#9fb6e0' }}>
            <path d="M2 16l20-8-9 9-3-3z" />
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-.01em' }}>CUN</span>
      </div>
      <div style={{ fontSize: 7, color: '#9fb6e0', marginTop: 3 }}>New York → Cancún, MX</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 6.5, color: '#8fa6cc', fontFamily: 'var(--font-jetbrains,monospace)' }}>
        <span>JUL 25</span>
        <span>SEAT 14A</span>
      </div>
      <div style={{ marginTop: 'auto', height: 13, background: 'repeating-linear-gradient(90deg,#cdd8ee 0 1.5px,transparent 1.5px 3px)', borderRadius: 2 }} />
    </div>
  )
}
