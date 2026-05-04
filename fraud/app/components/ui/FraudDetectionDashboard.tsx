'use client';

import { Shield, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  bg: string;
  trend?: string;
}

function StatCard({ title, value, subtitle, icon, bg, trend }: StatCardProps) {
  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ background: bg, padding: 10, borderRadius: 10 }}>{icon}</div>
        {trend && (
          <span style={{ fontSize: '0.72rem', color: trend.startsWith('+') ? '#10b981' : '#ef4444', background: trend.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '3px 8px', borderRadius: 999 }}>
            {trend}
          </span>
        )}
      </div>
      <p style={{ margin: '0 0 4px', fontSize: '1.7rem', fontWeight: 800, color: '#f0f4ff' }}>{value}</p>
      <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#94a3b8' }}>{title}</p>
      <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569' }}>{subtitle}</p>
    </div>
  );
}

export function FraudDetectionDashboard() {
  const [counts, setCounts] = useState({ total: 12847, legit: 12695, fraud: 152, saved: 284550 });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prev => ({
        total: prev.total + Math.floor(Math.random() * 5),
        legit: prev.legit + Math.floor(Math.random() * 5),
        fraud: prev.fraud + (Math.random() > 0.8 ? 1 : 0),
        saved: prev.saved + Math.floor(Math.random() * 500),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="dashboard" style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f0f4ff' }}>Overview Dashboard</h2>
        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#475569' }}>Live metrics — updates every 5 seconds</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard
          title="Total Transactions"
          value={counts.total.toLocaleString()}
          subtitle="Today"
          icon={<TrendingUp size={20} color="#818cf8" />}
          bg="rgba(99,102,241,0.15)"
          trend="+8.2%"
        />
        <StatCard
          title="Legitimate"
          value={counts.legit.toLocaleString()}
          subtitle={`${((counts.legit / counts.total) * 100).toFixed(1)}% Safe`}
          icon={<CheckCircle size={20} color="#10b981" />}
          bg="rgba(16,185,129,0.15)"
          trend="+99.1%"
        />
        <StatCard
          title="Flagged as Fraud"
          value={counts.fraud.toLocaleString()}
          subtitle={`${((counts.fraud / counts.total) * 100).toFixed(2)}% Suspicious`}
          icon={<AlertTriangle size={20} color="#ef4444" />}
          bg="rgba(239,68,68,0.15)"
          trend="+2.1%"
        />
        <StatCard
          title="Fraud Prevented"
          value={`$${(counts.saved / 1000).toFixed(0)}K`}
          subtitle="Last 30 days"
          icon={<Shield size={20} color="#22d3ee" />}
          bg="rgba(34,211,238,0.15)"
          trend="+12.4%"
        />
      </div>
    </div>
  );
}
