'use client';

import { Shield, Target, Zap, Award } from 'lucide-react';

export function AboutSection() {
  const cards = [
    {
      icon: <Shield size={26} color="#6366f1" />,
      bg: 'rgba(99,102,241,0.15)',
      title: 'Advanced Protection',
      desc: 'Multi-layer security using Random Forest, XGBoost, and ensemble neural networks for maximum coverage.',
    },
    {
      icon: <Target size={26} color="#10b981" />,
      bg: 'rgba(16,185,129,0.15)',
      title: 'High Accuracy',
      desc: '99.2% detection accuracy with minimal false positives for seamless, uninterrupted operations.',
    },
    {
      icon: <Zap size={26} color="#f59e0b" />,
      bg: 'rgba(245,158,11,0.15)',
      title: 'Real-Time Analysis',
      desc: 'Sub-50ms fraud detection with SHAP explainability for human-readable risk reasoning.',
    },
    {
      icon: <Award size={26} color="#22d3ee" />,
      bg: 'rgba(34,211,238,0.15)',
      title: 'Proven Results',
      desc: 'Prevented $284K in fraudulent transactions across 12,847+ analyzed transactions per day.',
    },
  ];

  const techStack = [
    'Python 3.11', 'TensorFlow 2.x', 'Scikit-learn', 'XGBoost',
    'SHAP', 'Random Forest', 'Next.js 15', 'React 19', 'TypeScript',
  ];

  const steps = [
    { step: '01', title: 'Data Collection', desc: 'Transaction data is captured in real-time from multiple financial sources.' },
    { step: '02', title: 'AI Analysis', desc: 'ML models analyze patterns, anomalies, velocity, and behavioral signals.' },
    { step: '03', title: 'Risk Scoring', desc: 'Each transaction receives a SHAP-explained fraud probability score.' },
    { step: '04', title: 'Instant Action', desc: 'Suspicious transactions are flagged, reviewed, or blocked automatically.' },
  ];

  return (
    <div id="about" className="about-section">
      <h2 className="about-title">About FraudGuard AI</h2>
      <p className="about-subtitle">
        Built on cutting-edge AI/ML technology to protect financial institutions
        and customers from fraudulent activity at scale.
      </p>

      <div className="about-cards-grid">
        {cards.map((c, i) => (
          <div key={i} className="about-card">
            <div className="about-card-icon" style={{ background: c.bg }}>
              {c.icon}
            </div>
            <h3 className="about-card-title">{c.title}</h3>
            <p className="about-card-desc">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="about-bottom-grid">
        {/* How it works */}
        <div className="about-box">
          <h3 className="about-box-title">How It Works</h3>
          {steps.map((s, i) => (
            <div key={i} className="how-it-works-step">
              <div className="how-step-num">{s.step}</div>
              <div>
                <p className="how-step-title">{s.title}</p>
                <p className="how-step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="about-box">
          <h3 className="about-box-title">Technologies Used</h3>
          <div className="tech-tags" style={{ marginBottom: 20 }}>
            {techStack.map((t, i) => (
              <span key={i} className="tech-tag">{t}</span>
            ))}
          </div>
          <div style={{
            marginTop: 'auto', padding: '14px 16px',
            background: 'rgba(99,102,241,0.1)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#a5b4fc', marginBottom: 4 }}>
              Open Source Contribution
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)', lineHeight: 1.5 }}>
              Leveraging the best open-source ML libraries and modern web frameworks for maximum performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
