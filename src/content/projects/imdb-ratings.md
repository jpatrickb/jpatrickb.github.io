---
title: Reel Ratings, Predicting IMDb Scores
summary: A team project predicting IMDb film quality from crew metadata, using tree-based models with a Bayesian shrinkage-adjusted rating.
lane: model
stages: [data, model, eval]
tech: [Python, scikit-learn, XGBoost, pandas]
liveUrl: https://jpatrickb.github.io/vol3_semester1_project_imdb
order: 16
---

The raw IMDb average is noisy for films that only have a few votes, so we first shrink each film's rating toward a prior. Then we use tree-based models to predict that adjusted rating from the film's crew metadata.
