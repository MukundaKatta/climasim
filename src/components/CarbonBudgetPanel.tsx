"use client";

import { useState, useMemo } from "react";
import { calculateCarbonBudget } from "@/lib/simulator";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { Factory, Target, Clock, Leaf } from "lucide-react";

const sectorEmissions = [
  { name: "Energy", value: 15.8, color: "#ef4444" },
  { name: "Transport", value: 8.3, color: "#f59e0b" },
  { name: "Industry", value: 6.2, color: "#8b5cf6" },
  { name: "Buildings", value: 3.4, color: "#3b82f6" },
  { name: "Agriculture", value: 5.8, color: "#22c55e" },
  { name: "Land Use", value: 3.2, color: "#06b6d4" },
];

const countryEmissions = [
  { name: "China", current: 12.1, pledged: 8.0 },
  { name: "USA", current: 5.0, pledged: 2.5 },
  { name: "India", current: 3.9, pledged: 3.0 },
  { name: "EU", current: 3.3, pledged: 1.5 },
  { name: "Russia", current: 2.5, pledged: 2.0 },
  { name: "Japan", current: 1.1, pledged: 0.5 },
  { name: "Brazil", current: 1.3, pledged: 0.8 },
  { name: "Indonesia", current: 1.8, pledged: 1.2 },
];

export default function CarbonBudgetPanel() {
  const [targetTemp, setTargetTemp] = useState(1.5);

  const budget = useMemo(() => calculateCarbonBudget(targetTemp), [targetTemp]);

  const usedPct = Math.round((budget.used / budget.totalBudget) * 100);
  const remainPct = 100 - usedPct;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Factory size={22} className="text-amber-400" /> Carbon Budget Calculator
        </h2>
        <p className="text-sm text-slate-400">Track global carbon budget for temperature targets</p>
      </div>

      {/* Target Selector */}
      <div className="flex gap-3">
        {[1.5, 2.0, 3.0].map((t) => (
          <button
            key={t}
            onClick={() => setTargetTemp(t)}
            className={`flex-1 glass-panel p-4 text-center transition-all ${
              targetTemp === t ? "ring-2 ring-emerald-500/50" : "hover:bg-slate-800/50"
            }`}
          >
            <Target size={18} className={`mx-auto mb-2 ${targetTemp === t ? "text-emerald-400" : "text-slate-500"}`} />
            <div className="text-lg font-bold text-white">{t}°C</div>
            <div className="text-[10px] text-slate-500">
              {t === 1.5 ? "Paris Agreement" : t === 2.0 ? "Upper Limit" : "Dangerous"}
            </div>
          </button>
        ))}
      </div>

      {/* Budget Overview */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Carbon Budget Status</h3>
        <div className="flex items-center gap-8">
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Used", value: budget.used },
                    { name: "Remaining", value: budget.remaining },
                  ]}
                  dataKey="value"
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={65}
                  startAngle={90} endAngle={-270}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#22c55e" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Budget</span>
                <span className="text-white font-mono">{budget.totalBudget} GtCO2</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-red-400">Used</span>
                <span className="text-white font-mono">{budget.used} GtCO2 ({usedPct}%)</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${usedPct}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-400">Remaining</span>
                <span className="text-white font-mono">{budget.remaining} GtCO2 ({remainPct}%)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 p-3 bg-slate-800/50 rounded-lg">
              <Clock size={16} className="text-amber-400" />
              <span className="text-sm text-slate-300">
                At current rates: <strong className="text-white">{budget.yearsAtCurrentRate} years</strong> remaining
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Emissions */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Emissions by Sector (GtCO2/yr)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sectorEmissions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {sectorEmissions.map((s, i) => (
                <Cell key={i} fill={s.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Country Pledges */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
          <Leaf size={16} className="text-emerald-400" /> Country Emissions vs Pledges (GtCO2/yr)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={countryEmissions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
            <Bar dataKey="current" fill="#ef4444" name="Current" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pledged" fill="#22c55e" name="Pledged" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
