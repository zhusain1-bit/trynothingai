export function WhyNotPhoneSection() {
  return (
    <section
      className="w-full max-w-[640px] mx-auto px-4"
      aria-labelledby="cross-device-heading"
    >
      <div className="text-center mb-[36px]">
        <span className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: 'var(--ghost2)' }}>
          cross-device
        </span>
        <h2
          id="cross-device-heading"
          className="mt-[10px] font-semibold tracking-tight"
          style={{ fontSize: 'clamp(20px,3.2vw,28px)', color: 'var(--mist)' }}
        >
          Your phone's organizer stops at your phone.
        </h2>
        <p className="mt-[10px] font-mono" style={{ fontSize: 12, color: 'var(--ghost2)' }}>
          your work assistant stops at work.
        </p>
      </div>

      <div className="flex flex-col gap-[28px]">
        {/* Every other tool */}
        <div>
          <div className="font-mono mb-[12px]" style={{ fontSize: 10.5, color: 'var(--ghost2)', letterSpacing: '.08em' }}>
            — every other tool
          </div>
          <div className="flex flex-col gap-[8px] pl-[14px]">
            {[
              'your phone organizer stays on your phone',
              'your work AI stops at the work boundary',
              'context resets every session',
              'you still have to open an app to find the thing',
            ].map(item => (
              <div key={item} className="flex items-start gap-[10px]" style={{ fontSize: 14, color: 'var(--ghost)', lineHeight: 1.5 }}>
                <span className="font-mono flex-shrink-0 mt-[1px]" style={{ color: 'var(--ghost2)' }}>·</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--hairline)' }} />

        {/* nothing.ai */}
        <div>
          <div className="font-mono mb-[12px]" style={{ fontSize: 10.5, color: 'var(--phosphor)', letterSpacing: '.08em' }}>
            — nothing.ai
          </div>
          <div className="flex flex-col gap-[8px] pl-[14px]">
            {[
              'one brain across phone + PC',
              'faceless — no window, no app to switch to',
              'routes into the apps you already use',
              'the screenshot you took on your laptop is on your phone too, already filed',
            ].map(item => (
              <div key={item} className="flex items-start gap-[10px]" style={{ fontSize: 14, color: 'var(--ghost)', lineHeight: 1.5 }}>
                <span className="font-mono flex-shrink-0 mt-[1px]" style={{ color: 'var(--phosphor)' }}>→</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
