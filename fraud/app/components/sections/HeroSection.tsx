'use client';

import { Shield, TrendingUp, Lock, Zap } from 'lucide-react';

export function HeroSection() {
  const stats = [
    { icon: <TrendingUp size={18} color="#4f46e5" />, bg: '#eef2ff', value: '99.2%', label: 'Detection Rate' },
    { icon: <Lock size={18} color="#059669" />, bg: '#ecfdf5', value: '$284K', label: 'Fraud Prevented' },
    { icon: <Zap size={18} color="#d97706" />, bg: '#fffbeb', value: '<50ms', label: 'Response Time' },
    { icon: <Shield size={18} color="#0891b2" />, bg: '#ecfeff', value: '24/7', label: 'Active Guard' },
  ];

  return (
    <div id="hero" className="hero-section animate-fadeInUp">
      {/* Badge */}
      <div className="hero-badge">
        <Shield size={13} />
        AI-Powered Fraud Protection
      </div>

      {/* Title */}
      <h1 className="hero-title">
        Detect Fraud <span>in Real-Time</span>{' '}
        <br />with Machine Learning
      </h1>

      <p className="hero-subtitle">
        Advanced ML algorithms analyze thousands of transactions per second —
        protecting your financial assets with 99.2% accuracy and instant explainability.
      </p>

      {/* Stats */}
      <div className="hero-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="hero-stat">
            <div className="hero-stat-icon" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div>
              <div className="hero-stat-value">{s.value}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="hero-actions">
        <a
          href="#analyzer"
          onClick={(e) => { e.preventDefault(); document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="btn btn-primary btn-lg"
          style={{ textDecoration: 'none' }}
        >
          Try Fraud Analyzer
        </a>
        <span className="hero-live-card">
          <span
            style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block' }}
            className="animate-pulse-dot"
          />
          System Live
        </span>
      </div>
    </div>
  );
}
