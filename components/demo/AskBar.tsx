'use client'

import { useState } from 'react'

interface Answer {
  main: string
  sub: string
  link?: string
}

interface Props {
  onAnswer?: (answer: Answer | null) => void
}

const ANSWERS: Record<string, Answer> = {
  'cheapest':       { main: 'H&M Regular Short — $17.99', sub: 'cheapest of 14 · range $17.99–$68.00', link: 'hm.com' },
  'which is cheapest?': { main: 'H&M Regular Short — $17.99', sub: 'cheapest of 14 · range $17.99–$68.00', link: 'hm.com' },
  'under $30':      { main: '3 items under $30', sub: 'H&M $17.99 · Uniqlo $19.90 · Target $24.99', link: 'hm.com' },
  'average price':  { main: 'avg $37.42', sub: 'across 14 items · range $17.99–$68.00' },
  'most expensive': { main: 'Lululemon — $68.00', sub: 'most expensive of 14', link: 'lululemon.com' },
}

const CHIPS = ['cheapest', 'under $30', 'average price', 'most expensive']

export function AskBar({ onAnswer }: Props) {
  const [query, setQuery]   = useState('')
  const [answer, setAnswer] = useState<Answer | null>(null)

  function resolve(q: string) {
    const key = q.toLowerCase().trim()
    const hit = ANSWERS[key] ?? Object.entries(ANSWERS).find(([k]) => key.includes(k))?.[1] ?? null
    setAnswer(hit)
    onAnswer?.(hit)
  }

  function handleSubmit(q: string) {
    setQuery(q)
    resolve(q)
  }

  return (
    <div className="border-t" style={{ borderColor: 'var(--hairline)' }}>
      {answer && (
        <div
          className="mx-[14px] mt-[12px] rounded-[12px] flex items-start gap-[10px] p-[10px_12px] anim-ansin"
          style={{
            background: 'linear-gradient(180deg,rgba(174,194,255,.10) 0%,rgba(174,194,255,.04) 100%)',
            border: '1px solid rgba(174,194,255,.30)',
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="font-semibold" style={{ fontSize: 13.5, color: '#EAF0FF' }}>{answer.main}</div>
            <div className="font-mono mt-[2px]" style={{ fontSize: 9.5, color: 'var(--ghost)' }}>{answer.sub}</div>
          </div>
          {answer.link && (
            <button
              className="font-mono flex-shrink-0 focus-visible:outline-phosphor"
              style={{ fontSize: 9.5, color: 'var(--phosphor)', whiteSpace: 'nowrap' }}
              onClick={() => setAnswer(null)}
            >
              open {answer.link} ↗
            </button>
          )}
        </div>
      )}
      <div className="flex gap-[6px] flex-wrap px-[14px] pt-[10px] pb-[4px]">
        {CHIPS.map(chip => (
          <button
            key={chip}
            className="chip"
            style={{ fontSize: 10.5, fontFamily: 'var(--font-jetbrains, monospace)' }}
            onClick={() => handleSubmit(chip)}
          >
            {chip}
          </button>
        ))}
      </div>
      <form
        className="flex items-center gap-[10px] mx-[14px] mb-[14px] mt-[6px] rounded-[12px] px-[12px] py-[10px]"
        style={{ border: '1px solid var(--hairline2)', background: 'rgba(0,0,0,.25)', transition: 'border-color .2s, box-shadow .2s' }}
        onSubmit={e => { e.preventDefault(); handleSubmit(query) }}
        onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(174,194,255,.45)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(174,194,255,.10)' }}
        onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline2)'; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
      >
        <span className="font-mono flex-shrink-0" style={{ fontSize: 10, color: 'var(--ghost2)' }}>ask</span>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); if (!e.target.value) setAnswer(null) }}
          placeholder="ask anything about this collection…"
          className="flex-1 bg-transparent outline-none"
          style={{ fontSize: 12.5, color: 'var(--mist)' }}
          aria-label="Ask about this collection"
        />
        <button
          type="submit"
          className="flex-shrink-0 flex items-center justify-center rounded-[8px]"
          style={{
            width: 30, height: 30,
            background: 'linear-gradient(180deg,rgba(174,194,255,.18),rgba(174,194,255,.08))',
            border: '1px solid rgba(174,194,255,.35)',
          }}
          aria-label="Submit question"
        >
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="var(--phosphor)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  )
}
