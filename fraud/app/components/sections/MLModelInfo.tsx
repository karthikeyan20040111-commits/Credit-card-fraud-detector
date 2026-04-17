'use client';

import { Brain, Database, Activity, Target } from 'lucide-react';

export function MLModelInfo() {
  const infoCards = [
    {
      icon: <Database size={16} color="#6366f1" />,
      title: 'Training Data',
      lines: [
        'Dataset: Credit Card Transactions',
        'Size: 284,807 transactions',
        'Fraud Cases: 492 (0.172%)',
      ],
    },
    {
      icon: <Activity size={16} color="#10b981" />,
      title: 'Algorithms Used',
      lines: [
        '• Logistic Regression (Baseline)',
        '• Random Forest (Primary)',
        '• XGBoost (Ensemble)',
      ],
    },
    {
      icon: <Target size={16} color="#8b5cf6" />,
      title: 'Model Performance',
      lines: [
        'Accuracy: 99.2%',
        'Precision: 95.8%',
        'Recall: 91.4% | F1: 93.5%',
      ],
    },
  ];

  const features = [
    { label: 'Transaction Amount',    pct: 95, color: '#6366f1' },
    { label: 'Transaction Frequency', pct: 90, color: '#f59e0b' },
    { label: 'Location Pattern',      pct: 85, color: '#10b981' },
    { label: 'Time of Day',           pct: 75, color: '#22d3ee' },
  ];

  return (
    <div className="section-card">
      <div className="section-card-header">
        <div>
          <h2 className="section-title">
            <Brain size={18} color="#8b5cf6" />
            AI / ML Model Information
          </h2>
          <p className="section-subtitle">Model architecture &amp; performance metrics</p>
        </div>
      </div>

      <div className="section-card-body">
        <div className="ml-info-grid">
          {infoCards.map((c, i) => (
            <div key={i} className="ml-info-card">
              <div className="ml-info-card-title">
                {c.icon}
                {c.title}
              </div>
              {c.lines.map((l, j) => (
                <p key={j}>{l}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="ml-info-card">
          <h3 className="ml-info-card-title" style={{ marginBottom: 16 }}>
            Key Feature Importance
          </h3>
          <div className="feature-bar-wrap">
            {features.map((f, i) => (
              <div key={i} className="feature-bar-item">
                <div className="feature-bar-header">
                  <span className="feature-bar-label">{f.label}</span>
                  <span className="feature-bar-val" style={{ color: f.color }}>{f.pct}%</span>
                </div>
                <div className="feature-bar-track">
                  <div
                    className="feature-bar-fill"
                    style={{ width: `${f.pct}%`, background: f.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
