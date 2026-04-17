"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Shield, Server, Database, Lock } from "lucide-react";

export default function FederatedLearningPage() {
  const [isTraining, setIsTraining] = useState(false);
  const [globalTrends, setGlobalTrends] = useState<{round: number, acc: number}[]>([{round: 0, acc: 0.8}]);
  const [clients, setClients] = useState([
    { name: "Bank A", acc: 0.81, loss: 0.4 },
    { name: "Bank B", acc: 0.79, loss: 0.45 },
    { name: "Bank C", acc: 0.82, loss: 0.38 },
    { name: "Bank D", acc: 0.78, loss: 0.48 },
  ]);

  const runRound = async () => {
    setIsTraining(true);
    try {
      const res = await fetch("http://localhost:8000/federated/round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clients: 4 })
      });
      
      // Simulate network delay for animation effect
      await new Promise(r => setTimeout(r, 2000));
      
      if (res.ok) {
        const data = await res.json();
        setGlobalTrends(prev => [...prev, { round: prev.length, acc: data.global_accuracy }]);
        
        // Update local clients metrics
        setClients(data.client_metrics.map((c: any) => ({
          name: c.client,
          acc: c.accuracy,
          loss: Math.max(0.1, 1 - c.accuracy)
        })));
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen">
      <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Lock className="text-purple-500" /> Federated Learning Panel
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Collaborative model training without sharing raw customer data. Each bank trains locally and uploads encrypted gradient updates securely (FedAvg). 
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-lg flex items-center gap-2 font-mono text-sm">
            <Shield size={16} /> Privacy Target: ε=1.5 (DP-SGD)
          </div>
          <button 
            onClick={runRound}
            disabled={isTraining}
            className={`px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-purple-500/20 ${
              isTraining ? "bg-slate-700 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500"
            }`}
          >
            {isTraining ? "Aggregating Weights..." : "Run FedAvg Round"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Topology Animation */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          <h2 className="absolute top-6 left-6 text-xl font-semibold">Decentralized Network</h2>
          
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center mt-12">
            
            {/* Aggregation Server */}
            <div className={`absolute z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-slate-800 border-2 ${isTraining ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)]' : 'border-slate-600'} transition-all duration-500`}>
              <Server size={32} className={isTraining ? 'text-purple-400' : 'text-slate-400'} />
              <span className="text-xs font-bold mt-1 text-slate-300">Global</span>
            </div>

            {/* Clients */}
            {clients.map((client, i) => {
              const angle = (i * Math.PI * 2) / clients.length - Math.PI / 2;
              const radius = 140;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Connection Line & Particle */}
                  <div className="absolute w-full h-full flex items-center justify-center origin-center">
                    <svg className="absolute w-full h-full top-0 left-0" style={{ transform: `rotate(${angle}rad)`}}>
                      <line x1="50%" y1="50%" x2={`calc(50% + ${radius}px)`} y2="50%" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
                      {isTraining && (
                        <circle r="4" fill="#a855f7">
                          <animate attributeName="cx" values={`calc(50% + ${radius}px);50%`} dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="cy" values="50%;50%" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </svg>
                  </div>

                  {/* Node */}
                  <div 
                    className="absolute flex flex-col items-center justify-center w-20 h-20 bg-slate-950 border border-slate-700 rounded-xl"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
                    <Database size={24} className="text-blue-400 mb-1" />
                    <span className="text-xs font-bold">{client.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Global Metric */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex-1">
            <h2 className="text-xl font-semibold mb-6">Global Model Accuracy</h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={globalTrends}>
                  <XAxis dataKey="round" tick={{ fill: '#64748b' }} stroke="#334155" />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b' }} stroke="#334155" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Line type="monotone" dataKey="acc" stroke="#a855f7" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Local Metrics */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex-1">
             <h2 className="text-xl font-semibold mb-6">Per-Client Local Metrics</h2>
             <div className="space-y-4">
                {clients.map((c, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-300">{c.name} Accuracy</span>
                      <span className="font-mono text-emerald-400">{(c.acc * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                       <div 
                         className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" 
                         style={{ width: `${c.acc * 100}%` }}
                       />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
