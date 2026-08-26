import { Reveal } from '@/components/apple/Reveal'

// The second line compresses the cross-device point that used to be its own
// section (see components/_archive/WhyNotPhoneSection.tsx, archived in Task 7).
export function ProblemStatement() {
  return (
    <section className="flex flex-col items-center text-center px-6" style={{ padding: 'clamp(64px,10vw,140px) 24px', background: '#FAF8F5' }}>
      <Reveal variant="light" panel>
        <h2
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: 'clamp(28px,4vw,40px)',
            lineHeight: 1.3,
            color: '#1A1A1A',
            maxWidth: 720,
          }}
        >
          You screenshot things for a reason. Then you forget the reason.
        </h2>
      </Reveal>
      <Reveal variant="light" panel delay={80}>
        <p style={{ fontSize: 18, lineHeight: 1.5, color: '#6B6B6B', marginTop: 20, maxWidth: 640 }}>
          A LinkedIn profile, a receipt, a stat from a report — each one has real data in it: a
          name, a number, a link. Copying it into a spreadsheet by hand is the annoying part, so
          it doesn&rsquo;t happen. That data just dies in your screenshots folder.
        </p>
      </Reveal>
    </section>
  )
}
