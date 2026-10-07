---
title: DAGs and Causal Inference
summary: A project integrating directed acyclic graphs (DAGs) with conventional econometric techniques, covering collider bias, the front-door criterion, M-bias, and falsification testing.
lane: model
stages: [model, eval]
tech: [Econometrics, Causal inference, DAGs, OLS, Instrumental variables, Monte Carlo]
liveUrl: https://jpatrickb.github.io/byu-econ-588/
order: 13
---

This project uses Monte Carlo simulations to show where a standard regression goes wrong, like when you adjust for a collider or run into M-bias, and how reasoning with a DAG helps you choose which variables to adjust for.

It also covers falsification testing, where you check a DAG against the data by evaluating the conditional independencies that the DAG implies.

The Spot the Confounder game in the lab is built on the same ideas.
