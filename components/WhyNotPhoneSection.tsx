import { Chapter } from '@/components/apple/Chapter'
import { Reveal } from '@/components/apple/Reveal'

const OTHERS = [
  'your phone organizer stays on your phone',
  'your work AI stops at the work boundary',
  'context resets every session',
  'you still have to open an app to find the thing',
]

const NOTHING = [
  'one brain across phone + PC',
  'faceless — no window, no app to switch to',
  'routes into the apps you already use',
  'the screenshot you took on your laptop is on your phone too, already filed',
]

export function WhyNotPhoneSection() {
  return (
    <Chapter
      eyebrow="cross-device"
      headline={<>One brain. <span className="em">Any screen.</span></>}
      sub="your phone's organizer stops at your phone. your work assistant stops at work."
    >
      <Reveal>
        <div
          className="mx-auto grid grid-cols-1 md:grid-cols-2"
          style={{ maxWidth: 900 }}
        >
          <div className="flex flex-col gap-[12px] px-[28px] py-[24px]">
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--ghost2)', letterSpacing: '.08em' }}>
              — every other tool
            </div>
            {OTHERS.map(item => (
              <div key={item} className="flex items-start gap-[10px]" style={{ fontSize: 15, color: 'var(--ghost)', lineHeight: 1.5 }}>
                <span className="font-mono flex-shrink-0 mt-[1px]" style={{ color: 'var(--ghost2)' }}>·</span>
                {item}
              </div>
            ))}
          </div>
          <div
            className="flex flex-col gap-[12px] px-[28px] py-[24px] max-md:!border-l-0 max-md:!border-t max-md:!border-t-[rgba(255,255,255,0.10)]"
            style={{ borderLeft: '1px solid var(--hairline)' }}
          >
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--phosphor)', letterSpacing: '.08em' }}>
              — nothing.ai
            </div>
            {NOTHING.map(item => (
              <div key={item} className="flex items-start gap-[10px]" style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.5 }}>
                <span className="font-mono flex-shrink-0 mt-[1px]" style={{ color: 'var(--phosphor)' }}>→</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Chapter>
  )
}
