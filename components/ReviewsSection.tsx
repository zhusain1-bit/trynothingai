import { Chapter } from '@/components/apple/Chapter'
import { Reveal } from '@/components/apple/Reveal'

type Review = { name: string; handle: string; quote: string }

// Placeholder reviews — swap for real user quotes at launch.
const REVIEWS: Review[] = [
  { name: 'Maya Lindqvist', handle: 'mayabuilds', quote: 'screenshotted a flight confirmation at the gate. landed, and it was already on my calendar. i never opened anything!' },
  { name: 'Dev Anand', handle: 'devdoesthings', quote: 'the best part of nothing is that there’s nothing. no window, no chat. i press the hotkey and my problem is gone!' },
  { name: 'Sofia Reyes', handle: 'sofiareyes_', quote: 'i have 4,000 screenshots. for the first time they’re not a graveyard. so good!' },
  { name: 'Jonah Park', handle: 'jonahships', quote: 'screenshot an email, paste the reply. my coworkers think i got fast. i got nothing!' },
  { name: 'Amara Okafor', handle: 'amaraokafor', quote: 'it’s the only app i can’t show people. there’s literally nothing on my screen. that’s the review!' },
  { name: 'Felix Braun', handle: 'felixbraun', quote: 'snipped three prices, asked which was cheapest. one line back! no tabs, no spreadsheet.' },
  { name: 'Priya Natarajan', handle: 'priyacodes', quote: 'on-device sold me. my screenshots are my whole life and they don’t go anywhere. obsessed!' },
  { name: 'Sam Whitfield', handle: 'samwhit', quote: 'i stopped writing things down. i just snip! it remembers the reason i took the picture.' },
  { name: 'Lena Kowalski', handle: 'lenak', quote: 'signed up on a whim. the demo where the reply is just… in your clipboard?? unreasonable!' },
  { name: 'Marcus Hale', handle: 'marcushale', quote: 'my todo app is dead. i screenshot the thing, a reminder appears, i move on!' },
  { name: 'Yuki Tanaka', handle: 'yukibuilds', quote: '⊞ ⇧ S is the whole interface. honestly, it’s enough!' },
  { name: 'Omar El-Sayed', handle: 'omarelsayed', quote: 'asked it “when does my trial end” and it answered from a screenshot i forgot i took. slightly scary. mostly great!' },
  { name: 'Claire Dubois', handle: 'clairedubois', quote: 'snip a trial screen and it reminds me before i’m charged. it’s paid for itself already!' },
  { name: 'Tomás Rivera', handle: 'tomasrivera', quote: 'i keep trying to explain it and the pitch is just: it does something, then it disappears. 10/10!' },
  { name: 'Nina Vasiliev', handle: 'ninavasiliev', quote: 'the name is accurate. it adds nothing to my screen, and that’s the best feature of anything i’ve installed this year!' },
]

const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

// Middle column runs slower and in reverse; differing durations desync the loops.
const COLS = [
  { items: REVIEWS.slice(0, 5), dur: '46s', rev: false, cls: '' },
  { items: REVIEWS.slice(5, 10), dur: '60s', rev: true, cls: 'hidden sm:block' },
  { items: REVIEWS.slice(10, 15), dur: '52s', rev: false, cls: 'hidden lg:block' },
]

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure
      className="surface flex flex-col gap-[12px]"
      // 30 continuously-transforming cards with live backdrop blur is a GPU
      // hazard, and the blur samples nothing useful over the flat void bg.
      style={{ padding: 20, backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
    >
      <figcaption className="flex items-center gap-[10px]">
        <span
          aria-hidden="true"
          className="font-mono flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 34,
            height: 34,
            fontSize: 11,
            letterSpacing: '0.04em',
            color: 'var(--ghost)',
            background: 'var(--vapor)',
            border: '1px solid var(--hairline)',
          }}
        >
          {initials(review.name)}
        </span>
        <span className="flex flex-col" style={{ lineHeight: 1.3 }}>
          <span className="font-semibold" style={{ fontSize: 14, color: 'var(--mist)' }}>{review.name}</span>
          <span className="font-mono" style={{ fontSize: 11, color: 'var(--ghost2)' }}>@{review.handle}</span>
        </span>
        <span
          className="ml-auto"
          role="img"
          aria-label="5 out of 5 stars"
          style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--phosphor)', whiteSpace: 'nowrap' }}
        >
          ★★★★★
        </span>
      </figcaption>
      <blockquote style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ghost)' }}>{review.quote}</blockquote>
    </figure>
  )
}

export function ReviewsSection() {
  return (
    <Chapter
      id="reviews"
      defer
      eyebrow="wall of love"
      headline={<>People screenshot. <span className="em">People talk.</span></>}
      sub="early users, in their own words."
    >
      <Reveal>
        <div
          className="marquee-wall mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]"
          style={{ maxWidth: 1080 }}
        >
          {COLS.map((col, i) => (
            <div key={i} className={`marquee-viewport ${col.cls}`}>
              <div
                className={col.rev ? 'marquee-track marquee-rev' : 'marquee-track'}
                style={{ '--marquee-dur': col.dur } as React.CSSProperties}
              >
                <ul className="marquee-copy">
                  {col.items.map((r) => (
                    <li key={r.handle}><ReviewCard review={r} /></li>
                  ))}
                </ul>
                {/* Duplicate copy makes the -50% loop seamless; hidden from AT
                    and dropped entirely under reduced motion (→ static grid). */}
                <ul className="marquee-copy marquee-dup" aria-hidden="true">
                  {col.items.map((r) => (
                    <li key={r.handle}><ReviewCard review={r} /></li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Chapter>
  )
}
