'use client'

export function HeroWaitlistInline() {
  function scrollToWaitlist(e: React.FormEvent) {
    e.preventDefault()
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col items-center gap-[10px] w-full" style={{ maxWidth: 420 }}>
      <form className="flex gap-[8px] w-full" onSubmit={scrollToWaitlist}>
        <input
          type="email"
          placeholder="your@email.com"
          aria-label="Email for waitlist"
          className="flex-1 rounded-[11px] px-[13px] py-[10px] outline-none transition-shadow"
          style={{
            background: 'rgba(255,255,255,.05)',
            border: '1px solid var(--hairline2)',
            color: 'var(--mist)',
            fontSize: 13.5,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(174,194,255,.45)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(174,194,255,.10)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline2)'; e.currentTarget.style.boxShadow = '' }}
        />
        <button type="submit" className="btn-phosphor flex-shrink-0" style={{ fontSize: 13 }}>
          Get founding access
        </button>
      </form>
      <p className="font-mono text-center" style={{ fontSize: 10, color: 'var(--ghost2)' }}>
        no charge now · founding users get 50% off at launch
      </p>
    </div>
  )
}
