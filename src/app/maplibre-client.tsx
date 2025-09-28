"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

export default function LeafletClient() {
  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    (async () => {
      const el = document.getElementById("bg-map");
      if (!el) return;

      const { default: L } = await import("leaflet");

      // Container bereinigen, falls bereits eine Leaflet-Instanz existiert
      const anyEl = el as unknown as { _leaflet_id?: number } & HTMLElement;
      if (anyEl._leaflet_id) {
        try {
          anyEl.innerHTML = "";
          anyEl._leaflet_id = undefined;
        } catch {}
      }

      map = L.map(el, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      const bali = L.latLng(-8.4095, 115.1889);
      const chiangMai = L.latLng(18.7883, 98.9853);

      const mBali = L.circleMarker(bali, { radius: 7, color: "#cfd2d8", weight: 2, fillColor: "#ffffff", fillOpacity: 0.9 })
        .addTo(map)
        .bindTooltip("currently", { direction: "top", offset: [0, -10] });

      const mChiang = L.circleMarker(chiangMai, { radius: 7, color: "#cfd2d8", weight: 2, fillColor: "#ffffff", fillOpacity: 0.9 })
        .addTo(map)
        .bindTooltip("soon", { direction: "top", offset: [0, -10] });

      const bounds = L.latLngBounds([bali, chiangMai]);
      map.fitBounds(bounds, { padding: [80, 80] });

      const resize = () => { try { map?.invalidateSize(); } catch {} };
      window.addEventListener("resize", resize);
      setTimeout(resize, 50);

      const syncTooltips = () => {
        const show = document.body.classList.contains("map-only");
        if (show) {
          mBali.openTooltip();
          mChiang.openTooltip();
        } else {
          mBali.closeTooltip();
          mChiang.closeTooltip();
        }
      };
      const mo = new MutationObserver(syncTooltips);
      mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
      syncTooltips();
    })();

    return () => {
      try { map?.remove(); } catch {}
    };
  }, []);

  return null;
}
