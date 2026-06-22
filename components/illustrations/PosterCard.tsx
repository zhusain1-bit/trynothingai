interface Props {
  src?: string
  artist?: string
  venue?: string
  date?: string
  className?: string
}

export function PosterCard({ src, artist = 'Beach House', venue = 'Brooklyn Steel', date = 'Mar 14', className = '' }: Props) {
  if (src) return <img src={src} alt={`${artist} poster`} className={`object-cover w-full h-full rounded-[11px] ${className}`} />
  return (
    <div
      className={`relative overflow-hidden rounded-[11px] flex flex-col items-center justify-end ${className}`}
      style={{ background: 'linear-gradient(180deg,#1a1330 0%,#0c0a18 100%)', padding: '0 8px 10px' }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: '70%', height: '60%', top: '5%', left: '15%',
          background: 'radial-gradient(ellipse,rgba(200,100,255,.35) 0%,transparent 70%)',
          filter: 'blur(12px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '50%', height: '50%', top: '20%', right: '10%',
          background: 'radial-gradient(ellipse,rgba(255,80,180,.25) 0%,transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
      <div className="relative z-10 text-center">
        <div
          className="font-display text-white leading-none"
          style={{ fontSize: 21, textShadow: '0 2px 12px rgba(0,0,0,.6)', fontFamily: 'var(--font-bebas, "Bebas Neue", sans-serif)' }}
        >
          {artist}
        </div>
        <div className="font-mono" style={{ fontSize: 7.5, color: '#cbb6ff', letterSpacing: '0.1em', marginTop: 1 }}>
          {date} · {venue}
        </div>
      </div>
    </div>
  )
}
