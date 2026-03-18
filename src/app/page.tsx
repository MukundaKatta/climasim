"use client";

import dynamic from "next/dynamic";
import { useClimaStore, TabMode } from "@/lib/store";
import SimulatorPanel from "@/components/SimulatorPanel";
import SeaLevelPanel from "@/components/SeaLevelPanel";
import CarbonBudgetPanel from "@/components/CarbonBudgetPanel";
import ExtremeEventPanel from "@/components/ExtremeEventPanel";
import {
  Globe2, Sliders, Waves, Factory, Zap,
} from "lucide-react";

const GlobeView = dynamic(() => import("@/components/GlobeView"), { ssr: false });

const tabs: { key: TabMode; label: string; icon: React.ReactNode }[] = [
  { key: "simulator", label: "Simulator", icon: <Sliders size={18} /> },
  { key: "sealevel", label: "Sea Level", icon: <Waves size={18} /> },
  { key: "carbon", label: "Carbon Budget", icon: <Factory size={18} /> },
  { key: "extreme", label: "Extreme Events", icon: <Zap size={18} /> },
  { key: "globe", label: "3D Globe", icon: <Globe2 size={18} /> },
];

export default function HomePage() {
  const { tab, setTab } = useClimaStore();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Left Nav */}
      <div className="w-16 h-full glass-panel flex flex-col items-center py-6 gap-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mb-6">
          <Globe2 size={20} className="text-white" />
        </div>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              tab === t.key
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
            }`}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {tab === "globe" ? (
          <div className="w-full h-full">
            <GlobeView />
          </div>
        ) : (
          <>
            <div className="w-1/2 h-full">
              <GlobeView />
            </div>
            <div className="w-1/2 h-full border-l border-slate-700/50">
              {tab === "simulator" && <SimulatorPanel />}
              {tab === "sealevel" && <SeaLevelPanel />}
              {tab === "carbon" && <CarbonBudgetPanel />}
              {tab === "extreme" && <ExtremeEventPanel />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
