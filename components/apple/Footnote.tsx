// Apple-style footnote superscript linking to the #footnotes block above the
// footer. Give the FIRST occurrence of each number a refId ("fnref-N") so the
// footnote's return link has somewhere to land.
export function Fn({ n, refId }: { n: number; refId?: string }) {
  return (
    <sup id={refId} style={{ fontSize: '0.62em', lineHeight: 0 }}>
      <a
        href={`#footnote-${n}`}
        aria-label={`Footnote ${n}`}
        className="link-ghost"
        style={{ textDecoration: 'none', padding: '0 1px' }}
      >
        {n}
      </a>
    </sup>
  )
}
