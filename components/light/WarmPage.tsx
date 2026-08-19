// Overrides the dark body defaults locally for light-system pages, without
// touching global body CSS (which /reset still relies on).
export function WarmPage({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#FAF8F5', color: '#1A1A1A', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
