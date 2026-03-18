import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SimulationRun = {
  id: string;
  name: string;
  scenario: string;
  start_year: number;
  end_year: number;
  co2_initial: number;
  parameters: Record<string, number>;
  results: SimulationResult[];
  created_at: string;
};

export type SimulationResult = {
  year: number;
  co2_ppm: number;
  temperature_anomaly: number;
  sea_level_mm: number;
  ice_sheet_area_km2: number;
  extreme_events: number;
  carbon_budget_remaining_gt: number;
};
