"use client";

import { useState, useEffect } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function UserProfilingPage() {
  const [userId, setUserId] = useState("U1");
  const [inputVal, setInputVal] = useState("U1");
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/users/${id}/profile`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile(userId);
  }, [userId]);

  const handleFreeze = async () => {
    try {
      await fetch(`http://localhost:8000/users/${userId}/freeze`, { method: "POST" });
      alert(`User ${userId} frozen successfully`);
    } catch (err) {
      console.error(err);
    }
  };

  const radarData = [
    { subject: 'Velocity', A: 120, B: 110, fullMark: 150 },
    { subject: 'Amount', A: 98, B: 130, fullMark: 150 },
    { subject: 'Location Dist', A: 86, B: 130, fullMark: 150 },
    { subject: 'Time Shift', A: 99, B: 100, fullMark: 150 },
    { subject: 'Category', A: 85, B: 90, fullMark: 150 },
    { subject: 'Device', A: 65, B: 85, fullMark: 150 },
  ];

  const trendData = [
    { name: 'Mon', deviation: 0.1 },
    { name: 'Tue', deviation: 0.15 },
    { name: 'Wed', deviation: 0.12 },
    { name: 'Thu', deviation: 0.3 },
    { name: 'Fri', deviation: 0.8 },
    { name: 'Sat', deviation: 0.2 },
    { name: 'Sun', deviation: 0.1 },
  ];

  return (
    <div className="p-8 space-y-6 text-white min-h-screen bg-slate-950">
      <h1 className="text-3xl font-bold">User Behavioral Profiling</h1>
      
      <div className="flex gap-4 mb-8">
        <input 
          type="text" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white"
          placeholder="Search User ID..."
        />
        <button 
          onClick={() => setUserId(inputVal)}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded font-semibold transition"
        >
          Search
        </button>
      </div>

      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-1 shadow-2xl flex flex-col items-center">
            <div className={`p-4 rounded-full mb-4 ${profile.risk_tier === "High" ? "bg-red-500/20 text-red-500" : "bg-emerald-500/20 text-emerald-500"}`}>
              {profile.risk_tier === "High" ? <ShieldAlert size={48} /> : <ShieldCheck size={48} />}
            </div>
            <h2 className="text-2xl font-bold mb-2">{profile.user_id}</h2>
            <p className="text-slate-400 mb-6 border-b border-slate-800 pb-4 w-full text-center">
              Risk Tier: <span className={profile.risk_tier === "High" ? "text-red-500" : "text-emerald-500"}>{profile.risk_tier}</span>
            </p>
            
            <div className="w-full space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Spend</span>
                <span className="font-mono">${profile.behavioral_profile.avg_spend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Spend</span>
                <span className="font-mono">${profile.behavioral_profile.max_spend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Freq</span>
                <span className="font-mono">{profile.behavioral_profile.freq}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Anomaly Score</span>
                <span className="font-mono text-red-500">{profile.anomaly_score}</span>
              </div>
            </div>

            <button 
              onClick={handleFreeze}
              className="mt-8 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-red-400/50"
            >
              Freeze Account
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2 shadow-2xl space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-slate-300">Behavior vs Population Avg</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                    <PolarRadiusAxis stroke="#334155" />
                    <Radar name="User" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                    <Radar name="Avg" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-slate-300">7-Day Deviation Trend</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Area type="monotone" dataKey="deviation" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
