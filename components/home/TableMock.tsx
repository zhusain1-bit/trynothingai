// A light mock of a nothing.ai project table (0.2.0 workspace styling)
// whose rows land one after another. Pure CSS animation (.tm-row), static
// under reduced motion.

export type MockRow = { cells: string[]; source: 'screenshot' | 'pdf' | 'image' | 'sheet' }

const DEFAULT_ROWS: MockRow[] = [
  { cells: ['Jordan Ellis', 'Northwind Analytics', 'Austin'], source: 'screenshot' },
  { cells: ['Priya Raman', 'Lattice Capital', 'New York'], source: 'screenshot' },
  { cells: ['Marcus Chen', 'Halcyon Labs', 'New York'], source: 'pdf' },
  { cells: ['Ana Ortiz', 'Brightline Health', 'Chicago'], source: 'sheet' },
]

const SOURCE_LABEL = { screenshot: 'Screenshot', pdf: 'PDF', image: 'Image', sheet: 'Sheet' } as const

export function SourceGlyph({ type }: { type: MockRow['source'] }) {
  const p = { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (type === 'screenshot') return <svg {...p}><path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" /></svg>
  if (type === 'pdf') return <svg {...p}><path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" /><path d="M14 3v4h4M9 13h6M9 17h4" /></svg>
  if (type === 'image') return <svg {...p}><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><path d="m4 17 5-5 4 4 2.5-2.5L20 18" /></svg>
  return <svg {...p}><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M4 10h16M4 15h16M10 4v16" /></svg>
}

export function TableMock({
  title = 'Networking',
  columns = ['Name', 'Company', 'Location'],
  rows = DEFAULT_ROWS,
  animate = true,
  selected,
  highlight,
  mobileHide,
  big = false,
}: {
  title?: string
  columns?: string[]
  rows?: MockRow[]
  animate?: boolean
  /** index of a row to show as selected (inspector open) */
  selected?: number
  /** row indexes to keep; others fade (used by the Ask demo) */
  highlight?: number[] | null
  /** column index to drop on phones, so the rest stay readable */
  mobileHide?: number
  /** larger type, for when the table is the whole demo */
  big?: boolean
}) {
  const cols = mobileHide === undefined ? columns.length : columns.length - 1
  return (
    <div className="app-mock" style={{ width: '100%' }}>
      <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderBottom: '1px solid #E5E0D8' }}>
        <span style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 20, color: '#1A1A1A' }}>{title}</span>
        <span className="flex" style={{ gap: 4, fontSize: 12 }}>
          <span style={{ padding: '4px 10px', borderRadius: 6, background: '#FFFFFF', border: '1px solid #E5E0D8', color: '#1A1A1A' }}>Table</span>
          <span style={{ padding: '4px 10px', borderRadius: 6, color: '#6B6B6B' }}>Sources</span>
        </span>
      </div>
      <div role="table" aria-label={`${title} project table`}>
        <div role="row" className="tm-grid" style={{ ['--cols' as string]: columns.length, ['--cols-m' as string]: cols, padding: '8px 16px', fontSize: 12, color: '#6B6B6B', borderBottom: '1px solid #EFEBE4' }}>
          {columns.map((c, j) => <span role="columnheader" key={c} className={j === mobileHide ? 'tm-hide-m' : undefined}>{c}</span>)}
          <span role="columnheader" style={{ textAlign: 'right' }}><span className="tm-source-label">Source</span></span>
        </div>
        {rows.map((r, i) => {
          const dim = highlight ? !highlight.includes(i) : false
          return (
            <div
              role="row"
              key={r.cells[0]}
              className={`tm-grid ${animate ? 'tm-row' : ''}`}
              style={{
                ['--cols' as string]: columns.length,
                ['--cols-m' as string]: cols,
                ['--i' as string]: i,
                padding: big ? '14px 18px' : '10px 16px',
                fontSize: big ? 15.5 : 13.5,
                color: '#1A1A1A',
                borderBottom: '1px solid #F2EFE9',
                background: selected === i ? '#FBEEE4' : undefined,
                boxShadow: selected === i ? 'inset 2px 0 0 #C2410C' : undefined,
                opacity: dim ? 0.28 : 1,
                transition: 'opacity .35s var(--ease-warm)',
              }}
            >
              {r.cells.map((c, j) => (
                <span role="cell" key={j} className={j === mobileHide ? 'tm-hide-m' : undefined} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: j === 0 ? 500 : 400 }}>{c}</span>
              ))}
              <span role="cell" className="flex items-center justify-end" style={{ gap: 5, color: '#6B6B6B', fontSize: 12 }}>
                <SourceGlyph type={r.source} />
                <span className="tm-source-label">{SOURCE_LABEL[r.source]}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
