/**
 * macOS-style window chrome for product demos.
 * Stage contract (matches FeaturesReel's old stage): position:relative container
 * with an explicit height — children mount `absolute inset-0`.
 * Illustration cards accept a `src` prop, so real screenshots can drop in later
 * without changing this frame.
 */
export function MacWindow({
  height,
  aspect,
  children,
  glow = false,
}: {
  /** fixed stage height (clamp() ok) — for the synthetic CSS demos */
  height?: string
  /** exact stage aspect ratio, e.g. "1728 / 1008" — for real clips, zero crop at any width */
  aspect?: string
  children: React.ReactNode
  glow?: boolean
}) {
  return (
    <div className="relative w-full mx-auto" style={{ maxWidth: 1080 }}>
      {glow && (
        <div
          aria-hidden="true"
          className="absolute pointer-events-none glow-drift glow-breathe"
          style={{
            inset: '-12% -18%',
            background: 'radial-gradient(50% 50% at 50% 45%, rgba(174,194,255,.14), rgba(174,194,255,.04) 45%, transparent 70%)',
          }}
        />
      )}
      <div
        className="relative overflow-hidden settle"
        style={{
          borderRadius: 24,
          border: '1px solid var(--hairline)',
          background: '#08090c',
          boxShadow: '0 60px 140px -40px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.05)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-[7px] px-[16px]"
          style={{ height: 36, borderBottom: '1px solid var(--hairline)' }}
          aria-hidden="true"
        >
          <span className="rounded-full" style={{ width: 10, height: 10, background: '#333740' }} />
          <span className="rounded-full" style={{ width: 10, height: 10, background: '#333740' }} />
          <span className="rounded-full" style={{ width: 10, height: 10, background: '#333740' }} />
        </div>
        {/* Stage */}
        <div
          className={aspect ? 'relative' : 'relative max-sm:!h-[360px]'}
          style={aspect ? { aspectRatio: aspect } : { height }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
