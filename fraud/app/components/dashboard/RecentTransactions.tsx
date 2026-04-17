'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  location: string;
  time: string;
  status: 'safe' | 'fraud';
  cardLast4: string;
  riskScore: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX001', amount: 125.50,   location: 'New York, USA',    time: '10:30 AM', status: 'safe',  cardLast4: '4532', riskScore: 12 },
  { id: 'TX002', amount: 15820.00, location: 'Lagos, Nigeria',   time: '02:15 AM', status: 'fraud', cardLast4: '4532', riskScore: 87 },
  { id: 'TX003', amount: 84.99,    location: 'London, UK',       time: '08:45 AM', status: 'safe',  cardLast4: '9921', riskScore: 5  },
  { id: 'TX004', amount: 6500.00,  location: 'Moscow, Russia',   time: '11:20 PM', status: 'fraud', cardLast4: '1024', riskScore: 78 },
  { id: 'TX005', amount: 45.00,    location: 'Tokyo, Japan',     time: '09:10 AM', status: 'safe',  cardLast4: '8832', riskScore: 2  },
];

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTransactions([...MOCK_TRANSACTIONS].sort(() => Math.random() - 0.5));
      setLastUpdated(new Date());
      setLoading(false);
    }, 600);
  };

  const getRiskClass = (score: number) =>
    score > 50 ? 'high' : score > 30 ? 'mid' : 'low';

  return (
    <div id="transactions" className="section-card">
      <div className="section-card-header">
        <div>
          <h2 className="section-title">
            <Clock size={17} style={{ opacity: 0.7 }} />
            Recent Transaction Analysis
          </h2>
          <p className="section-subtitle">
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="btn btn-secondary btn-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>TX ID</th>
              <th>Amount</th>
              <th>Location</th>
              <th>Time</th>
              <th>Card</th>
              <th>Risk Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td style={{ fontWeight: 700, color: 'var(--color-indigo-600)' }}>
                  {tx.id}
                </td>
                <td style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>
                  ${tx.amount.toFixed(2)}
                </td>
                <td>{tx.location}</td>
                <td>{tx.time}</td>
                <td className="font-mono" style={{ color: 'var(--color-text-muted)' }}>
                  ****{tx.cardLast4}
                </td>
                <td>
                  <div className="risk-bar-wrap">
                    <div className="risk-bar-track">
                      <div
                        className={`risk-bar-fill ${getRiskClass(tx.riskScore)}`}
                        style={{ width: `${tx.riskScore}%` }}
                      />
                    </div>
                    <span className="risk-pct">{tx.riskScore}%</span>
                  </div>
                </td>
                <td>
                  {tx.status === 'safe' ? (
                    <span className="badge badge-success">
                      <CheckCircle size={12} /> Safe
                    </span>
                  ) : (
                    <span className="badge badge-danger">
                      <AlertTriangle size={12} /> Fraud
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
