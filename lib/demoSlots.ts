// Every product demo on the homepage renders into a fixed-shape slot defined
// here. The slots are sized for the final Remotion renders; until a render
// exists (`src` unset) the slot shows interim content (the old footage or an
// HTML mock) so the page is reviewable.
//
// Remotion pass: render each composition at `render` (and `mobileRender`,
// if set — phones get their own tighter crop, never a shrunk desktop frame),
// export MP4 (H.264, muted) + a poster (WebP of the payoff moment) to
// public/demos/, then set `src` / `poster` (and the mobile
// variants) below. Nothing else needs to change. Masters live outside the site,
// in "NothingAI Production/marketing-reference/previews/".

export type DemoSlotId =
  | 'hero'
  | 'usecase-networking'
  | 'usecase-jobs'
  | 'usecase-apartments'
  | 'usecase-research'
  | 'how-setup'
  | 'how-capture'
  | 'how-table'
  | 'provenance'
  | 'ask'

type Render = { width: number; height: number; fps: number; seconds: number }

export type DemoSlot = {
  /** CSS aspect-ratio at ≥ `mobileBelow` px wide. Must match `render`. */
  aspect: string
  /** CSS aspect-ratio below `mobileBelow`. Must match `mobileRender`. */
  mobileAspect?: string
  /** Width (px) below which the mobile shape/render is used — where the section's layout goes single-column. */
  mobileBelow: 560 | 640 | 900
  render: Render
  mobileRender?: Render
  /** Final renders — unset until the Remotion pass lands them. MP4 (H.264) plays everywhere;
   *  `webm` is optional and only worth adding if it's meaningfully smaller (for the Phase 1 UI
   *  footage it wasn't, so those slots ship MP4 only). */
  src?: string
  webm?: string
  mobileSrc?: string
  mobileWebm?: string
  /** Shown before playback and, under reduced motion, instead of it. */
  poster?: string
  mobilePoster?: string
  /** loop — continuous (hero; the render's loop is seamless).
   *  select — plays from 0 whenever the slot is shown (tabbed demos), holds the last frame.
   *  once — plays when it meaningfully enters the viewport, holds the last frame, replays on re-entry.
   *  Default: loop. */
  playback?: 'loop' | 'select' | 'once'
  /** Hero only: fetch immediately. Everything else loads when near the viewport. */
  priority?: boolean
  /** What the composition shows, beat by beat. */
  brief: string
}

export const DEMO_SLOTS: Record<DemoSlotId, DemoSlot> = {
  hero: {
    aspect: '16 / 9',
    mobileAspect: '4 / 3',
    render: { width: 1920, height: 1080, fps: 30, seconds: 9 },
    mobileRender: { width: 1440, height: 1080, fps: 30, seconds: 9 },
    mobileBelow: 560,
    priority: true,
    playback: 'loop',
    src: '/demos/hero.mp4',
    mobileSrc: '/demos/hero-mobile.mp4',
    poster: '/demos/hero-poster.webp',
    mobilePoster: '/demos/hero-mobile-poster.webp',
    brief:
      'SOURCE: professional profile fills the frame, name/role/company legible. CAPTURE: region selection drawn over the profile — the selection is the focal point. RESULT: tight close-up of the new row landing in the table. PAYOFF: pull back to the whole project with the confirmation. Mobile: end on the row close-up, no wide shot.',
  },
  'usecase-networking': {
    aspect: '16 / 9',
    mobileAspect: '4 / 5',
    render: { width: 1920, height: 1080, fps: 30, seconds: 4.2 },
    mobileRender: { width: 1080, height: 1350, fps: 30, seconds: 4.2 },
    mobileBelow: 560,
    playback: 'select',
    src: '/demos/usecase-networking.mp4',
    mobileSrc: '/demos/usecase-networking-mobile.mp4',
    poster: '/demos/usecase-networking-poster.webp',
    mobilePoster: '/demos/usecase-networking-mobile-poster.webp',
    brief: 'LinkedIn-style profile → selection → record card fills in: Name, Role, Company, Location, LinkedIn.',
  },
  'usecase-jobs': {
    aspect: '16 / 9',
    mobileAspect: '4 / 5',
    render: { width: 1920, height: 1080, fps: 30, seconds: 4.2 },
    mobileRender: { width: 1080, height: 1350, fps: 30, seconds: 4.2 },
    mobileBelow: 560,
    playback: 'select',
    src: '/demos/usecase-jobs.mp4',
    mobileSrc: '/demos/usecase-jobs-mobile.mp4',
    poster: '/demos/usecase-jobs-poster.webp',
    mobilePoster: '/demos/usecase-jobs-mobile-poster.webp',
    brief: 'Job listing → selection → record: Company, Role, Salary, Location, Status.',
  },
  'usecase-apartments': {
    aspect: '16 / 9',
    mobileAspect: '4 / 5',
    render: { width: 1920, height: 1080, fps: 30, seconds: 4.2 },
    mobileRender: { width: 1080, height: 1350, fps: 30, seconds: 4.2 },
    mobileBelow: 560,
    playback: 'select',
    src: '/demos/usecase-apartments.mp4',
    mobileSrc: '/demos/usecase-apartments-mobile.mp4',
    poster: '/demos/usecase-apartments-poster.webp',
    mobilePoster: '/demos/usecase-apartments-mobile-poster.webp',
    brief: 'Rental listing → selection → record: Rent, Beds, Neighborhood, Sq ft, Address.',
  },
  'usecase-research': {
    aspect: '16 / 9',
    mobileAspect: '4 / 5',
    render: { width: 1920, height: 1080, fps: 30, seconds: 4.2 },
    mobileRender: { width: 1080, height: 1350, fps: 30, seconds: 4.2 },
    mobileBelow: 560,
    playback: 'select',
    src: '/demos/usecase-research.mp4',
    mobileSrc: '/demos/usecase-research-mobile.mp4',
    poster: '/demos/usecase-research-poster.webp',
    mobilePoster: '/demos/usecase-research-mobile-poster.webp',
    brief: 'Article/PDF page with a highlighted passage → record: Source, Topic, Key finding, Date.',
  },
  'how-setup': {
    aspect: '1 / 1',
    mobileAspect: '4 / 3',
    mobileBelow: 900,
    playback: 'select',
    src: '/demos/how-setup.mp4',
    mobileSrc: '/demos/how-setup-mobile.mp4',
    poster: '/demos/how-setup-poster.webp',
    mobilePoster: '/demos/how-setup-mobile-poster.webp',
    render: { width: 1080, height: 1080, fps: 30, seconds: 6 },
    mobileRender: { width: 1440, height: 1080, fps: 30, seconds: 6 },
    brief: 'Tight on the New project dialog: type "People I meet while networking for investment banking" → fields appear (Name, Role, Company, Location, LinkedIn, Notes) → Create.',
  },
  'how-capture': {
    aspect: '1 / 1',
    mobileAspect: '4 / 3',
    mobileBelow: 900,
    playback: 'select',
    src: '/demos/how-capture.mp4',
    mobileSrc: '/demos/how-capture-mobile.mp4',
    poster: '/demos/how-capture-poster.webp',
    mobilePoster: '/demos/how-capture-mobile-poster.webp',
    render: { width: 1080, height: 1080, fps: 30, seconds: 4 },
    mobileRender: { width: 1440, height: 1080, fps: 30, seconds: 4 },
    brief: 'Tight on the source: Alt+S, drag the selection over a profile, capture pill confirms the project. (Other source types are the section’s own chips, desktop only.)',
  },
  'how-table': {
    aspect: '1 / 1',
    mobileAspect: '4 / 3',
    mobileBelow: 900,
    render: { width: 1080, height: 1080, fps: 30, seconds: 5 },
    mobileRender: { width: 1440, height: 1080, fps: 30, seconds: 5 },
    brief: 'Tight on the table: several records land one after another, each with its source type.',
  },
  provenance: {
    aspect: '16 / 10',
    mobileAspect: '4 / 5',
    mobileBelow: 640,
    render: { width: 1600, height: 1000, fps: 30, seconds: 5.5 },
    mobileRender: { width: 1080, height: 1350, fps: 30, seconds: 5.5 },
    playback: 'once',
    src: '/demos/provenance.mp4',
    mobileSrc: '/demos/provenance-mobile.mp4',
    poster: '/demos/provenance-poster.webp',
    mobilePoster: '/demos/provenance-mobile-poster.webp',
    brief: 'Records in the table → click one → inspector slides in from the right: each field tagged with its source, original screenshot preview, "Open" the source.',
  },
  ask: {
    aspect: '16 / 10',
    mobileAspect: '4 / 5',
    mobileBelow: 560,
    render: { width: 1600, height: 1000, fps: 30, seconds: 8 },
    mobileRender: { width: 1080, height: 1350, fps: 30, seconds: 8 },
    brief: 'Type "Show me everyone in New York." → submit → non-matching rows fade/filter out, matches stay emphasized. Then "Which jobs pay over $100k?" on a jobs project.',
  },
}
