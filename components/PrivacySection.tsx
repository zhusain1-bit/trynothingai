import { Chapter } from '@/components/apple/Chapter'
import { Reveal } from '@/components/apple/Reveal'

const POINTS = [
  {
    icon: '◈',
    title: 'stays on your machine',
    body: 'it sees your screen, so it runs locally. nothing is sent to a server. nothing is stored in the cloud unless you choose to.',
  },
  {
    icon: '◉',
    title: 'your data is never trained on',
    body: "what you screenshot is yours. we don't see it, we don't use it, we don't improve our model with it.",
  },
  {
    icon: '◎',
    title: 'one memory, any model',
    body: "your collections are your memory. you choose which AI answers from them — your own context, fed to whichever model you prefer. it's your brain, not ours.",
  },
  {
    icon: '◇',
    title: 'only what you ask for leaves',
    body: 'when you explicitly trigger an action — send a reply, create an event — that content goes exactly where you said. nothing else.',
  },
]

export function PrivacySection() {
  return (
    <Chapter
      id="privacy"
      tone="black"
      eyebrow="privacy"
      headline={<>Always with you. <span className="em">Always on your terms.</span></>}
    >
      <div
        className="mx-auto grid grid-cols-1 sm:grid-cols-2 gap-[14px]"
        style={{ maxWidth: 860 }}
      >
        {POINTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 80}>
            <div className="surface h-full flex flex-col gap-[10px]" style={{ padding: 28 }}>
              <div style={{ fontSize: 28, color: 'var(--phosphor)' }}>{p.icon}</div>
              <div className="font-semibold" style={{ fontSize: 17, color: 'var(--mist)' }}>{p.title}</div>
              <p style={{ fontSize: 15, color: 'var(--ghost)', lineHeight: 1.55 }}>{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Chapter>
  )
}
