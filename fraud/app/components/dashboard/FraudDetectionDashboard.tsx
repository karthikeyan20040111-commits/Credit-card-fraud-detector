'use client';

import { Shield, TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

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

const initialChartData = [
  { time: '10:00', volume: 400, fraud: 24 },
  { time: '10:05', volume: 300, fraud: 13 },
  { time: '10:10', volume: 200, fraud: 18 },
  { time: '10:15', volume: 278, fraud: 39 },
  { time: '10:20', volume: 189, fraud: 8 },
  { time: '10:25', volume: 239, fraud: 18 },
  { time: '10:30', volume: 349, fraud: 23 },
];

export function FraudDetectionDashboard() {
  const { resolvedTheme } = useTheme();
  const [counts, setCounts] = useState({
    total: 12847,
    legit: 12695,
    fraud: 152,
    saved: 284550,
    accuracy: 0.98,
    model_version: 'v1.2.0',
  });

  const [chartData, setChartData] = useState(initialChartData);

  // Fetch live stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/stats');
        if (res.ok) {
          const data = await res.json();
          setCounts({
            total:         data.total  ?? 12847,
            legit:         data.legit  ?? 12695,
            fraud:         data.fraud  ?? 152,
            saved:         data.saved  ?? 284550,
            accuracy:      data.accuracy ?? 0.98,
            model_version: data.model_version ?? 'v1.2.0',
          });
        }
      } catch {
        /* backend offline — keep defaults */
      }
    };
    fetchStats();
    const poll = setInterval(fetchStats, 10000); // refresh every 10s
    return () => clearInterval(poll);
  }, []);

  // Local animated increment (visual only)
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        ...prev,
        total: prev.total + Math.floor(Math.random() * 3),
        legit: prev.legit + Math.floor(Math.random() * 3),
        fraud: prev.fraud + (Math.random() > 0.85 ? 1 : 0),
        saved: prev.saved + Math.floor(Math.random() * 300),
      }));

      setChartData((prev) => {
        const newData = [...prev.slice(1)];
        const lastTime = prev[prev.length - 1].time;
        const [hh, mm] = lastTime.split(':').map(Number);
        const nextMin = (mm + 5) % 60;
        const nextH = nextMin === 0 ? (hh + 1) % 24 : hh;
        const timeStr = `${String(nextH).padStart(2, '0')}:${String(nextMin).padStart(2, '0')}`;
        newData.push({
          time: timeStr,
          volume: Math.floor(Math.random() * 200) + 150,
          fraud: Math.floor(Math.random() * 40) + 5,
        });
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tooltipBg = resolvedTheme === 'dark' ? '#1e293b' : '#ffffff';
  const tooltipBorder = resolvedTheme === 'dark' ? '#334155' : '#e2e8f0';
  const tooltipText = resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a';

  return (
    <div id="dashboard">
      <div className="section-header">
        <div>
          <h2 className="section-title">Overview Dashboard</h2>
          <p className="section-subtitle">
            Live metrics — updates every 5 s &nbsp;·&nbsp;
            <span style={{ color: '#4f46e5', fontWeight: 600 }}>
              Model {counts.model_version}
            </span>
            &nbsp;·&nbsp; AUC-ROC:&nbsp;
            <span style={{ color: '#059669', fontWeight: 600 }}>
              {(counts.accuracy * 100).toFixed(1)}%
            </span>
          </p>
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

      {/* Chart Section */}
      <div className="section-card" style={{ marginTop: '28px' }}>
        <div className="section-card-header">
          <div className="section-title">
            <Activity size={18} color="#4f46e5" />
            Live Transaction Volume
          </div>
        </div>
        <div className="section-card-body" style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '8px' }}
                itemStyle={{ color: tooltipText }}
              />
              <Area type="monotone" dataKey="volume" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
              <Area type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorFraud)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
