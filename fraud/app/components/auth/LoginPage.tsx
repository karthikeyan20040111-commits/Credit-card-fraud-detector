'use client';

import { useState } from 'react';
import {
  Shield,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Activity,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

const FEATURES = [
  { icon: Activity,      label: 'Real-time fraud monitoring',      color: '#818cf8' },
  { icon: TrendingUp,    label: 'ML model with 99.2% accuracy',    color: '#34d399' },
  { icon: AlertTriangle, label: 'Instant alert & risk scoring',    color: '#fbbf24' },
  { icon: CheckCircle,   label: 'SHAP explainability & reporting', color: '#60a5fa' },
];

const STATS = [
  { value: '99.2%', label: 'Accuracy' },
  { value: '< 50ms', label: 'Detection' },
  { value: '284K+', label: 'Transactions' },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    // Simulate auth delay (replace with real API call)
    setTimeout(() => {
      setLoading(false);
      onLogin(email);
    }, 1200);
  };

  return (
    <div className="login-root">
      {/* Animated background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className="login-container">
        {/* ── LEFT PANEL ── */}
        <div className="login-left">
          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">
              <Shield size={26} color="#fff" />
            </div>
            <div>
              <div className="login-brand-name">FraudGuard AI</div>
              <div className="login-brand-tag">Enterprise Security Platform</div>
            </div>
          </div>

          {/* Hero text */}
          <div className="login-hero">
            <h1 className="login-hero-title">
              Stop Fraud <br />
              <span className="login-hero-accent">Before It Happens</span>
            </h1>
            <p className="login-hero-sub">
              AI-powered real-time detection engine trusted by financial institutions
              to protect millions of transactions every day.
            </p>
          </div>

          {/* Stats */}
          <div className="login-stats">
            {STATS.map((s) => (
              <div key={s.label} className="login-stat">
                <div className="login-stat-value">{s.value}</div>
                <div className="login-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="login-features">
            {FEATURES.map(({ icon: Icon, label, color }) => (
              <div key={label} className="login-feature">
                <div className="login-feature-icon" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                  <Icon size={15} color={color} />
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Live badge */}
          <div className="login-live-badge">
            <span className="login-live-dot" />
            System Online · All services operational
          </div>
        </div>

        {/* ── RIGHT PANEL — Login card ── */}
        <div className="login-right">
          <div className="login-card">
            {/* Card header */}
            <div className="login-card-header">
              <div className="login-card-icon">
                <Lock size={20} color="#6366f1" />
              </div>
              <h2 className="login-card-title">Welcome back</h2>
              <p className="login-card-sub">Sign in to your admin account</p>
            </div>

            {/* Demo hint */}
            <div className="login-demo-hint">
              <CheckCircle size={13} color="#059669" />
              Demo mode — use any email &amp; password
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              {/* Email */}
              <div className="login-field">
                <label className="login-label" htmlFor="login-email">Email address</label>
                <div className="login-input-wrap">
                  <Mail size={15} className="login-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    className="login-input"
                    placeholder="admin@fraudguard.ai"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-field">
                <label className="login-label" htmlFor="login-password">Password</label>
                <div className="login-input-wrap">
                  <Lock size={15} className="login-input-icon" />
                  <input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    className="login-input login-input-pw"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="login-pw-toggle"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Row: remember + forgot */}
              <div className="login-row">
                <label className="login-remember">
                  <input type="checkbox" className="login-checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="login-forgot">Forgot password?</a>
              </div>

              {/* Error */}
              {error && (
                <div className="login-error">
                  <AlertTriangle size={13} />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Authenticating…
                  </>
                ) : (
                  <>
                    <Shield size={17} />
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Footer note */}
            <p className="login-card-footer">
              Protected by 256-bit AES encryption &amp; MFA-ready infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
