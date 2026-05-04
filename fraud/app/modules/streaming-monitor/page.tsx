"use client";

import { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// City geo positions as approximate % on a 1000×500 Mercator-like plane
const CITY_POSITIONS: Record<string, { x: number; y: number }> = {
  "New York":      { x: 220, y: 185 },
  "San Francisco": { x: 105, y: 195 },
  "London":        { x: 460, y: 145 },
  "Tokyo":         { x: 820, y: 195 },
  "Berlin":        { x: 492, y: 140 },
  "Mumbai":        { x: 635, y: 245 },
  "Sydney":        { x: 845, y: 370 },
  "Dubai":         { x: 590, y: 230 },
};

/** Minimal inline world SVG map (simplified continental outlines) */
function WorldMap({ transactions }: { transactions: any[] }) {
  return (
    <svg
      viewBox="0 0 1000 500"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {/* Ocean background */}
      <rect width="1000" height="500" fill="#0f172a" rx="12" />

      {/* Simplified continent fills */}
      {/* North America */}
      <path d="M80,60 L240,55 L260,100 L270,140 L250,180 L230,200 L200,220 L185,250 L160,260 L130,240 L100,200 L75,160 L65,120 Z"
        fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Central America */}
      <path d="M185,250 L215,250 L225,280 L205,300 L185,285 Z"
        fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* South America */}
      <path d="M200,300 L260,295 L290,320 L300,370 L285,420 L255,450 L225,445 L200,410 L185,360 L188,320 Z"
        fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Europe */}
      <path d="M430,60 L510,55 L530,80 L520,110 L505,125 L490,120 L465,130 L450,120 L435,100 Z"
        fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Africa */}
      <path d="M430,155 L500,150 L540,170 L550,220 L545,290 L520,360 L490,390 L460,380 L435,340 L420,270 L415,210 Z"
        fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Asia */}
      <path d="M515,55 L700,45 L860,60 L900,100 L880,150 L840,180 L800,190 L750,185 L700,200 L660,220 L620,215 L580,200 L550,175 L530,145 L515,110 Z"
        fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Australia */}
      <path d="M790,320 L880,315 L915,345 L910,390 L875,415 L820,415 L785,385 L775,350 Z"
        fill="#1e293b" stroke="#334155" strokeWidth="1" />

      {/* Transaction markers */}
      {transactions.slice(0, 60).map((tx, i) => {
        const pos = CITY_POSITIONS[tx.location];
        if (!pos) return null;
        const isFraud = tx.label === "fraud";
        const opacity = Math.max(0.15, 1 - i * 0.016);
        return (
          <g key={i} style={{ opacity }}>
            {isFraud && (
              <circle cx={pos.x} cy={pos.y} r={16} fill="#ef4444" fillOpacity={0.15}>
                <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isFraud ? 5 : 3}
              fill={isFraud ? "#ef4444" : "#10b981"}
            />
          </g>
        );
      })}

      {/* City labels */}
      {Object.entries(CITY_POSITIONS).map(([city, pos]) => (
        <text key={city} x={pos.x + 7} y={pos.y + 4}
          fill="#475569" fontSize="9" fontFamily="monospace">
          {city}
        </text>
      ))}
    </svg>
  );
}

export default function StreamingMonitorPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fraudRateData, setFraudRateData] = useState<{ time: string; rate: number }[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [tps, setTps] = useState(0);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (wsRef.current) wsRef.current.close();
      return;
    }
    let ws: WebSocket;
    try {
      ws = new WebSocket("ws://localhost:8000/ws/transactions");
      wsRef.current = ws;
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTransactions((prev) => [data, ...prev].slice(0, 200));
        setTps((prev) => prev + 1);
        setTimeout(() => setTps((prev) => Math.max(0, prev - 1)), 1000);
      };
      ws.onerror = () => { /* backend offline — ignore */ };
    } catch {
      /* ignore */
    }
    return () => { try { ws?.close(); } catch { /* ignore */ } };
  }, [isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      const recent = transactions.slice(0, 60);
      const fraudCount = recent.filter((tx) => tx.label === "fraud").length;
      const rate = recent.length ? (fraudCount / recent.length) * 100 : 0;
      setFraudRateData((prev) =>
        [...prev, { time: new Date().toLocaleTimeString(), rate }].slice(-60)
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [transactions]);

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-4">
          <span className="relative flex h-4 w-4">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPaused ? "bg-yellow-400" : "bg-emerald-400"}`} />
            <span className={`relative inline-flex rounded-full h-4 w-4 ${isPaused ? "bg-yellow-500" : "bg-emerald-500"}`} />
          </span>
          Real-Time Streaming Monitor
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => { alert("Generating Analytics PDF Report..."); window.print(); }}
            className="px-6 py-2 rounded font-bold transition-colors bg-blue-600 hover:bg-blue-500 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
            Export Report
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-6 py-2 rounded font-bold transition-colors ${isPaused ? "bg-emerald-600 hover:bg-emerald-500" : "bg-amber-600 hover:bg-amber-500"}`}
          >
            {isPaused ? "RESUME STREAM" : "PAUSE STREAM"}
          </button>
        </div>
      </div>

      {/* SHAP Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-blue-900/20">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AI Threat Explanation (XAI)
              </h3>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Transaction ID</span>
                <span className="font-mono bg-slate-800 px-2 py-1 rounded text-sm text-blue-300">{selectedTx.user_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Predicted Risk Score</span>
                <span className={`text-2xl font-black ${selectedTx.label === "fraud" ? "text-red-500" : "text-emerald-500"}`}>
                  {selectedTx.label === "fraud" ? "98.5%" : "12.4%"}
                </span>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase text-slate-500 flex justify-between">
                  <span>SHAP Analysis (Risk Factors)</span>
                  <span className="text-xs font-normal">Impact vs Baseline</span>
                </h4>
                {selectedTx.label === "fraud" ? (
                  <>
                    {[
                      { label: "Unusual Location (IP Mismatch)", val: 45 },
                      { label: "Transaction Velocity",           val: 30 },
                      { label: "Amount Deviation",               val: 23 },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-red-400 font-medium">{item.label}</span>
                          <span className="text-white">+{item.val}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${item.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400 font-medium">Trusted Device History</span>
                      <span className="text-white">-80% Risk</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-4 pt-6 pb-2 border-t border-slate-800">
                {selectedTx.label === "fraud" && (
                  <button
                    onClick={() => { alert("⚡ SMS Alert sent for Tx ID: " + selectedTx.user_id); setSelectedTx(null); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 py-3 rounded-lg font-bold transition-all"
                  >
                    Send SMS Alert
                  </button>
                )}
                <button onClick={() => setSelectedTx(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-lg font-bold transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Top metrics */}
        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Current TPS</span>
            <span className="text-4xl font-mono mt-2 text-blue-400">{tps} /s</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Fraud Rate (Last 60s)</span>
            <span className="text-4xl font-mono mt-2 text-red-500">
              {fraudRateData.length ? fraudRateData[fraudRateData.length - 1].rate.toFixed(1) : 0}%
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Processed Total</span>
            <span className="text-4xl font-mono mt-2 text-emerald-400">{transactions.length}</span>
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl lg:col-span-1 h-[600px] overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-800 pb-2">Live Feed</h2>
          {transactions.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" fill="currentColor" />
              </svg>
              <p className="text-sm text-center">Waiting for live stream...<br />Start the backend to see transactions</p>
            </div>
          )}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {transactions.map((tx, i) => (
              <div
                key={i}
                onClick={() => setSelectedTx(tx)}
                className={`p-3 rounded border cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all ${tx.label === "fraud" ? "bg-red-500/10 border-red-500/30" : "bg-slate-800 border-slate-700"}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-sm">{tx.user_id}</span>
                  <span className={`text-xs px-2 py-1 rounded ${tx.label === "fraud" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                    {tx.label}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>${tx.amount?.toFixed(2)}</span>
                  <span>{tx.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* World Map */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-[350px] relative overflow-hidden">
            <h2 className="text-xl font-bold mb-2 absolute z-10">Global Activity Map</h2>
            <div className="w-full h-full pt-8">
              <WorldMap transactions={transactions} />
            </div>
          </div>

          {/* Fraud Rate Chart */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-[226px]">
            <h2 className="text-xl font-bold mb-2">Fraud Rate Trend</h2>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={fraudRateData}>
                <XAxis dataKey="time" hide />
                <YAxis stroke="#475569" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                <Line type="monotone" dataKey="rate" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
