interface Props { src?: string; sender?: string; subject?: string; preview?: string; className?: string }

export function EmailCard({ src, sender = 'Alex', subject = 'Re: the deck', preview = 'When can you send it? Need it before the call at 4.', className = '' }: Props) {
  if (src) return <img src={src} alt={subject} className={`object-cover w-full h-full rounded-[11px] ${className}`} />
  return (
    <div
      className={`relative overflow-hidden rounded-[11px] flex flex-col gap-[6px] ${className}`}
      style={{ background: '#f7f8fa', padding: '10px' }}
    >
      <div className="flex items-center gap-[6px]">
        <div
          className="rounded-full flex-shrink-0"
          style={{ width: 18, height: 18, background: 'linear-gradient(135deg,#5cc8ff,#5c7bff)' }}
        />
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, color: '#1a1a2e' }}>{sender}</div>
          <div style={{ fontSize: 8, color: '#6b7280' }}>{subject}</div>
        </div>
      </div>
      <div style={{ fontSize: 8.5, color: '#374151', lineHeight: 1.45 }}>{preview}</div>
    </div>
  )
}
