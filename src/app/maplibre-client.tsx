"use client";

import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapLibreClient() {
  useEffect(() => {
    const el = document.getElementById("bg-map");
    if (!el) return;

    const map = new maplibregl.Map({
      container: el,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      interactive: false,
      attributionControl: false,
    });

    const bali: [number, number] = [115.1889, -8.4095];
    const chiangMai: [number, number] = [98.9853, 18.7883];

    new maplibregl.Marker({ color: "#ffffff" }).setLngLat(bali).addTo(map);
    new maplibregl.Marker({ color: "#ffffff" }).setLngLat(chiangMai).addTo(map);

    map.fitBounds(
      [
        [bali[0], bali[1]],
        [chiangMai[0], chiangMai[1]],
      ],
      { padding: 80, duration: 0 }
    );

    return () => {
      map.remove();
    };
  }, []);

  return null;
}
