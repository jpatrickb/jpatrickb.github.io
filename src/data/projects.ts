export type Project = {
  slug: string
  title: string
  description: string
  tech: string[]
  image?: string
  externalUrl?: string
  repoUrl?: string
}

export const projects: Project[] = [
  {
    slug: 'byu-econ-588',
    title: 'DAGs and Causal Inference',
    description: 'Advanced econometric methods for causal inference integrating Directed Acyclic Graphs (DAGs) with conventional econometric techniques; explores collider bias, frontdoor criterion, M-bias, and falsification testing by evaluating conditional independencies implied by DAGs.',
    tech: ['Econometrics', 'Causal Inference', 'DAGs', 'OLS', 'Instrumental Variables', 'Monte Carlo Simulations'],
    externalUrl: 'https://jpatrickb.github.io/byu-econ-588/'
  },
  {
    slug: 'football-to-admissions',
    title: 'Football Performance and Admissions',
    description: 'Findings-first analysis of how NCAA football win rates relate to college admissions outcomes (enrollment, diversity, and student caliber) using XGBoost and SHAP. Winning presentation, 2025 BYU Statistics Case Competition.',
    tech: ['Python', 'XGBoost', 'SHAP', 'scikit-learn', 'pandas'],
    externalUrl: 'https://jpatrickb.github.io/football-to-admissions',
    repoUrl: 'https://github.com/jpatrickb/football-to-admissions'
  },
  {
    slug: "vol3-semester1-project-imdb",
    title: "Reel Ratings: Predicting IMDb Scores with Hollywood Data",
    description: "Prediction of IMDb film quality from crew metadata using tree-based ML with a Bayesian shrinkage-adjusted rating.",
    tech: ["Python", "scikit-learn", "XGBoost", "pandas"],
    externalUrl: "https://jpatrickb.github.io/vol3_semester1_project_imdb"
  },
  {
    slug: 'vol3-housing-project',
    title: 'The Cost of Living: A Zillow Housing Forecast',
    description: 'State-level housing analysis (2000-2020) merging Zillow HPI with CPS/IPUMS; uses clustering, ARIMA/VARMAX, and a Bayesian hierarchical model to study regional dynamics and forecasting.',
    tech: ['Python', 'Jupyter', 'pandas', 'NumPy', 'SciPy', 'statsmodels', 'scikit-learn', 'PyMC3'],
    externalUrl: 'https://jpatrickb.github.io/vol3_housing_project',
    repoUrl: 'https://github.com/jpatrickb/vol3_housing_project'
  },
  {
    slug: 'esop-tax-credit-did',
    title: 'ESOP Tax Credit: A Difference-in-Differences Analysis',
    description: 'Causal analysis of Colorado\'s ESOP tax credit policy (HB17-1214) using difference-in-differences and synthetic control methods; examines firm-level ESOP participation and asset accumulation from Department of Labor Form 5500 filings (2012-2025).',
    tech: ['Difference-in-Differences', 'Synthetic Control', 'Causal Inference', 'Stata'],
    externalUrl: 'https://jpatrickb.github.io/esop-tax-credit-did/',
    repoUrl: 'https://github.com/jpatrickb/esop-tax-credit-did'
  },
  {
    slug: 'moonlander-optimal-control',
    title: 'Fly Me To The Moon!',
    description: 'Optimal control of a 2D Lunar Lander, covering formulation, results, and methods, with curated figures.',
    tech: ['Python', 'SciPy', 'NumPy', 'Matplotlib', 'LaTeX'],
    externalUrl: 'https://jpatrickb.github.io/moonlander_optimal_control',
    repoUrl: 'https://github.com/jpatrickb/moonlander_optimal_control'
  },
  {
    slug: 'lumen-list',
    title: 'Lumen List',
    description: 'Next.js and Supabase family gift registry that enforces "surprise preservation" at the database level with row-level security, so a gift owner can never see who claimed their own wishlist items.',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Row Level Security'],
    externalUrl: 'https://lumenlist.app',
    repoUrl: 'https://github.com/jpatrickb/family-gift-registry'
  },
  {
    slug: 'pdf-to-speech',
    title: 'PDF-to-Speech Audiobook Converter',
    description: 'Flask web app and CLI that converts PDF documents into narrated audiobooks, using the Gemini API for OCR cleanup and text-to-speech with chunked processing to work within API quota limits.',
    tech: ['Python', 'Flask', 'Gemini API', 'SQLAlchemy'],
    repoUrl: 'https://github.com/jpatrickb/pdf-to-speech'
  }
]

