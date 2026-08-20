// Placeholder mock UI — not a real screenshot. The static "screen behind the
// pill" for the Capture feature block: a Slack-like conversation so the
// CapturePillMock sits over a real screen, not a void.

type Message = { id: string; name: string; text: string; highlighted?: boolean }

const MESSAGES: Message[] = [
  { id: 'm1', name: 'Priya', text: 'pushed the deck to the shared drive' },
  { id: 'm2', name: 'Jon', text: 'looks good — one typo on slide 4' },
  { id: 'm3', name: 'Priya', text: 'tour at 4?', highlighted: true },
  { id: 'm4', name: 'Jon', text: 'works for me' },
]

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="font-mono"
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: '#3A3A3A',
        color: 'rgba(255,255,255,.5)',
        fontSize: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {name[0]}
    </span>
  )
}

export function CaptureContextMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {MESSAGES.map(m => (
        <div
          key={m.id}
          className="flex items-start gap-2"
          style={{
            padding: '6px 8px',
            borderRadius: 8,
            background: m.highlighted ? 'rgba(194,65,12,.14)' : 'transparent',
          }}
        >
          <Avatar name={m.name} />
          <div>
            <div className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>{m.name}</div>
            <div style={{ fontSize: 13, color: '#E5E5E5', marginTop: 2 }}>{m.text}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
