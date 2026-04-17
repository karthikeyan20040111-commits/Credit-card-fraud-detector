'use client';

import { useState } from 'react';
import { CreditCard, MapPin, Calendar, DollarSign, AlertCircle, CheckCircle2, TrendingUp as TrendUp, Loader2 } from 'lucide-react';

interface FraudResult {
  isFraud: boolean;
  confidence: number;
  riskFactors: string[];
  recommendation: string;
}

export function TransactionChecker() {
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('');
  const [result, setResult] = useState<FraudResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeTransaction = async () => {
    if (!amount) return;
    setAnalyzing(true);
    setResult(null);

    // Simulate processing delay for realism
    await new Promise(res => setTimeout(res, 900));

    const transactionAmount = parseFloat(amount);
    const transactionFreq = parseInt(frequency) || 0;
    let riskScore = 0;
    const riskFactors: string[] = [];

    if (transactionAmount > 10000) { riskScore += 35; riskFactors.push('Very high transaction amount (>$10,000)'); }
    else if (transactionAmount > 5000) { riskScore += 20; riskFactors.push('High transaction amount (>$5,000)'); }

    const highRiskLocations = ['nigeria', 'russia', 'china', 'brazil', 'pakistan', 'ukraine'];
    const locLower = location.toLowerCase();
    if (highRiskLocations.some(loc => locLower.includes(loc))) {
      riskScore += 25;
      riskFactors.push('High-risk geographical region detected');
    }

    if (transactionFreq > 10) { riskScore += 30; riskFactors.push('Abnormal transaction velocity (>10 in 24h)'); }
    else if (transactionFreq > 5) { riskScore += 15; riskFactors.push('Elevated transaction frequency'); }

    const hour = time ? parseInt(time.split(':')[0]) : -1;
    if (hour >= 0 && hour < 6) { riskScore += 10; riskFactors.push('Unusual hours (12AM–6AM)'); }

    const isFraud = riskScore > 50;
    const confidence = Math.min(riskScore, 99);
    let recommendation = '';
    if (isFraud) recommendation = '🚫 BLOCK — Contact cardholder immediately for verification';
    else if (riskScore > 30) recommendation = '⚠️ REVIEW — Additional verification recommended';
    else recommendation = '✓ APPROVE — Transaction appears legitimate';

    setResult({
      isFraud,
      confidence,
      riskFactors: riskFactors.length > 0 ? riskFactors : ['No significant risk factors detected'],
      recommendation,
    });
    setAnalyzing(false);
  };

  return (
    <div id="analyzer" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-indigo-100 p-3 rounded-lg">
          <CreditCard className="text-indigo-600 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Transaction Fraud Analyzer</h2>
          <p className="text-sm text-slate-500">AI-powered risk assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <DollarSign className="w-4 h-4" /> Transaction Amount ($)
          </label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="e.g., 5000" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <MapPin className="w-4 h-4" /> Transaction Location
          </label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)}
            placeholder="e.g., New York, USA" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Calendar className="w-4 h-4" /> Time of Transaction
          </label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <TrendUp className="w-4 h-4" /> Transaction Count (24h)
          </label>
          <input type="number" value={frequency} onChange={e => setFrequency(e.target.value)}
            placeholder="e.g., 3" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>

      <button onClick={analyzeTransaction} disabled={analyzing || !amount}
        className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white transition-colors
          ${analyzing || !amount ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
        {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
        {analyzing ? 'Analyzing...' : 'Analyze Transaction'}
      </button>

      {result && (
        <div className={`mt-8 p-6 rounded-xl border ${result.isFraud ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-center gap-4 mb-4">
            {result.isFraud
              ? <AlertCircle className="w-8 h-8 text-red-600" />
              : <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            }
            <div>
              <h3 className={`text-lg font-bold ${result.isFraud ? 'text-red-800' : 'text-emerald-800'}`}>
                {result.isFraud ? 'FRAUD DETECTED' : 'LEGITIMATE TRANSACTION'}
              </h3>
              <p className="text-sm font-medium text-slate-600">Confidence Score: {result.confidence}%</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-bold text-slate-700 mb-2">Risk Factors Detected:</p>
            <ul className="space-y-1">
              {result.riskFactors.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`w-1.5 h-1.5 rounded-full ${result.isFraud ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Recommendation:</p>
            <p className={`text-sm font-bold ${result.isFraud ? 'text-red-600' : 'text-emerald-600'}`}>
              {result.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

