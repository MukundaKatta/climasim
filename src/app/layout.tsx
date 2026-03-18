import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClimaSim - Climate Simulation Platform",
  description: "Interactive climate simulation with CO2 scenarios, sea level rise, and extreme event prediction",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
