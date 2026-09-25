'use client'

import { useState } from 'react'
import { Reveal } from '@/components/apple/Reveal'
import { capture } from '@/lib/posthog'
import { TEMPLATES, type Template } from '@/lib/home'
import { SectionHead } from './SectionHead'

// One-click templates aren't in the desktop app yet, so each card carries
// the one line you'd type into "What are you tracking?" — the app turns it
// into these fields today. When a template gets `status: 'live'` + `href`,
// the card links there instead (integration point: lib/home.ts).
function TemplateCard({ t }: { t: Template }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    capture('template_clicked', { template: t.id, action: 'copy' })
    try {
      await navigator.clipboard.writeText(t.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {
      /* clipboard blocked — the prompt is visible on the card to copy by hand */
    }
  }

  return (
    <article className="card-warm flex flex-col" style={{ height: '100%', background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: 14, padding: 22 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>{t.name}</h3>
      <ul className="flex flex-wrap" style={{ gap: 6, marginTop: 12 }} aria-label={`${t.name} fields`}>
        {t.fields.map(f => (
          <li key={f} style={{ fontSize: 12.5, padding: '4px 9px', borderRadius: 6, background: '#F2EFE9', color: '#1A1A1A' }}>{f}</li>
        ))}
      </ul>
      <p style={{ fontSize: 13, lineHeight: 1.5, color: '#6B6B6B', marginTop: 14, flex: 1 }}>“{t.prompt}”</p>
      {t.status === 'live' && t.href ? (
        <a href={t.href} className="link-warm" style={{ fontSize: 14, marginTop: 14 }} onClick={() => capture('template_clicked', { template: t.id, action: 'open' })}>
          Use this template →
        </a>
      ) : (
        <button type="button" onClick={copy} className="tpl-copy" aria-live="polite">
          {copied ? 'Copied — paste it into the app' : 'Copy to start this project'}
        </button>
      )}
    </article>
  )
}

export function TemplatesSection() {
  return (
    <section id="templates" className="home-section" style={{ background: '#F2EFE9' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SectionHead
          eyebrow="templates"
          title="Don’t start from scratch."
          body="Choose what you’re tracking and start with the fields already set up."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginTop: 'clamp(28px,4vw,44px)' }}>
          {TEMPLATES.map((t, i) => (
            <Reveal key={t.id} variant="light" panel index={i}>
              <TemplateCard t={t} />
            </Reveal>
          ))}
        </div>
        <Reveal variant="light">
          <p style={{ fontSize: 14, color: '#6B6B6B', textAlign: 'center', marginTop: 22 }}>
            Paste it into <span style={{ color: '#1A1A1A' }}>What are you tracking?</span> in the app — Nothing sets up the fields for you.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
