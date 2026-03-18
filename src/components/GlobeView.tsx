"use client";

import { useEffect, useRef, useState } from "react";
import { useClimaStore } from "@/lib/store";

export default function GlobeView() {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const { year } = useClimaStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!container.current || mapRef.current) return;

    const init = async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.demo";

      mapRef.current = new mapboxgl.Map({
        container: container.current!,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [0, 20],
        zoom: 1.5,
        projection: "globe" as any,
        fog: {
          color: "rgb(5, 15, 20)",
          "high-color": "rgb(20, 30, 45)",
          "horizon-blend": 0.1,
          "space-color": "rgb(5, 10, 20)",
          "star-intensity": 0.8,
        } as any,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      mapRef.current.on("load", () => {
        setLoaded(true);

        // Add temperature heatmap overlay
        const features: any[] = [];
        for (let lat = -80; lat <= 80; lat += 8) {
          for (let lng = -180; lng <= 180; lng += 8) {
            const intensity = Math.max(0, 1 - Math.abs(lat) / 90) * 0.7 + Math.random() * 0.3;
            features.push({
              type: "Feature",
              geometry: { type: "Point", coordinates: [lng, lat] },
              properties: { intensity },
            });
          }
        }

        mapRef.current.addSource("temp-overlay", {
          type: "geojson",
          data: { type: "FeatureCollection", features },
        });

        mapRef.current.addLayer({
          id: "temp-heatmap",
          type: "heatmap",
          source: "temp-overlay",
          paint: {
            "heatmap-weight": ["get", "intensity"],
            "heatmap-intensity": 0.4,
            "heatmap-radius": 50,
            "heatmap-color": [
              "interpolate", ["linear"], ["heatmap-density"],
              0, "rgba(0,0,0,0)",
              0.2, "rgba(59,130,246,0.3)",
              0.4, "rgba(34,197,94,0.4)",
              0.6, "rgba(234,179,8,0.5)",
              0.8, "rgba(249,115,22,0.6)",
              1, "rgba(239,68,68,0.7)",
            ],
            "heatmap-opacity": 0.6,
          },
        });
      });

      // Slow auto-rotate
      const rotate = () => {
        if (!mapRef.current) return;
        const center = mapRef.current.getCenter();
        center.lng += 0.03;
        mapRef.current.setCenter(center);
        requestAnimationFrame(rotate);
      };
      rotate();
    };

    init();
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={container} className="w-full h-full" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Rendering globe...</p>
          </div>
        </div>
      )}
      {/* Year overlay */}
      <div className="absolute top-4 left-4 glass-panel px-4 py-2">
        <span className="text-xs text-slate-400">Simulation Year: </span>
        <span className="text-sm font-bold text-white">{year}</span>
      </div>
    </div>
  );
}
