"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export type MapCountry = { name: string; coordinates: [number, number] };

export default function UXUIWorldMap({ countries }: { countries: MapCountry[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col">
      <div className="relative aspect-[2/1] w-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [10, 15] }}
          className="h-full w-full"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(26,26,26,0.05)"
                  stroke="rgba(26,26,26,0.18)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "rgba(26,26,26,0.1)" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {countries.map((country) => (
            <Marker
              key={country.name}
              coordinates={country.coordinates}
              onMouseEnter={() => setHovered(country.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle
                r={hovered === country.name ? 7 : 4.5}
                className="cursor-pointer transition-all duration-200"
                fill="#1a1a1a"
                fillOpacity={hovered === country.name ? 1 : 0.75}
                stroke="#fdfbf5"
                strokeWidth={1}
              />
            </Marker>
          ))}
        </ComposableMap>
      </div>

      <div className="mt-3 min-h-[1.25rem] text-center font-mono text-xs uppercase tracking-[3px] text-[#1a1a1a]">
        {hovered ?? ""}
      </div>
    </div>
  );
}
