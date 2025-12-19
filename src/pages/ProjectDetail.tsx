import { useParams, Link } from 'react-router-dom'
import { projects } from '../data/projects'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find(p => p.slug === slug)

  if (!project) {
    return (
      <section className="container project-detail-section">
        <div className="panel project-not-found">
          <p>Project not found.</p>
          <div className="actions">
            <Link className="btn" to="/projects">Back to Projects</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container project-detail-section" aria-labelledby="project-heading">
      <div className="panel project-detail">
        <h1 id="project-heading" className="project-title">{project.title}</h1>
        <p className="project-description">{project.description}</p>
        <div className="tags project-tags">
          {project.tech.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="project-actions">
          {project.externalUrl && (
            <a className="btn" href={project.externalUrl} target="_blank" rel="noreferrer">Open Repository</a>
          )}
          <Link className="btn secondary" to="/projects">Back to Projects</Link>
        </div>
      </div>
    </section>
  )
}

