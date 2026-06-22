interface Props { src?: string; className?: string }

export function TravelScene({ src, className = '' }: Props) {
  if (src) return <img src={src} alt="Travel scene" className={`object-cover w-full h-full rounded-[11px] ${className}`} />
  return (
    <div
      className={`relative overflow-hidden rounded-[11px] ${className}`}
      style={{ background: 'linear-gradient(180deg,#ffd9a8 0%,#ffb3c1 34%,#7ec8e3 60%,#2e7da6 100%)' }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: '34%',
          height: '34%',
          top: '12%',
          left: '33%',
          background: 'radial-gradient(circle,#fff6d8 0%,#ffd36e 100%)',
          boxShadow: '0 0 20px 8px rgba(255,211,110,.45)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '34%', background: 'linear-gradient(180deg,rgba(46,125,166,.6),rgba(22,70,100,.9))' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '9%', background: 'linear-gradient(180deg,#d4a76a,#b8885a)' }}
      />
    </div>
  )
}
