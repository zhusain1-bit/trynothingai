import { NextResponse } from 'next/server'

// Resolve the latest signed Windows installer from the public releases repo and redirect to it,
// so the "Download for Windows" button always serves the current version (survives version bumps).
// Cached 5 min to stay well under GitHub's API rate limit. Falls back to the releases page on any error.
const RELEASES_API = 'https://api.github.com/repos/zhusain1-bit/nothing-ai-releases/releases/latest'
const RELEASES_PAGE = 'https://github.com/zhusain1-bit/nothing-ai-releases/releases/latest'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const r = await fetch(RELEASES_API, {
      headers: { accept: 'application/vnd.github+json' },
      next: { revalidate: 300 },
    })
    if (!r.ok) return NextResponse.redirect(RELEASES_PAGE, 302)
    const rel = (await r.json()) as { assets?: { name?: string; browser_download_url?: string }[] }
    const asset = (rel.assets ?? []).find(
      (a) => typeof a.name === 'string' && a.name.toLowerCase().endsWith('.exe'),
    )
    if (!asset?.browser_download_url) return NextResponse.redirect(RELEASES_PAGE, 302)
    return NextResponse.redirect(asset.browser_download_url, 302)
  } catch {
    return NextResponse.redirect(RELEASES_PAGE, 302)
  }
}
