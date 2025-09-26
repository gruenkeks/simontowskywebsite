"use client";

import Image from "next/image";
import MapClient from "./maplibre-client";
import { useEffect, useRef } from "react";

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | null>(null);

  useEffect(() => {
    const n = 4; // Anzahl Buttons
    const gapPx = 16; // horizontaler Abstand zwischen Buttons
    const borderPerButton = 2; // 1px links + 1px rechts Rahmen
    const update = () => {
      // Icon-Größen exakt an Überschriftenbreite anpassen (inkl. Button-Rahmen)
      const titleW = titleRef.current?.offsetWidth ?? 0;
      if (titleW && iconsRef.current) {
        const totalGaps = gapPx * (n - 1);
        const totalBorders = borderPerButton * n;
        const size = Math.max(36, Math.floor((titleW - totalGaps - totalBorders) / n));
        iconsRef.current.style.setProperty("--iconSize", `${size}px`);
        iconsRef.current.style.setProperty("--iconGap", `${gapPx}px`);
      }
      // Portrait-Höhe = Höhe von Überschrift + Iconreihe + vertikale Abstände
      const titleH = titleRef.current?.getBoundingClientRect().height ?? 0;
      const iconsEl = iconsRef.current;
      const iconsH = iconsEl?.getBoundingClientRect().height ?? 0;
      const cs = iconsEl ? getComputedStyle(iconsEl) : null;
      const mt = cs ? parseFloat(cs.marginTop || "0") : 0;
      const mb = cs ? parseFloat(cs.marginBottom || "0") : 0;
      const blockH = titleH + iconsH + mt + mb;
      const portrait = Math.min(640, Math.max(100, Math.round(blockH)));
      document.documentElement.style.setProperty("--portraitSize", `${portrait}px`);
    };

    update();

    const ro1 = new ResizeObserver(update);
    const ro2 = new ResizeObserver(update);
    if (titleRef.current) ro1.observe(titleRef.current);
    if (iconsRef.current) ro2.observe(iconsRef.current);
    if (blockRef.current) ro2.observe(blockRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro1.disconnect();
      ro2.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <main className="relative min-h-screen grid grid-rows-[1fr_auto]">
      {/* Background map canvas placeholder; MapLibre added later */}
      <div id="bg-map" className="pointer-events-none fixed inset-0 opacity-10 transition-opacity duration-300" aria-hidden />
      <MapClient />

      {/* Centered hero */}
      <section className="relative z-[1] w-full max-w-[1400px] mx-auto px-6 py-8 grid min-h-[100svh] grid-cols-[1fr_auto_1fr] items-center justify-items-center">
        {/* Center column with text */}
        <div ref={blockRef} className="col-start-2 text-center">
          <h1 ref={titleRef} className="hide-on-map m-0 font-extrabold tracking-tight leading-[1.04] text-[clamp(44px,6.4vw,80px)] whitespace-nowrap">
            Dennis Simontowsky
          </h1>
          <div
            ref={iconsRef}
            className="flex mt-4 justify-center"
            style={{ gap: "var(--iconGap, 16px)" }}
          >
            <button
              type="button"
              className="globe-btn inline-flex items-center justify-center rounded-lg border border-[color:var(--line)] bg-white/5 hover:bg-white/15 transition"
              aria-label="Show travel map"
              title="Show travel map"
              onMouseEnter={() => {
                if (hoverTimer.current) { window.clearTimeout(hoverTimer.current); hoverTimer.current = null; }
                document.body.classList.add("map-reveal");
                document.body.classList.add("map-only");
              }}
              onMouseLeave={() => {
                if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
                hoverTimer.current = window.setTimeout(() => {
                  document.body.classList.remove("map-reveal");
                  document.body.classList.remove("map-only");
                  hoverTimer.current = null;
                }, 150);
              }}
              onFocus={() => {
                if (hoverTimer.current) { window.clearTimeout(hoverTimer.current); hoverTimer.current = null; }
                document.body.classList.add("map-reveal");
                document.body.classList.add("map-only");
              }}
              onBlur={() => {
                if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
                hoverTimer.current = window.setTimeout(() => {
                  document.body.classList.remove("map-reveal");
                  document.body.classList.remove("map-only");
                  hoverTimer.current = null;
                }, 150);
              }}
              style={{ width: "var(--iconSize)", height: "var(--iconSize)" }}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ width: "calc(var(--iconSize) * 0.5)", height: "calc(var(--iconSize) * 0.5)" }}>
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9s1.3-6.3 3.8-9Z"/>
                  <path d="M5.6 6.5c3.8 2.3 9 2.3 12.8 0M18.4 17.5c-3.8-2.3-9-2.3-12.8 0"/>
                </g>
              </svg>
            </button>
            <a
              className="hide-on-map inline-flex items-center justify-center rounded-lg border border-[color:var(--line)] bg-white/5 hover:bg-white/15 transition"
              href="mailto:dennis@simontowsky.com"
              aria-label="E-Mail an dennis@simontowsky.com senden"
              style={{ width: "var(--iconSize)", height: "var(--iconSize)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ width: "calc(var(--iconSize) * 0.5)", height: "calc(var(--iconSize) * 0.5)" }}>
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="M3 7l9 6 9-6"/>
              </svg>
            </a>
            <a
              className="hide-on-map inline-flex items-center justify-center rounded-lg border border-[color:var(--line)] bg-white/5 hover:bg-white/15 transition"
              href="https://wa.me/4917621280315"
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp chat with Dennis"
              style={{ width: "var(--iconSize)", height: "var(--iconSize)" }}
            >
              <Image src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="" width={36} height={36} style={{ width: "calc(var(--iconSize) * 0.5)", height: "calc(var(--iconSize) * 0.5)" }} />
            </a>
            <a
              className="hide-on-map inline-flex items-center justify-center rounded-lg border border-[color:var(--line)] bg-white/5 hover:bg-white/15 transition"
              href="https://instagram.com/dennissimontowsky"
              target="_blank"
              rel="noopener"
              aria-label="Instagram profile @dennissimontowsky"
              style={{ width: "var(--iconSize)", height: "var(--iconSize)" }}
            >
              <Image src="https://cdn.simpleicons.org/instagram/ffffff" alt="" width={36} height={36} style={{ width: "calc(var(--iconSize) * 0.5)", height: "calc(var(--iconSize) * 0.5)" }} />
            </a>
          </div>
        </div>

        {/* Right column with portrait */}
        <div className="col-start-3 justify-self-start z-[2] ml-6 hide-on-map">
          <div className="relative" style={{ width: "var(--portraitSize, 240px)", height: "var(--portraitSize, 240px)" }}>
            <div className="absolute -left-[14%] top-[12%] w-[42%] h-[42%] rounded-full bg-[radial-gradient(closest-side,rgba(180,120,255,0.35),rgba(180,120,255,0)_70%)] blur-[2px]" aria-hidden />
            <div className="absolute inset-0 rounded-full p-3 bg-[linear-gradient(145deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))] shadow-[0_12px_50px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <Image
                src="/headshot.webp"
                alt="Portrait von Dennis Simontowsky"
                fill
                sizes="(max-width: 768px) 45vw, (max-width: 1200px) 360px, 420px"
                unoptimized
                className="rounded-full border border-[color:var(--line)] [transform:scaleX(-1)] object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-[1] border-t border-[color:var(--line)] px-6 py-4 text-xs text-[color:var(--muted)] hide-on-map">
        © {new Date().getFullYear()} Dennis Simontowsky
      </footer>

      <style jsx global>{`
        #bg-map { z-index: 2; }
        body.map-reveal #bg-map { opacity: 0.45; }
        /* Map beim Hover zeigen, aber nicht interaktiv machen, damit Hover nicht verloren geht */
        body.map-only #bg-map { opacity: 1; pointer-events: none; }
        .maplibregl-ctrl-attrib { display: none !important; }
        /* Nur ausblenden, kein transform -> verhindert Flackern */
        body.map-only .hide-on-map { opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 180ms ease; }
        body.map-only .globe-btn { position: relative; z-index: 3; }
      `}</style>
    </main>
  );
}
