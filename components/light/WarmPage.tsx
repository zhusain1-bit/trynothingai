// Explicit light-scheme wrapper — mostly redundant now that html/body default
// to the light system, kept for symmetry with DarkPage and explicitness.
export function WarmPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="warm-page" style={{ background: '#FAF8F5', color: '#1A1A1A', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
