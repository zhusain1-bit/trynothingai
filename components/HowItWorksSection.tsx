export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      label: 'capture',
      title: 'Take a screenshot.',
      body: "nothing.ai lives in a global hotkey. press it, and it wakes up just long enough to see what you captured. then it disappears.",
    },
    {
      num: '02',
      label: 'understand',
      title: 'It reads it.',
      body: "on-device. no cloud. it recognizes what's in the shot — an event, a price, a login, a reminder — and decides what to do with it.",
    },
    {
      num: '03',
      label: 'act',
      title: 'It does something useful.',
      body: 'files it into a smart collection. adds a calendar event. sets a reminder. drafts a reply. routes into the apps you already use. or just saves it quietly for later.',
    },
  ]

  return (
    <section
      className="w-full max-w-[700px] mx-auto px-4"
      aria-labelledby="how-heading"
    >
      <div className="text-center mb-[36px]">
        <span className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: 'var(--ghost2)' }}>
          how it works
        </span>
        <h2
          id="how-heading"
          className="mt-[10px] font-semibold tracking-tight"
          style={{ fontSize: 'clamp(22px,3.5vw,30px)', color: 'var(--mist)' }}
        >
          The AI without a face.
        </h2>
        <p className="font-mono mt-[8px]" style={{ fontSize: 11, color: 'var(--ghost2)', fontStyle: 'italic' }}>
          because i don't wanna stop the flow state.
        </p>
      </div>

      <div className="flex flex-col gap-[8px]">
        {steps.map(step => (
          <div key={step.num} className="surface p-[14px_18px]">
            <div className="flex items-center gap-[10px] mb-[8px]">
              <span className="font-mono font-semibold" style={{ fontSize: 10, color: 'var(--phosphor)', letterSpacing: '.12em' }}>
                {step.num} · {step.label}
              </span>
            </div>
            <div className="font-semibold mb-[5px]" style={{ fontSize: 15, color: 'var(--mist)' }}>
              {step.title}
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--ghost)', lineHeight: 1.55 }}>
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
