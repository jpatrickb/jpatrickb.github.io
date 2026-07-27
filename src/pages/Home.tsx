import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-wrapper">
            <div className="hero-content">
              <p className="hero-role">AI/ML Engineer</p>
              <h1 id="home-heading" className="hero-title">Patrick Beal</h1>
              <p className="hero-sub">I mix applied math, economics, and ML to model behavior, forecast outcomes, and optimize decisions, turning messy real‑world problems into measurable wins.</p>
              <div className="hero-cta">
                <Link to="/projects" className="btn">View Projects</Link>
                <a href="https://github.com/jpatrickb" target="_blank" rel="noreferrer" className="btn secondary">GitHub</a>
                <a href="mailto:jpatrickbeal@gmail.com" className="btn secondary">Email</a>
                <a href="https://linkedin.com/in/jpatrickbeal" target="_blank" rel="noreferrer" className="btn secondary">LinkedIn</a>
                <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn secondary">Resume (PDF)</a>
              </div>
            </div>
            <div className="hero-avatar">
              <Picture />
            </div>
          </div>
        </div>
      </section>

      <section className="container" aria-labelledby="about-heading">
        <h2 id="about-heading" className="section-title">About</h2>
        <div className="about-grid">

          <article className="card">
            <h3>
              <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 7h12l2 4H4l2-4zm-2 6h16v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5z"/></svg>
              Experience
            </h3>
            <details className="details-row" open>
              <summary>
                <span><strong>Founding Engineer</strong> — TechForce Advisors (Remote) (Aug 2025–Present)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <ul>
                <li>Built and shipped a production agentic AI research system (Next.js, AWS Bedrock AgentCore, Claude) that turns a visitor's email into a personalized company report in ~78 seconds for $0.10 in LLM cost, with a verifier pass that strips unsupported claims before anything ships.</li>
                <li>Extended the system into an automated outbound pipeline (Apollo.io, Gmail API) that sources prospects, generates reports in parallel, and tracks engagement back into the CRM.</li>
                <li>Built and shipped a native iOS app (SwiftUI) for door-to-door sales consultants that transcribes voice notes (AWS Transcribe), extracts company/contact details (Bedrock Claude), and writes them into the CRM. Approved by Apple and live on TestFlight.</li>
                <li>Designed and built a shared AWS test-infrastructure platform (Terraform, Aurora Serverless v2, host-based ALB routing) for three production apps.</li>
                <li>Replaced managed NAT Gateways with EC2 NAT instances on that platform, eliminating that cost line entirely.</li>
                <li>Migrated the company marketing site to Next.js on AWS Amplify.</li>
                <li>Fixed a server-side tracking bug on the marketing site that raised Meta's Lead-event match quality from 0/10 to 8/10.</li>
                <li>Migrated a Slack-integrated AI CRM agent (LangGraph/LangChain) from HubSpot to GoHighLevel, rebuilding all 30 tool integrations and deploying via Terraform-managed AWS ECS.</li>
                <li>Launched and ran an 8-campaign Meta ads system with a custom ad-creative generator, campaign management, and cost analytics.</li>
                <li>Currently building an AI pipeline (Docling, AWS Bedrock) that extracts financial data from real-estate broker documents into acquisition underwriting models.</li>
              </ul>
            </details>
            <details className="details-row">
              <summary>
                <span><strong>GTM Strategy & AI Intern</strong> — Winning by Design (May–Sep 2025)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <ul>
                <li>Engineered a full-stack GTM diagnostic (Python, Flask, SQL, Google APIs) standardizing CRM/finance/CS data into 20+ analyses.</li>
                <li>Reduced diagnostic turnaround from 6–8 weeks to 5–15 minutes; presented results to executives.</li>
                <li>Designed an LLM "Deep Dive" pipeline to analyze client call transcripts (scale: unlimited calls in &lt;30 minutes).</li>
                <li>Automated slide-deck generation and Slack delivery to enable consistent, data-driven advisory.</li>
              </ul>
            </details>
            <details className="details-row">
              <summary>
                <span><strong>Research Assistant</strong> — BYU Office of the President (Aug 2024–Dec 2025)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <ul>
                <li>Researched and authored reports for President Reese on student development and related topics.</li>
                <li>Presented findings monthly to BYU leadership; synthesized literature into actionable insights.</li>
              </ul>
            </details>
            <details className="details-row">
              <summary>
                <span><strong>Research Assistant (Mathematics, Jarvis Lab)</strong> — BYU (Dec 2023–Oct 2024)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <ul>
                <li>Designed algorithms for biomarker detection in PPG signals: Bayesian modeling, peak detection, mixture-of-experts, notch detection.</li>
                <li>Ran experiments in Jupyter; integrated methods into lab package; documented workflows for reproducibility.</li>
              </ul>
            </details>
            <details className="details-row">
              <summary>
                <span><strong>Grader (Math 290)</strong> — BYU Mathematics (Aug 2023–Dec 2023)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <p>Graded and mentored students in proofs (logic, sets, discrete, number theory).</p>
            </details>
            <details className="details-row">
              <summary>
                <span><strong>Research Assistant (Whitehead Lab)</strong> — BYU (Apr 2021–Aug 2021)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <p>
                Authored documentation for Bayesian statistical sampling workflows with geologic computing software in Python. See results:
                <a href="https://tsunami.byu.edu/whitehead-lab" target="_blank" rel="noreferrer"> tsunami.byu.edu/whitehead-lab</a>.
              </p>
            </details>
            <details className="details-row">
              <summary>
                <span><strong>Additional Experience & Leadership</strong></span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <ul>
                <li>Volunteer Representative, The Church of Jesus Christ of Latter-day Saints (Aug 2021–Aug 2023): automated fleet management (Google Apps Script) for ~100 vehicles.</li>
                <li>Brass Salesperson / Software Developer, Summerhays Music Center (2018–2021): automated payment entry with PyWinAuto (−85% time).</li>
              </ul>
            </details>
          </article>

          <article className="card">
            <h3>
              <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l9 4-9 4-9-4 9-4zm9 7v6c0 .6-.4 1-1 1h-2v-5l-6 2.7-6-2.7V17H4c-.6 0-1-.4-1-1v-6l9 4 9-4z"/></svg>
              Education
            </h3>
            <p><strong>Brigham Young University</strong> — Provo, UT</p>
            <p>Jun 2020 - Apr 2026</p>
            <p>BS — <strong>Double Major:</strong> Applied & Computational Mathematics (ACME) + Economics</p>
            <p>
              <a href="https://wheatley.byu.edu/student-scholars" target="_blank" rel="noreferrer">Wheatley Scholar (2024 Cohort)</a> · Dean's List (4×) · GPA 3.92
            </p>
          </article>

          <article className="card">
            <h3>
              <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h16v4H4v-4z"/></svg>
              Skills
            </h3>
            <p style={{margin: '8px 0 4px', color: 'var(--medium-gray)', fontSize: 13}}>Applied Math</p>
            <div className="tags">
              <span className="tag">Linear Algebra</span>
              <span className="tag">Probability Theory</span>
              <span className="tag">Optimization</span>
              <span className="tag">Functional Analysis</span>
              <span className="tag">Dynamical Systems</span>
              <span className="tag">Latent Models</span>
              <span className="tag">Optimal Control</span>
              <span className="tag">Data Structures</span>
              <span className="tag">Algorithms</span>
            </div>
            <p style={{margin: '8px 0 4px', color: 'var(--medium-gray)', fontSize: 13}}>Data & Statistics</p>
            <div className="tags">
              <span className="tag">NumPy</span>
              <span className="tag">pandas</span>
              <span className="tag">SciPy</span>
              <span className="tag">Bayesian Modeling</span>
              <span className="tag">Machine Learning</span>
              <span className="tag">Econometrics</span>
            </div>
            <p style={{margin: '8px 0 4px', color: 'var(--medium-gray)', fontSize: 13}}>Economics</p>
            <div className="tags">
              <span className="tag">Economic Modeling</span>
              <span className="tag">Econometric Analysis</span>
              <span className="tag">Causal Inference</span>
            </div>
            <p style={{margin: '12px 0 4px', color: 'var(--medium-gray)', fontSize: 13}}>Tools</p>
            <div className="tags">
              <span className="tag">Python</span>
              <span className="tag">C++</span>
              <span className="tag">SQL</span>
              <span className="tag">Git</span>
              <span className="tag">Stata</span>
              <span className="tag">Java</span>
              <span className="tag">UNIX</span>
            </div>
            <p style={{margin: '12px 0 4px', color: 'var(--medium-gray)', fontSize: 13}}>Languages</p>
            <div className="tags">
              <span className="tag">American Sign Language (ASL)</span>
            </div>
          </article>

          <article className="card">
            <h3>
              <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              Beyond the Resume
            </h3>
            <details className="details-row">
              <summary>
                <span><strong>Opera Accompanist</strong> — BYU School of Music (May 2025–Apr 2026)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <ul>
                <li>Prepared and performed operatic repertoire; collaborated with conductors and vocalists for seamless performance.</li>
                <li>Demonstrated attentive listening, precision, and teamwork in high-stakes environments.</li>
              </ul>
            </details>
            <details className="details-row">
              <summary>
                <span><strong>Ballet Accompanist</strong> — BYU Department of Dance (Aug 2024–Apr 2026)</span>
                <span className="chevron" aria-hidden>▸</span>
              </summary>
              <ul>
                <li>Performed live accompaniment for 2–6 weekly classes (company groups), preparing, improvising, and sight‑reading across styles.</li>
                <li>Adapted in real time to professor direction and dancer pacing.</li>
              </ul>
            </details>
            <p>Principal/Lead Trombonist, BYU ensembles: led section rehearsals and mentored peers.</p>
          </article>
        </div>
      </section>
    </>
  )
}

function Picture() {
  const src = '/profile.jpeg'
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
