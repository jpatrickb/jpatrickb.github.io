import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="container" aria-labelledby="home-heading">
      <div className="hero">
        <div className="panel hero-card">
          <h1 id="home-heading" className="hero-title">Hi, I’m Joseph (jpatrick)</h1>
          <p className="hero-sub">I build efficient, reliable software — from data-driven services to modern web apps.</p>
          <div className="hero-cta">
            <Link to="/projects" className="btn">View Projects</Link>
            <a href="https://github.com/jpatrick" target="_blank" rel="noreferrer" className="btn secondary">GitHub</a>
          </div>
        </div>
        <div className="panel avatar-card">
          {/* Place your profile photo at public/profile.jpg */}
          <Picture />
        </div>
      </div>

      <h2 className="section-title">About</h2>
      <div className="panel" style={{padding: 20}}>
        <p style={{margin: 0, color: 'var(--muted)'}}>
          This site is data-driven and easy to extend. Add new projects by editing a single file — no wiring required.
        </p>
      </div>
    </section>
  )
}

function Picture() {
  const src = '/profile.jpg' // Add your image to public/profile.jpg
  return (
    <img
      src={src}
      className="avatar"
      alt="Portrait of Joseph"
      onError={(e) => {
        const el = e.currentTarget
        el.style.display = 'none'
        const fallback = document.createElement('div')
        fallback.className = 'avatar-fallback'
        fallback.textContent = 'Add profile.jpg in /public'
        el.parentElement?.appendChild(fallback)
      }}
    />
  )
}

