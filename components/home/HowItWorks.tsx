'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/apple/Reveal'
import { useInView } from '@/components/features/useInView'
import { SectionHead } from './SectionHead'
import { TableMock, type MockRow } from './TableMock'
import { DemoSlot } from './DemoSlot'

const TABLE_ROWS: MockRow[] = [
  { cells: ['Jordan Ellis', 'Product Manager', 'Northwind'], source: 'screenshot' },
  { cells: ['Priya Raman', 'Associate', 'Lattice Capital'], source: 'screenshot' },
  { cells: ['Marcus Chen', 'Analyst', 'Halcyon Labs'], source: 'pdf' },
  { cells: ['Ana Ortiz', 'VP Strategy', 'Brightline'], source: 'sheet' },
  { cells: ['Sam Patel', 'Engineer', 'Halcyon Labs'], source: 'image' },
]

const STEPS = [
  {
    n: '01',
    title: 'Tell Nothing what to track.',
    body: 'Describe what you’re building. Nothing sets up the fields for you.',
    ms: 7000,
  },
  {
    n: '02',
    title: 'Capture anything.',
    body: 'Screenshot it or add a source. Then keep moving.',
    ms: 5000,
  },
  {
    n: '03',
    title: 'Your project builds itself.',
    body: 'Nothing puts the information into the fields you chose.',
    ms: 6500,
  },
]

const SLOT_FOR_STEP = ['how-setup', 'how-capture', 'how-table'] as const
const STEP_LABEL = [
  'Creating a project: describing what to track and nothing.ai suggesting the fields.',
  'Dragging a capture region over a profile on screen — or adding a PDF, image or spreadsheet.',
  'Records landing in the project table, each tagged with the kind of source it came from.',
]

// Steps 01 and 02 are Remotion renders (lib/demoSlots.ts: how-setup, how-capture); step 03 is
// the live HTML table below.
function StepTable() {
  return (
    <div className="flex items-center justify-center" style={{ position: 'absolute', inset: 0, background: 'var(--app-chrome)', padding: 'clamp(12px,2.4vw,24px)' }}>
      <TableMock columns={['Name', 'Role', 'Company']} rows={TABLE_ROWS} big />
    </div>
  )
}

export function HowItWorks() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.35, once: false })
  const [progress, setProgress] = useState(0)
  const started = useRef(0)

  // Auto-advance while visible, until the visitor picks a step themselves.
  useEffect(() => {
    if (!auto || !inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    started.current = performance.now()
    let raf = 0
    const tick = () => {
      const p = (performance.now() - started.current) / STEPS[active].ms
      if (p >= 1) {
        setProgress(0)
        setActive(a => (a + 1) % STEPS.length)
        return
      }
      setProgress(p)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, auto, inView])

  return (
    <section id="how-it-works" className="home-section" style={{ background: '#F2EFE9' }}>
      <div ref={ref} style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SectionHead eyebrow="how it works" title="Three steps. The last one is automatic." />
        <div className="grid how-grid" style={{ marginTop: 'clamp(28px,4vw,48px)' }}>
          <Reveal variant="light" index={1}>
            <ol style={{ listStyle: 'none' }}>
              {STEPS.map((s, i) => (
                <li key={s.n}>
                  <button
                    type="button"
                    className="how-step"
                    aria-current={i === active ? 'step' : undefined}
                    onClick={() => {
                      setAuto(false)
                      setProgress(0)
                      setActive(i)
                    }}
                  >
                    <span className="font-mono" style={{ fontSize: 12, color: i === active ? '#C2410C' : '#9A958D' }}>{s.n}</span>
                    <span>
                      <span style={{ display: 'block', fontSize: 19, fontWeight: 600, color: i === active ? '#1A1A1A' : '#6B6B6B', letterSpacing: '-.01em' }}>{s.title}</span>
                      <span className="how-step-body" style={{ fontSize: 15, lineHeight: 1.55, color: '#6B6B6B', marginTop: 6 }}>{s.body}</span>
                      <span className="how-step-bar" aria-hidden="true">
                        <span style={{ transform: `scaleX(${i === active ? (auto ? progress : 1) : 0})` }} />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal variant="light" panel index={2}>
            <div style={{ position: 'relative' }}>
              <DemoSlot key={active} id={SLOT_FOR_STEP[active]} label={STEP_LABEL[active]}>
                {active === 2 ? <StepTable /> : null}
              </DemoSlot>
              {active === 1 ? (
                // Other ways in, under the capture pill (square frame only — too tight at 4:3).
                <div className="how-chips flex flex-wrap justify-center" style={{ position: 'absolute', left: 12, right: 12, bottom: 12, gap: 6 }}>
                  {['or drop a PDF', 'an image', 'a CSV / Excel file'].map(x => (
                    <span key={x} style={{ fontSize: 12, padding: '5px 10px', borderRadius: 999, background: 'rgba(250,248,245,.94)', border: '1px solid #E5E0D8', color: '#1A1A1A' }}>{x}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
