import { FeatureBlock } from './FeatureBlock'
import { CaptureDemo } from './CaptureDemo'
import { ProductVideo } from './ProductVideo'
import { StepRail } from './StepRail'

export function SetupBlock() {
  return (
    <FeatureBlock
      id="setup"
      eyebrow="setup"
      heading="Tell it what you're tracking."
      body={'Name a project, describe what you want in plain English — “Full Name, Company, LinkedIn URL, Location.” AI suggests a column list, picks a sensible key, and you\'ve got a real schema before you\'ve captured anything.'}
      media={
        <ProductVideo
          src="/videos/setup-flow.mp4"
          poster="/videos/setup-flow-poster.webp"
          alt="Creating a project: naming it, generating columns from a plain-English description, and picking a key column"
        />
      }
      frameless
    />
  )
}

export function CaptureBlock() {
  return (
    <FeatureBlock
      id="capture"
      eyebrow="capture"
      heading="One key. Straight into the project."
      body="Alt+N grabs the whole screen, Alt+S lets you select a region. The pill shows which project you're capturing into — add a note if you want, or don't. No picker, no folder, no decision."
      media={<CaptureDemo />}
      reverse
    />
  )
}

export function ExtractBlock() {
  return (
    <FeatureBlock
      id="extract"
      eyebrow="extraction"
      heading="It reads the screenshot and files the row."
      body="The moment you dismiss the pill, AI reads the crop and the full screen, matches it against your project's columns, and adds a new row or updates the existing one — matched on your key column, exact value, no fuzzy guessing. You get a notification either way."
      media={
        <ProductVideo
          src="/videos/capture-to-row.mp4"
          poster="/videos/capture-to-row-poster.webp"
          alt="A captured LinkedIn profile screenshot being read by AI and turned into a new row in a CRM project table, with a confirmation notification"
        />
      }
      frameless
    />
  )
}

export function TableBlock() {
  return (
    <FeatureBlock
      id="table"
      eyebrow="the table"
      heading="A real spreadsheet, not a wall of screenshots."
      body="Typed cells — currency, dates, clickable URLs. Click to edit. Toggle to Screenshots to see the raw captures chronologically. A camera icon on each row shows exactly which screenshot(s) built it."
      media={
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/table-view.png"
          alt="nothing.ai's table view — a LinkedIn CRM project with typed columns, a key-column match icon, and a camera icon per row"
          style={{ width: '100%', display: 'block', borderRadius: 12, boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)' }}
        />
      }
      reverse
      frameless
    />
  )
}

// Grid wrapper: rail column (sticky, hidden below 1024px) beside the four
// stacked blocks. FeatureBlock no longer self-centers (that moved here) so
// the rail and the blocks share one page-width column together.
export function FeatureBlocksSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[140px_1fr] gap-6 px-6" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <StepRail />
      <div>
        <SetupBlock />
        <CaptureBlock />
        <ExtractBlock />
        <TableBlock />
      </div>
    </div>
  )
}
