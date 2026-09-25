import { useState } from 'react'
import './App.css'

const candidates = {
  moody: {
    name: 'Ashley Moody',
    party: 'Republican',
    partyShort: 'R',
    role: 'Incumbent U.S. Senator',
    initials: 'AM',
    finance: {
      raised: '$11.27M',
      cash: '$8.49M',
      asOf: 'Reported through July 29, 2026',
    },
    priorities: [
      'Economic prosperity and lower taxes',
      'Law enforcement and public safety',
      'Border security and national sovereignty',
    ],
  },
  nixon: {
    name: 'Angela Nixon',
    party: 'Democratic',
    partyShort: 'D',
    role: 'Florida State Representative',
    initials: 'AN',
    finance: {
      raised: '$974.8K',
      cash: '$265.0K',
      asOf: 'Reported through July 29, 2026',
    },
    priorities: [
      'Expanded healthcare access',
      'Worker and family economic support',
      'Housing affordability and public investment',
    ],
  },
}

const issues = [
  {
    id: 'economy',
    title: 'Economy & Taxes',
    left: {
      summary:
        'Campaign messaging emphasizes tax reductions, economic growth, deregulation, and policies intended to encourage private investment.',
      proposal:
        'Supports a lower-tax, lower-regulation economic approach and highlights recent federal tax reductions.',
      record:
        'Specific legislative votes and bill context will be added from official congressional records.',
      context:
        'Voting records should be shown with the major provisions of each bill rather than reduced to a simple “pro-tax” or “anti-tax” label.',
      source: 'Ashley Moody campaign',
      sourceUrl: 'https://ashleymoody.com/',
    },
    right: {
      summary:
        'Campaign messaging emphasizes affordability, worker support, public investment, and reducing household economic pressures.',
      proposal:
        'Detailed proposal summaries will be added from campaign materials and candidate responses.',
      record:
        'Relevant Florida legislative votes will be added from official state records.',
      context:
        'State legislative votes and federal campaign proposals are different kinds of evidence and will be labeled separately.',
      source: 'Candidate sources — verification in progress',
      sourceUrl: 'https://angienixon.com/',
    },
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    left: {
      summary:
        'Position summary will be based on campaign statements and federal legislative activity.',
      proposal:
        'Specific healthcare proposals are being verified from primary sources.',
      record:
        'Relevant U.S. Senate votes will be linked to the official congressional record.',
      context:
        'The app will distinguish votes on broad budget legislation from votes focused specifically on healthcare.',
      source: 'Official-source research pending',
      sourceUrl: 'https://www.senate.gov/',
    },
    right: {
      summary:
        'Nixon has publicly supported Medicare for All as a model for universal healthcare coverage.',
      proposal:
        'Supports coverage without premiums, deductibles, copays, or surprise medical bills.',
      record:
        'Relevant Florida legislative votes will be added separately from campaign proposals.',
      context:
        'A stated federal policy goal is not the same thing as a completed legislative action, so they appear in separate fields.',
      source: 'Candidate campaign / voter-guide materials',
      sourceUrl: 'https://angienixon.com/',
    },
  },
  {
    id: 'immigration',
    title: 'Immigration',
    left: {
      summary:
        'Campaign messaging emphasizes border security, immigration enforcement, and national sovereignty.',
      proposal:
        'Specific federal proposals will be summarized from candidate statements and official legislative sources.',
      record:
        'Relevant Senate votes will be added with bill numbers and contextual provisions.',
      context:
        'Votes on large immigration or appropriations bills will list other significant provisions when relevant.',
      source: 'Ashley Moody campaign',
      sourceUrl: 'https://ashleymoody.com/',
    },
    right: {
      summary:
        'Nixon has stated support for comprehensive immigration reform and a pathway to citizenship for undocumented residents.',
      proposal:
        'Also supports fair and efficient processing of asylum claims.',
      record:
        'Relevant state-level actions will be separated from federal campaign proposals.',
      context:
        'The summary reflects the candidate’s own stated position rather than an opposing party’s characterization.',
      source: 'VOTE411 candidate response',
      sourceUrl: 'https://www.vote411.org/',
    },
  },
  {
    id: 'abortion',
    title: 'Abortion',
    left: {
      summary:
        'Candidate position and legislative record are being verified from primary sources.',
      proposal:
        'Specific current campaign commitments will appear here once sourced.',
      record:
        'Relevant votes or official actions will be shown independently of campaign statements.',
      context:
        'The app will avoid converting complex legislation into a one-word ideological label.',
      source: 'Primary-source research pending',
      sourceUrl: 'https://ashleymoody.com/',
    },
    right: {
      summary:
        'Candidate position and legislative record are being verified from primary sources.',
      proposal:
        'Specific current campaign commitments will appear here once sourced.',
      record:
        'Relevant votes or official actions will be shown independently of campaign statements.',
      context:
        'The same evidence rules are applied to both candidates.',
      source: 'Primary-source research pending',
      sourceUrl: 'https://angienixon.com/',
    },
  },
  {
    id: 'guns',
    title: 'Guns',
    left: {
      summary:
        'Candidate statements and relevant legislative activity will be summarized here.',
      proposal:
        'Current policy commitments are being verified.',
      record:
        'Federal votes will link to official Senate or Congress.gov records.',
      context:
        'Voting records will include the legislation’s major provisions when necessary for context.',
      source: 'Primary-source research pending',
      sourceUrl: 'https://www.congress.gov/',
    },
    right: {
      summary:
        'Candidate statements and relevant legislative activity will be summarized here.',
      proposal:
        'Current policy commitments are being verified.',
      record:
        'State legislative activity will link to official Florida records.',
      context:
        'The presentation will use the same fields and level of detail for both candidates.',
      source: 'Primary-source research pending',
      sourceUrl: 'https://www.myfloridahouse.gov/',
    },
  },
  {
    id: 'energy',
    title: 'Energy & Environment',
    left: {
      summary:
        'Campaign messaging favors expanding domestic energy production while also addressing Florida-specific environmental concerns.',
      proposal:
        'Specific proposals will be added from campaign and legislative sources.',
      record:
        'Relevant federal actions will be documented with dates and source links.',
      context:
        'Energy production and Florida coastal drilling policy may involve different positions and will not be collapsed into one label.',
      source: 'Candidate and congressional sources',
      sourceUrl: 'https://ashleymoody.com/',
    },
    right: {
      summary:
        'Campaign materials emphasize renewable energy, grid resilience, climate policy, and consumer energy costs.',
      proposal:
        'Specific proposals will be summarized directly from campaign materials.',
      record:
        'Relevant state legislative actions will be added where available.',
      context:
        'Campaign promises and completed legislative actions remain separate categories.',
      source: 'Candidate campaign',
      sourceUrl: 'https://angienixon.com/',
    },
  },
]

function CandidateHeader({ candidate, side }) {
  return (
    <article className={`candidate-card ${side}`}>
      <div className="candidate-avatar">{candidate.initials}</div>
      <div>
        <div className="party-line">
          <span className={`party-dot ${side}`}></span>
          {candidate.party}
        </div>
        <h2>{candidate.name}</h2>
        <p className="candidate-role">{candidate.role}</p>
      </div>
    </article>
  )
}

function IssueCard({ issue }) {
  const [open, setOpen] = useState(false)

  return (
    <section className={`issue-card ${open ? 'open' : ''}`}>
      <button className="issue-heading" onClick={() => setOpen(!open)}>
        <span>{issue.title}</span>
        <span className="expand-symbol">{open ? '−' : '+'}</span>
      </button>

      <div className="issue-summary-grid">
        <p>{issue.left.summary}</p>
        <p>{issue.right.summary}</p>
      </div>

      {open && (
        <div className="issue-details-grid">
          {[issue.left, issue.right].map((data, index) => (
            <div className="detail-column" key={index}>
              <h4>Campaign proposal</h4>
              <p>{data.proposal}</p>

              <h4>Relevant record</h4>
              <p>{data.record}</p>

              <h4>Important context</h4>
              <p>{data.context}</p>

              <a
                className="source-link"
                href={data.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Source: {data.source} ↗
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function App() {
  const [state, setState] = useState('Florida')
  const [view, setView] = useState('overview')

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">CC</div>
          <div>
            <strong>Candidate Compare</strong>
            <span>Evidence before spin</span>
          </div>
        </div>

        <nav>
          <button
            className={view === 'overview' ? 'nav-active' : ''}
            onClick={() => setView('overview')}
          >
            Compare
          </button>
          <button
            className={view === 'method' ? 'nav-active' : ''}
            onClick={() => setView('method')}
          >
            How it works
          </button>
        </nav>
      </header>

      {view === 'overview' ? (
        <main>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">2026 ELECTION GUIDE</span>
              <h1>Know who's running.<br />Know where they stand.</h1>
              <p>
                Candidate positions, campaign promises, voting records,
                financial data and original sources — organized in one
                side-by-side view.
              </p>
            </div>

            <div className="state-picker">
              <label htmlFor="state">Choose your state</label>
              <select
                id="state"
                value={state}
                onChange={(event) => setState(event.target.value)}
              >
                <option>Florida</option>
              </select>
              <span>Prototype currently available for Florida</span>
            </div>
          </section>

          <section className="race-heading">
            <div>
              <span className="eyebrow">{state.toUpperCase()}</span>
              <h2>U.S. Senate — Special Election</h2>
              <p>November 3, 2026</p>
            </div>

            <div className="race-note">
              Also on the ballot: <strong>Neil Gillespie</strong> — No Party
              Affiliation
            </div>
          </section>

          <section className="candidate-grid">
            <CandidateHeader candidate={candidates.moody} side="republican" />
            <div className="versus">VS</div>
            <CandidateHeader candidate={candidates.nixon} side="democratic" />
          </section>

          <section className="comparison-section">
            <div className="section-title">
              <span className="eyebrow">AT A GLANCE</span>
              <h2>Key priorities</h2>
              <p>
                Short summaries first. Expand individual issues for the
                underlying evidence and context.
              </p>
            </div>

            <div className="priority-grid">
              <div className="priority-column">
                {candidates.moody.priorities.map((priority) => (
                  <div className="priority-item" key={priority}>
                    <span>✓</span>
                    {priority}
                  </div>
                ))}
              </div>

              <div className="priority-column">
                {candidates.nixon.priorities.map((priority) => (
                  <div className="priority-item" key={priority}>
                    <span>✓</span>
                    {priority}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="comparison-section">
            <div className="section-title">
              <span className="eyebrow">ISSUES</span>
              <h2>Side-by-side positions</h2>
              <p>Click any issue for proposals, record, context and sources.</p>
            </div>

            <div className="comparison-labels">
              <strong>{candidates.moody.name}</strong>
              <strong>{candidates.nixon.name}</strong>
            </div>

            <div className="issues-list">
              {issues.map((issue) => (
                <IssueCard issue={issue} key={issue.id} />
              ))}
            </div>
          </section>

          <section className="comparison-section">
            <div className="section-title">
              <span className="eyebrow">CAMPAIGN FINANCE</span>
              <h2>Follow the money</h2>
              <p>
                Reported campaign receipts and cash on hand. Detailed donor
                categories will be added from official FEC records.
              </p>
            </div>

            <div className="finance-grid">
              <div className="finance-card">
                <div className="finance-name">{candidates.moody.name}</div>
                <div className="money">{candidates.moody.finance.raised}</div>
                <span>Total receipts</span>
                <hr />
                <div className="finance-secondary">
                  <strong>{candidates.moody.finance.cash}</strong>
                  <span>Cash on hand</span>
                </div>
                <small>{candidates.moody.finance.asOf}</small>
              </div>

              <div className="finance-card">
                <div className="finance-name">{candidates.nixon.name}</div>
                <div className="money">{candidates.nixon.finance.raised}</div>
                <span>Total receipts</span>
                <hr />
                <div className="finance-secondary">
                  <strong>{candidates.nixon.finance.cash}</strong>
                  <span>Cash on hand</span>
                </div>
                <small>{candidates.nixon.finance.asOf}</small>
              </div>
            </div>

            <div className="finance-footnote">
              Future version: individual contributions · PAC/committee
              contributions · self-funding · notable disclosed contributors ·
              outside spending
            </div>
          </section>

          <section className="evidence-box">
            <div className="evidence-icon">✓</div>
            <div>
              <h3>Evidence-first comparisons</h3>
              <p>
                Candidate statements are summarized from identified sources.
                Voting records and campaign-finance information are presented
                separately from campaign promises. Complex bills should include
                important additional provisions rather than being reduced to a
                misleading one-word label.
              </p>
            </div>
          </section>

          <div className="prototype-warning">
            <strong>Academic prototype:</strong> Some policy fields are
            intentionally marked as awaiting source verification. Candidate
            Compare does not endorse candidates.
          </div>
        </main>
      ) : (
        <main className="method-page">
          <span className="eyebrow">OUR METHOD</span>
          <h1>Show the evidence. Let the voter decide.</h1>

          <div className="method-grid">
            <article>
              <span>01</span>
              <h3>What they say</h3>
              <p>
                Current positions and campaign promises should come first from
                the candidate's own campaign, statements, interviews and
                debates.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>What they did</h3>
              <p>
                Votes and official actions should come from Congress.gov,
                Senate records, state legislatures and other primary government
                records.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>What funded the campaign</h3>
              <p>
                Federal campaign-finance numbers should come from Federal
                Election Commission filings and should distinguish direct
                contributions from independent outside spending.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>Context matters</h3>
              <p>
                A vote on a large bill should include important lesser-known
                provisions when those provisions materially affect how the vote
                may be understood.
              </p>
            </article>

            <article>
              <span>05</span>
              <h3>Same questions</h3>
              <p>
                Candidates in the same race receive the same issue categories,
                fields and evidence standards.
              </p>
            </article>

            <article>
              <span>06</span>
              <h3>No candidate score</h3>
              <p>
                The application organizes evidence rather than assigning a
                political candidate a truth, quality or recommendation score.
              </p>
            </article>
          </div>
        </main>
      )}

      <footer>
        <strong>Candidate Compare</strong>
        <span>Academic prototype · 2026</span>
      </footer>
    </div>
  )
}

export default App
