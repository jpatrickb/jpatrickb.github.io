import { projects } from '../data/projects'

export default function Projects() {
  return (
    <section className="container projects-section" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="section-title">Projects</h2>
      <div className="grid">
        {projects.map((p) => {
          const url = p.externalUrl
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
                {url && (
                  <a className="btn" href={url} target="_blank" rel="noreferrer">
                    Open Project Page ↗
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

