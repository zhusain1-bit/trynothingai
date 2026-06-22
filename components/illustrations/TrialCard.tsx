interface Props { src?: string; appName?: string; daysLeft?: number; price?: string; className?: string }

export function TrialCard({ src, appName = 'Streamly', daysLeft = 3, price = '$14.99', className = '' }: Props) {
  if (src) return <img src={src} alt={appName} className={`object-cover w-full h-full rounded-[11px] ${className}`} />
  return (
    <div
      className={`relative overflow-hidden rounded-[11px] flex flex-col ${className}`}
      style={{ background: '#f7f8fa', padding: '10px' }}
    >
      <div className="flex items-center gap-[6px] mb-[8px]">
        <div
          className="rounded-[5px]"
          style={{ width: 18, height: 18, background: 'linear-gradient(135deg,#ff5c7a,#ff9d5c)', flexShrink: 0 }}
        />
        <span style={{ fontSize: 10, fontWeight: 600, color: '#1a1a2e' }}>{appName}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2 }}>{daysLeft} days left</div>
      <div style={{ fontSize: 8.5, color: '#6b7280', marginTop: 2 }}>{price}/mo after trial</div>
      <div
        className="mt-auto inline-block font-mono rounded-[4px] px-[5px] py-[1px]"
        style={{ fontSize: 7.5, background: '#fef3c7', color: '#92400e', marginTop: 6 }}
      >
        free trial
      </div>
    </div>
  )
}
