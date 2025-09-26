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
              <svg viewBox="0 0 24 24" aria-hidden width="36" height="36" style={{ width: "calc(var(--iconSize) * 0.5)", height: "calc(var(--iconSize) * 0.5)" }}>
                <path fill="currentColor" d="M20.52 3.48A11.77 11.77 0 0 0 12.06 0C5.46.03.13 5.36.16 11.96c.01 2.11.57 4.17 1.64 5.97L0 24l6.22-1.76a12 12 0 0 0 5.84 1.56h.05c6.6-.03 11.93-5.36 11.95-11.96A11.77 11.77 0 0 0 20.52 3.48Zm-8.47 18.5h-.04a10.2 10.2 0 0 1-5.2-1.43l-.37-.21-3.7 1.05 1-3.61l-.24-.37a9.6 9.6 0 0 1-1.49-5.1C2 6.46 6.48 2 12.05 2a9.78 9.78 0 0 1 6.96 2.88 9.73 9.73 0 0 1 2.87 6.96c-.02 5.56-4.5 10.14-9.83 10.14Zm5.4-7.59c-.29-.15-1.73-.85-2-.95c-.27-.1-.47-.15-.67.15c-.2.29-.77.95-.95 1.15c-.17.2-.35.22-.64.08c-.29-.15-1.23-.45-2.34-1.44c-.86-.77-1.43-1.72-1.6-2c-.17-.29-.02-.45.13-.6c.14-.14.29-.35.44-.52c.15-.17.2-.29.29-.49c.1-.2.05-.37-.02-.52c-.08-.15-.67-1.6-.92-2.2c-.24-.58-.49-.5-.67-.5h-.57c-.19 0-.5.07-.76.37c-.26.29-1 1-1 2.45c0 1.44 1.03 2.84 1.17 3.04c.15.2 2.03 3.1 4.92 4.35c.69.3 1.22.48 1.64.61c.69.22 1.33.19 1.83.12c.56-.08 1.73-.71 1.97-1.39c.24-.68.24-1.27.17-1.39c-.07-.12-.26-.19-.55-.34Z"/>
              </svg>
            </a>
            <a
              className="hide-on-map inline-flex items-center justify-center rounded-lg border border-[color:var(--line)] bg-white/5 hover:bg-white/15 transition"
              href="https://instagram.com/dennissimontowsky"
              target="_blank"
              rel="noopener"
              aria-label="Instagram profile @dennissimontowsky"
              style={{ width: "var(--iconSize)", height: "var(--iconSize)" }}
            >
              <svg viewBox="0 0 24 24" aria-hidden width="36" height="36" style={{ width: "calc(var(--iconSize) * 0.5)", height: "calc(var(--iconSize) * 0.5)" }}>
                <path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.9.07c1.17.06 1.95.24 2.64.52c.72.28 1.33.66 1.93 1.26c.6.6.98 1.21 1.26 1.93c.28.69.46 1.47.52 2.64c.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.17-.24 1.95-.52 2.64c-.28.72-.66 1.33-1.26 1.93c-.6.6-1.21.98-1.93 1.26c-.69.28-1.47.46-2.64.52c-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.17-.06-1.95-.24-2.64-.52c-.72-.28-1.33-.66-1.93-1.26c-.6-.6-.98-1.21-1.26-1.93c-.28-.69-.46-1.47-.52-2.64C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.17.24-1.95.52-2.64c.28-.72.66-1.33 1.26-1.93c.6-.6 1.21-.98 1.93-1.26c.69-.28 1.47-.46 2.64-.52C8.4 2.2 8.8 2.2 12 2.2m0 1.8c-3.16 0-3.53 0-4.78.07c-1.03.05-1.58.22-1.95.37c-.49.19-.83.41-1.2.78c-.37.37-.59.71-.78 1.2c-.15.37-.32.92-.37 1.95c-.07 1.25-.07 1.62-.07 4.78s0 3.53.07 4.78c.05 1.03.22 1.58.37 1.95c.19.49.41.83.78 1.2c.37.37.71.59 1.2.78c.37.15.92.32 1.95.37c1.25.07 1.62.07 4.78.07s3.53 0 4.78-.07c1.03-.05 1.58-.22 1.95-.37c.49-.19.83-.41 1.2-.78c.37-.37.59-.71.78-1.2c.15-.37.32-.92.37-1.95c.07-1.25.07-1.62.07-4.78s0-3.53-.07-4.78c-.05-1.03-.22-1.58-.37-1.95c-.19-.49-.41-.83-.78-1.2c-.37-.37-.71-.59-1.2-.78c-.37-.15-.92-.32-1.95-.37C15.53 4 15.16 4 12 4Zm0 2.8A5.2 5.2 0 1 1 6.8 12A5.2 5.2 0 0 1 12 6.8m0 1.8A3.4 3.4 0 1 0 15.4 12A3.4 3.4 0 0 0 12 8.6m4.85-3.13a1.2 1.2 0 1 0 1.2 1.2a1.2 1.2 0 0 0-1.2-1.2Z"/>
              </svg>
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
