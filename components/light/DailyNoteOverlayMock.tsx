'use client'

import { useEffect, useState } from 'react'
import { useInView } from '@/components/features/useInView'

export type NoteEntry = {
  id: string
  time: string
  date?: string
  summary: string
  annotation?: string
  group?: { rangeLabel: string; count: number; items?: string[] }
}

export type CloseoutItem = { id: string; summary: string }

export type DailyNoteMode = 'note' | 'strip' | 'closeout' | 'search' | 'project'

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

function EntryRow({
  entry,
  view,
  index,
  expanded = false,
  collapsed = false,
  matched = false,
}: {
  entry: NoteEntry
  view: 'note' | 'strip' | 'search' | 'project'
  index?: number
  expanded?: boolean
  /** search mode only — narrowed out as a non-match; stays mounted, collapses via transition */
  collapsed?: boolean
  /** search mode only — briefly flashes once the search has settled on this row as a match */
  matched?: boolean
}) {
  const thumbSize = view === 'strip' ? 44 : 32
  const searchRowStyle: React.CSSProperties = view === 'search'
    ? { maxHeight: collapsed ? 0 : 60, opacity: collapsed ? 0 : 1, overflow: 'hidden', ...(index !== undefined ? ({ '--i': index } as React.CSSProperties) : {}) }
    : {}
  const liClassName = [view === 'search' ? 'ask-row-collapse' : '', matched ? 'ask-row-match' : ''].filter(Boolean).join(' ')
  return (
    <li style={searchRowStyle} className={liClassName}>
      <div
        className="flex items-center gap-3 entry-row-land"
        style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', ...(index !== undefined ? ({ '--i': index } as React.CSSProperties) : {}) }}
      >
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
      </div>
      {entry.group?.items && (
        <ul
          className="entry-group-expand"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            paddingLeft: 52,
            maxHeight: expanded ? 120 : 0,
            opacity: expanded ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height .3s var(--ease-warm), opacity .2s ease',
          }}
        >
          {entry.group.items.map(item => (
            <li key={item} style={{ fontSize: 11, color: '#8A8A8A', padding: '4px 16px 4px 0' }}>{item}</li>
          ))}
        </ul>
      )}
    </li>
  )
}

// Project mode: entries carry the same `date` field search mode uses for its
// badge, but here it drives grouping instead — preserves first-seen order
// per date rather than re-sorting, since PROJECT_ENTRIES is already
// chronological.
function groupByDate(entries: NoteEntry[]) {
  const groups: { date: string; items: NoteEntry[] }[] = []
  for (const e of entries) {
    const date = e.date ?? ''
    let g = groups.find(g => g.date === date)
    if (!g) { g = { date, items: [] }; groups.push(g) }
    g.items.push(e)
  }
  return groups
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
  expandedGroupId,
  projectName,
  captureCount,
}: {
  mode: DailyNoteMode
  entries?: NoteEntry[]
  closeoutItems?: CloseoutItem[]
  searchQuery?: string
  /** note mode only — briefly expands a group row's `items` to show what it contains */
  expandedGroupId?: string
  /** project mode only */
  projectName?: string
  captureCount?: number
}) {
  const [view, setView] = useState<'note' | 'strip'>('note')
  const { ref, inView } = useInView(0.3)
  const { typed, done } = useTypedQuery(searchQuery, mode === 'search' && inView)

  const searchValue = mode === 'search' ? typed : ''
  const rowView: 'note' | 'strip' | 'search' = mode === 'search' ? 'search' : view

  // Search mode: rows stay mounted and narrow progressively as typing
  // advances (front rows collapse first, trailing KEEP_COUNT survive as
  // "matches") rather than popping in all at once when typing finishes —
  // retrieval, not a chatbot answering. Note/strip modes show every entry,
  // uncollapsed.
  const KEEP_COUNT = 2
  const progress = mode === 'search' ? Math.min(typed.length / (searchQuery.length || 1), 1) : 0
  const nonMatchCount = Math.max(entries.length - KEEP_COUNT, 0)
  const keepCount = mode === 'search' ? entries.length - Math.round(progress * nonMatchCount) : entries.length
  const collapseBefore = entries.length - keepCount

  return (
    <div ref={ref} style={PANEL_STYLE}>
      {mode === 'project' ? (
        <div style={{ padding: '16px 16px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#E5E5E5' }}>{projectName}</span>
          <span className="font-mono" style={{ fontSize: 11, color: '#8A8A8A' }}>{captureCount} captures</span>
        </div>
      ) : (
        <SearchField value={searchValue} placeholder="search or ask" />
      )}

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
          {entries.map((e, i) => (
            <EntryRow
              key={e.id}
              entry={e}
              view={rowView}
              index={i}
              expanded={e.id === expandedGroupId}
              collapsed={mode === 'search' && i < collapseBefore}
              matched={mode === 'search' && done && i >= collapseBefore}
            />
          ))}
        </ul>
      )}

      {mode === 'project' && (() => {
        let i = 0
        return (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, overflowY: 'auto' }}>
            {groupByDate(entries).flatMap(g => {
              const sepIndex = i++
              const rows = g.items.map(e => <EntryRow key={e.id} entry={e} view="project" index={i++} />)
              return [
                <li key={`sep-${g.date}`} className="entry-row-land" style={{ '--i': sepIndex } as React.CSSProperties}>
                  <div
                    className="font-mono"
                    style={{ padding: '10px 16px 4px', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6B6B6B' }}
                  >
                    {g.date}
                  </div>
                </li>,
                ...rows,
              ]
            })}
          </ul>
        )
      })()}

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
