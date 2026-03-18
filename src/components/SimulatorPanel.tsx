"use client";

import { useState, useMemo } from "react";
import { useClimaStore } from "@/lib/store";
import { runSimulation, YearData } from "@/lib/simulator";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, AreaChart, Area,
} from "recharts";
import { Play, Pause, RotateCcw, Gauge, Thermometer, Waves, TreePine } from "lucide-react";

export default function SimulatorPanel() {
  const { co2Level, setCo2Level, year, setYear, scenario, setScenario } = useClimaStore();
  const [emissionsRate, setEmissionsRate] = useState(40);
  const [endYear, setEndYear] = useState(2100);
  const [isRunning, setIsRunning] = useState(false);

  const results = useMemo(
    () =>
      runSimulation({
        co2Initial: co2Level,
        emissionsRate,
        scenario: scenario as any,
        startYear: 2025,
        endYear,
      }),
    [co2Level, emissionsRate, scenario, endYear]
  );

  const currentData = results.find((r) => r.year === year) || results[0];

  const scenarios = [
    { key: "low", label: "Low Emissions", color: "#22c55e", desc: "Net zero by 2050" },
    { key: "moderate", label: "Moderate", color: "#3b82f6", desc: "Current policies" },
    { key: "high", label: "High Emissions", color: "#f59e0b", desc: "Increased fossil fuels" },
    { key: "extreme", label: "Extreme", color: "#ef4444", desc: "Unchecked growth" },
  ];

  const comparisonData = useMemo(() => {
    const allScenarios = scenarios.map((s) =>
      runSimulation({
        co2Initial: co2Level,
        emissionsRate,
        scenario: s.key as any,
        startYear: 2025,
        endYear,
      })
    );
    const years = allScenarios[0].map((r) => r.year);
    return years.map((y, i) => ({
      year: y,
      low: allScenarios[0][i]?.tempAnomaly,
      moderate: allScenarios[1][i]?.tempAnomaly,
      high: allScenarios[2][i]?.tempAnomaly,
      extreme: allScenarios[3][i]?.tempAnomaly,
    }));
  }, [co2Level, emissionsRate, endYear]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Climate Simulator</h2>
          <p className="text-sm text-slate-400">Configure parameters and run simulations</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? "Pause" : "Run"}
          </button>
          <button
            onClick={() => { setYear(2025); setCo2Level(420); }}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="grid grid-cols-4 gap-3">
        {scenarios.map((s) => (
          <button
            key={s.key}
            onClick={() => setScenario(s.key)}
            className={`glass-panel p-3 text-left transition-all ${
              scenario === s.key ? "ring-2 ring-emerald-500/50" : "hover:bg-slate-800/50"
            }`}
          >
            <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: s.color }} />
            <div className="text-xs font-medium text-white">{s.label}</div>
            <div className="text-[10px] text-slate-500">{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="glass-panel p-6 space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">CO2 Level</span>
            <span className="text-white font-mono">{co2Level} ppm</span>
          </div>
          <input
            type="range" min={280} max={1000} value={co2Level}
            onChange={(e) => setCo2Level(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Emissions Rate</span>
            <span className="text-white font-mono">{emissionsRate} GtCO2/yr</span>
          </div>
          <input
            type="range" min={0} max={100} value={emissionsRate}
            onChange={(e) => setEmissionsRate(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Time</span>
            <span className="text-white font-mono">{year}</span>
          </div>
          <input
            type="range" min={2025} max={endYear} value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Projection End</span>
            <span className="text-white font-mono">{endYear}</span>
          </div>
          <input
            type="range" min={2050} max={2200} step={10} value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Current State Cards */}
      {currentData && (
        <div className="grid grid-cols-4 gap-3">
          <div className="glass-panel p-4 text-center">
            <Thermometer size={18} className="mx-auto mb-2 text-red-400" />
            <div className="text-xl font-bold text-white">+{currentData.tempAnomaly}°C</div>
            <div className="text-[10px] text-slate-500">Temperature</div>
          </div>
          <div className="glass-panel p-4 text-center">
            <Waves size={18} className="mx-auto mb-2 text-blue-400" />
            <div className="text-xl font-bold text-white">{currentData.seaLevelMm}mm</div>
            <div className="text-[10px] text-slate-500">Sea Level</div>
          </div>
          <div className="glass-panel p-4 text-center">
            <Gauge size={18} className="mx-auto mb-2 text-amber-400" />
            <div className="text-xl font-bold text-white">{currentData.co2Ppm}</div>
            <div className="text-[10px] text-slate-500">CO2 ppm</div>
          </div>
          <div className="glass-panel p-4 text-center">
            <TreePine size={18} className="mx-auto mb-2 text-emerald-400" />
            <div className="text-xl font-bold text-white">{currentData.forestCoverPct}%</div>
            <div className="text-[10px] text-slate-500">Forest Cover</div>
          </div>
        </div>
      )}

      {/* Temperature Comparison Chart */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Temperature Anomaly - All Scenarios</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} unit="°C" />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
            <Legend />
            {/* 1.5C and 2C targets */}
            <Line type="monotone" dataKey={() => 1.5} stroke="#fbbf24" strokeDasharray="5 5" name="1.5°C Target" dot={false} />
            <Line type="monotone" dataKey={() => 2.0} stroke="#ef4444" strokeDasharray="5 5" name="2°C Limit" dot={false} />
            <Line type="monotone" dataKey="low" stroke="#22c55e" strokeWidth={scenario === "low" ? 3 : 1} dot={false} name="Low" />
            <Line type="monotone" dataKey="moderate" stroke="#3b82f6" strokeWidth={scenario === "moderate" ? 3 : 1} dot={false} name="Moderate" />
            <Line type="monotone" dataKey="high" stroke="#f59e0b" strokeWidth={scenario === "high" ? 3 : 1} dot={false} name="High" />
            <Line type="monotone" dataKey="extreme" stroke="#ef4444" strokeWidth={scenario === "extreme" ? 3 : 1} dot={false} name="Extreme" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CO2 and Sea Level */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-4">CO2 Concentration</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={results}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="co2Ppm" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Sea Level Rise</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={results}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="seaLevelMm" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
