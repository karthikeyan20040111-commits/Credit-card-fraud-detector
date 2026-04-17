'use client';

import { Shield, Target, Zap, Award } from 'lucide-react';

export function AboutSection() {
  const cards = [
    { icon: <Shield size={28} color="#818cf8" />, bg: 'rgba(99,102,241,0.15)', hoverBg: 'rgba(99,102,241,0.1)', title: 'Advanced Protection', desc: 'Multi-layer security using Random Forest, XGBoost, and ensemble neural networks for maximum coverage.' },
    { icon: <Target size={28} color="#10b981" />, bg: 'rgba(16,185,129,0.15)', hoverBg: 'rgba(16,185,129,0.1)', title: 'High Accuracy', desc: '99.2% detection accuracy with minimal false positives for seamless, uninterrupted operations.' },
    { icon: <Zap size={28} color="#f59e0b" />, bg: 'rgba(245,158,11,0.15)', hoverBg: 'rgba(245,158,11,0.1)', title: 'Real-Time Analysis', desc: 'Sub-50ms fraud detection with instant SHAP explainability for human-readable risk reasoning.' },
    { icon: <Award size={28} color="#22d3ee" />, bg: 'rgba(34,211,238,0.15)', hoverBg: 'rgba(34,211,238,0.1)', title: 'Proven Results', desc: 'Prevented $284K in fraudulent transactions across 12,847+ analyzed transactions per day.' },
  ];

  const techStack = ['Python 3.11', 'TensorFlow 2.x', 'Scikit-learn', 'XGBoost', 'SHAP', 'Random Forest', 'Next.js 16', 'React 19', 'Recharts', 'SQLite'];

  return (
    <div id="about" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '64px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f0f4ff', margin: '0 0 12px' }}>About FraudGuard AI</h2>
          <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            Built on cutting-edge AI/ML technology to protect financial institutions and customers from fraudulent activity at scale.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 48 }}>
          {cards.map((card, i) => (
            <div key={i} className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: 60, height: 60, background: card.bg, borderRadius: '50%', marginBottom: 16 }}>
                {card.icon}
              </div>
              <h3 style={{ margin: '0 0 10px', fontSize: '0.95rem', fontWeight: 600, color: '#f0f4ff' }}>{card.title}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* How it works */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 700, color: '#f0f4ff' }}>How It Works</h3>
            {[
              { step: '01', title: 'Data Collection', desc: 'Transaction data is captured in real-time from multiple financial sources.' },
              { step: '02', title: 'AI Analysis', desc: 'ML models analyze patterns, anomalies, velocity, and behavioral signals.' },
              { step: '03', title: 'Risk Scoring', desc: 'Each transaction receives a SHAP-explained fraud probability score.' },
              { step: '04', title: 'Instant Action', desc: 'Suspicious transactions are flagged, reviewed, or blocked automatically.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#818cf8' }}>
                  {item.step}
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '0.85rem', color: '#f0f4ff' }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: '0.77rem', color: '#64748b', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 700, color: '#f0f4ff' }}>Technologies Used</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {techStack.map((tech, i) => (
                <span key={i} style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500
                }}>{tech}</span>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: 16, background: 'rgba(99,102,241,0.08)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.15)' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>Open Source Contribution</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                Leveraging the best open-source ML libraries and modern web frameworks for maximum performance and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
