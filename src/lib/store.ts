import { create } from "zustand";

export type TabMode = "simulator" | "sealevel" | "carbon" | "extreme" | "globe";

interface ClimaStore {
  tab: TabMode;
  setTab: (t: TabMode) => void;
  co2Level: number;
  setCo2Level: (v: number) => void;
  year: number;
  setYear: (y: number) => void;
  scenario: string;
  setScenario: (s: string) => void;
  isSimulating: boolean;
  setIsSimulating: (v: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (v: number) => void;
}

export const useClimaStore = create<ClimaStore>((set) => ({
  tab: "simulator",
  setTab: (t) => set({ tab: t }),
  co2Level: 420,
  setCo2Level: (v) => set({ co2Level: v }),
  year: 2025,
  setYear: (y) => set({ year: y }),
  scenario: "moderate",
  setScenario: (s) => set({ scenario: s }),
  isSimulating: false,
  setIsSimulating: (v) => set({ isSimulating: v }),
  simulationSpeed: 1,
  setSimulationSpeed: (v) => set({ simulationSpeed: v }),
}));
