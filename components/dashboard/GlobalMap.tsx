'use client';

import React, { memo, useState, useRef, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const markers = [
  { name: "Mumbai", coordinates: [72.8777, 19.0760] as [number, number], sales: '₹1.00L', orders: 1 },
  { name: "Dubai", coordinates: [55.2708, 25.2048] as [number, number], sales: '₹0.00L', orders: 0 },
];

const activeCountries = ["India", "United Arab Emirates"];

const MapChart = () => {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent page scroll when scrolling inside the map
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative" 
      style={{ minHeight: '300px', cursor: 'grab' }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [0, 20]
        }}
        width={800}
        height={400}
        style={{ width: "100%", height: "100%", outline: "none" }}
      >
        <ZoomableGroup center={[0, 20]} zoom={1} maxZoom={5}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isActive = activeCountries.includes(geo.properties.name);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isActive ? "var(--brand-primary)" : "var(--bg-base)"}
                    fillOpacity={isActive ? 0.15 : 1}
                    stroke={isActive ? "var(--brand-primary)" : "var(--border-color)"}
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none", transition: "all 250ms" },
                      hover: { fill: isActive ? "var(--brand-primary)" : "var(--border-color)", fillOpacity: isActive ? 0.3 : 1, outline: "none", transition: "all 250ms" },
                      pressed: { outline: "none" },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {markers.map(({ name, coordinates, sales }) => (
            <Marker 
              key={name} 
              coordinates={coordinates}
              onMouseEnter={() => setHoveredMarker(name)}
              onMouseLeave={() => setHoveredMarker(null)}
              style={{ cursor: "pointer" }}
            >
              <g
                fill="none"
                stroke="var(--brand-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-6, -12) scale(0.5)"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
              </g>
              <circle r={3} fill="var(--brand-primary)" className="animate-ping opacity-75" />
              
              {hoveredMarker === name && (
                <text
                  textAnchor="middle"
                  y={8}
                  style={{
                    fontFamily: "system-ui",
                    fill: "var(--text-main)",
                    fontSize: 7,
                    fontWeight: "bold"
                  }}
                >
                  {name} ({sales})
                </text>
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default memo(MapChart);
