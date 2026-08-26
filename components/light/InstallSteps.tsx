import { Reveal } from '@/components/apple/Reveal'

const STEPS = [
  { label: '01 · run', stat: 'Open the installer.', body: 'NothingAI-Setup.exe — from your downloads bar or folder.' },
  { label: '02 · smartscreen', stat: '"More info" → "Run anyway."', body: 'Windows warns about apps it hasn’t seen before. nothing.ai is safe — it runs entirely on your machine.' },
  { label: '03 · summon', stat: 'Press Alt+N or Alt+S.', body: 'instant capture or region-select — it reads it and files the row. no window to find for capture; open the app anytime to see your tables.' },
]

export function InstallSteps() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ maxWidth: 900, margin: '0 auto' }}>
      {STEPS.map((s, i) => (
        <Reveal key={s.label} variant="light" index={i}>
          <div className="card-warm" style={{ background: '#F2EFE9', border: '1px solid #E5E0D8', borderRadius: 12, padding: 24, height: '100%' }}>
            <div className="font-mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B6B6B' }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1A1A', marginTop: 8 }}>{s.stat}</div>
            <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 8, lineHeight: 1.55 }}>{s.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
