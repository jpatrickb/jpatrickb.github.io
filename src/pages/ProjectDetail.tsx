import { useParams, Link } from 'react-router-dom'
import { projects } from '../data/projects'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find(p => p.slug === slug)

  if (!project) {
    return (
      <section className="container">
        <div className="panel" style={{padding: 20}}>
          <p style={{margin: 0}}>Project not found.</p>
          <div style={{marginTop: 12}}>
            <Link className="btn" to="/projects">Back to Projects</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container" aria-labelledby="project-heading">
      <div className="panel" style={{padding: 24}}>
        <h1 id="project-heading" className="hero-title" style={{fontSize: 28}}>{project.title}</h1>
        <p style={{color: 'var(--muted)'}}>{project.description}</p>
        <div className="tags" style={{marginTop: 8}}>
          {project.tech.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div style={{display:'flex', gap: 10, marginTop: 16}}>
          {project.externalUrl && (
            <a className="btn" href={project.externalUrl} target="_blank" rel="noreferrer">Open Repository</a>
          )}
          <Link className="btn secondary" to="/projects">Back</Link>
        </div>
      </div>
    </section>
  )
}

