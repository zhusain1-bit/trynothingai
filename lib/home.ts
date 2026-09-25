// Homepage content that's likely to grow: use cases and templates. Kept as
// data so each use case can later get its own page (set `href`) and each
// template can later open in the app (set `status: 'live'` + `href`)
// without touching the components.

export type UseCase = {
  id: 'networking' | 'jobs' | 'apartments' | 'research'
  label: string
  /** What you're looking at when you capture. */
  sourceLabel: string
  /** One example record, field → value, in display order. */
  record: [string, string][]
  /** Dedicated landing page, once one exists (/networking, /jobs, …). Unset = no link rendered. */
  href?: string
}

export const USE_CASES: UseCase[] = [
  {
    id: 'networking',
    label: 'Networking',
    sourceLabel: 'LinkedIn profile',
    record: [
      ['Name', 'Jordan Ellis'],
      ['Role', 'Senior Product Manager'],
      ['Company', 'Northwind Analytics'],
      ['Location', 'Austin, TX'],
      ['LinkedIn', 'linkedin.com/in/jordan-ellis-demo'],
    ],
  },
  {
    id: 'jobs',
    label: 'Job search',
    sourceLabel: 'Job listing',
    record: [
      ['Company', 'Alder & Finch Capital'],
      ['Role', 'Financial Analyst'],
      ['Salary', '$105k–$125k'],
      ['Location', 'New York'],
      ['Status', 'Saved'],
    ],
  },
  {
    id: 'apartments',
    label: 'Apartments',
    sourceLabel: 'Rental listing',
    record: [
      ['Rent', '$3,450/mo'],
      ['Beds', '1'],
      ['Neighborhood', 'SoHo'],
      ['Sq ft', '720'],
      ['Address', '47 Tamsin Street'],
    ],
  },
  {
    id: 'research',
    label: 'Research',
    sourceLabel: 'Article or PDF',
    record: [
      ['Source', 'Harwell Review'],
      ['Topic', 'Networking habits'],
      ['Key finding', '62% update their contact tracker less than once a week'],
      ['Date', 'Feb 18, 2026'],
    ],
  },
]

export type Template = {
  id: string
  name: string
  /** The one line you'd type into the app's "What are you tracking?" box. */
  prompt: string
  fields: string[]
  /** 'soon' until one-click templates ship in the desktop app; until then the card's prompt is copied and pasted into project creation. */
  status: 'live' | 'soon'
  /** Where "use this template" goes once templates are live. */
  href?: string
}

export const TEMPLATES: Template[] = [
  { id: 'networking', name: 'Networking Tracker', prompt: 'People I meet while networking — name, role, company, location, LinkedIn and notes', fields: ['Name', 'Role', 'Company', 'Location', 'LinkedIn', 'Notes'], status: 'soon' },
  { id: 'jobs', name: 'Job Application Tracker', prompt: 'Jobs I’m applying to — company, role, salary, location, status and when I applied', fields: ['Company', 'Role', 'Salary', 'Location', 'Status', 'Applied on'], status: 'soon' },
  { id: 'apartments', name: 'Apartment Hunt', prompt: 'Apartments I’m considering — address, rent, beds, square feet, neighborhood and link', fields: ['Address', 'Rent', 'Beds', 'Sq ft', 'Neighborhood', 'Link'], status: 'soon' },
  { id: 'research', name: 'Research Library', prompt: 'Articles and papers I read — source, topic, key finding, date and link', fields: ['Source', 'Topic', 'Key finding', 'Date', 'Link'], status: 'soon' },
]
