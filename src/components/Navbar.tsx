import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" aria-label="Home">
          <span className="brand-logo" aria-hidden />
          <span>jpatrick</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Projects</NavLink>
          <a className="nav-link" href="https://github.com/jpatrick" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>
  )
}

