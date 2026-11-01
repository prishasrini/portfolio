"use client";

import { useEffect, useRef } from "react";

const SIZES = [140, 104, 80, 60, 44]; // the five drops, biggest first

/**
 * Liquid cursor for the contact section: five drops chase the cursor, each one following
 * the one before, and an SVG "goo" filter melts them into one blob. mix-blend-difference
 * flips the colours of whatever the blob passes over.
 * Put it inside a `position: relative` section. Mouse only; nothing shows on touch screens.
 */
export default function Liquid() {
  const layer = useRef<HTMLDivElement>(null);
  const drops = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = layer.current!;
    const parent = el.parentElement!;
    const mouse = { x: 0, y: 0, inside: false };
    const pts = SIZES.map(() => ({ x: 0, y: 0 }));
    let started = false;
    let frame = 0;

    function onMove(e: PointerEvent) {
      const r = parent.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.inside = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= r.width && mouse.y <= r.height;
      if (!started) {
        started = true;
        pts.forEach((p) => Object.assign(p, { x: mouse.x, y: mouse.y }));
      }
    }
    function tick() {
      pts.forEach((p, i) => {
        const lead = i === 0 ? mouse : pts[i - 1];
        const ease = i === 0 ? 0.2 : 0.35;
        p.x += (lead.x - p.x) * ease;
        p.y += (lead.y - p.y) * ease;
        const d = drops.current[i];
        if (d) {
          d.style.transform = `translate(${p.x - SIZES[i] / 2}px, ${p.y - SIZES[i] / 2}px)`;
          d.style.opacity = mouse.inside ? "1" : "0";
        }
      });
      frame = requestAnimationFrame(tick);
    }
    window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="liquid-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
      </svg>
      <div
        ref={layer}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 hidden mix-blend-difference [@media(pointer:fine)]:block"
        style={{ filter: "url(#liquid-goo)" }}
      >
        {SIZES.map((s, i) => (
          <span
            key={s}
            ref={(el) => {
              if (el) drops.current[i] = el;
            }}
            className="absolute left-0 top-0 rounded-full bg-cream opacity-0 transition-opacity duration-300"
            style={{ width: s, height: s, willChange: "transform" }}
          />
        ))}
      </div>
    </>
  );
}
