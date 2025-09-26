"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletClient() {
  useEffect(() => {
    const el = document.getElementById("bg-map");
    if (!el) return;

    // Container bereinigen, falls bereits eine Leaflet-Instanz existiert
    const anyEl = el as unknown as { _leaflet_id?: number } & HTMLElement;
    if (anyEl._leaflet_id) {
      try {
        anyEl.innerHTML = "";
        anyEl._leaflet_id = undefined;
      } catch {}
    }

    const map = L.map(el, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      tap: false,
      touchZoom: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const bali = L.latLng(-8.4095, 115.1889);
    const chiangMai = L.latLng(18.7883, 98.9853);

    L.circleMarker(bali, { radius: 7, color: "#cfd2d8", weight: 2, fillColor: "#ffffff", fillOpacity: 0.9 }).addTo(map);
    L.circleMarker(chiangMai, { radius: 7, color: "#cfd2d8", weight: 2, fillColor: "#ffffff", fillOpacity: 0.9 }).addTo(map);

    const bounds = L.latLngBounds([bali, chiangMai]);
    map.fitBounds(bounds, { padding: [80, 80] });

    const resize = () => { try { map.invalidateSize(); } catch {} };
    window.addEventListener("resize", resize);
    setTimeout(resize, 50);

    return () => {
      window.removeEventListener("resize", resize);
      try { map.remove(); } catch {}
    };
  }, []);

  return null;
}
