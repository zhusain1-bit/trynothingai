interface Props { src?: string; className?: string }

export function LoginCard({ src, className = '' }: Props) {
  if (src) return <img src={src} alt="Login form" className={`object-cover w-full h-full rounded-[11px] ${className}`} />
  return (
    <div
      className={`relative overflow-hidden rounded-[11px] flex flex-col items-center justify-center gap-[7px] ${className}`}
      style={{ background: '#f7f8fa', padding: '10px' }}
    >
      <div
        className="rounded-[7px]"
        style={{ width: 24, height: 24, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
      />
      <div
        className="w-full rounded-[4px]"
        style={{ height: 13, background: 'white', border: '1px solid #e5e7eb' }}
      />
      <div
        className="w-full rounded-[4px] flex items-center justify-center gap-[2px]"
        style={{ height: 13, background: 'white', border: '1px solid #e5e7eb' }}
      >
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-full" style={{ width: 3, height: 3, background: '#9ca3af' }} />
        ))}
      </div>
      <div
        className="w-full rounded-[4px] flex items-center justify-center"
        style={{ height: 14, background: '#1a1a2e' }}
      >
        <span style={{ fontSize: 7, fontWeight: 600, color: 'white' }}>Sign in</span>
      </div>
    </div>
  )
}
