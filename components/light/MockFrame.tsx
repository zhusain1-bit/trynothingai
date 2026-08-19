export function MockFrame({
  children,
  className = '',
  rotate = 0,
}: {
  children: React.ReactNode
  className?: string
  rotate?: number
}) {
  return (
    <div
      className={`overflow-hidden rounded-[12px] ${className}`}
      style={{
        boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)',
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        background: '#0F0F0F',
      }}
    >
      {children}
    </div>
  )
}
