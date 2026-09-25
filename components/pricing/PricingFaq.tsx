'use client'

import { useId, useState } from 'react'
import { capture } from '@/lib/posthog'
import { PLANS, afterLine, introLine, isLive } from '@/lib/pricing'

const ind = PLANS.individual
const ent = PLANS.enterprise
const uploadsLive = isLive('pdfUploads') && isLive('imageUploads') && isLive('spreadsheetUploads')

// Answers that depend on what's shipped read from the feature config, so they
// stop saying "rolling out" the moment a status is flipped to 'live'.
const FAQS: { q: string; a: string }[] = [
  {
    q: 'What’s included in the introductory price?',
    a: `The discounted rate applies to your first ${ind.introMonths} months — ${introLine(ind)} on Individual, ${introLine(ent)} on Enterprise. After that, the plan moves to its standard price: ${afterLine(ind)} for Individual, ${afterLine(ent)} for Enterprise.`,
  },
  {
    q: 'Can I upload PDFs and files on Individual?',
    a: uploadsLive
      ? 'Yes. Individual includes the full core experience — screenshots, PDFs, images and spreadsheets, all turned into structured projects.'
      : 'Yes — PDF, image and CSV / Excel uploads are part of Individual, not an Enterprise extra. They’re rolling out now; today, capture works from screenshots.',
  },
  {
    q: 'What’s the main difference between Individual and Enterprise?',
    a: 'Individual is built around your personal workspace. Enterprise adds shared team workspaces, collaboration, administration, automation, higher usage and organization-level controls.',
  },
  {
    q: 'Is Enterprise available today?',
    a: 'Enterprise is rolling out with early teams. Contact sales and we’ll walk you through what’s live, onboard your team, and set up your first shared projects with you.',
  },
  {
    q: 'Is Enterprise priced per user?',
    a: `Yes. Enterprise is ${introLine(ent)}, then ${afterLine(ent)}.`,
  },
  {
    q: 'Can I export my data?',
    a: isLive('exports')
      ? 'Yes. CSV / Excel export is included on both Individual and Enterprise.'
      : 'CSV / Excel export is coming to both Individual and Enterprise. Your projects already live in a database on your own PC, and they stay yours.',
  },
  {
    q: 'Is it Windows-only?',
    a: 'Yes, today — Windows 10 and 11. macOS is coming; you can join the waitlist from the download page.',
  },
  {
    q: 'Do Enterprise users get a different extraction model?',
    a: 'No. Both plans get the same core Nothing intelligence. Enterprise is different in scale, collaboration, automation, administration and support — not in extraction quality.',
  },
]

export function PricingFaq() {
  const [open, setOpen] = useState<number | null>(null)
  const baseId = useId()

  function toggle(i: number) {
    const next = open === i ? null : i
    setOpen(next)
    if (next !== null) capture('faq_opened', { question: FAQS[i].q })
  }

  return (
    <section id="faq" style={{ padding: 'clamp(80px, 12vw, 140px) 24px 0' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: 'clamp(30px, 4.2vw, 44px)',
            color: '#1A1A1A',
            textAlign: 'center',
          }}
        >
          Questions
        </h2>
        <div style={{ marginTop: 'clamp(24px, 4vw, 40px)', borderTop: '1px solid #E5E0D8' }}>
          {FAQS.map((item, i) => {
            const isOpen = open === i
            const btnId = `${baseId}-q${i}`
            const panelId = `${baseId}-a${i}`
            return (
              <div key={item.q} style={{ borderBottom: '1px solid #E5E0D8' }}>
                <h3>
                  <button id={btnId} type="button" className="faq-trigger" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(i)}>
                    {item.q}
                    <svg className="faq-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M8 2v12M2 8h12" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen}>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: '#6B6B6B', paddingBottom: 22, maxWidth: 620 }}>{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
