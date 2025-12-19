export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {year} jpatrickb. Portfolio built with React + TypeScript.</p>
        <p className="footer-note">
          <a href="https://github.com/jpatrickb" target="_blank" rel="noreferrer">GitHub</a>
        </p>
      </div>
    </footer>
  )
}

