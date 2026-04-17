"use client";

import { useEffect, useState, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function StreamingMonitorPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fraudRateData, setFraudRateData] = useState<{time: string, rate: number}[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [tps, setTps] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (wsRef.current) wsRef.current.close();
      return;
    }

    const ws = new WebSocket("ws://localhost:8000/ws/transactions");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTransactions(prev => [data, ...prev].slice(0, 200));

      setTps(prev => prev + 1);
      setTimeout(() => setTps(prev => Math.max(0, prev - 1)), 1000);
    };

    return () => ws.close();
  }, [isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      const recent = transactions.slice(0, 60);
      const fraudCount = recent.filter(tx => tx.label === "fraud").length;
      const rate = recent.length ? (fraudCount / recent.length) * 100 : 0;
      
      setFraudRateData(prev => [...prev, { time: new Date().toLocaleTimeString(), rate }].slice(-60));
    }, 2000);
    return () => clearInterval(interval);
  }, [transactions]);

  // City mappings for demo since real coords usually require geocoding
  const coords: Record<string, [number, number]> = {
    "New York": [-74.006, 40.7128],
    "San Francisco": [-122.4194, 37.7749],
    "London": [-0.1276, 51.5074],
    "Tokyo": [139.6917, 35.6895],
    "Berlin": [13.4050, 52.5200]
  };

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-4">
          <span className="relative flex h-4 w-4">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPaused ? 'bg-yellow-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-4 w-4 ${isPaused ? 'bg-yellow-500' : 'bg-emerald-500'}`}></span>
          </span>
          Real-Time Streaming Monitor
        </h1>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className={`px-6 py-2 rounded font-bold transition-colors ${
            isPaused ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'
          }`}
        >
          {isPaused ? "RESUME STREAM" : "PAUSE STREAM"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Top metrics */}
        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Current TPS</span>
            <span className="text-4xl font-mono mt-2 text-blue-400">{tps} /s</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Fraud Rate (Last 60s)</span>
            <span className="text-4xl font-mono mt-2 text-red-500">{fraudRateData.length ? fraudRateData[fraudRateData.length-1].rate.toFixed(1) : 0}%</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Processed Total</span>
            <span className="text-4xl font-mono mt-2 text-emerald-400">{transactions.length}++</span>
          </div>
        </div>

        {/* Live List */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl lg:col-span-1 h-[600px] overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-800 pb-2">Live Feed</h2>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {transactions.map((tx, i) => (
              <div key={i} className={`p-3 rounded border ${tx.label === 'fraud' ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-sm">{tx.user_id}</span>
                  <span className={`text-xs px-2 py-1 rounded ${tx.label === 'fraud' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
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

        <div className="lg:col-span-3 space-y-6">
          {/* Map */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-[350px] relative overflow-hidden">
            <h2 className="text-xl font-bold mb-4 absolute z-10">Global Activity</h2>
            <ComposableMap projection="geoMercator" className="w-full h-full opacity-60">
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo} fill="#1e293b" stroke="#334155" />
                  ))
                }
              </Geographies>
              {transactions.slice(0, 50).map((tx, i) => {
                const coord = coords[tx.location];
                if (!coord) return null;
                return (
                  <Marker key={i} coordinates={coord}>
                    <circle r={tx.label === 'fraud' ? 8 : 4} fill={tx.label === 'fraud' ? "#ef4444" : "#10b981"} opacity={Math.max(0.1, 1 - i * 0.02)}>
                      {tx.label === 'fraud' && (
                        <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                      )}
                    </circle>
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>

          {/* Chart */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-[226px]">
             <h2 className="text-xl font-bold mb-2">Fraud Rate Trend</h2>
             <ResponsiveContainer width="100%" height="80%">
                <LineChart data={fraudRateData}>
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#475569" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Line type="monotone" dataKey="rate" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
             </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
