# Portfolio: jpatrickb.github.io

This is a Vite + React (TypeScript) portfolio site for GitHub Pages (user site).

Key details
- Router: HashRouter for safe deep linking on Pages
- Build: GitHub Actions (upload-pages-artifact → deploy-pages)
- Base path: default ("/") which is correct for a user site

Local dev
```bash
npm install
npm run dev
```

Deploy
1) Commit and push to main. The GitHub Actions workflow will build and publish automatically.
2) In GitHub → Settings → Pages, ensure Source = GitHub Actions.

First-time GitHub setup (if repo not created yet)
- Create a new public repo named jpatrickb.github.io under your GitHub account (username: jpatrick) and push this project to it.

Project data (easy to extend)
- Edit src/data/projects.ts to add/remove/update projects. Each project supports:
  - slug: string (used for the /project/:slug route)
  - title: string
  - description: string
  - tech: string[] (tags)
  - externalUrl?: string (optional link to GitHub or live site)
  - image?: string (optional path for future use)

Profile photo
- Place your image at public/profile.jpg and it will appear on the home page. If missing, a friendly placeholder text is shown.

Structure
- src/pages: Home, Projects, ProjectDetail
- src/components: Navbar, Footer
- src/data/projects.ts: List of projects

Notes
- For a user site (https://jpatrick.github.io/), the Vite base path can be omitted or set to "/". No repo subpath is needed.
- If you prefer BrowserRouter, add an SPA 404 fallback (see github_pages.md).
