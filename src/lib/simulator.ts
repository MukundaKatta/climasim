export interface SimParams {
  co2Initial: number;
  emissionsRate: number; // GtCO2/year
  scenario: "low" | "moderate" | "high" | "extreme";
  startYear: number;
  endYear: number;
}

export interface YearData {
  year: number;
  co2Ppm: number;
  tempAnomaly: number;
  seaLevelMm: number;
  iceSheetPct: number;
  extremeEvents: number;
  carbonBudgetGt: number;
  forestCoverPct: number;
  oceanPh: number;
}

const scenarioMultipliers: Record<string, number> = {
  low: 0.5,
  moderate: 1.0,
  high: 1.8,
  extreme: 3.0,
};

export function runSimulation(params: SimParams): YearData[] {
  const results: YearData[] = [];
  const mult = scenarioMultipliers[params.scenario] || 1;
  let co2 = params.co2Initial;
  let carbonBudget = 500; // GtCO2 remaining for 1.5C
  const totalYears = params.endYear - params.startYear;

  for (let y = params.startYear; y <= params.endYear; y++) {
    const t = (y - params.startYear) / Math.max(1, totalYears);
    const yearlyEmissions = params.emissionsRate * mult * (1 + t * 0.5 * (mult - 0.5));
    co2 += yearlyEmissions * 0.45; // ~45% stays in atmosphere
    carbonBudget = Math.max(0, carbonBudget - yearlyEmissions);

    const tempAnomaly = 0.8 + (co2 - 280) * 0.008 * mult * 0.6;
    const seaLevel = 200 + (tempAnomaly - 0.8) * 300 * (1 + t);
    const iceSheet = Math.max(0, 100 - tempAnomaly * 15);
    const extremeEvents = Math.round(10 + tempAnomaly * 20 * (1 + Math.random() * 0.3));
    const forestCover = Math.max(20, 80 - tempAnomaly * 8);
    const oceanPh = 8.1 - (co2 - 280) * 0.0003;

    results.push({
      year: y,
      co2Ppm: Math.round(co2 * 10) / 10,
      tempAnomaly: Math.round(tempAnomaly * 100) / 100,
      seaLevelMm: Math.round(seaLevel),
      iceSheetPct: Math.round(iceSheet * 10) / 10,
      extremeEvents,
      carbonBudgetGt: Math.round(carbonBudget * 10) / 10,
      forestCoverPct: Math.round(forestCover * 10) / 10,
      oceanPh: Math.round(oceanPh * 1000) / 1000,
    });
  }
  return results;
}

export function calculateCarbonBudget(targetTemp: number): {
  totalBudget: number;
  used: number;
  remaining: number;
  yearsAtCurrentRate: number;
} {
  const totalBudget = targetTemp === 1.5 ? 500 : targetTemp === 2.0 ? 1150 : 2000;
  const used = 2400; // approx cumulative since industrial era
  const remaining = Math.max(0, totalBudget + 2000 - used);
  return {
    totalBudget: totalBudget + 2000,
    used,
    remaining,
    yearsAtCurrentRate: Math.round(remaining / 40), // ~40 GtCO2/yr current rate
  };
}

export function predictExtremeEvents(
  tempAnomaly: number,
  region: string
): { type: string; probability: number; severity: string }[] {
  const base = tempAnomaly / 2;
  return [
    { type: "Heatwave", probability: Math.min(0.95, 0.3 + base * 0.25), severity: base > 1.5 ? "Extreme" : "Severe" },
    { type: "Drought", probability: Math.min(0.9, 0.2 + base * 0.2), severity: base > 2 ? "Extreme" : "Moderate" },
    { type: "Flooding", probability: Math.min(0.85, 0.25 + base * 0.22), severity: base > 1.8 ? "Severe" : "Moderate" },
    { type: "Wildfire", probability: Math.min(0.9, 0.15 + base * 0.28), severity: base > 2 ? "Catastrophic" : "Severe" },
    { type: "Hurricane Cat4+", probability: Math.min(0.8, 0.1 + base * 0.2), severity: base > 2.5 ? "Extreme" : "Severe" },
    { type: "Coral Bleaching", probability: Math.min(0.99, 0.4 + base * 0.3), severity: base > 1.5 ? "Mass Event" : "Moderate" },
  ];
}
