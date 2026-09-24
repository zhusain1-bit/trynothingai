// Single source of truth for plans, prices, and feature availability.
// Every price and every "is this built yet" claim on the site reads from here —
// change a number or flip a status in this file and the pricing page, the
// homepage pricing section, the download page, and the OG image all follow.

export type PlanId = 'individual' | 'enterprise'

export type Plan = {
  id: PlanId
  name: string
  descriptor: string
  description: string
  introPrice: number
  standardPrice: number
  introMonths: number
  perUser: boolean
  cta: { label: string; href: string }
  /** Heading above the feature list. */
  featuresIntro?: string
  features: FeatureKey[]
}

// ─── Integration points ─────────────────────────────────────────────────
// Individual: subscribing happens inside the desktop app (Settings → plan →
// Stripe Checkout via nothing-ai-server's /v1/checkout), so the site's CTA
// sends people to the download. If a web checkout is ever added, point this
// at it — nothing else needs to change.
export const INDIVIDUAL_CHECKOUT_HREF = '/download'
// Enterprise: no sales backend exists — it's a prefilled email to the
// founder inbox already used sitewide (footer, privacy page).
export const CONTACT_SALES_HREF =
  'mailto:hi@trynothingai.com?subject=' + encodeURIComponent('nothing.ai Enterprise')

/** Not a hard number yet — the server enforces a per-user daily spend cap, not a published quota. */
export const CAPTURE_ALLOWANCE_LABEL = 'Generous monthly capture allowance'

// ─── Feature availability ───────────────────────────────────────────────
// 'live' = shipped in the current desktop app. 'soon' = on the roadmap and
// rendered with a visible "soon" marker. Verified against the app source
// (NothingAI Production, 2026-09-24): no file/PDF/spreadsheet import, no
// export, no templates, no team features exist yet.
export type Status = 'live' | 'soon'

export const FEATURES = {
  screenshotCapture: { label: 'Screenshot capture', status: 'live' },
  structuredRecords: { label: 'Screenshots → structured records', status: 'live' },
  customProjects: { label: 'Unlimited custom projects', status: 'live' },
  customSchemas: { label: 'Custom fields and schemas', status: 'live' },
  aiSchemas: { label: 'AI-generated project schemas', status: 'live' },
  tableView: { label: 'Table view', status: 'live' },
  sourcesView: { label: 'Sources view', status: 'soon' },
  imageUploads: { label: 'Image uploads', status: 'soon' },
  pdfUploads: { label: 'PDF uploads', status: 'soon' },
  spreadsheetUploads: { label: 'CSV / Excel uploads', status: 'soon' },
  ask: { label: 'Ask your projects', status: 'live' },
  provenance: { label: 'Source provenance', status: 'live' },
  search: { label: 'Search across your captures', status: 'live' },
  templates: { label: 'Project templates', status: 'soon' },
  exports: { label: 'CSV / Excel export', status: 'soon' },
  standardBatch: { label: 'Standard batch processing', status: 'soon' },
  personalWorkspace: { label: 'Personal workspace', status: 'live' },
  standardPriority: { label: 'Standard processing priority', status: 'live' },
  captureAllowance: { label: CAPTURE_ALLOWANCE_LABEL, status: 'live' },

  sharedWorkspaces: { label: 'Shared team workspaces', status: 'soon' },
  sharedProjects: { label: 'Shared projects', status: 'soon' },
  collaborators: { label: 'Multiple collaborators', status: 'soon' },
  comments: { label: 'Comments', status: 'soon' },
  orgSearch: { label: 'Organization-wide search', status: 'soon' },
  orgAsk: { label: 'Organization-wide Ask', status: 'soon' },
  sharedTemplates: { label: 'Shared project templates', status: 'soon' },
  sourceLibrary: { label: 'Centralized source library', status: 'soon' },
  pooledLimits: { label: 'Higher / pooled capture limits', status: 'soon' },
  largeBatch: { label: 'Large batch processing', status: 'soon' },
  higherFileLimits: { label: 'Higher file limits', status: 'soon' },
  automatedIngestion: { label: 'Automated ingestion', status: 'soon' },
  integrations: { label: 'Advanced integrations', status: 'soon' },
  api: { label: 'API access', status: 'soon' },
  roles: { label: 'Role-based permissions', status: 'soon' },
  adminConsole: { label: 'Admin console', status: 'soon' },
  provisioning: { label: 'User provisioning and deprovisioning', status: 'soon' },
  auditLogs: { label: 'Audit logs', status: 'soon' },
  retention: { label: 'Data retention controls', status: 'soon' },
  dataControls: { label: 'Organization data controls', status: 'soon' },
  priorityProcessing: { label: 'Priority processing', status: 'soon' },
  // Human services, not software — deliverable today.
  prioritySupport: { label: 'Priority support', status: 'live' },
  teamOnboarding: { label: 'Team onboarding', status: 'live' },
  customSetup: { label: 'Custom project / schema setup', status: 'live' },
  selfServeOnboarding: { label: 'Self-service onboarding', status: 'live' },
} as const satisfies Record<string, { label: string; status: Status }>

export type FeatureKey = keyof typeof FEATURES

export const isLive = (key: FeatureKey) => FEATURES[key].status === 'live'

// ─── Plans ──────────────────────────────────────────────────────────────
export const PLANS: Record<PlanId, Plan> = {
  individual: {
    id: 'individual',
    name: 'Individual',
    descriptor: 'Your information, organized.',
    description: 'Capture anything you see and turn it into structured, searchable projects.',
    introPrice: 11.99,
    standardPrice: 19.99,
    introMonths: 2,
    perUser: false,
    cta: { label: 'Get Individual', href: INDIVIDUAL_CHECKOUT_HREF },
    features: [
      'screenshotCapture', 'structuredRecords', 'customProjects', 'customSchemas', 'aiSchemas',
      'tableView', 'ask', 'provenance', 'search', 'captureAllowance', 'personalWorkspace',
      'standardPriority',
      'sourcesView', 'imageUploads', 'pdfUploads', 'spreadsheetUploads', 'templates', 'exports',
      'standardBatch',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    descriptor: "Your team's information, connected.",
    description: 'Turn everything your organization sees into shared, structured intelligence.',
    introPrice: 79.99,
    standardPrice: 99.99,
    introMonths: 2,
    perUser: true,
    cta: { label: 'Contact Sales', href: CONTACT_SALES_HREF },
    featuresIntro: 'Everything in Individual, plus:',
    features: [
      'prioritySupport', 'teamOnboarding', 'customSetup',
      'sharedWorkspaces', 'sharedProjects', 'collaborators', 'orgSearch', 'orgAsk',
      'sharedTemplates', 'sourceLibrary', 'pooledLimits', 'largeBatch', 'higherFileLimits',
      'automatedIngestion', 'integrations', 'api', 'roles', 'adminConsole', 'provisioning',
      'auditLogs', 'retention', 'dataControls', 'priorityProcessing',
    ],
  },
}

// ─── Formatting ─────────────────────────────────────────────────────────
export const formatPrice = (n: number) => `$${n.toFixed(2).replace(/\.00$/, '')}`

/** "/month" or "/user/month" */
export const perUnit = (plan: Plan) => (plan.perUser ? '/user/month' : '/month')

/** e.g. "$11.99/month for your first 2 months" */
export const introLine = (plan: Plan) =>
  `${formatPrice(plan.introPrice)}${perUnit(plan)} for your first ${plan.introMonths} months`

/** e.g. "$19.99/month after" */
export const afterLine = (plan: Plan) => `${formatPrice(plan.standardPrice)}${perUnit(plan)} after`

// ─── Comparison table ───────────────────────────────────────────────────
// true = included, false = not included (dash), string = qualified value.
// A cell renders a "soon" marker when its feature isn't live yet;
// `enterpriseFeature` lets a row's Enterprise side track a different
// (Enterprise-only) feature than its Individual side.
export type Cell = boolean | string
export type ComparisonRow = {
  label: string
  feature: FeatureKey
  enterpriseFeature?: FeatureKey
  individual: Cell
  enterprise: Cell
}

export const COMPARISON: { group: string; rows: ComparisonRow[] }[] = [
  {
    group: 'Core',
    rows: [
      { label: 'Capture screenshots', feature: 'screenshotCapture', individual: true, enterprise: true },
      { label: 'Upload images', feature: 'imageUploads', individual: true, enterprise: true },
      { label: 'Upload PDFs', feature: 'pdfUploads', individual: true, enterprise: true },
      { label: 'Upload CSV / Excel', feature: 'spreadsheetUploads', individual: true, enterprise: true },
      { label: 'Custom projects', feature: 'customProjects', individual: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Custom schemas', feature: 'customSchemas', individual: true, enterprise: true },
      { label: 'AI-generated schemas', feature: 'aiSchemas', individual: true, enterprise: true },
      { label: 'Table view', feature: 'tableView', individual: true, enterprise: true },
      { label: 'Sources view', feature: 'sourcesView', individual: true, enterprise: true },
      { label: 'Source provenance', feature: 'provenance', individual: true, enterprise: true },
      { label: 'Search', feature: 'search', individual: true, enterprise: true },
      { label: 'Ask Nothing', feature: 'ask', individual: true, enterprise: true },
      { label: 'Exports', feature: 'exports', individual: 'CSV / Excel', enterprise: 'CSV / Excel' },
    ],
  },
  {
    group: 'Scale',
    rows: [
      { label: 'Monthly capture allowance', feature: 'captureAllowance', enterpriseFeature: 'pooledLimits', individual: 'Generous', enterprise: 'Higher / pooled' },
      { label: 'File size / upload allowance', feature: 'pdfUploads', enterpriseFeature: 'higherFileLimits', individual: 'Standard', enterprise: 'Higher' },
      { label: 'Batch processing', feature: 'standardBatch', enterpriseFeature: 'largeBatch', individual: 'Standard', enterprise: 'Large' },
      { label: 'Processing priority', feature: 'standardPriority', enterpriseFeature: 'priorityProcessing', individual: 'Standard', enterprise: 'Priority' },
      { label: 'Pooled usage', feature: 'pooledLimits', individual: false, enterprise: true },
    ],
  },
  {
    group: 'Collaboration',
    rows: [
      { label: 'Shared workspace', feature: 'sharedWorkspaces', individual: false, enterprise: true },
      { label: 'Shared projects', feature: 'sharedProjects', individual: false, enterprise: true },
      { label: 'Multiple users', feature: 'collaborators', individual: false, enterprise: true },
      { label: 'Comments / collaboration', feature: 'comments', individual: false, enterprise: true },
      { label: 'Organization-wide search', feature: 'orgSearch', individual: false, enterprise: true },
      { label: 'Organization-wide Ask Nothing', feature: 'orgAsk', individual: false, enterprise: true },
      { label: 'Shared templates', feature: 'sharedTemplates', individual: false, enterprise: true },
    ],
  },
  {
    group: 'Automation',
    rows: [
      { label: 'Automated ingestion', feature: 'automatedIngestion', individual: false, enterprise: true },
      { label: 'Advanced integrations', feature: 'integrations', individual: false, enterprise: true },
      { label: 'API access', feature: 'api', individual: false, enterprise: true },
    ],
  },
  {
    group: 'Admin & security',
    rows: [
      { label: 'Admin console', feature: 'adminConsole', individual: false, enterprise: true },
      { label: 'Roles and permissions', feature: 'roles', individual: false, enterprise: true },
      { label: 'Provisioning', feature: 'provisioning', individual: false, enterprise: true },
      { label: 'Audit logs', feature: 'auditLogs', individual: false, enterprise: true },
      { label: 'Retention controls', feature: 'retention', individual: false, enterprise: true },
      { label: 'Organization data controls', feature: 'dataControls', individual: false, enterprise: true },
    ],
  },
  {
    group: 'Support',
    rows: [
      { label: 'Self-service onboarding', feature: 'selfServeOnboarding', individual: true, enterprise: true },
      { label: 'Priority support', feature: 'prioritySupport', individual: false, enterprise: true },
      { label: 'Team onboarding', feature: 'teamOnboarding', individual: false, enterprise: true },
      { label: 'Custom schema / project setup', feature: 'customSetup', individual: false, enterprise: true },
    ],
  },
]
