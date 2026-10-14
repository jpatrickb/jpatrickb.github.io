---
title: Biomarker Detection in PPG Signals
summary: Research on extracting biomarkers from photoplethysmogram (PPG) signals, including peak detection, signal-quality metrics, and a Bayesian mixture-of-experts ensemble.
lane: model
stages: [data, model, eval]
outcome: My signal-resampling module and its test suite were merged into the research group's shared codebase and adopted lab-wide.
tech: [Python, Bayesian modeling, Signal processing, Jupyter, Mixture of experts]
year: 2024
featured: true
order: 10
---

I worked on this as a research assistant in the Jarvis Lab in BYU's Department of Mathematics, from December 2023 to October 2024. The group works on extracting biomarkers from PPG signals, which are the optical pulse waveforms that wearables and pulse oximeters measure.

I built a dynamic signal-resampling module and its pytest test suite, and I developed signal-quality metrics to automatically detect and filter low-quality waveform data.

I also designed, implemented, and evaluated several peak-detection algorithms (wavelet transforms, Gaussian smoothing, and zero-crossing detection), along with a Bayesian mixture-of-experts ensemble that combines them. I authored a comparative literature review of 15+ published peak-detection methods, and I presented our findings each week to my faculty advisor and an external data-collection partner.
