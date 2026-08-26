// Placeholder mock UI — not a real screenshot. The static "screen behind the
// pill" for the Capture feature block: a LinkedIn-profile-like page, so the
// CapturePillMock (capturing into "LinkedIn CRM Task3") sits over a screen
// that actually matches the project it names — and sets up the same Jordan
// Ellis example the Extraction block's video demo (02-profile-to-crm-row)
// pays off.
//
// Light-toned on purpose: this mocks a real LinkedIn-style webpage (which is
// a light UI), not a dark app — only the CapturePillMock overlay on top of
// it is a literal dark floating pill (matches the real capture-pill
// screenshot), the page behind it should not read as "dark mode."
export function CaptureContextMock() {
  return (
    <div style={{ width: '100%', borderRadius: 8, overflow: 'hidden', background: '#fff', border: '1px solid #E5E0D8' }}>
      <div aria-hidden="true" style={{ height: 56, background: 'linear-gradient(135deg,#BFDCD3,#E7D9B8)' }} />
      <div style={{ padding: '0 14px 12px' }}>
        <span
          aria-hidden="true"
          className="font-mono"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38, borderRadius: '50%',
            background: '#F2EFE9', border: '3px solid #fff', marginTop: -19,
            color: '#6B6B6B', fontSize: 12,
          }}
        >
          JE
        </span>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginTop: 8 }}>Jordan Ellis</div>
        <div style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>Senior Product Manager · Northwind Analytics</div>
        <div className="font-mono" style={{ fontSize: 10, color: '#6B6B6B', marginTop: 4 }}>Austin, TX</div>
      </div>
    </div>
  )
}
