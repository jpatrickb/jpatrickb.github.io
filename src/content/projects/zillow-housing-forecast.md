---
title: The Cost of Living, a Zillow Housing Forecast
summary: State-level housing analysis (2000–2020) merging Zillow HPI with CPS/IPUMS, using clustering, ARIMA/VARMAX, and a Bayesian hierarchical model.
lane: model
stages: [data, model, eval]
tech: [Python, PyMC3, statsmodels, scikit-learn, pandas, NumPy, SciPy]
liveUrl: https://jpatrickb.github.io/vol3_housing_project
repoUrl: https://github.com/jpatrickb/vol3_housing_project
featured: true
order: 12
---

Studies regional housing dynamics and how well different model families forecast them.

- Clustering groups states with similar price trajectories.
- ARIMA and VARMAX provide classical time-series baselines.
- A Bayesian hierarchical model shares strength across states while allowing regional differences.
