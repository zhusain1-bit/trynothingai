// Line icons for the pricing diagrams — 1.5px stroke, currentColor, matching
// the hairline weight of the rest of the warm system. Decorative only.
type P = { size?: number }
const base = (size: number) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true,
})

export const IconScreenshot = ({ size = 16 }: P) => (
  <svg {...base(size)}><path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" /></svg>
)
export const IconDoc = ({ size = 16 }: P) => (
  <svg {...base(size)}><path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></svg>
)
export const IconImage = ({ size = 16 }: P) => (
  <svg {...base(size)}><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><path d="m4 17 5-5 4 4 2.5-2.5L20 18" /><circle cx="15.5" cy="9.5" r="1.25" /></svg>
)
export const IconFile = ({ size = 16 }: P) => (
  <svg {...base(size)}><path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" /><path d="M14 3v4h4" /></svg>
)
export const IconSheet = ({ size = 16 }: P) => (
  <svg {...base(size)}><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M4 10h16M4 15h16M10 4v16" /></svg>
)
export const IconUsers = ({ size = 16 }: P) => (
  <svg {...base(size)}><circle cx="9" cy="9" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M15.5 6.5a3 3 0 0 1 0 5M17.5 19a5.5 5.5 0 0 0-2-4.2" /></svg>
)
export const IconMail = ({ size = 16 }: P) => (
  <svg {...base(size)}><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="m4 7 8 6 8-6" /></svg>
)
export const IconFolder = ({ size = 16 }: P) => (
  <svg {...base(size)}><path d="M3.5 7a1.5 1.5 0 0 1 1.5-1.5h4l2 2h8a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z" /></svg>
)
export const IconContact = ({ size = 16 }: P) => (
  <svg {...base(size)}><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="10" r="2.5" /><path d="M7.5 17a4.5 4.5 0 0 1 9 0" /></svg>
)
export const IconSearch = ({ size = 16 }: P) => (
  <svg {...base(size)}><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></svg>
)
export const IconCheck = ({ size = 16 }: P) => (
  <svg {...base(size)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
)
