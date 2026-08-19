import { Reveal } from '@/components/apple/Reveal'

// Placeholder copy — final copy pending. The second line compresses the
// cross-device point that used to be its own section (see components/
// _archive/WhyNotPhoneSection.tsx, archived in Task 7): phones already turn
// a screenshot with a time in it into a calendar event; the computer doesn't,
// and that's where work actually gets lost. No Apple mention, not comparative.
export function ProblemStatement() {
  return (
    <section className="flex flex-col items-center text-center px-6" style={{ padding: 'clamp(64px,10vw,140px) 24px', background: '#FAF8F5' }}>
      <Reveal variant="light">
        <p
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: 'clamp(28px,4vw,40px)',
            lineHeight: 1.3,
            color: '#1A1A1A',
            maxWidth: 720,
          }}
        >
          [Placeholder — you screenshot things for a reason, then forget the reason.]
        </p>
      </Reveal>
      <Reveal variant="light" delay={80}>
        <p style={{ fontSize: 18, lineHeight: 1.5, color: '#6B6B6B', marginTop: 20, maxWidth: 640 }}>
          [Placeholder — your phone already turns a screenshot with a time in it into a calendar
          event. Work happens on your computer — Slack, docs, tabs — and that&rsquo;s where it gets lost.]
        </p>
      </Reveal>
    </section>
  )
}
