import { StripCard } from '@/components/strip/StripCard'
import { SongCard } from '@/components/illustrations/SongCard'
import { TrialCard } from '@/components/illustrations/TrialCard'
import { BoardingPass } from '@/components/illustrations/BoardingPass'
import { LoginCard } from '@/components/illustrations/LoginCard'
import { OrderCard } from '@/components/illustrations/OrderCard'

const CARDS = [
  {
    name: 'Save a song',
    toastText: 'Added to · Songs',
    desc: "screenshot a track → it's in your list",
    delayMs: 0,
    thumbnail: <div style={{ position: 'absolute', inset: 0 }}><SongCard className="w-full h-full" /></div>,
  },
  {
    name: 'Free-trial reminder',
    toastText: 'Reminder · cancel Apr 9',
    desc: "screenshot it → pinged before you're charged",
    delayMs: 500,
    thumbnail: <div style={{ position: 'absolute', inset: 0 }}><TrialCard className="w-full h-full" /></div>,
  },
  {
    name: 'Custom rules',
    toastText: 'Auto-filed by rule · Mexico',
    desc: '“any trip to Mexico → Mexico collection”',
    ruleFlag: 'flight to MX → Mexico',
    delayMs: 1000,
    thumbnail: <BoardingPass className="absolute inset-0" />,
  },
  {
    name: 'Save a password',
    toastText: 'Saved to autofill',
    desc: 'screenshot a login → ready to autofill',
    soon: true,
    delayMs: 1500,
    thumbnail: <div style={{ position: 'absolute', inset: 0 }}><LoginCard className="w-full h-full" /></div>,
  },
  {
    name: 'Log an order',
    toastText: 'Arriving Thu · return Apr 9',
    desc: 'screenshot the confirmation → arrival + returns',
    delayMs: 2000,
    thumbnail: <div style={{ position: 'absolute', inset: 0 }}><OrderCard className="w-full h-full" /></div>,
  },
]

// Apple-style horizontal snap rail of the five small-feature cards.
// Each listitem wrapper is the snap-rail flex child (.snap-rail > * sizing).
export function HighlightsRail() {
  return (
    <div className="snap-rail w-full" role="list" aria-label="More things it does">
      {CARDS.map(({ name, ...card }) => (
        <div key={name} role="listitem">
          <StripCard name={name} {...card} />
        </div>
      ))}
    </div>
  )
}
