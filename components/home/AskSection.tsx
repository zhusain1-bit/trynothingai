'use client'

import { useEffect, useState } from 'react'
import { Reveal } from '@/components/apple/Reveal'
import { useInView } from '@/components/features/useInView'
import { SectionHead } from './SectionHead'
import { useReducedMotion } from './useReducedMotion'
import { DemoSlot } from './DemoSlot'
import { capture } from '@/lib/posthog'
import { TableMock, type MockRow } from './TableMock'

// Illustrative: each prompt maps to a project and the rows that answer it.
// The real "Ask this project…" answers from your rows and links back to them.
const PEOPLE: MockRow[] = [
  { cells: ['Jordan Ellis', 'Northwind Analytics', 'Austin'], source: 'screenshot' },
  { cells: ['Priya Raman', 'Lattice Capital', 'New York'], source: 'screenshot' },
  { cells: ['Marcus Chen', 'Halcyon Labs', 'New York'], source: 'pdf' },
  { cells: ['Ana Ortiz', 'Brightline Health', 'Chicago'], source: 'sheet' },
  { cells: ['Sam Patel', 'Halcyon Labs', 'Boston'], source: 'screenshot' },
]

const PROMPTS: { q: string; title: string; columns: string[]; rows: MockRow[]; match: number[]; answer: string }[] = [
  { q: 'Show me everyone in New York.', title: 'Networking', columns: ['Name', 'Company', 'Location'], rows: PEOPLE, match: [1, 2], answer: '2 people in New York' },
  {
    q: 'Which jobs pay over $100k?',
    title: 'Job search',
    columns: ['Company', 'Role', 'Salary'],
    rows: [
      { cells: ['Halcyon Labs', 'Data Analyst', '$95k – $115k'], source: 'screenshot' },
      { cells: ['Northwind', 'Product Analyst', '$82k – $90k'], source: 'screenshot' },
      { cells: ['Lattice Capital', 'Investment Analyst', '$120k – $140k'], source: 'pdf' },
      { cells: ['Brightline', 'BI Engineer', '$105k – $125k'], source: 'screenshot' },
    ],
    match: [0, 2, 3],
    answer: '3 roles can pay over $100k',
  },
  { q: 'Which companies appear more than once?', title: 'Networking', columns: ['Name', 'Company', 'Location'], rows: PEOPLE, match: [2, 4], answer: 'Halcyon Labs — 2 people' },
  {
    q: 'Show apartments under $3,500.',
    title: 'Apartments',
    columns: ['Address', 'Rent', 'Beds'],
    rows: [
      { cells: ['214 Clermont Ave', '$3,250', '2 bd'], source: 'screenshot' },
      { cells: ['88 Hicks St', '$3,900', '2 bd'], source: 'screenshot' },
      { cells: ['31 Lefferts Pl', '$2,875', '1 bd'], source: 'image' },
      { cells: ['410 Union St', '$4,150', '3 bd'], source: 'screenshot' },
    ],
    match: [0, 2],
    answer: '2 listings under $3,500',
  },
]

export function AskSection() {
  const [active, setActive] = useState(0)
  const [typed, setTyped] = useState(PROMPTS[0].q.length)
  const [auto, setAuto] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.4, once: false })
  const reduced = useReducedMotion()
  const p = PROMPTS[active]
  // Reduced motion: no typing, the whole question appears at once.
  const shown = reduced ? p.q.length : typed
  const done = shown >= p.q.length

  // Type the question out, hold on the answer, move to the next prompt.
  useEffect(() => {
    if (!inView || reduced) return
    if (!done) {
      const t = setTimeout(() => setTyped(n => n + 1), 28)
      return () => clearTimeout(t)
    }
    if (!auto) return
    const t = setTimeout(() => {
      setActive(a => (a + 1) % PROMPTS.length)
      setTyped(0)
    }, 3200)
    return () => clearTimeout(t)
  }, [inView, done, auto, reduced])

  return (
    <section id="ask" className="home-section">
      <div ref={ref} style={{ maxWidth: 880, margin: '0 auto' }}>
        <SectionHead
          eyebrow="ask this project"
          title="Ask what you’ve captured."
          body="Once your information is structured, you can actually use it."
        />
        <Reveal variant="light" panel index={1}>
          <div style={{ marginTop: 'clamp(28px,4vw,44px)' }}>
          <DemoSlot id="ask" label={`Asking the project “${p.q}” — ${p.answer}; matching rows stay, the rest fade.`}>
          <div className="ask-stage">
            <div
              className="flex items-center"
              style={{ gap: 10, padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: 10, fontSize: 15, color: '#1A1A1A', minHeight: 48 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="1.6" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></svg>
              <span aria-live="polite">
                {shown === 0 ? <span style={{ color: '#9A958D' }}>Ask this project…</span> : p.q.slice(0, shown)}
                {!done && <span className="ask-caret" aria-hidden="true" />}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#6B6B6B', margin: '12px 4px', minHeight: 20 }}>
              {done ? <>↳ {p.answer} · showing matching records</> : ' '}
            </p>
            <TableMock title={p.title} columns={p.columns} rows={p.rows} animate={false} highlight={done ? p.match : null} />
          </div>
          </DemoSlot>
          </div>
        </Reveal>
        <div className="flex flex-wrap justify-center" style={{ gap: 8, marginTop: 20 }}>
          {PROMPTS.map((x, i) => (
            <button
              key={x.q}
              type="button"
              className="uc-tab"
              aria-pressed={i === active}
              onClick={() => {
                capture('ask_demo_interacted', { prompt: x.q })
                setAuto(false)
                setActive(i)
                setTyped(0)
              }}
            >
              {x.q}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
