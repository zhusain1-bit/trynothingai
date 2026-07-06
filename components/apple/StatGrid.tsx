export function StatGrid({
  items,
  cols = 3,
}: {
  items: { stat: string; label: string; body?: string }[]
  cols?: 2 | 3 | 4
}) {
  return (
    <div
      className={`mx-auto grid grid-cols-1 ${cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}
      style={{ maxWidth: 980 }}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className="flex flex-col gap-[10px] px-[28px] py-[24px] max-sm:!border-l-0"
          style={{
            borderLeft: i > 0 ? '1px solid var(--hairline)' : 'none',
            borderTop: 'none',
          }}
        >
          <div className="eyebrow">{item.label}</div>
          <div className="headline-l" style={{ color: 'var(--mist)' }}>{item.stat}</div>
          {item.body && (
            <p style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--ghost)' }}>{item.body}</p>
          )}
        </div>
      ))}
    </div>
  )
}
