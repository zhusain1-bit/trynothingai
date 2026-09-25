import { Reveal } from '@/components/apple/Reveal'
import { SectionHead } from './SectionHead'
import { SourceGlyph, TableMock, type MockRow } from './TableMock'

const INPUTS: { type: MockRow['source']; label: string; example: string }[] = [
  { type: 'screenshot', label: 'Screenshot', example: 'whatever’s on your screen' },
  { type: 'pdf', label: 'PDF', example: 'a report, a deck, a memo' },
  { type: 'image', label: 'Image', example: 'a photo or a saved graphic' },
  { type: 'sheet', label: 'Spreadsheet', example: 'a CSV or Excel export' },
]

const ROWS: MockRow[] = [
  { cells: ['Urban Mobility Review', 'E-bike adoption', 'Short trips up 41%'], source: 'pdf' },
  { cells: ['Transit Weekly', 'Congestion pricing', 'Downtown traffic −9%'], source: 'screenshot' },
  { cells: ['Rider survey (photo)', 'Commute habits', '62% ride 3+ days/wk'], source: 'image' },
  { cells: ['city-bike-counts.csv', 'Bike counts', 'Peak at 8–9am'], source: 'sheet' },
]

export function SourcesSection() {
  return (
    <section id="sources" className="home-section" style={{ paddingBottom: 0 }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SectionHead
          eyebrow="sources"
          title="Screenshots are just the fastest way in."
          body="Add screenshots, images, PDFs and spreadsheets to the same project. Nothing puts them into the fields you defined."
        />
        <Reveal variant="light" panel index={1}>
          <div className="sources-flow" style={{ marginTop: 'clamp(28px,4vw,44px)' }}>
            <ul className="sources-inputs" aria-label="Supported sources">
              {INPUTS.map(s => (
                <li key={s.type} className="flex items-center" style={{ gap: 12, padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: 10 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 8, background: '#F2EFE9', color: '#1A1A1A', display: 'grid', placeItems: 'center', flex: 'none' }}>
                    <SourceGlyph type={s.type} />
                  </span>
                  <span>
                    <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{s.label}</span>
                    <span style={{ display: 'block', fontSize: 13, color: '#6B6B6B' }}>{s.example}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="sources-link" aria-hidden="true">
              <span className="sources-line" />
              <span style={{ padding: '8px 16px', background: '#1A1A1A', color: '#FAF8F5', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>nothing</span>
              <span className="sources-line" />
            </div>
            <div>
              <TableMock title="Research" columns={['Source', 'Topic', 'Key finding']} rows={ROWS} animate={false} mobileHide={1} selected={0} />
            </div>
          </div>
        </Reveal>
        {/* Bridge into the provenance section below — one continuous story:
            sources → records → click a record → its source. */}
        <div className="flex flex-col items-center" aria-hidden="true" style={{ marginTop: 28 }}>
          <span style={{ width: 1, height: 40, background: '#CFC8BD' }} />
          <span className="font-mono" style={{ fontSize: 11.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B6B6B', marginTop: 10 }}>
            click any record
          </span>
          <span style={{ width: 1, height: 40, background: '#CFC8BD', marginTop: 10 }} />
        </div>
      </div>
    </section>
  )
}
