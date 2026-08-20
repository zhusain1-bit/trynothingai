'use client'

import { useEffect, useState } from 'react'
import { useInView } from '@/components/features/useInView'

export type NoteEntry = {
  id: string
  time: string
  date?: string
  summary: string
  annotation?: string
  group?: { rangeLabel: string; count: number }
}

export type CloseoutItem = { id: string; summary: string }

export type DailyNoteMode = 'note' | 'strip' | 'closeout' | 'search'

// Placeholder mock UI — not a real screenshot. All four modes share this
// panel's chrome, dimensions, and entry-row renderer on purpose: only the
// content differs. See docs/superpowers/specs/2026-08-19-landing-page-
// rebuild-design.md §5.

const PANEL_STYLE: React.CSSProperties = {
  width: 'min(420px, 90%)',
  maxHeight: 420,
  borderRadius: 14,
  background: '#1F1F1F',
  boxShadow: '0 24px 60px -16px rgba(0,0,0,.6)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

function SearchField({ value, placeholder }: { value: string; placeholder: string }) {
  const showingPlaceholder = value.length === 0
  return (
    <div style={{ padding: 16, paddingBottom: 8 }}>
      <div
        style={{
          height: 44,
          borderRadius: 8,
          background: '#2A2A2A',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          fontSize: 13,
          color: showingPlaceholder ? '#6B6B6B' : '#E5E5E5',
        }}
      >
        {showingPlaceholder ? placeholder : value}
      </div>
    </div>
  )
}

function EntryRow({ entry, view }: { entry: NoteEntry; view: 'note' | 'strip' | 'search' }) {
  const thumbSize = view === 'strip' ? 44 : 32
  return (
    <li className="flex items-center gap-3" style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
      <span aria-hidden="true" style={{ width: thumbSize, height: thumbSize, borderRadius: 6, background: '#3A3A3A', flexShrink: 0 }} />
      {view !== 'strip' ? (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            {view === 'search' && entry.date && (
              <span className="font-mono" style={{ fontSize: 10, color: '#6B6B6B' }}>{entry.date}</span>
            )}
            <span className="font-mono" style={{ fontSize: 11, color: '#8A8A8A' }}>{entry.time}</span>
          </div>
          <p style={{ fontSize: 13, color: '#E5E5E5', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {entry.group ? `${entry.group.rangeLabel} · ${entry.group.count} from ${entry.summary}` : entry.summary}
          </p>
          {entry.annotation && <p style={{ fontSize: 11, color: '#8A8A8A', margin: '2px 0 0' }}>{entry.annotation}</p>}
        </div>
      ) : (
        <span className="font-mono" style={{ fontSize: 11, color: '#8A8A8A' }}>{entry.time}</span>
      )}
    </li>
  )
}

function useTypedQuery(query: string, active: boolean) {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) return
    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      const timer = setTimeout(() => { setTyped(query); setDone(true) }, 0)
      return () => clearTimeout(timer)
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => { setTyped(''); setDone(false) }, 0))
    for (let i = 1; i <= query.length; i++) {
      timers.push(setTimeout(() => setTyped(query.slice(0, i)), i * 40))
    }
    timers.push(setTimeout(() => setDone(true), query.length * 40 + 300))
    return () => timers.forEach(clearTimeout)
  }, [active, query])

  return { typed, done }
}

export function DailyNoteOverlayMock({
  mode,
  entries = [],
  closeoutItems = [],
  searchQuery = 'the address tyler sent',
}: {
  mode: DailyNoteMode
  entries?: NoteEntry[]
  closeoutItems?: CloseoutItem[]
  searchQuery?: string
}) {
  const [view, setView] = useState<'note' | 'strip'>('note')
  const { ref, inView } = useInView(0.3)
  const { typed, done } = useTypedQuery(searchQuery, mode === 'search' && inView)

  const searchValue = mode === 'search' ? typed : ''
  const visibleEntries = mode === 'search' ? (done ? entries.slice(0, 3) : []) : entries
  const rowView: 'note' | 'strip' | 'search' = mode === 'search' ? 'search' : view

  return (
    <div ref={ref} style={PANEL_STYLE}>
      <SearchField value={searchValue} placeholder="search or ask" />

      {(mode === 'note' || mode === 'strip') && (
        <div className="flex items-center gap-2" style={{ padding: '0 16px 8px' }}>
          {(['note', 'strip'] as const).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              style={{
                fontSize: 11,
                padding: '4px 10px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background: view === v ? '#3A3A3A' : 'transparent',
                color: view === v ? '#E5E5E5' : '#8A8A8A',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {(mode === 'note' || mode === 'strip' || mode === 'search') && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, overflowY: 'auto' }}>
          {visibleEntries.map(e => <EntryRow key={e.id} entry={e} view={rowView} />)}
        </ul>
      )}

      {mode === 'closeout' && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {closeoutItems.map(item => (
            <li key={item.id} className="flex items-center justify-between gap-3" style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <span style={{ fontSize: 13, color: '#E5E5E5' }}>{item.summary}</span>
              <div className="flex gap-2 font-mono" style={{ fontSize: 10, color: '#8A8A8A' }}>
                <span>done</span><span>snooze</span><span>dismiss</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
