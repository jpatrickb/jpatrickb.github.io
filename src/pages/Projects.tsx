import { projects } from '../data/projects'

export default function Projects() {
  return (
    <section className="container" aria-labelledby="projects-heading">
      <h1 id="projects-heading" className="hero-title" style={{fontSize: 28}}>Projects</h1>
      <div className="grid">
        {projects.map((p) => {
          const url = p.externalUrl
          const displayUrl = url?.replace(/^https?:\/\//, '')
          return (
            <article key={p.slug} className="card">
              <div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                {url && (
                  <p style={{marginTop: 6, fontSize: 12, color: 'var(--muted)'}}>
                    {displayUrl}
                  </p>
                )}
              </div>
              <div className="tags">
                {p.tech.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <div className="actions">
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

