import { Reveal } from '@/components/apple/Reveal'
import { TrackedLink } from '@/components/pricing/TrackedLink'
import { CONTACT_SALES_HREF } from '@/lib/pricing'
import { SectionHead } from './SectionHead'
import { SourceGlyph, type MockRow } from './TableMock'

const TEAMMATES: { who: string; initials: string; type: MockRow['source']; what: string }[] = [
  { who: 'Teammate A', initials: 'A', type: 'screenshot', what: 'screenshots a listing' },
  { who: 'Teammate B', initials: 'B', type: 'pdf', what: 'adds an offering memo' },
  { who: 'Teammate C', initials: 'C', type: 'sheet', what: 'drops in a rent roll' },
]

const DEALS = [
  { name: '123 Main Street', stage: 'Diligence', by: ['A', 'B', 'C'] },
  { name: '48 Harbor Road', stage: 'Sourced', by: ['A'] },
  { name: 'Elm Court Apartments', stage: 'LOI', by: ['B', 'C'] },
]

export function EnterpriseSection() {
  return (
    <section id="enterprise" className="home-section">
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SectionHead
          eyebrow="enterprise"
          title="Nothing for your whole team."
          body={
            <>
              Individual remembers what you’ve seen.
              <br />
              Enterprise connects what your organization has seen.
            </>
          }
        />
        <Reveal variant="light" panel index={1}>
          <div className="ent-flow" style={{ marginTop: 'clamp(28px,4vw,44px)' }}>
            <ul className="flex flex-col" style={{ gap: 10 }} aria-label="Teammates adding sources">
              {TEAMMATES.map(t => (
                <li key={t.who} className="flex items-center" style={{ gap: 12, padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: 10 }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#1A1A1A', color: '#FAF8F5', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, flex: 'none' }}>{t.initials}</span>
                  <span style={{ fontSize: 14, color: '#1A1A1A' }}>
                    <strong style={{ fontWeight: 600 }}>{t.who}</strong> {t.what}
                  </span>
                  <span style={{ marginLeft: 'auto', color: '#6B6B6B', display: 'flex' }}><SourceGlyph type={t.type} /></span>
                </li>
              ))}
            </ul>
            <div className="sources-link" aria-hidden="true">
              <span className="sources-line" />
              <span style={{ padding: '8px 16px', background: '#1A1A1A', color: '#FAF8F5', borderRadius: 999, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>shared project</span>
              <span className="sources-line" />
            </div>
            <div className="app-mock">
              <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderBottom: '1px solid #E5E0D8' }}>
                <span style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 20, color: '#1A1A1A' }}>Acquisition pipeline</span>
                <span style={{ fontSize: 12, color: '#6B6B6B' }}>shared · 3 people</span>
              </div>
              {DEALS.map(d => (
                <div key={d.name} className="flex items-center" style={{ gap: 12, padding: '11px 16px', borderBottom: '1px solid #F2EFE9', fontSize: 14 }}>
                  <span style={{ color: '#1A1A1A', fontWeight: 500, flex: 1, minWidth: 0 }}>{d.name}</span>
                  <span style={{ color: '#6B6B6B', fontSize: 13 }}>{d.stage}</span>
                  <span className="flex" aria-label={`Sources from teammates ${d.by.join(', ')}`}>
                    {d.by.map((b, i) => (
                      <span key={b} style={{ width: 22, height: 22, borderRadius: '50%', background: '#1A1A1A', color: '#FAF8F5', fontSize: 10, fontWeight: 600, display: 'grid', placeItems: 'center', border: '2px solid #FAF8F4', marginLeft: i ? -6 : 0 }}>{b}</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal variant="light">
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#6B6B6B', textAlign: 'center', maxWidth: 600, margin: '32px auto 0' }}>
            Search everything your team has captured. Share projects, sources and what your team knows in one workspace.
          </p>
          <div className="flex flex-wrap items-center justify-center" style={{ gap: '12px 22px', marginTop: 22 }}>
            <TrackedLink href={CONTACT_SALES_HREF} event="enterprise_cta_clicked" props={{ location: 'home_enterprise' }} className="btn-warm-outline" style={{ padding: '13px 26px', fontSize: 15 }}>
              Contact Sales
            </TrackedLink>
            <a href="/pricing#compare" className="link-warm" style={{ fontSize: 15 }}>See what’s included</a>
          </div>
          <p className="font-mono" style={{ fontSize: 11.5, color: '#6B6B6B', textAlign: 'center', marginTop: 16 }}>
            rolling out with early teams — ask what’s live today
          </p>
        </Reveal>
      </div>
    </section>
  )
}
