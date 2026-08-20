// Explicit dark-scheme wrapper for /reset, now that the site-wide default
// (html color-scheme, body background) is light. Mirrors components/light/WarmPage.tsx.
export function DarkPage({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--void)', color: 'var(--mist)', minHeight: '100vh', colorScheme: 'dark' }}>
      {children}
    </div>
  )
}
