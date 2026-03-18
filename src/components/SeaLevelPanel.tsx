"use client";

import { useState, useMemo } from "react";
import { runSimulation } from "@/lib/simulator";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { Waves, MapPin, AlertTriangle } from "lucide-react";

const vulnerableCities = [
  { name: "Miami", country: "US", elevation: 2, population: 6.1, lat: 25.76, lng: -80.19 },
  { name: "Shanghai", country: "CN", elevation: 4, population: 28.5, lat: 31.23, lng: 121.47 },
  { name: "Mumbai", country: "IN", elevation: 8, population: 20.7, lat: 19.08, lng: 72.88 },
  { name: "Bangkok", country: "TH", elevation: 1.5, population: 10.7, lat: 13.76, lng: 100.5 },
  { name: "Jakarta", country: "ID", elevation: 7, population: 10.6, lat: -6.21, lng: 106.85 },
  { name: "Amsterdam", country: "NL", elevation: -2, population: 2.5, lat: 52.37, lng: 4.9 },
  { name: "New York", country: "US", elevation: 10, population: 8.3, lat: 40.71, lng: -74.01 },
  { name: "Dhaka", country: "BD", elevation: 4, population: 22.5, lat: 23.81, lng: 90.41 },
];

export default function SeaLevelPanel() {
  const [riseAmount, setRiseAmount] = useState(500); // mm
  const [selectedScenario, setSelectedScenario] = useState("moderate");

  const results = useMemo(
    () =>
      runSimulation({
        co2Initial: 420,
        emissionsRate: 40,
        scenario: selectedScenario as any,
        startYear: 2025,
        endYear: 2150,
      }),
    [selectedScenario]
  );

  const riskData = vulnerableCities.map((city) => {
    const riseM = riseAmount / 1000;
    const floodRisk = Math.min(100, Math.max(0, ((riseM - (city.elevation / 1000)) / riseM) * 100 + 30));
    const displacedPct = floodRisk > 50 ? (floodRisk - 50) * 1.5 : 0;
    return {
      ...city,
      floodRisk: Math.round(floodRisk),
      displacedMillions: Math.round(city.population * displacedPct / 100 * 10) / 10,
      status: floodRisk > 80 ? "Critical" : floodRisk > 50 ? "High Risk" : floodRisk > 30 ? "Moderate" : "Low",
    };
  });

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Waves size={22} className="text-blue-400" /> Sea Level Rise Simulator
        </h2>
        <p className="text-sm text-slate-400">Model coastal flooding and displacement risk</p>
      </div>

      {/* Controls */}
      <div className="glass-panel p-6 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Sea Level Rise</span>
            <span className="text-white font-mono">{riseAmount}mm ({(riseAmount / 10).toFixed(1)}cm)</span>
          </div>
          <input
            type="range" min={0} max={3000} step={50} value={riseAmount}
            onChange={(e) => setRiseAmount(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          {["low", "moderate", "high", "extreme"].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedScenario(s)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                selectedScenario === s ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Projection Chart */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Sea Level Projection (mm)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={results}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
            <Area type="monotone" dataKey="seaLevelMm" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Vulnerable Cities */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-400" /> Coastal City Risk Assessment
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={riskData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis type="category" dataKey="name" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} width={80} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
            <Bar dataKey="floodRisk" name="Flood Risk %" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* City Details */}
      <div className="space-y-3">
        {riskData.sort((a, b) => b.floodRisk - a.floodRisk).map((city) => {
          const statusColor =
            city.status === "Critical" ? "text-red-400 bg-red-500/20" :
            city.status === "High Risk" ? "text-amber-400 bg-amber-500/20" :
            city.status === "Moderate" ? "text-yellow-400 bg-yellow-500/20" :
            "text-green-400 bg-green-500/20";

          return (
            <div key={city.name} className="glass-panel p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-500" />
                  <span className="text-sm font-medium text-white">{city.name}, {city.country}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${statusColor}`}>{city.status}</span>
                </div>
                <div className="flex gap-4 mt-1 text-xs text-slate-500">
                  <span>Elev: {city.elevation}m</span>
                  <span>Pop: {city.population}M</span>
                  <span>Risk: {city.floodRisk}%</span>
                  {city.displacedMillions > 0 && (
                    <span className="text-red-400">Displaced: {city.displacedMillions}M</span>
                  )}
                </div>
              </div>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${city.floodRisk}%`,
                    backgroundColor: city.floodRisk > 80 ? "#ef4444" : city.floodRisk > 50 ? "#f59e0b" : "#22c55e",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
