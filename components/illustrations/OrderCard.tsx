interface Props { src?: string; item?: string; arriving?: string; total?: string; className?: string }

export function OrderCard({ src, item = 'Jogger Set', arriving = 'Thu', total = '$62.00', className = '' }: Props) {
  if (src) return <img src={src} alt={item} className={`object-cover w-full h-full rounded-[11px] ${className}`} />
  return (
    <div
      className={`relative overflow-hidden rounded-[11px] flex flex-col gap-[5px] ${className}`}
      style={{ background: '#f7f8fa', padding: '9px 10px' }}
    >
      {/* Confirmed header */}
      <div className="flex items-center gap-[5px]">
        <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 13, height: 13, background: '#22c55e' }}>
          <svg viewBox="0 0 12 12" width="7" height="7" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize: 8.5, fontWeight: 600, color: '#1a1a2e' }}>Order confirmed</span>
      </div>

      {/* Item row — price removed to avoid overflow */}
      <div className="flex items-center gap-[6px]">
        <div className="rounded-[4px] flex-shrink-0" style={{ width: 20, height: 20, background: 'linear-gradient(135deg,#4ade80,#22c55e)' }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 8, fontWeight: 500, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item}</div>
          <div style={{ fontSize: 7, color: '#6b7280' }}>Arriving {arriving}</div>
        </div>
      </div>

      {/* Total on its own line */}
      <div style={{ fontSize: 8, fontWeight: 600, color: '#1a1a2e', fontFamily: 'var(--font-jetbrains,monospace)' }}>{total}</div>
    </div>
  )
}
