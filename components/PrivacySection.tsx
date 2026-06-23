export function PrivacySection() {
  const points = [
    {
      icon: '◈',
      title: 'stays on your machine',
      body: 'it sees your screen, so it runs locally. nothing is sent to a server. nothing is stored in the cloud unless you choose to.',
    },
    {
      icon: '◉',
      title: 'your data is never trained on',
      body: 'what you screenshot is yours. we don\'t see it, we don\'t use it, we don\'t improve our model with it.',
    },
    {
      icon: '◎',
      title: 'one memory, any model',
      body: 'your collections are your memory. you choose which AI answers from them — your own context, fed to whichever model you prefer. it\'s your brain, not ours.',
    },
    {
      icon: '◇',
      title: 'only what you ask for leaves',
      body: 'when you explicitly trigger an action — send a reply, create an event — that content goes exactly where you said. nothing else.',
    },
  ]

  return (
    <section
      className="w-full max-w-[860px] mx-auto px-4"
      aria-labelledby="privacy-heading"
    >
      <div className="text-center mb-[40px]">
        <span className="font-mono text-[11px] uppercase tracking-[.18em]" style={{ color: 'var(--ghost2)' }}>
          privacy
        </span>
        <h2
          id="privacy-heading"
          className="mt-[10px] font-semibold tracking-tight"
          style={{ fontSize: 'clamp(22px,3.5vw,32px)', color: 'var(--mist)' }}
        >
          Always with you, but on your terms.
        </h2>
      </div>

      <div
        className="grid gap-[10px]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
      >
        {points.map(p => (
          <div key={p.title} className="surface p-[18px_20px] flex flex-col gap-[8px]">
            <div style={{ fontSize: 18, color: 'var(--phosphor)' }}>{p.icon}</div>
            <div className="font-semibold" style={{ fontSize: 13.5, color: 'var(--mist)' }}>{p.title}</div>
            <p style={{ fontSize: 12.5, color: 'var(--ghost)', lineHeight: 1.55 }}>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
