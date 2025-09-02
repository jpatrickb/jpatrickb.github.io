import { Link } from 'react-router-dom'
import { projects } from '../data/projects'

export default function Projects() {
  return (
    <section className="container" aria-labelledby="projects-heading">
      <h1 id="projects-heading" className="hero-title" style={{fontSize: 28}}>Projects</h1>
      <div className="grid">
        {projects.map((p) => (
          <article key={p.slug} className="card">
            <div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </div>
            <div className="tags">
              {p.tech.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
            <div className="actions">
              {p.externalUrl ? (
                <a className="btn secondary" href={p.externalUrl} target="_blank" rel="noreferrer">View Repo</a>
              ) : null}
              <Link className="btn" to={`/project/${p.slug}`}>Details</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

