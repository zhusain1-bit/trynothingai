import { Reveal } from '@/components/apple/Reveal'

export function Chapter({
  id,
  eyebrow,
  headline,
  sub,
  tone = 'void',
  children,
}: {
  id?: string
  eyebrow?: string
  headline: React.ReactNode
  sub?: React.ReactNode
  tone?: 'void' | 'black'
  children?: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="w-full"
      style={{
        background: tone === 'black' ? '#000' : 'var(--void)',
        padding: 'clamp(80px, 12vw, 160px) 24px',
      }}
    >
      <Reveal>
        <div className="mx-auto flex flex-col items-center gap-[18px] text-center" style={{ maxWidth: 820 }}>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h2 className="headline-xl headline-dim">{headline}</h2>
          {sub && <p className="copy-l" style={{ maxWidth: 620 }}>{sub}</p>}
        </div>
      </Reveal>
      {children && <div style={{ marginTop: 'clamp(40px, 6vw, 72px)' }}>{children}</div>}
    </section>
  )
}
