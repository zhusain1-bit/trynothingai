'use client'

import { useEffect, useRef, useState } from 'react'
import { capture, getSource } from '@/lib/posthog'

// Auto-starts the installer download ~1.2s after landing (the page stays put —
// the release asset is served as an attachment). The manual link is always
// rendered so no-JS and blocked-autostart visitors still have a path.
export function DownloadKick() {
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const [kicked, setKicked] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      anchorRef.current?.click()
      setKicked(true)
      capture('download_started', { trigger: 'auto', source: getSource() })
    }, 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col items-center gap-[10px]">
      {/* Hidden kick target — programmatic click starts the file download */}
      <a ref={anchorRef} href="/download/latest" className="sr-only" tabIndex={-1} aria-hidden="true">
        download installer
      </a>
      <p className="font-mono" style={{ fontSize: 12, color: '#6B6B6B' }} aria-live="polite">
        {kicked
          ? 'downloading — check your browser’s downloads.'
          : 'your download will begin in a moment…'}
      </p>
      <a
        href="/download/latest"
        className="link-warm"
        style={{ fontSize: 15, color: '#C2410C' }}
        onClick={() => capture('download_started', { trigger: 'manual', source: getSource() })}
      >
        download didn&rsquo;t start? get it manually
      </a>
    </div>
  )
}
