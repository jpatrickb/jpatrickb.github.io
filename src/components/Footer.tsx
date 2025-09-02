export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container" style={{paddingTop: 0}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap: 12, flexWrap:'wrap'}}>
          <span style={{opacity: 0.8}}>© {year} jpatrickb</span>
          <div style={{display:'flex', gap: 12}}>
            <a href="https://github.com/jpatrickb" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

