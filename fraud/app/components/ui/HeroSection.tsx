'use client';

import { Shield, TrendingUp, Lock, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <div id="hero" className="grid-bg" style={{ padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
      {/* Gradient orbs */}
      <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Left */}
          <div className="animate-fadeInUp">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 999, padding: '6px 16px', marginBottom: 24 }}>
              <Shield size={14} color="#818cf8" />
              <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 500 }}>AI-Powered Fraud Protection</span>
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: '#f0f4ff' }}>
              Detect Fraud{' '}
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                in Real-Time
              </span>
              {' '}with AI
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#94a3b8', marginBottom: 36, lineHeight: 1.7, maxWidth: 480 }}>
              Advanced machine learning algorithms analyze thousands of transactions per second — protecting your financial assets 24/7 with 99.2% accuracy.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36 }}>
              {[
                { icon: <TrendingUp size={20} color="#10b981" />, value: '99.2%', label: 'Detection Accuracy' },
                { icon: <Lock size={20} color="#818cf8" />, value: '$284K', label: 'Fraud Prevented' },
                { icon: <Zap size={20} color="#f59e0b" />, value: '<50ms', label: 'Response Time' },
                { icon: <Shield size={20} color="#22d3ee" />, value: '24/7', label: 'Active Protection' },
              ].map((stat, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 8 }}>{stat.icon}</div>
                  <div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f0f4ff' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <a href="#analyzer" onClick={e => { e.preventDefault(); document.querySelector('#analyzer')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn-glow" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
                Try Fraud Analyzer
              </a>
              <a href="#analytics" onClick={e => { e.preventDefault(); document.querySelector('#analytics')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 20px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.2s', background: 'transparent' }}>
                View Live Analytics →
              </a>
            </div>
          </div>

          {/* Right — Animated stats card */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -2, background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(34,211,238,0.2))', borderRadius: 20, filter: 'blur(16px)' }} />
            <div className="glass-card" style={{ position: 'relative', padding: 28, borderRadius: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>LIVE THREAT MONITOR</span>
                <span className="animate-blink" style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  ACTIVE
                </span>
              </div>

              {[
                { label: 'Transaction Volume', value: 12847, max: 20000, color: '#6366f1', suffix: '/day' },
                { label: 'Fraud Blocked', value: 152, max: 500, color: '#ef4444', suffix: ' cases' },
                { label: 'Model Confidence', value: 99.2, max: 100, color: '#10b981', suffix: '%' },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.label}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.color }}>{item.value}{item.suffix}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(item.value / item.max) * 100}%`, background: item.color, borderRadius: 3, boxShadow: `0 0 8px ${item.color}66` }} />
                  </div>
                </div>
              ))}

              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 14px', marginTop: 8 }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#fca5a5' }}>
                  🚨 HIGH ALERT: $15,820 suspicious transaction blocked from Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
