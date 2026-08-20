export function MockFrame({
  children,
  className = '',
  rotate = 0,
  chrome = false,
  chromeTitle,
  layered = false,
  minHeight,
}: {
  children: React.ReactNode
  className?: string
  rotate?: number
  /** minimal macOS-style title-bar dots, so the mock reads as a window */
  chrome?: boolean
  /** optional label shown in the title bar next to the dots (e.g. a channel name) */
  chromeTitle?: string
  /** offset, rotated accent-tinted card behind the frame, for depth */
  layered?: boolean
  minHeight?: number
}) {
  const inner = (
    <div
      className={`overflow-hidden rounded-[12px] ${className}`}
      style={{
        boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)',
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        background: '#0F0F0F',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {chrome && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', flexShrink: 0 }}>
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.18)' }} />
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.18)' }} />
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.18)' }} />
          {chromeTitle && (
            <span className="font-mono" style={{ marginLeft: 8, fontSize: 11, color: 'rgba(255,255,255,.4)' }}>
              {chromeTitle}
            </span>
          )}
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight }}>
        {children}
      </div>
    </div>
  )

  if (!layered) return inner

  return (
    <div style={{ position: 'relative' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          background: 'rgba(194,65,12,.10)',
          transform: 'rotate(-2deg) translate(8px, 10px)',
        }}
      />
      <div style={{ position: 'relative' }}>{inner}</div>
    </div>
  )
}
