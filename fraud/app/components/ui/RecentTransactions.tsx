'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  location: string;
  time: string;
  status: 'safe' | 'fraud';
  cardLast4: string;
  riskScore: number;
  timestamp: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX001', amount: 125.50, location: 'New York, USA', time: '10:30 AM', status: 'safe', cardLast4: '4532', riskScore: 12, timestamp: new Date().toISOString() },
  { id: 'TX002', amount: 15820.00, location: 'Lagos, Nigeria', time: '02:15 AM', status: 'fraud', cardLast4: '4532', riskScore: 87, timestamp: new Date().toISOString() },
  { id: 'TX003', amount: 84.99, location: 'London, UK', time: '08:45 AM', status: 'safe', cardLast4: '9921', riskScore: 5, timestamp: new Date().toISOString() },
  { id: 'TX004', amount: 6500.00, location: 'Moscow, Russia', time: '11:20 PM', status: 'fraud', cardLast4: '1024', riskScore: 78, timestamp: new Date().toISOString() },
  { id: 'TX005', amount: 45.00, location: 'Tokyo, Japan', time: '09:10 AM', status: 'safe', cardLast4: '8832', riskScore: 2, timestamp: new Date().toISOString() },
];

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setTransactions([...MOCK_TRANSACTIONS].sort(() => Math.random() - 0.5));
      setLastUpdated(new Date());
      setLoading(false);
    }, 600);
  };

  return (
    <div id="transactions" className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recent Transaction Analysis</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <button onClick={refreshData} disabled={loading} className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 font-semibold">Transaction ID</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Time</th>
              <th className="px-6 py-4 font-semibold">Card</th>
              <th className="px-6 py-4 font-semibold">Risk Score</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-indigo-600">{tx.id}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">${tx.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{tx.location}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{tx.time}</td>
                <td className="px-6 py-4 text-sm text-slate-500 font-mono">****{tx.cardLast4}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${tx.riskScore > 50 ? 'bg-red-500' : tx.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${tx.riskScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{tx.riskScore}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {tx.status === 'safe'
                    ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3.5 h-3.5" /> Safe</span>
                    : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="w-3.5 h-3.5" /> Fraud</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
