import { Reveal } from '@/components/apple/Reveal'
import { IconScreenshot, IconDoc, IconSheet, IconContact, IconSearch } from './icons'

// Illustrative mock only — a made-up property, not customer data.
const SOURCES = [
  { label: 'Property screenshot', by: 'Analyst', icon: <IconScreenshot /> },
  { label: 'Offering memorandum', by: 'Associate', icon: <IconDoc /> },
  { label: 'Rent roll', by: 'Ops', icon: <IconSheet /> },
  { label: 'Broker contact', by: 'Principal', icon: <IconContact /> },
]

const FIELDS = [
  { k: 'Asking price', v: '$4.2M', from: 'Offering memorandum' },
  { k: 'Units', v: '24', from: 'Rent roll' },
  { k: 'Occupancy', v: '96%', from: 'Rent roll' },
  { k: 'Broker', v: 'Dana Reyes', from: 'Broker contact' },
  { k: 'Listing photos', v: '6 saved', from: 'Property screenshot' },
]

export function EnterpriseValueSection() {
  return (
    <section style={{ padding: 'clamp(80px, 12vw, 140px) 24px 0' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <Reveal variant="light">
          <span
            className="font-mono block text-center"
            style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}
          >
            why enterprise
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontSize: 'clamp(30px, 4.2vw, 44px)',
              lineHeight: 1.1,
              color: '#1A1A1A',
              textAlign: 'center',
              marginTop: 12,
              maxWidth: 680,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Nothing remembers what your company has seen.
          </h2>
        </Reveal>
        <Reveal variant="light" index={1}>
          <div style={{ maxWidth: 560, margin: '24px auto 0', textAlign: 'center', fontSize: 16, lineHeight: 1.65, color: '#6B6B6B' }}>
            <p style={{ color: '#1A1A1A' }}>
              One teammate screenshots a prospect.
              <br />
              Another uploads a PDF.
              <br />
              Another adds a spreadsheet.
            </p>
            <p style={{ marginTop: 14 }}>
              Nothing turns those sources into shared, structured knowledge the entire team can search and use.
            </p>
          </div>
        </Reveal>

        <Reveal variant="light" panel index={2}>
          <figure
            style={{
              marginTop: 'clamp(40px, 6vw, 64px)',
              background: '#F2EFE9',
              border: '1px solid #E5E0D8',
              borderRadius: 18,
              padding: 'clamp(20px, 4vw, 40px)',
            }}
          >
            <figcaption className="sr-only">
              Example: asking “What do we know about 123 Main Street?” pulls together a property screenshot, an offering memorandum,
              a rent roll and a broker contact — added by different teammates — into one project with each value traced to its source.
            </figcaption>
            <div aria-hidden="true">
              <div
                className="flex items-center"
                style={{
                  gap: 10,
                  maxWidth: 520,
                  margin: '0 auto',
                  padding: '13px 16px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E0D8',
                  borderRadius: 12,
                  fontSize: 15,
                  color: '#1A1A1A',
                  boxShadow: '0 8px 24px -16px rgba(26,26,26,.2)',
                }}
              >
                <span style={{ color: '#6B6B6B', display: 'flex' }}>
                  <IconSearch />
                </span>
                What do we know about 123 Main Street?
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 10, marginTop: 28 }}>
                {SOURCES.map(s => (
                  <div
                    key={s.label}
                    style={{ background: '#FAF8F5', border: '1px solid #E5E0D8', borderRadius: 10, padding: '12px 14px' }}
                  >
                    <span style={{ color: '#6B6B6B', display: 'flex' }}>{s.icon}</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginTop: 8 }}>{s.label}</div>
                    <div className="font-mono" style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>
                      added by {s.by}
                    </div>
                  </div>
                ))}
              </div>

              {/* Four sources → one project. Curves on desktop where the
                  sources sit in a row; a single hairline once they wrap. */}
              <svg className="converge-lines hidden md:block" viewBox="0 0 400 56" preserveAspectRatio="none">
                {[50, 150, 250, 350].map(x => (
                  <path key={x} d={`M${x} 0 C ${x} 30, 200 26, 200 56`} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
              <div className="flow-line md:hidden" style={{ margin: '10px auto' }} />

              <div
                style={{
                  maxWidth: 520,
                  margin: '0 auto',
                  background: '#FFFFFF',
                  border: '1px solid #E5E0D8',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderBottom: '1px solid #E5E0D8' }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>123 Main Street</span>
                  <span className="font-mono" style={{ fontSize: 11, color: '#6B6B6B' }}>
                    4 sources · 4 teammates
                  </span>
                </div>
                {FIELDS.map((f, i) => (
                  <div
                    key={f.k}
                    className="grid"
                    style={{
                      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
                      gap: 12,
                      padding: '9px 16px',
                      fontSize: 13,
                      borderTop: i ? '1px solid #F2EFE9' : 'none',
                    }}
                  >
                    <span style={{ color: '#6B6B6B' }}>{f.k}</span>
                    <span className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between" style={{ gap: '2px 8px' }}>
                      <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{f.v}</span>
                      <span className="font-mono" style={{ fontSize: 10.5, color: '#9A958D' }}>
                        {f.from}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
