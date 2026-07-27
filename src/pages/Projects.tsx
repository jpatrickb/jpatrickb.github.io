import { projects } from '../data/projects'

export default function Projects() {
  return (
    <section className="container projects-section" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="section-title">Projects</h2>
      <div className="grid">
        {projects.map((p) => {
          return (
            <article key={p.slug} className="card">
              <div className="card-content">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
              <div className="tags">
                {p.tech.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <div className="card-actions">
                {p.externalUrl && (
                  <a className="btn" href={p.externalUrl} target="_blank" rel="noreferrer">
                    Open Project Page ↗
                  </a>
                )}
                {p.repoUrl && (
                  <a className="btn secondary" href={p.repoUrl} target="_blank" rel="noreferrer">
                    View Code ↗
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

