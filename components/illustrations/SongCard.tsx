interface Props { src?: string; track?: string; artist?: string; className?: string }

export function SongCard({ src, track = 'Bloom', artist = 'Beach House', className = '' }: Props) {
  if (src) return <img src={src} alt={track} className={`object-cover w-full h-full rounded-[11px] ${className}`} />
  return (
    <div
      className={`relative overflow-hidden rounded-[11px] ${className}`}
      style={{ background: '#12121a', aspectRatio: '1/1' }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg,#7b5cff 0%,#ff5c8a 50%,#ffb35c 100%)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full absolute"
          style={{ width: '58%', height: '58%', background: 'rgba(255,255,255,.18)', top: '21%', left: '21%' }}
        />
        <div
          className="rounded-full absolute"
          style={{ width: '32%', height: '32%', background: 'rgba(18,18,26,.72)', top: '34%', left: '34%' }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-[8px] pb-[8px]">
        <div className="font-semibold text-white" style={{ fontSize: 9 }}>{track}</div>
        <div className="text-white/60" style={{ fontSize: 8 }}>{artist}</div>
        <div className="mt-[5px] rounded-full overflow-hidden" style={{ height: 3, background: 'rgba(255,255,255,.2)' }}>
          <div className="h-full rounded-full" style={{ width: '38%', background: '#cfd6ff' }} />
        </div>
      </div>
    </div>
  )
}
