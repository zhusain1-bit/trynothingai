import { Reveal } from '@/components/apple/Reveal'

export function Chapter({
  id,
  eyebrow,
  headline,
  sub,
  tone = 'void',
  layout = 'center',
  cta,
  defer = false,
  children,
}: {
  id?: string
  eyebrow?: string
  headline: React.ReactNode
  sub?: React.ReactNode
  tone?: 'void' | 'black'
  /** 'split' renders the header left-aligned beside the children (≥lg) */
  layout?: 'center' | 'split'
  /** Apple-style chevron link under the sub */
  cta?: { label: string; href: string }
  /** below-fold chapters: skip rendering until near viewport */
  defer?: boolean
  children?: React.ReactNode
}) {
  // Eyebrow → headline → sub → cta cascade in 70ms stagger slots
  const header = (
    <div
      className={
        layout === 'split'
          ? 'flex flex-col gap-[18px] text-left items-start'
          : 'mx-auto flex flex-col items-center gap-[18px] text-center'
      }
      style={layout === 'split' ? undefined : { maxWidth: 820 }}
    >
      {eyebrow && <Reveal index={0}><div className="eyebrow">{eyebrow}</div></Reveal>}
      <Reveal index={1} blur>
        <h2 className="headline-xl headline-dim">{headline}</h2>
      </Reveal>
      {sub && (
        <Reveal index={2}>
          <p className="copy-l" style={{ maxWidth: 620 }}>{sub}</p>
        </Reveal>
      )}
      {cta && (
        <Reveal index={3}>
          <a href={cta.href} className="cta-link" style={{ fontSize: 17 }}>{cta.label}</a>
        </Reveal>
      )}
    </div>
  )

  return (
    <section
      id={id}
      className="w-full"
      style={{
        background: tone === 'black' ? '#000' : 'var(--void)',
        padding: 'clamp(80px, 12vw, 160px) 24px',
        ...(defer ? { contentVisibility: 'auto' as const, containIntrinsicSize: 'auto 900px' } : {}),
      }}
    >
      {layout === 'split' && children ? (
        <div
          className="mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] items-center gap-x-[64px] gap-y-[48px]"
          style={{ maxWidth: 1180 }}
        >
          {header}
          <div>{children}</div>
        </div>
      ) : (
        <>
          {header}
          {children && <div style={{ marginTop: 'clamp(32px, 5vw, 56px)' }}>{children}</div>}
        </>
      )}
    </section>
  )
}
