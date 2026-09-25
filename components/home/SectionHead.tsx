import { Reveal } from '@/components/apple/Reveal'

// Shared section header: mono eyebrow, serif statement, short sans body.
export function SectionHead({
  eyebrow,
  title,
  body,
  align = 'center',
}: {
  eyebrow?: string
  title: React.ReactNode
  body?: React.ReactNode
  align?: 'center' | 'left'
}) {
  return (
    <Reveal variant="light">
      <div style={{ textAlign: align, maxWidth: align === 'center' ? 680 : 520, margin: align === 'center' ? '0 auto' : undefined }}>
        {eyebrow && (
          <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
            {eyebrow}
          </span>
        )}
        <h2
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: 'clamp(32px,4.4vw,48px)',
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
            color: '#1A1A1A',
            marginTop: eyebrow ? 10 : 0,
            textWrap: 'balance',
          }}
        >
          {title}
        </h2>
        {body && (
          <p style={{ fontSize: 17, lineHeight: 1.6, color: '#6B6B6B', marginTop: 14, textWrap: 'pretty' }}>{body}</p>
        )}
      </div>
    </Reveal>
  )
}
