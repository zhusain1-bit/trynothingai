interface Props {
  src?: string
  color?: string
  brand?: string
  price?: string
  cheapest?: boolean
  className?: string
}

export function ShortsCard({ src, color = '#4a6fa5', brand = 'H&M', price = '$17.99', cheapest, className = '' }: Props) {
  const shade = shadeColor(color, -34)
  if (src) return <img src={src} alt={brand} className={`object-cover w-full h-full rounded-[12px] ${className}`} />
  return (
    <div
      className={`relative overflow-hidden rounded-[12px] border border-hairline ${className}`}
      style={{ background: 'linear-gradient(180deg,#f4f5f7 0%,#e8eaed 100%)', aspectRatio: '4/5' }}
    >
      {cheapest && (
        <div
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center"
          style={{ padding: '3px 0' }}
        >
          <span
            className="font-mono text-[8px] px-[6px] py-[1px] rounded-[4px]"
            style={{
              background: 'var(--phosphor)',
              color: '#0a0b0d',
              boxShadow: '0 0 8px var(--phosphor-glow)',
            }}
          >
            cheapest
          </span>
        </div>
      )}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0.22 }}
      >
        <svg viewBox="0 0 120 160" width="54%" height="54%">
          <path
            d={`M18 36 H102 L98 66 L86 126 Q84 138 72 140 L48 140 Q36 138 34 126 L22 66 Z`}
            fill={color}
          />
          <rect x="14" y="26" width="92" height="12" rx="6" fill={shade} />
          <line x1="60" y1="38" x2="60" y2="140" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
          <path d={`M18 70 Q10 90 12 110`} stroke={shade} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d={`M102 70 Q110 90 108 110`} stroke={shade} strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,.02) 40%,rgba(0,0,0,.55))' }} />
      <div className="absolute bottom-[8px] left-[8px] right-[8px]">
        <div className="text-white font-semibold" style={{ fontSize: 11 }}>{brand}</div>
      </div>
      <div
        className="absolute top-[6px] right-[6px] font-mono rounded-[4px] px-[4px] py-[1px]"
        style={{ fontSize: 9.5, background: 'rgba(0,0,0,.44)', color: 'var(--mist)' }}
      >
        {price}
      </div>
      {cheapest && (
        <div
          className="absolute inset-0 rounded-[12px] pointer-events-none"
          style={{ outline: '1.5px solid var(--phosphor)', outlineOffset: '-1.5px' }}
        />
      )}
    </div>
  )
}

function shadeColor(hex: string, pct: number) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + pct))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + pct))
  const b = Math.max(0, Math.min(255, (num & 0xff) + pct))
  return `rgb(${r},${g},${b})`
}
