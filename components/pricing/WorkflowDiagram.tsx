import { Reveal } from '@/components/apple/Reveal'
import { IconScreenshot, IconDoc, IconImage, IconFile, IconUsers, IconMail, IconFolder, IconSheet } from './icons'

type Source = { label: string; icon: React.ReactNode }

const FLOWS: { label: string; sources: Source[]; destination: string; examples: string[] }[] = [
  {
    label: 'Individual',
    sources: [
      { label: 'Screenshot', icon: <IconScreenshot /> },
      { label: 'PDF', icon: <IconDoc /> },
      { label: 'Image', icon: <IconImage /> },
      { label: 'File', icon: <IconFile /> },
    ],
    destination: 'Personal project',
    examples: ['Networking', 'Jobs', 'Apartments', 'Research'],
  },
  {
    label: 'Enterprise',
    sources: [
      { label: 'Team members', icon: <IconUsers /> },
      { label: 'Email attachments', icon: <IconMail /> },
      { label: 'Shared folders', icon: <IconFolder /> },
      { label: 'Screenshots', icon: <IconScreenshot /> },
      { label: 'Documents', icon: <IconDoc /> },
    ],
    destination: 'Shared workspace',
    examples: ['Acquisition pipeline', 'Sales CRM', 'Research', 'Company knowledge'],
  },
]

// A hairline with a single dot travelling down it — the only motion here,
// switched off under reduced motion (see .flow-line in globals.css).
function Connector() {
  return <div className="flow-line" aria-hidden="true" />
}

export function WorkflowDiagram() {
  return (
    <section aria-label="How each plan works" style={{ padding: 'clamp(40px, 6vw, 72px) 24px 0' }}>
      <div className="workflow-grid grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: 980, margin: '0 auto' }}>
        {FLOWS.map((f, i) => (
          <Reveal key={f.label} variant="light" panel index={i}>
            <figure
              className="flex flex-col items-center"
              style={{
                height: '100%',
                background: '#F2EFE9',
                border: '1px solid #E5E0D8',
                borderRadius: 18,
                padding: 'clamp(24px, 4vw, 36px) 20px',
              }}
            >
              <figcaption className="sr-only">
                {f.label}: {f.sources.map(s => s.label).join(', ')} go into nothing, which builds a{' '}
                {f.destination.toLowerCase()} such as {f.examples.join(', ')}.
              </figcaption>
              <div aria-hidden="true" className="flex flex-col items-center w-full">
                <span className="font-mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
                  {f.label}
                </span>
                {/* Centered in a fixed-height band so both columns' "nothing"
                    nodes line up even though Enterprise has more sources. */}
                <div
                  className="flex flex-wrap justify-center content-center"
                  style={{ gap: 8, marginTop: 20, maxWidth: 380, minHeight: 'var(--sources-h, 0px)' }}
                >
                  {f.sources.map(s => (
                    <span
                      key={s.label}
                      className="inline-flex items-center"
                      style={{
                        gap: 7,
                        padding: '7px 11px',
                        background: '#FAF8F5',
                        border: '1px solid #E5E0D8',
                        borderRadius: 8,
                        fontSize: 13,
                        color: '#1A1A1A',
                      }}
                    >
                      <span style={{ color: '#6B6B6B', display: 'flex' }}>{s.icon}</span>
                      {s.label}
                    </span>
                  ))}
                </div>
                <Connector />
                <span
                  style={{
                    padding: '8px 16px',
                    background: '#1A1A1A',
                    color: '#FAF8F5',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '.01em',
                  }}
                >
                  nothing
                </span>
                <Connector />
                <div
                  style={{
                    width: '100%',
                    maxWidth: 300,
                    background: '#FFFFFF',
                    border: '1px solid #E5E0D8',
                    borderRadius: 12,
                    overflow: 'hidden',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid #E5E0D8', fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
                    {f.destination}
                  </div>
                  {f.examples.map((e, j) => (
                    <div
                      key={e}
                      className="flex items-center"
                      style={{ gap: 9, padding: '8px 14px', fontSize: 13, color: '#6B6B6B', borderTop: j ? '1px solid #F2EFE9' : 'none' }}
                    >
                      <span style={{ display: 'flex' }}>
                        <IconSheet size={14} />
                      </span>
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
