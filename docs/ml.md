# ML methodology
Synthetic dataset: 2,500 generated observations with country, role, experience, salary competitiveness, talent availability, benefits, hiring time, volume, visa and related features.

Models:
- RandomForestClassifier: offer acceptance, retention, compliance.
- RandomForestRegressor: hiring cost and time-to-hire.

Classification metrics: accuracy, precision, recall, F1, ROC-AUC and confusion matrix.
Regression metrics: MAE, MSE, RMSE and R².

Run `python train_models.py`; the generated `models/metrics.json` is the source of evaluation metrics. Do not manually edit reported metrics.
