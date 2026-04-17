'use client';

import { useState } from 'react';
import {
  CreditCard, MapPin, Calendar, DollarSign,
  AlertCircle, CheckCircle2, TrendingUp, Loader2,
} from 'lucide-react';

interface FraudResult {
  isFraud: boolean;
  confidence: number;
  riskFactors: string[];
  recommendation: string;
}

export function TransactionChecker() {
  const [amount, setAmount]     = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime]         = useState('');
  const [frequency, setFrequency] = useState('');
  const [result, setResult]     = useState<FraudResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = async () => {
    if (!amount) return;
    setAnalyzing(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 900));

    const txAmount = parseFloat(amount);
    const txFreq   = parseInt(frequency) || 0;
    let riskScore  = 0;
    const riskFactors: string[] = [];

    if (txAmount > 10000)      { riskScore += 35; riskFactors.push('Very high transaction amount (>$10,000)'); }
    else if (txAmount > 5000)  { riskScore += 20; riskFactors.push('High transaction amount (>$5,000)'); }

    const highRisk = ['nigeria', 'russia', 'china', 'brazil', 'pakistan', 'ukraine'];
    if (highRisk.some((l) => location.toLowerCase().includes(l))) {
      riskScore += 25;
      riskFactors.push('High-risk geographical region detected');
    }

    if (txFreq > 10)     { riskScore += 30; riskFactors.push('Abnormal transaction velocity (>10 in 24h)'); }
    else if (txFreq > 5) { riskScore += 15; riskFactors.push('Elevated transaction frequency'); }

    const hour = time ? parseInt(time.split(':')[0]) : -1;
    if (hour >= 0 && hour < 6) { riskScore += 10; riskFactors.push('Unusual hours (12AM–6AM)'); }

    const isFraud = riskScore > 50;
    const confidence = Math.min(riskScore, 99);
    let recommendation = '';
    if (isFraud)           recommendation = '🚫  BLOCK — Contact cardholder immediately for verification';
    else if (riskScore > 30) recommendation = '⚠️  REVIEW — Additional verification recommended';
    else                   recommendation = '✓  APPROVE — Transaction appears legitimate';

    setResult({
      isFraud,
      confidence,
      riskFactors: riskFactors.length > 0 ? riskFactors : ['No significant risk factors detected'],
      recommendation,
    });
    setAnalyzing(false);
  };

  return (
    <div id="analyzer" className="section-card">
      <div className="section-card-header">
        <div>
          <h2 className="section-title">
            <CreditCard size={18} color="var(--color-indigo-600)" />
            Transaction Fraud Analyzer
          </h2>
          <p className="section-subtitle">AI-powered real-time risk assessment</p>
        </div>
      </div>

      <div className="section-card-body">
        <div className="form-grid-2" style={{ marginBottom: 20 }}>
          {/* Amount */}
          <div className="form-group">
            <label className="form-label">
              <DollarSign size={14} /> Transaction Amount ($)
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">
              <MapPin size={14} /> Transaction Location
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. New York, USA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Time */}
          <div className="form-group">
            <label className="form-label">
              <Calendar size={14} /> Time of Transaction
            </label>
            <input
              type="time"
              className="form-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {/* Frequency */}
          <div className="form-group">
            <label className="form-label">
              <TrendingUp size={14} /> Transaction Count (24h)
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 3"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={analyze}
          disabled={analyzing || !amount}
          className="btn btn-primary btn-lg"
        >
          {analyzing
            ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
            : <><CreditCard size={18} /> Analyze Transaction</>
          }
        </button>

        {/* Result */}
        {result && (
          <div className={`result-box ${result.isFraud ? 'fraud' : 'safe'}`}>
            <div className="result-box-header">
              {result.isFraud
                ? <AlertCircle size={30} color="var(--color-red-600)" />
                : <CheckCircle2 size={30} color="var(--color-emerald-600)" />
              }
              <div>
                <div className={`result-verdict ${result.isFraud ? 'fraud' : 'safe'}`}>
                  {result.isFraud ? 'FRAUD DETECTED' : 'LEGITIMATE TRANSACTION'}
                </div>
                <div className="result-confidence">
                  Confidence Score: {result.confidence}%
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-slate-700)', marginBottom: 8 }}>
              Risk Factors Detected:
            </p>
            <ul className="result-factors-list">
              {result.riskFactors.map((f, i) => (
                <li key={i} className="result-factor-item">
                  <span
                    style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: result.isFraud ? 'var(--color-red-500)' : 'var(--color-emerald-600)',
                      display: 'inline-block',
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <div className="result-recommendation">
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>
                Recommendation:
              </p>
              <p style={{
                fontSize: '0.85rem', fontWeight: 700,
                color: result.isFraud ? 'var(--color-red-600)' : 'var(--color-emerald-700)',
              }}>
                {result.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
