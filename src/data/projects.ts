export type Project = {
  slug: string
  title: string
  description: string
  tech: string[]
  image?: string
  externalUrl?: string
}

export const projects: Project[] = [
  {
    slug: 'football-to-admissions',
    title: 'Football Performance and Admissions - BYU Statistics Case Competition 2025',
    description: 'Findings-first analysis of how NCAA football team win rates relate to admissions outcomes (enrollment, diversity, and student caliber) using XGBoost and SHAP; prepared for the 2025 BYU Statistics Case Competition.',
    tech: ['Python', 'XGBoost', 'SHAP', 'scikit-learn', 'pandas'],
    externalUrl: 'https://jpatrickb.github.io/football-to-admissions'
  },
  {
    slug: "vol3-semester1-project-imdb",
    title: "Reel Ratings: Predicting IMDb Scores with Hollywood Data",
    description: "Predict IMDb film quality from crew metadata using tree-based ML with a Bayesian shrinkage-adjusted rating; includes a paper-style Jekyll site.",
    tech: ["Python", "scikit-learn", "XGBoost", "pandas"],
    externalUrl: "https://jpatrickb.github.io/vol3_semester1_project_imdb"
  },
  {
    slug: 'moonlander-optimal-control',
    title: 'Fly Me To The Moon!',
    description: 'Optimal control of a 2D Lunar Lander—formulation, results, and methods with curated figures and Jekyll-based docs.',
    tech: ['Python', 'SciPy', 'NumPy', 'Matplotlib', 'LaTeX'],
    externalUrl: 'https://jpatrickb.github.io/moonlander_optimal_control'
  },
  {
    slug: 'vol3-housing-project',
    title: 'The Cost of Living: A Zillow Housing Forecast',
    description: 'State-level housing analysis (2000-2020) merging Zillow HPI with CPS/IPUMS; uses clustering, ARIMA/VARMAX, and a Bayesian hierarchical model to study regional dynamics and forecasting. Includes a GitHub Pages site and paper.',
    tech: ['Python', 'Jupyter', 'pandas', 'NumPy', 'SciPy', 'statsmodels', 'scikit-learn', 'PyMC3'],
    externalUrl: 'https://jpatrickb.github.io/vol3_housing_project'
  }
]

