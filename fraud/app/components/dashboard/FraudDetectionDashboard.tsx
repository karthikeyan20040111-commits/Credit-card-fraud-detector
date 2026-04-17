'use client';

import { Shield, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, subtitle, icon, iconBg, trend, trendUp }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon-wrap" style={{ background: iconBg }}>
          {icon}
        </div>
        {trend && (
          <span className={`stat-trend ${trendUp ? 'up' : 'down'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
      <div className="stat-meta">{subtitle}</div>
    </div>
  );
}

export function FraudDetectionDashboard() {
  const [counts, setCounts] = useState({
    total: 12847,
    legit: 12695,
    fraud: 152,
    saved: 284550,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        total: prev.total + Math.floor(Math.random() * 5),
        legit: prev.legit + Math.floor(Math.random() * 5),
        fraud: prev.fraud + (Math.random() > 0.8 ? 1 : 0),
        saved: prev.saved + Math.floor(Math.random() * 500),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="dashboard">
      <div className="section-header">
        <div>
          <h2 className="section-title">Overview Dashboard</h2>
          <p className="section-subtitle">Live metrics — updates every 5 seconds</p>
        </div>
        <span className="badge badge-success">
          <span
            style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block' }}
            className="animate-pulse-dot"
          />
          Live
        </span>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Transactions"
          value={counts.total.toLocaleString()}
          subtitle="Today"
          icon={<TrendingUp size={20} color="#4f46e5" />}
          iconBg="var(--color-indigo-100)"
          trend="+8.2%"
          trendUp
        />
        <StatCard
          title="Legitimate"
          value={counts.legit.toLocaleString()}
          subtitle={`${((counts.legit / counts.total) * 100).toFixed(1)}% safe`}
          icon={<CheckCircle size={20} color="#059669" />}
          iconBg="var(--color-emerald-100)"
          trend="+99.1%"
          trendUp
        />
        <StatCard
          title="Flagged as Fraud"
          value={counts.fraud.toLocaleString()}
          subtitle={`${((counts.fraud / counts.total) * 100).toFixed(2)}% suspicious`}
          icon={<AlertTriangle size={20} color="#dc2626" />}
          iconBg="var(--color-red-100)"
          trend="+2.1%"
          trendUp={false}
        />
        <StatCard
          title="Fraud Prevented"
          value={`$${(counts.saved / 1000).toFixed(0)}K`}
          subtitle="Last 30 days"
          icon={<Shield size={20} color="#4f46e5" />}
          iconBg="var(--color-indigo-100)"
          trend="+12.4%"
          trendUp
        />
      </div>
    </div>
  );
}
