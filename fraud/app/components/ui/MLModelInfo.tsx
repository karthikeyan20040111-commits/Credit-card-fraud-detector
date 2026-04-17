'use client';

import { Brain, Database, Activity, Target } from 'lucide-react';

export function MLModelInfo() {
  const features = [
    { label: 'Transaction Amount', pct: 95, color: '#6366f1' },
    { label: 'Transaction Frequency', pct: 90, color: '#f59e0b' },
    { label: 'Location Pattern', pct: 85, color: '#10b981' },
    { label: 'Time of Day', pct: 75, color: '#22d3ee' },
  ];

  return (
    <div className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ background: 'rgba(139,92,246,0.15)', padding: 10, borderRadius: 10 }}>
          <Brain size={22} color="#a78bfa" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f0f4ff' }}>AI/ML Model Information</h2>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Model architecture & performance metrics</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          {
            icon: <Database size={18} color="#818cf8" />, title: 'Training Data',
            lines: ['Dataset: Credit Card Transactions', 'Size: 284,807 transactions', 'Fraud Cases: 492 (0.172%)']
          },
          {
            icon: <Activity size={18} color="#10b981" />, title: 'Algorithms Used',
            lines: ['• Logistic Regression (Baseline)', '• Random Forest (Primary)', '• XGBoost (Ensemble)']
          },
          {
            icon: <Target size={18} color="#a78bfa" />, title: 'Model Performance',
            lines: ['Accuracy: 99.2%', 'Precision: 95.8%', 'Recall: 91.4% | F1: 93.5%']
          },
        ].map((card, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 18, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              {card.icon}
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f0f4ff' }}>{card.title}</span>
            </div>
            {card.lines.map((l, j) => (
              <p key={j} style={{ margin: '4px 0', fontSize: '0.78rem', color: '#94a3b8' }}>{l}</p>
            ))}
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 18, border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '0.85rem', fontWeight: 600, color: '#f0f4ff' }}>Key Feature Importance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {features.map((f, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{f.label}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: f.color }}>{f.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${f.pct}%`, background: f.color, borderRadius: 3, boxShadow: `0 0 8px ${f.color}66` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
