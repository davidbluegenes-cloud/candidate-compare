import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'
import nixonPhoto from './assets/angela-nixon.jpg'

function formatMoney(value) {
  if (value === null || value === undefined) return 'Not available'
  const number = Number(value)

  if (number >= 1000000) {
    return `$${(number / 1000000).toFixed(2)}M`
  }

  if (number >= 1000) {
    return `$${(number / 1000).toFixed(1)}K`
  }

  return `$${number.toLocaleString()}`
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

const candidatePhotos = {
  'Ashley Moody':
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Official_Portrait_of_Senator_Ashley_Moody_(cropped).jpg',
  'Angela Nixon': nixonPhoto,
}

function CandidatePhoto({ candidate }) {
  return (
    <div className="candidate-photo-wrap">
      <div className="candidate-photo-fallback">
        {initials(candidate.name)}
      </div>

      <img
        className="candidate-photo"
        src={candidatePhotos[candidate.name]}
        alt={`${candidate.name} portrait`}
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />
    </div>
  )
}

function App() {
  const [page, setPage] = useState('compare')
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [session, setSession] = useState(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginMessage, setLoginMessage] = useState('')

  const emptyForm = {
    candidate_id: '',
    issue: '',
    current_position: '',
    campaign_proposal: '',
    record_summary: '',
    context_summary: '',
    source_label: '',
    source_url: '',
  }

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  async function loadData() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('candidates')
      .select(`
        *,
        positions (*),
        finance (*)
      `)
      .order('id')

    if (error) {
      setError(error.message)
    } else {
      setCandidates(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin(event) {
    event.preventDefault()
    setLoginMessage('Signing in...')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setLoginMessage(error.message)
      return
    }

    setLoginMessage('')
    setPassword('')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setEditingId(null)
    setForm(emptyForm)
  }

  function startCreate() {
    const firstFeatured = candidates.find((candidate) => candidate.featured)

    setEditingId(null)
    setForm({
      ...emptyForm,
      candidate_id: firstFeatured?.id || '',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startEdit(position) {
    setEditingId(position.id)

    setForm({
      candidate_id: position.candidate_id,
      issue: position.issue || '',
      current_position: position.current_position || '',
      campaign_proposal: position.campaign_proposal || '',
      record_summary: position.record_summary || '',
      context_summary: position.context_summary || '',
      source_label: position.source_label || '',
      source_url: position.source_url || '',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function savePosition(event) {
    event.preventDefault()
    setError('')

    if (!form.candidate_id || !form.issue.trim()) {
      setError('Candidate and issue are required.')
      return
    }

    const payload = {
      candidate_id: Number(form.candidate_id),
      issue: form.issue.trim(),
      current_position: form.current_position.trim(),
      campaign_proposal: form.campaign_proposal.trim(),
      record_summary: form.record_summary.trim(),
      context_summary: form.context_summary.trim(),
      source_label: form.source_label.trim(),
      source_url: form.source_url.trim() || null,
      updated_at: new Date().toISOString(),
    }

    let result

    if (editingId) {
      result = await supabase
        .from('positions')
        .update(payload)
        .eq('id', editingId)
    } else {
      result = await supabase.from('positions').insert(payload)
    }

    if (result.error) {
      setError(result.error.message)
      return
    }

    setEditingId(null)
    setForm(emptyForm)
    await loadData()
  }

  async function deletePosition(id) {
    const confirmed = window.confirm(
      'Delete this position from the database?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('positions')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
      return
    }

    await loadData()
  }

  const featured = candidates.filter((candidate) => candidate.featured)
  const otherCandidates = candidates.filter((candidate) => !candidate.featured)

  const left = featured[0]
  const right = featured[1]

  const issueNames = Array.from(
    new Set(
      featured.flatMap((candidate) =>
        (candidate.positions || []).map((position) => position.issue)
      )
    )
  )

  function getPosition(candidate, issue) {
    return candidate?.positions?.find(
      (position) => position.issue === issue
    )
  }

  if (loading) {
    return (
      <div className="loading-screen">
        Loading Candidate Compare...
      </div>
    )
  }

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
            className={page === 'compare' ? 'nav-active' : ''}
            onClick={() => setPage('compare')}
          >
            Compare
          </button>

          <button
            className={page === 'method' ? 'nav-active' : ''}
            onClick={() => setPage('method')}
          >
            How it works
          </button>

          <button
            className={page === 'admin' ? 'nav-active' : ''}
            onClick={() => setPage('admin')}
          >
            Admin
          </button>
        </nav>
      </header>

      {error && <div className="global-error">{error}</div>}

      {page === 'compare' && (
        <main>
          <section className="hero hero-compact">
            <div className="hero-copy hero-copy-wide">
              <span className="eyebrow">2026 ELECTION GUIDE</span>

              <div className="election-selectors">
                <div className="selector-group">
                  <label htmlFor="state-select">State</label>
                  <select id="state-select" defaultValue="Florida">
                    <option>Florida</option>
                  </select>
                </div>

                <div className="selector-group">
                  <label htmlFor="race-select">Race or ballot</label>
                  <select id="race-select" defaultValue="U.S. Senate">
                    <option>U.S. Senate</option>
                    <option disabled>Governor — coming soon</option>
                    <option disabled>U.S. House — coming soon</option>
                    <option disabled>
                      Statewide Ballot Measures — coming soon
                    </option>
                  </select>
                </div>
              </div>

              <p>
                Candidate positions, campaign promises, public records,
                campaign finance and original sources organized in a
                concise side-by-side view.
              </p>

              <span className="prototype-state-note">
                Prototype currently populated for Florida U.S. Senate.
              </span>
            </div>
          </section>

          <section className="race-heading">
            <div>
              <span className="eyebrow">FLORIDA</span>
              <h2>U.S. Senate — Special Election</h2>
              <p>2026 prototype race</p>
            </div>

            {otherCandidates.length > 0 && (
              <div className="race-note">
                Also in database:{' '}
                {otherCandidates.map((candidate, index) => (
                  <span key={candidate.id}>
                    {index > 0 && ', '}
                    <strong>{candidate.name}</strong> — {candidate.party}
                  </span>
                ))}
              </div>
            )}
          </section>

          {left && right ? (
            <>
              <section className="candidate-grid">
                <article className="candidate-card candidate-republican">
                  <CandidatePhoto candidate={left} />

                  <div>
                    <div className="party-line party-republican">
                      <span className="party-color-dot"></span>
                      {left.party}
                    </div>

                    <h2>{left.name}</h2>
                    <p className="candidate-role">{left.role_title}</p>
                  </div>
                </article>

                <div className="versus">VS</div>

                <article className="candidate-card candidate-democratic">
                  <CandidatePhoto candidate={right} />

                  <div>
                    <div className="party-line party-democratic">
                      <span className="party-color-dot"></span>
                      {right.party}
                    </div>

                    <h2>{right.name}</h2>
                    <p className="candidate-role">{right.role_title}</p>
                  </div>
                </article>
              </section>

              <section className="comparison-section">
                <div className="section-title">
                  <span className="eyebrow politics-heading">POLITICS AND CURRENT ISSUES</span>

                  <p>
                    Expand an issue to compare the candidates directly.
                  </p>
                </div>

                <div className="comparison-labels">
                  <strong className="comparison-name republican-heading">
                    {left.name}
                  </strong>

                  <strong className="comparison-name democratic-heading">
                    {right.name}
                  </strong>
                </div>

                <div className="issues-list">
                  {issueNames.map((issue) => {
                    const leftPosition = getPosition(left, issue)
                    const rightPosition = getPosition(right, issue)

                    return (
                      <details className="issue-card" key={issue}>
                        <summary className="issue-heading">
                          <span>{issue}</span>
                          <span>+</span>
                        </summary>

                        <div className="issue-summary-grid">
                          <div className="detail-column">
                            <h4>Current position</h4>
                            <p>
                              {leftPosition?.current_position ||
                                'No verified summary entered yet.'}
                            </p>

                            <h4>Campaign proposal</h4>
                            <p>
                              {leftPosition?.campaign_proposal ||
                                'No verified proposal entered yet.'}
                            </p>

                            <h4>Documented action / record</h4>
                            <p>
                              {leftPosition?.record_summary ||
                                'No record entered yet.'}
                            </p>

                            <h4>Important context</h4>
                            <p>
                              {leftPosition?.context_summary ||
                                'No context entered yet.'}
                            </p>

                            {leftPosition?.source_url ? (
                              <a
                                className="source-link"
                                href={leftPosition.source_url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Source: {leftPosition.source_label || 'Open source'} ↗
                              </a>
                            ) : (
                              <span className="source-link">
                                Source: {leftPosition?.source_label || 'Pending'}
                              </span>
                            )}
                          </div>

                          <div className="detail-column">
                            <h4>Current position</h4>
                            <p>
                              {rightPosition?.current_position ||
                                'No verified summary entered yet.'}
                            </p>

                            <h4>Campaign proposal</h4>
                            <p>
                              {rightPosition?.campaign_proposal ||
                                'No verified proposal entered yet.'}
                            </p>

                            <h4>Documented action / record</h4>
                            <p>
                              {rightPosition?.record_summary ||
                                'No record entered yet.'}
                            </p>

                            <h4>Important context</h4>
                            <p>
                              {rightPosition?.context_summary ||
                                'No context entered yet.'}
                            </p>

                            {rightPosition?.source_url ? (
                              <a
                                className="source-link"
                                href={rightPosition.source_url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Source: {rightPosition.source_label || 'Open source'} ↗
                              </a>
                            ) : (
                              <span className="source-link">
                                Source: {rightPosition?.source_label || 'Pending'}
                              </span>
                            )}
                          </div>
                        </div>
                      </details>
                    )
                  })}
                </div>
              </section>

              <section className="comparison-section">
                <div className="section-title">
                  <span className="eyebrow">CAMPAIGN FINANCE</span>
                  <h2>Follow the money</h2>

                  <p>
                    Finance data is stored separately from policy claims.
                  </p>
                </div>

                <div className="finance-grid">
                  {[left, right].map((candidate) => {
                    const finance = candidate.finance?.[0]

                    return (
                      <div className="finance-card" key={candidate.id}>
                        <div className="finance-name">
                          {candidate.name}
                        </div>

                        <div className="money">
                          {formatMoney(finance?.total_raised)}
                        </div>

                        <span>Total reported receipts</span>

                        <hr />

                        <div className="finance-secondary">
                          <strong>
                            {formatMoney(finance?.cash_on_hand)}
                          </strong>

                          <span>Cash on hand</span>
                        </div>

                        <small>
                          {finance?.as_of_date
                            ? `Data as of ${finance.as_of_date}`
                            : 'Date unavailable'}
                        </small>
                      </div>
                    )
                  })}
                </div>
              </section>
            </>
          ) : (
            <div className="global-error">
              Two featured candidates were not found in the database.
            </div>
          )}

          <section className="evidence-box">
            <div className="evidence-icon">✓</div>

            <div>
              <h3>Evidence-first comparisons</h3>

              <p>
                Candidate statements, campaign promises, voting records,
                bill context and campaign-finance information are kept
                separate so users can inspect the evidence themselves.
              </p>
            </div>
          </section>

          <div className="prototype-warning">
            <strong>Academic prototype:</strong> Some policy fields are
            intentionally marked as awaiting verification. Candidate
            Compare does not endorse candidates.
          </div>
        </main>
      )}

      {page === 'method' && (
        <main className="method-page">
          <span className="eyebrow">OUR METHOD</span>

          <h1>Show the evidence. Let the voter decide.</h1>

          <div className="method-grid">
            <article>
              <span>01</span>
              <h3>What they say</h3>

              <p>
                Campaign material, public statements, interviews and
                debates document stated positions.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>What they did</h3>

              <p>
                Voting records and official actions are stored separately
                from campaign promises.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Where the money comes from</h3>

              <p>
                Campaign-finance information is presented separately from
                policy positions.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>Context matters</h3>

              <p>
                Important provisions of complex legislation can be shown
                so a vote is not reduced to a misleading one-word label.
              </p>
            </article>

            <article>
              <span>05</span>
              <h3>Same structure</h3>

              <p>
                Candidates are displayed using the same issue headings and
                information fields.
              </p>
            </article>

            <article>
              <span>06</span>
              <h3>No candidate score</h3>

              <p>
                The application organizes evidence rather than assigning
                candidates a recommendation or political score.
              </p>
            </article>
          </div>
        </main>
      )}

      {page === 'admin' && (
        <main className="method-page">
          <span className="eyebrow">DATABASE ADMINISTRATION</span>
          <h1>Candidate Compare Admin</h1>

          {!session ? (
            <form className="admin-login" onSubmit={handleLogin}>
              <h2>Administrator login</h2>

              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button type="submit">Log in</button>

              {loginMessage && <p>{loginMessage}</p>}
            </form>
          ) : (
            <>
              <div className="admin-toolbar">
                <span>Logged in as {session.user.email}</span>

                <div>
                  <button onClick={startCreate}>
                    New Position
                  </button>

                  <button onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              </div>

              <form className="admin-form" onSubmit={savePosition}>
                <h2>
                  {editingId
                    ? 'Update database record'
                    : 'Create database record'}
                </h2>

                <label>Candidate</label>

                <select
                  value={form.candidate_id}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      candidate_id: event.target.value,
                    })
                  }
                  required
                >
                  <option value="">Choose candidate</option>

                  {featured.map((candidate) => (
                    <option
                      key={candidate.id}
                      value={candidate.id}
                    >
                      {candidate.name}
                    </option>
                  ))}
                </select>

                <label>Issue</label>

                <input
                  value={form.issue}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      issue: event.target.value,
                    })
                  }
                  placeholder="Example: Education"
                  required
                />

                <label>Current position</label>

                <textarea
                  value={form.current_position}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      current_position: event.target.value,
                    })
                  }
                />

                <label>Campaign proposal</label>

                <textarea
                  value={form.campaign_proposal}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      campaign_proposal: event.target.value,
                    })
                  }
                />

                <label>Relevant record</label>

                <textarea
                  value={form.record_summary}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      record_summary: event.target.value,
                    })
                  }
                />

                <label>Important context</label>

                <textarea
                  value={form.context_summary}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      context_summary: event.target.value,
                    })
                  }
                />

                <label>Source label</label>

                <input
                  value={form.source_label}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      source_label: event.target.value,
                    })
                  }
                  placeholder="Example: Official campaign website"
                />

                <label>Source URL</label>

                <input
                  value={form.source_url}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      source_url: event.target.value,
                    })
                  }
                  placeholder="https://..."
                />

                <button type="submit">
                  {editingId ? 'Save Changes' : 'Create Position'}
                </button>
              </form>

              <section className="admin-records">
                <h2>Existing database records</h2>

                {featured.map((candidate) => (
                  <div key={candidate.id}>
                    <h3>{candidate.name}</h3>

                    {(candidate.positions || []).map((position) => (
                      <div
                        className="admin-record"
                        key={position.id}
                      >
                        <div>
                          <strong>{position.issue}</strong>

                          <span>
                            {position.current_position ||
                              'No summary entered'}
                          </span>
                        </div>

                        <div>
                          <button
                            onClick={() => startEdit(position)}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deletePosition(position.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            </>
          )}
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
