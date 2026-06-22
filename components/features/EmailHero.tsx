'use client'

import { useState, useRef, useCallback, type CSSProperties } from 'react'
import { SnipOverlay, SNIP_INITIAL, type SnipState } from './SnipOverlay'
import { useAnimationLoop } from './useAnimationLoop'
import { useInView } from './useInView'

const D0 = '"Happy to send the deck before your 4 PM call."'
const D1 = '"I\'ll have it to you within 2 hours, before your 4 PM call."'
const REPLY = "Hi Alex — I'll have the deck to you within 2 hours, comfortably before your 4 PM call."
const CTX_TEXT = 'tell him I can get it done in 2 hours'

export function EmailHero() {
  const { ref: containerRef, inView } = useInView()
  const stageRef  = useRef<HTMLDivElement>(null)
  const infoRef   = useRef<HTMLDivElement>(null)
  const ctxTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const repTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const [snip, setSnip]         = useState<SnipState>(SNIP_INITIAL)
  const [popShow, setPopShow]   = useState(false)
  const [popDone, setPopDone]   = useState(false)
  const [pressing, setPressing]  = useState(false)
  const [ctxShow, setCtxShow]   = useState(false)
  const [ctxTyped, setCtxTyped]  = useState('')
  const [draftText, setDraftText] = useState(D0)
  const [draftUpd, setDraftUpd]  = useState(false)
  const [replyText, setReplyText] = useState('')

  function clearTimers() {
    ctxTimers.current.forEach(clearTimeout); ctxTimers.current = []
    repTimers.current.forEach(clearTimeout); repTimers.current = []
  }

  function typeCtx() {
    clearTimers()
    CTX_TEXT.split('').forEach((_, i) => {
      ctxTimers.current.push(setTimeout(() => setCtxTyped(CTX_TEXT.slice(0, i + 1)), i * 32))
    })
  }

  function typeReply() {
    clearTimers()
    REPLY.split('').forEach((_, i) => {
      repTimers.current.push(setTimeout(() => setReplyText(REPLY.slice(0, i + 1)), i * 24))
    })
  }

  function reset() {
    clearTimers()
    setSnip(SNIP_INITIAL)
    setPopShow(false); setPopDone(false); setPressing(false)
    setCtxShow(false); setCtxTyped('')
    setDraftText(D0); setDraftUpd(false)
    setReplyText('')
  }

  const measureSel = useCallback(() => {
    const stage = stageRef.current, info = infoRef.current
    if (!stage || !info) return
    const sr = stage.getBoundingClientRect(), ir = info.getBoundingClientRect()
    const base: CSSProperties = { left: ir.left - sr.left - 6, top: ir.top - sr.top - 6, width: 0, height: 0 }
    setSnip(s => ({ ...s, selShow: true, selStyle: base }))
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setSnip(s => ({ ...s, selStyle: { ...base, width: ir.width + 12, height: ir.height + 12 } }))
    }))
  }, [])

  useAnimationLoop([
    { ms: 700,  action: () => setSnip(s => ({ ...s, dimShow: true, toolShow: true })) },
    { ms: 1250, action: measureSel },
    { ms: 2350, action: () => setSnip(s => ({ ...s, dimShow: false, toolShow: false, selShow: false, scrimShow: true, flashKey: s.flashKey + 1 })) },
    { ms: 2800, action: () => setPopShow(true) },
    { ms: 3900, action: () => { setCtxShow(true); typeCtx() } },
    { ms: 5900, action: () => { setDraftText(D1); setDraftUpd(true) } },
    { ms: 6800, action: () => setPressing(true) },
    { ms: 7200, action: () => {
      setPressing(false); setPopDone(true)
      setSnip(s => ({ ...s, scrimShow: false }))
      typeReply()
    }},
  ], 11400, reset, inView)

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ overflow: 'hidden' }}>
      <div ref={stageRef} style={{ position: 'absolute', inset: 0 }}>

        {/* ── Source: Gmail page ── */}
        <div style={{ position: 'absolute', inset: 0, background: '#fff', color: '#1a1a1d', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 5 }}>
          {/* Browser chrome */}
          <div style={{ height: 28, background: '#ececE7', display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', borderBottom: '1px solid #d8d8d2', flexShrink: 0 }}>
            <span style={{ color: '#aaa', fontSize: 13, lineHeight: 1, userSelect: 'none' }}>‹ ›</span>
            <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9.5, color: '#666', background: '#fff', border: '1px solid #ddd', borderRadius: 6, padding: '3px 11px', flex: 1, maxWidth: '58%' }}>mail.google.com/mail/u/0</span>
          </div>

          {/* Gmail toolbar */}
          <div style={{ height: 34, display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', borderBottom: '1px solid #eaeaea', color: '#5f6368', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M3 9l9 5 9-5"/></svg>
            <span style={{ fontSize: 11, color: '#80868b', marginLeft: 'auto', fontFamily: 'var(--font-jetbrains,monospace)' }}>Inbox · 1 of 24</span>
          </div>

          {/* Email body — infozone */}
          <div style={{ flex: 1, padding: '15px 18px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div ref={infoRef}>
              <div style={{ fontSize: 17, fontWeight: 600 }}>Re: the deck</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 11 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#7b8cff,#5c63d8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>A</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>Alex Rivera</div>
                  <div style={{ fontSize: 10, color: '#80868b' }}>to me</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: '#80868b' }}>3:48 PM</span>
              </div>
              <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6, color: '#3c4043' }}>
                <p>Hey — when can you send over the deck? I need it before the 4 PM client call today.</p>
                <p>Thanks, Alex</p>
              </div>
            </div>

            {/* Reply box */}
            <div style={{ marginTop: 'auto', border: '1px solid #dadce0', borderRadius: 11, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 9, minHeight: 42 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><path d="M9 17l-5-5 5-5M4 12h11a5 5 0 015 5v1"/></svg>
              <span style={{ fontSize: 12, color: replyText ? '#202124' : '#9aa0a6' }}>
                {replyText || 'Reply to Alex…'}
                {replyText && replyText.length < REPLY.length && (
                  <span style={{ display: 'inline-block', width: 1.5, height: 12, background: '#1a73e8', verticalAlign: -2, animation: 'blink 1s steps(1) infinite' }} />
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Snip overlay */}
        <SnipOverlay {...snip} />

        {/* Detection popup */}
        <div
          style={{
            position: 'absolute', left: '5%', bottom: '7%', zIndex: 50,
            width: 'clamp(260px,58%,340px)',
            borderRadius: 14,
            opacity: popShow ? 1 : 0,
            transform: popShow ? 'none' : 'translateY(14px)',
            background: 'linear-gradient(180deg,rgba(22,24,30,.95),rgba(12,13,18,.97))',
            backdropFilter: 'blur(22px)',
            border: '1px solid var(--hairline2)',
            boxShadow: '0 28px 70px -20px rgba(0,0,0,.85), inset 0 1px 0 rgba(255,255,255,.07)',
            transition: '.45s var(--ease)',
          }}
        >
          <div style={{ display: 'flex', gap: 12, padding: 13 }}>
            {/* Snapshot */}
            <div style={{ flexShrink: 0, width: 62, aspectRatio: '5/4', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--hairline2)', background: '#fff', color: '#1a1a1d', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, padding: 6, fontSize: 5.5 }}>
                <div style={{ fontWeight: 700, fontSize: 6.5 }}>Re: the deck</div>
                <div style={{ marginTop: 4, color: '#555', lineHeight: 1.3 }}>"when can you send the deck? need it before the 4 PM call."</div>
              </div>
            </div>
            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, letterSpacing: '.13em', textTransform: 'uppercase', color: popDone ? 'var(--phosphor)' : 'var(--ghost)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--phosphor)', boxShadow: '0 0 8px var(--phosphor-glow)', display: 'inline-block', flexShrink: 0 }} />
                {popDone ? 'Copied to clipboard' : 'Reply drafted'}
              </div>
              <div style={{ marginTop: 7, fontSize: 13, fontWeight: 600, color: 'var(--mist)' }}>Re: the deck</div>
              <div style={{ marginTop: 6, fontSize: 11, color: draftUpd ? '#d6dcff' : '#b8bcc4', fontStyle: 'italic', lineHeight: 1.45, transition: '.3s' }}>
                {draftText}
              </div>
            </div>
          </div>

          {/* Context field */}
          {!popDone && (
            <div style={{ padding: '4px 13px 0' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ghost2)', background: 'transparent', border: 'none', fontFamily: 'inherit', cursor: 'default', padding: '4px 0' }}>
                <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 13 }}>+</span> add context
              </button>
              {ctxShow && (
                <div style={{ marginTop: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(0,0,0,.34)', border: '1px solid rgba(174,194,255,.4)', borderRadius: 9, padding: '7px 10px', boxShadow: '0 0 0 3px rgba(174,194,255,.08)' }}>
                    <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 9, color: 'var(--ghost2)' }}>note</span>
                    <span style={{ flex: 1, fontSize: 11.5, color: 'var(--mist)' }}>
                      {ctxTyped}
                      {ctxTyped.length < CTX_TEXT.length && <span style={{ display: 'inline-block', width: 1.5, height: 12, background: 'var(--phosphor)', verticalAlign: -2, animation: 'blink 1s steps(1) infinite' }} />}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {!popDone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 13px 13px' }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 13px', borderRadius: 10, fontSize: 12.5, fontWeight: 500,
                  color: '#EAF0FF',
                  background: 'linear-gradient(180deg,rgba(174,194,255,.2),rgba(174,194,255,.1))',
                  border: '1px solid rgba(174,194,255,.45)',
                  boxShadow: pressing ? '0 0 20px -2px var(--phosphor-glow)' : '0 5px 18px -8px var(--phosphor-glow)',
                  transform: pressing ? 'scale(.96)' : 'none', transition: '.2s',
                }}
              >
                Copy reply
                <span style={{ fontFamily: 'var(--font-jetbrains,monospace)', fontSize: 10, background: 'rgba(0,0,0,.3)', border: '1px solid rgba(174,194,255,.4)', borderRadius: 5, padding: '1px 5px' }}>⏎</span>
              </span>
              <span style={{ fontSize: 12, color: 'var(--ghost2)' }}>Dismiss</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
