'use client';

import { useState } from 'react';
import { X, Lock, Mail, Shield, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(email.split('@')[0]);
      setLoading(false);
      setEmail('');
      setPassword('');
    }, 1000);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box">
        {/* Left panel */}
        <div className="modal-left">
          <div className="modal-left-logo">
            <div style={{
              width: 40, height: 40, background: 'rgba(255,255,255,0.2)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={22} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>FraudGuard AI</span>
          </div>

          <h2 className="modal-left-title">Secure Admin Access</h2>
          <p className="modal-left-desc">
            Login to access the full AI-powered fraud detection dashboard,
            model retraining pipeline, and admin controls.
          </p>

          <div className="modal-feature-list">
            {[
              'Real-time fraud monitoring',
              'SHAP explainability panel',
              'Model retraining pipeline',
              'Report export tools',
            ].map((f, i) => (
              <div key={i} className="modal-feature-item">
                <div className="modal-feature-check">✓</div>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="modal-right">
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-slate-900)', marginBottom: 4 }}>
              Welcome Back
            </h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--color-text-muted)' }}>
              Login to your FraudGuard AI account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-icon-wrap">
                <Mail size={15} className="form-input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@fraudguard.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-icon-wrap">
                <Lock size={15} className="form-input-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--color-indigo-600)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Remember me</span>
              </label>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--color-indigo-600)', fontWeight: 600 }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: 4 }}
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
                : 'Login to Dashboard'
              }
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Demo: use any email + password to login
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
