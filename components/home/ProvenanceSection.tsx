import { Reveal } from '@/components/apple/Reveal'
import { DemoSlot } from './DemoSlot'
import { SectionHead } from './SectionHead'
import { SourceGlyph, TableMock } from './TableMock'

// Interim content for the `provenance` demo slot (lib/demoSlots.ts). Mirrors
// the desktop app's record inspector (0.2.0): record title, added time, each
// field tagged with the source it came from, then the source itself.
const FIELDS: [string, string][] = [
  ['Name', 'Jordan Ellis'],
  ['Role', 'Senior Product Manager'],
  ['Company', 'Northwind Analytics'],
  ['Location', 'Austin'],
]

function Inspector() {
  return (
    <aside aria-label="Record details (example)" className="prov-inspector">
      <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #EFEBE4' }}>
        <div style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 26, lineHeight: 1.1, color: '#1A1A1A' }}>Jordan Ellis</div>
        <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 4 }}>Added Sep 24 · 3:14 PM</div>
      </div>
      <dl style={{ padding: '4px 22px' }}>
        {FIELDS.map(([k, v]) => (
          <div key={k} className="prov-field">
            <dt className="flex items-center justify-between" style={{ fontSize: 12.5, color: '#6B6B6B' }}>
              {k}
              <span className="flex items-center" style={{ gap: 4, fontSize: 12, color: '#9A5A2E' }}>
                <SourceGlyph type="screenshot" /> screenshot
              </span>
            </dt>
            <dd style={{ fontSize: 15.5, color: '#1A1A1A', marginTop: 2 }}>{v}</dd>
          </div>
        ))}
      </dl>
      <div style={{ padding: '10px 22px 20px' }}>
        <div className="font-mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B6B6B' }}>Source</div>
        <div
          className="prov-thumb"
          style={{
            marginTop: 8,
            borderRadius: 8,
            border: '1px solid #E5E0D8',
            backgroundImage: 'url(/videos/capture-to-row-still.webp)',
            backgroundSize: '330% auto',
            backgroundPosition: '5% 34%',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="flex items-center justify-between" style={{ marginTop: 8, fontSize: 12.5, color: '#6B6B6B', gap: 8 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Screenshot · profiles.app/in/jordan-ellis</span>
          <span style={{ color: '#1A1A1A', whiteSpace: 'nowrap' }}>Open ↗</span>
        </div>
      </div>
    </aside>
  )
}

export function ProvenanceSection() {
  return (
    <section id="provenance" className="home-section" style={{ paddingTop: 20 }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SectionHead
          title="Every row has a source."
          body="Click any record to see exactly where it came from — the original screenshot, PDF or file stays attached."
        />
        <Reveal variant="light" panel index={1}>
          <div style={{ marginTop: 'clamp(28px,4vw,44px)' }}>
            <DemoSlot
              id="provenance"
              label="A record selected in the table opens the inspector: each field — name, role, company, location — is tagged with the screenshot it came from, with the original screenshot shown below."
            >
              <div className="prov-window">
                <div className="prov-table">
                  <TableMock animate={false} selected={0} mobileHide={1} />
                </div>
                <Inspector />
              </div>
            </DemoSlot>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
