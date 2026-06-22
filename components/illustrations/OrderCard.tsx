interface Props { src?: string; item?: string; arriving?: string; total?: string; className?: string }

export function OrderCard({ src, item = 'Jogger Set · M', arriving = 'Thu', total = '$62.00', className = '' }: Props) {
  if (src) return <img src={src} alt={item} className={`object-cover w-full h-full rounded-[11px] ${className}`} />
  return (
    <div
      className={`relative overflow-hidden rounded-[11px] flex flex-col gap-[6px] ${className}`}
      style={{ background: '#f7f8fa', padding: '10px' }}
    >
      <div className="flex items-center gap-[5px] mb-[2px]">
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0"
          style={{ width: 14, height: 14, background: '#22c55e' }}
        >
          <svg viewBox="0 0 12 12" width="8" height="8" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize: 9, fontWeight: 600, color: '#1a1a2e' }}>Order confirmed</span>
      </div>
      <div className="flex items-center gap-[6px]">
        <div
          className="rounded-[5px] flex-shrink-0"
          style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#4ade80,#22c55e)' }}
        />
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 500, color: '#1a1a2e' }}>{item}</div>
          <div style={{ fontSize: 7.5, color: '#6b7280' }}>Arriving {arriving}</div>
        </div>
        <div style={{ fontSize: 8.5, fontWeight: 600, color: '#1a1a2e', marginLeft: 'auto' }}>{total}</div>
      </div>
    </div>
  )
}
