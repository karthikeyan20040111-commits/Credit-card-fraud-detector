'use client';

import { useState } from 'react';
import { X, Lock, Mail, Shield, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(email.split('@')[0]);
      setIsLoading(false);
      setEmail('');
      setPassword('');
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'rgba(13,20,38,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, maxWidth: 900, width: '100%', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* Left Panel */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(34,211,238,0.1) 100%)', padding: 40, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: 12, padding: 10 }}>
                  <Shield size={24} color="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FraudGuard AI</span>
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f0f4ff', marginBottom: 12 }}>Secure Admin Access</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 32 }}>
                Login to access the full AI-powered fraud detection dashboard, model retraining pipeline, and admin controls.
              </p>

              {['Real-time fraud monitoring', 'SHAP explainability panel', 'Model retraining pipeline', 'Report export tools'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#818cf8', flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: '0.83rem', color: '#94a3b8' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Form */}
          <div style={{ padding: 40, position: 'relative' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 6, color: '#64748b', cursor: 'pointer' }}>
              <X size={18} />
            </button>

            <div style={{ marginBottom: 32 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 700, color: '#f0f4ff' }}>Welcome Back</h3>
              <p style={{ margin: 0, fontSize: '0.83rem', color: '#64748b' }}>Login to your FraudGuard AI account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 8, fontWeight: 500 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@fraudguard.ai" required className="dark-input"
                    style={{ paddingLeft: 40 }} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 8, fontWeight: 500 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required className="dark-input"
                    style={{ paddingLeft: 40 }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: '#6366f1' }} />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Remember me</span>
                </label>
                <a href="#" style={{ fontSize: '0.8rem', color: '#818cf8', textDecoration: 'none' }}>Forgot password?</a>
              </div>

              <button type="submit" disabled={isLoading} className="btn-glow"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 24px', fontSize: '0.9rem', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                {isLoading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Authenticating...</> : 'Login to Dashboard'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#475569', marginTop: 16 }}>
                Demo: use any email + password to login
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
