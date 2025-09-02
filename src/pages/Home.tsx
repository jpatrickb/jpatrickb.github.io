import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="container" aria-labelledby="home-heading">
      <div className="hero">
        <div className="panel hero-card">
          <h1 id="home-heading" className="hero-title">Hi, I’m Patrick (jpatrickb)</h1>
          <p className="hero-sub">I mix applied math, economics, and ML to model behavior, forecast outcomes, and optimize decisions—turning messy real‑world problems into measurable wins.</p>
          <div className="hero-cta">
            <Link to="/projects" className="btn">View Projects</Link>
            <a href="https://github.com/jpatrickb" target="_blank" rel="noreferrer" className="btn secondary">GitHub</a>
          </div>
        </div>
        <div className="panel avatar-card">
          {/* Place your profile photo at public/profile.jpeg */}
          <Picture />
        </div>
      </div>

      <h2 className="section-title">About</h2>
      <div className="panel" style={{padding: 20}}>
        <div className="about-list" style={{display:'grid', gap: 16}}>


          <article className="card">
            <h3 style={{margin: 0}}>
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 7h12l2 4H4l2-4zm-2 6h16v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5z"/></svg>
              Experience
            </h3>
            <details className="details-row">
              <summary>
                <span><strong>GTM Strategy & AI Intern</strong> — Winning by Design (May 2025–Present)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <p style={{color: 'var(--muted)'}}>
                Built “Archie,” an AI-powered GTM diagnostic platform. Full diagnostics in under 30 minutes; 20+ quantitative analyses; automated qualitative reviews.
              </p>
            </details>
            <details className="details-row">
              <summary>
                <span><strong>Research Assistant</strong> — BYU Office of the President (Aug 2024–Present)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <p style={{color: 'var(--muted)'}}>
                Policy and strategy research to inform executive decision-making aligned with BYU’s Mission & Aims.
              </p>
            </details>
            <details className="details-row">
              <summary>
                <span><strong>Research Assistant (Jarvis Lab)</strong> — BYU Mathematics (Dec 2023–Present)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <p style={{color: 'var(--muted)'}}>
                Bayesian models for biomarker detection in noisy PPG signals; probabilistic inference and signal processing for robust detection.
              </p>
            </details>
            <details className="details-row">
              <summary>
                <span><strong>Research Assistant (Whitehead Lab)</strong> — BYU Mathematics (Apr 2021–Aug 2021)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <p style={{color: 'var(--muted)'}}>
                Authored documentation for Bayesian statistical sampling workflows with geologic computing software in Python. See results: 
                <a href="https://tsunami.byu.edu/whitehead-lab" target="_blank" rel="noreferrer"> tsunami.byu.edu/whitehead-lab</a>.
              </p>
            </details>
            <details className="details-row">
              <summary>
                <span><strong>Grader (Math 290)</strong> — BYU Mathematics (Aug 2023–Dec 2023)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <p style={{color: 'var(--muted)'}}>
                Graded and mentored students in proofs (logic, sets, discrete, number theory).
              </p>
            </details>
          </article>
          
          <article className="card">
            <h3 style={{margin: 0}}>
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l9 4-9 4-9-4 9-4zm9 7v6c0 .6-.4 1-1 1h-2v-5l-6 2.7-6-2.7V17H4c-.6 0-1-.4-1-1v-6l9 4 9-4z"/></svg>
              Education
            </h3>
            <p style={{margin: '6px 0 0'}}><strong>Brigham Young University</strong> — Provo, UT</p>
            <p style={{margin: '4px 0', color: 'var(--muted)'}}>Jun 2020 – Apr 2026</p>
            <p style={{margin: '6px 0 0'}}>BS — <strong>Double Major:</strong> Applied & Computational Mathematics (ACME) + Economics</p>
            <p style={{margin: '6px 0 0'}}>
              <a href="https://wheatley.byu.edu/student-scholars" target="_blank" rel="noreferrer">Wheatley Scholar (2024 Cohort)</a> · Dean’s List (3×) · GPA 3.92
            </p>
          </article>

          <article className="card">
            <h3 style={{margin: 0}}>
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h16v4H4v-4z"/></svg>
              Skills
            </h3>
            <p style={{margin: '8px 0 4px', color: 'var(--muted)', fontSize: 13}}>Applied Math</p>
            <div className="tags" style={{marginTop: 4}}>
              <span className="tag">Linear Algebra</span>
              <span className="tag">Probability Theory</span>
              <span className="tag">Optimization</span>
              <span className="tag">Functional Analysis</span>
              <span className="tag">Dynamical Systems</span>
              <span className="tag">Machine Learning</span>
              <span className="tag">Latent Models</span>
              <span className="tag">Optimal Control</span>
              <span className="tag">Data Structures</span>
              <span className="tag">Algorithms</span>
            </div>
            <p style={{margin: '8px 0 4px', color: 'var(--muted)', fontSize: 13}}>Economics</p>
            <div className="tags" style={{marginTop: 4}}>
              <span className="tag">Economic Modeling</span>
              <span className="tag">Econometric Analysis</span>
              <span className="tag">Causal Inference</span>
            </div>
            <p style={{margin: '12px 0 4px', color: 'var(--muted)', fontSize: 13}}>Tools</p>
            <div className="tags" style={{marginTop: 4}}>
              <span className="tag">Python</span>
              <span className="tag">C++</span>
              <span className="tag">SQL</span>
              <span className="tag">Git</span>
              <span className="tag">Stata</span>
              <span className="tag">Java</span>
              <span className="tag">UNIX</span>
            </div>
          </article>
        </div>

        <div style={{marginTop: 12, color: 'var(--muted)'}}>
          <span>
            <a href="mailto:jpatrickbeal@gmail.com">Email</a> · <a href="https://linkedin.com/in/jpatrickbeal" target="_blank" rel="noreferrer">LinkedIn</a> · <a href="/resume.pdf" target="_blank" rel="noreferrer">Full resume (PDF)</a>
          </span>
        </div>
      </div>
    </section>
  )
}

function Picture() {
  const src = '/profile.jpeg' // Add your image to public/profile.jpeg
  return (
    <img
      src={src}
      className="avatar"
      alt="Portrait of Patrick"
      onError={(e) => {
        const el = e.currentTarget
        el.style.display = 'none'
        const fallback = document.createElement('div')
        fallback.className = 'avatar-fallback'
        fallback.textContent = 'Add profile.jpeg in /public'
        el.parentElement?.appendChild(fallback)
      }}
    />
  )
}

