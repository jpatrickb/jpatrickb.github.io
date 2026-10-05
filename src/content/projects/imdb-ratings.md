---
title: Reel Ratings, Predicting IMDb Scores
summary: Predicts film quality from crew metadata with tree-based models and a Bayesian shrinkage-adjusted rating.
lane: model
stages: [data, model, eval]
tech: [Python, scikit-learn, XGBoost, pandas]
liveUrl: https://jpatrickb.github.io/vol3_semester1_project_imdb
order: 16
---

Raw IMDb averages are noisy for films with few votes, so the target is shrunk toward a prior before modeling. Tree-based models then predict it from cast and crew metadata.
