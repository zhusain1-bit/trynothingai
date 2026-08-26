import { Reveal } from '@/components/apple/Reveal'
import { PinnedMockFrame } from './PinnedMockFrame'

export function FeatureBlock({
  id,
  eyebrow,
  heading,
  body,
  media,
  reverse = false,
  mediaDark = false,
}: {
  id?: string
  eyebrow: string
  heading: React.ReactNode
  body: string
  media: React.ReactNode
  reverse?: boolean
  /** the media is a mock of some OTHER dark screen (e.g. CaptureDemo's capture-pill-over-a-screenshot), not nothing.ai's own light UI */
  mediaDark?: boolean
}) {
  return (
    <section
      id={id}
      className={`w-full grid grid-cols-1 md:grid-cols-2 gap-10 feature-block ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}
      style={{ padding: 'clamp(64px,10vw,120px) 24px' }}
    >
      <Reveal variant="light" index={0} className="feature-block-text">
        <div style={{ maxWidth: 440 }}>
          <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
            {eyebrow}
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontSize: 'clamp(28px,3.4vw,36px)',
              color: '#1A1A1A',
              marginTop: 10,
              lineHeight: 1.15,
            }}
          >
            {heading}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#6B6B6B', marginTop: 14 }}>
            {body}
          </p>
        </div>
      </Reveal>
      <Reveal variant="light" index={1} className="feature-block-media">
        <div className="card-warm">
          <PinnedMockFrame minHeight={320} dark={mediaDark}>
            {media}
          </PinnedMockFrame>
        </div>
      </Reveal>
    </section>
  )
}
