"use client";

import { useState, useMemo } from "react";
import { predictExtremeEvents } from "@/lib/simulator";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import { Zap, Flame, CloudRain, Wind, Snowflake, Thermometer } from "lucide-react";

const regions = ["Global", "North America", "Europe", "Asia", "Africa", "South America", "Oceania"];

export default function ExtremeEventPanel() {
  const [tempAnomaly, setTempAnomaly] = useState(2.0);
  const [selectedRegion, setSelectedRegion] = useState("Global");

  const predictions = useMemo(
    () => predictExtremeEvents(tempAnomaly, selectedRegion),
    [tempAnomaly, selectedRegion]
  );

  const radarData = predictions.map((p) => ({
    event: p.type,
    probability: Math.round(p.probability * 100),
  }));

  const severityColors: Record<string, string> = {
    "Extreme": "#ef4444",
    "Catastrophic": "#881337",
    "Severe": "#f59e0b",
    "Moderate": "#3b82f6",
    "Mass Event": "#a855f7",
    "Low": "#22c55e",
  };

  const eventIcons: Record<string, React.ReactNode> = {
    "Heatwave": <Thermometer size={18} />,
    "Drought": <Flame size={18} />,
    "Flooding": <CloudRain size={18} />,
    "Wildfire": <Flame size={18} />,
    "Hurricane Cat4+": <Wind size={18} />,
    "Coral Bleaching": <Snowflake size={18} />,
  };

  // Historical trend mock
  const historicalTrend = Array.from({ length: 12 }, (_, i) => ({
    decade: `${1970 + i * 5}`,
    events: Math.round(50 + i * 15 + Math.random() * 20),
  }));

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap size={22} className="text-amber-400" /> Extreme Event Predictor
        </h2>
        <p className="text-sm text-slate-400">Predict probability and severity of extreme weather events</p>
      </div>

      {/* Controls */}
      <div className="glass-panel p-6 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Temperature Anomaly</span>
            <span className="text-white font-mono">+{tempAnomaly.toFixed(1)}°C</span>
          </div>
          <input
            type="range" min={0.5} max={5} step={0.1} value={tempAnomaly}
            onChange={(e) => setTempAnomaly(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <span className="text-sm text-slate-400 mb-2 block">Region</span>
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  selectedRegion === r ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Event Probability Radar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="event" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={[0, 100]} />
            <Radar
              name="Probability"
              dataKey="probability"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-2 gap-3">
        {predictions.map((pred) => {
          const color = severityColors[pred.severity] || "#6b7280";
          return (
            <div key={pred.type} className="glass-panel p-4">
              <div className="flex items-center gap-2 mb-3" style={{ color }}>
                {eventIcons[pred.type]}
                <span className="text-sm font-medium text-white">{pred.type}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Probability</span>
                <span className="text-sm font-bold text-white">{Math.round(pred.probability * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pred.probability * 100}%`, backgroundColor: color }}
                />
              </div>
              <div className="text-xs px-2 py-0.5 rounded inline-block" style={{ backgroundColor: color + "20", color }}>
                {pred.severity}
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Trend */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Historical Extreme Events (per decade)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={historicalTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="decade" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
            <Bar dataKey="events" radius={[4, 4, 0, 0]}>
              {historicalTrend.map((_, i) => (
                <Cell key={i} fill={i > 8 ? "#ef4444" : i > 5 ? "#f59e0b" : "#22c55e"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
