'use client';

import { useState } from 'react';
import { Shield, Loader2, AlertTriangle, CheckCircle, Zap, Activity } from 'lucide-react';

interface PredictResult {
  risk_score:        number;
  label:             string;
  xgb_score:         number;
  iso_score:         number;
  autoencoder_score: number;
  shap_values:       Record<string, number>;
  explanation:       string;
}

// ─── Sample transactions ───────────────────────────────────────────────────
const SAMPLES = [
  {
    label:    '✅ Legitimate — Small grocery purchase',
    color:    'emerald',
    payload: { amount: 42.5,  location: 'New York',      time: '14:30', velocity: 1.2, user_id: 'U_LEGIT_01' },
  },
  {
    label:    '✅ Legitimate — Regular online subscription',
    color:    'emerald',
    payload: { amount: 9.99,  location: 'San Francisco',  time: '09:00', velocity: 0.5, user_id: 'U_LEGIT_02' },
  },
  {
    label:    '🚨 Fraud — Unusually large midnight purchase',
    color:    'red',
    payload: { amount: 4850.0, location: 'NA',            time: '02:47', velocity: 9.8, user_id: 'U_FRAUD_01' },
  },
  {
    label:    '🚨 Fraud — High velocity foreign transaction',
    color:    'red',
    payload: { amount: 1200.0, location: 'unknown',       time: '03:15', velocity: 8.5, user_id: 'U_FRAUD_02' },
  },
  {
    label:    '⚠️  Suspicious — Mid-range off-hours',
    color:    'amber',
    payload: { amount: 620.0,  location: 'Berlin',        time: '01:20', velocity: 4.1, user_id: 'U_SUSP_01' },
  },
];

function GaugeBar({ value, color }: { value: number; color: string }) {
  const pct = Math.round(value * 100);
  const bg  = color === 'red' ? '#ef4444' : color === 'amber' ? '#f59e0b' : '#10b981';
  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 8, borderRadius: 9999, background: '#e2e8f0', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: bg,
          borderRadius: 9999, transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  );
}

export function CheckFraudAPI() {
  const [selected, setSelected]   = useState<typeof SAMPLES[0] | null>(null);
  const [loading,  setLoading]    = useState(false);
  const [result,   setResult]     = useState<PredictResult | null>(null);
  const [error,    setError]      = useState<string | null>(null);

  const runCheck = async (sample: typeof SAMPLES[0]) => {
    setSelected(sample);
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/predict', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(sample.payload),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setResult(await res.json());
    } catch (e: any) {
      // Fallback: deterministic mock so the UI still works offline
      const isFraud = sample.color === 'red';
      const risk    = isFraud ? 0.87 + Math.random() * 0.1 : 0.08 + Math.random() * 0.1;
      setResult({
        risk_score:        parseFloat(risk.toFixed(3)),
        label:             isFraud ? 'fraud' : 'legitimate',
        xgb_score:         parseFloat((risk * 0.95).toFixed(3)),
        iso_score:         parseFloat((risk * 0.90).toFixed(3)),
        autoencoder_score: parseFloat((risk * 1.05).toFixed(3)),
        shap_values: {
          log_amount:           isFraud ?  0.42 : -0.12,
          velocity_24h:         isFraud ?  0.31 : -0.05,
          hour_of_day:          isFraud ?  0.18 :  0.03,
          location_risk_score:  isFraud ?  0.09 : -0.08,
        },
        explanation: isFraud
          ? 'High velocity and unusual hour contributed to fraud score.'
          : 'Normal transaction pattern — trusted time, location, and amount.',
      });
      setError('⚠️ Backend offline — showing demo result');
    } finally {
      setLoading(false);
    }
  };

  const riskPct   = result ? Math.round(result.risk_score * 100) : 0;
  const isFraud   = result?.label === 'fraud';
  const riskColor = riskPct >= 70 ? 'red' : riskPct >= 40 ? 'amber' : 'emerald';
  const riskHex   = riskColor === 'red' ? '#ef4444' : riskColor === 'amber' ? '#f59e0b' : '#10b981';

  // Top SHAP factors
  const shapEntries = result
    ? Object.entries(result.shap_values).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 4)
    : [];

  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>

      {/* ── Left: Sample Selector ── */}
      <div style={{
        flex: '0 0 340px', background: 'var(--color-surface)',
        border: '1px solid var(--color-border)', borderRadius: 14,
        padding: 28, display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
            Sample Transactions
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Click a sample to run it through the fraud detection pipeline instantly.
            The backend returns real XGBoost + Isolation Forest scores with SHAP explanations.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SAMPLES.map((s, i) => {
            const isActive = selected?.label === s.label;
            const border   = s.color === 'red' ? '#fca5a5' : s.color === 'amber' ? '#fcd34d' : '#6ee7b7';
            const bg       = s.color === 'red' ? 'rgba(239,68,68,0.06)' : s.color === 'amber' ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.06)';
            return (
              <button
                key={i}
                onClick={() => runCheck(s)}
                disabled={loading}
                style={{
                  textAlign: 'left', padding: '12px 14px',
                  borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
                  border: `1px solid ${isActive ? border : 'var(--color-border)'}`,
                  background: isActive ? bg : 'var(--color-surface-hover)',
                  transition: 'all 0.15s',
                  opacity: loading && !isActive ? 0.5 : 1,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <div style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', gap: 12 }}>
                  <span>💰 ${s.payload.amount}</span>
                  <span>📍 {s.payload.location}</span>
                  <span>⏰ {s.payload.time}</span>
                  <span>🔄 vel {s.payload.velocity}</span>
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 8, fontSize: '0.78rem',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            color: '#b45309',
          }}>
            {error}
          </div>
        )}
      </div>

      {/* ── Right: Result Panel ── */}
      <div style={{ flex: 1, minWidth: 320 }}>
        {!result && !loading && (
          <div style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 14, padding: 48, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 420,
          }}>
            <Shield size={56} color="#d1d5db" strokeWidth={1.5} />
            <p style={{ fontWeight: 600, color: '#9ca3af', fontSize: '1rem' }}>Select a Sample Transaction</p>
            <p style={{ color: '#9ca3af', fontSize: '0.83rem', textAlign: 'center', maxWidth: 280 }}>
              Click any sample on the left to run it through the AI model and see the full prediction breakdown.
            </p>
          </div>
        )}

        {loading && (
          <div style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 14, padding: 48, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 420,
          }}>
            <Loader2 size={44} color="#4f46e5" className="animate-spin" />
            <p style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Analyzing transaction...</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
              Running XGBoost → Isolation Forest → Ensemble → SHAP
            </p>
          </div>
        )}

        {result && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Risk Score Hero */}
            <div style={{
              background: isFraud
                ? 'linear-gradient(135deg, #450a0a, #7f1d1d)'
                : 'linear-gradient(135deg, #064e3b, #065f46)',
              borderRadius: 14, padding: 28, color: 'white',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', opacity: 0.7, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Verdict
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
                  {isFraud
                    ? <><AlertTriangle size={28} color="#fca5a5" /> FRAUD DETECTED</>
                    : <><CheckCircle  size={28} color="#6ee7b7" /> LEGITIMATE</>
                  }
                </div>
                <div style={{ marginTop: 10, fontSize: '0.83rem', opacity: 0.8 }}>
                  {result.explanation}
                </div>
              </div>
              {/* Circular risk score */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 90, height: 90, borderRadius: '50%',
                  background: `conic-gradient(${riskHex} ${riskPct * 3.6}deg, rgba(255,255,255,0.15) 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', fontWeight: 900,
                }}>
                  <div style={{
                    width: 68, height: 68, borderRadius: '50%',
                    background: isFraud ? '#7f1d1d' : '#065f46',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{riskPct}%</span>
                    <span style={{ fontSize: '0.55rem', opacity: 0.7, marginTop: 1 }}>RISK</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Scores */}
            <div style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 14, padding: 24,
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 16 }}>
                <Activity size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Model Score Breakdown
              </div>
              {[
                { name: 'XGBoost',          score: result.xgb_score,         color: riskColor },
                { name: 'Isolation Forest', score: result.iso_score,          color: riskColor },
                { name: 'Autoencoder',      score: result.autoencoder_score,  color: riskColor },
                { name: 'Ensemble (final)', score: result.risk_score,         color: riskColor },
              ].map(({ name, score, color }) => (
                <div key={name} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: '0.83rem', color: 'var(--color-text-secondary)', fontWeight: name.startsWith('Ensemble') ? 700 : 400 }}>{name}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700,
                      color: color === 'red' ? '#dc2626' : color === 'amber' ? '#d97706' : '#059669' }}>
                      {(score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <GaugeBar value={Math.min(score, 1)} color={color} />
                </div>
              ))}
            </div>

            {/* SHAP Explanation */}
            {shapEntries.length > 0 && (
              <div style={{
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: 14, padding: 24,
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 16 }}>
                  <Zap size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                  SHAP Feature Importance
                </div>
                {shapEntries.map(([feat, val]) => {
                  const positive = val > 0;
                  const barPct   = Math.min(Math.abs(val) * 120, 100);
                  return (
                    <div key={feat} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                          {feat.replace(/_/g, ' ')}
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'monospace',
                          color: positive ? '#dc2626' : '#059669' }}>
                          {positive ? '+' : ''}{val.toFixed(4)}
                        </span>
                      </div>
                      <div style={{ height: 6, borderRadius: 9999, background: '#e2e8f0', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${barPct}%`,
                          background: positive ? '#ef4444' : '#10b981',
                          borderRadius: 9999, transition: 'width 0.8s ease',
                        }} />
                      </div>
                    </div>
                  );
                })}
                <p style={{ fontSize: '0.73rem', color: 'var(--color-text-muted)', marginTop: 10 }}>
                  Positive SHAP = increases fraud risk · Negative = reduces fraud risk
                </p>
              </div>
            )}

            {/* Transaction Details */}
            {selected && (
              <div style={{
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: 14, padding: 20,
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
              }}>
                {[
                  ['User ID',   selected.payload.user_id],
                  ['Amount',    `$${selected.payload.amount}`],
                  ['Location',  selected.payload.location],
                  ['Time',      selected.payload.time],
                  ['Velocity',  selected.payload.velocity.toString()],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
