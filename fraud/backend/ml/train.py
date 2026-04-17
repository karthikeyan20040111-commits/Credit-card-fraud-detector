import pandas as pd
import numpy as np
import json
import joblib
from xgboost import XGBClassifier
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import classification_report, roc_auc_score, f1_score
from imblearn.over_sampling import SMOTE
import shap

def create_dummy_data():
    np.random.seed(42)
    n = 1000
    df = pd.DataFrame({
        'hour_of_day': np.random.randint(0, 24, n),
        'day_of_week': np.random.randint(0, 7, n),
        'log_amount': np.random.uniform(1, 10, n),
        'velocity_24h': np.random.poisson(3, n),
        'velocity_7d': np.random.poisson(15, n),
        'location_risk_score': np.random.uniform(0, 1, n),
        'is_round_amount': np.random.randint(0, 2, n),
        'label': np.random.choice([0, 1], n, p=[0.95, 0.05])
    })
    return df

def train_pipeline():
    print("Loading data...")
    df = create_dummy_data()
    X = df.drop('label', axis=1)
    y = df['label']
    
    features = list(X.columns)
    
    print("Applying SMOTE...")
    smote = SMOTE(random_state=42)
    X_res, y_res = smote.fit_resample(X, y)
    
    kf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    xgb_aucs = []
    iso_aucs = []
    ens_aucs = []
    
    for train_idx, test_idx in kf.split(X_res, y_res):
        X_train, X_test = X_res.iloc[train_idx], X_res.iloc[test_idx]
        y_train, y_test = y_res.iloc[train_idx], y_res.iloc[test_idx]
        
        # XGBoost
        xgb = XGBClassifier(eval_metric='logloss', random_state=42)
        xgb.fit(X_train, y_train)
        xgb_preds = xgb.predict_proba(X_test)[:, 1]
        
        # Isolation Forest (unsupervised, but we measure it like a classifier here for fusion)
        iso = IsolationForest(contamination=0.05, random_state=42)
        iso.fit(X_train)
        # scores are negative, we want higher to mean more anomalous (label=1)
        iso_scores = -iso.score_samples(X_test)
        iso_scores = (iso_scores - iso_scores.min()) / (iso_scores.max() - iso_scores.min())
        
        ens_preds = 0.7 * xgb_preds + 0.3 * iso_scores
        
        xgb_aucs.append(roc_auc_score(y_test, xgb_preds))
        iso_aucs.append(roc_auc_score(y_test, iso_scores))
        ens_aucs.append(roc_auc_score(y_test, ens_preds))
        
    print(f"XGB AUC: {np.mean(xgb_aucs):.4f} +/- {np.std(xgb_aucs):.4f}")
    print(f"ISO AUC: {np.mean(iso_aucs):.4f} +/- {np.std(iso_aucs):.4f}")
    print(f"Ensemble AUC: {np.mean(ens_aucs):.4f} +/- {np.std(ens_aucs):.4f}")
    
    print("Training final models on all data...")
    final_xgb = XGBClassifier(eval_metric='logloss')
    final_xgb.fit(X_res, y_res)
    
    final_iso = IsolationForest(contamination=0.05)
    final_iso.fit(X_res)
    
    print("Generating SHAP Explainer...")
    explainer = shap.TreeExplainer(final_xgb)
    
    print("Saving models...")
    joblib.dump(final_xgb, 'xgb_model.pkl')
    joblib.dump(final_iso, 'iso_model.pkl')
    
    with open('feature_list.json', 'w') as f:
        json.dump(features, f)
        
    metadata = {
        "model_version": "v1.2.0",
        "xgb_auc": np.mean(xgb_aucs),
        "f1": float(f1_score(y_res, final_xgb.predict(X_res))),
        "features": features
    }
    
    with open('model_metadata.json', 'w') as f:
        json.dump(metadata, f)
        
    print("Pipeline completed successfully.")

if __name__ == "__main__":
    train_pipeline()
