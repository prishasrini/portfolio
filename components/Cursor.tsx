"use client";

import { useEffect, useRef } from "react";

/**
 * A cursor that reacts to what's under it:
 *  - a red dot sits exactly on the pointer, and a cream ring follows it with a little lag
 *  - the ring stretches in the direction you move, like jelly, the faster the more
 *  - over links and buttons it grows into a bubble with a word inside (from data-cursor, or "Open")
 *  - small links and buttons are magnetic: they lean towards the cursor
 *  - over normal text it slims into a text bar
 * Only on devices with a mouse. The normal cursor comes back on touch screens.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("has-cursor");

    const d = dot.current!;
    const r = ring.current!;
    const l = label.current!;
    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...mouse };
    let mode: "default" | "label" | "text" | "hidden" = "default";
    let magnet: HTMLElement | null = null;
    let frame = 0;
    let shown = false;

    function setMode(next: typeof mode, text = "") {
      if (next === mode && l.textContent === text) return;
      mode = next;
      l.textContent = text;
      r.dataset.mode = next;
    }

    function onMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!shown) {
        shown = true;
        d.style.opacity = r.style.opacity = "1";
      }
      const t = e.target as HTMLElement;
      const target = t.closest<HTMLElement>("a, button, [data-cursor]");

      // Magnetic pull on small clickable things
      if (magnet && magnet !== target) {
        magnet.style.transform = "";
        magnet = null;
      }
      if (target && (target.tagName === "A" || target.tagName === "BUTTON")) {
        const b = target.getBoundingClientRect();
        if (b.width < 240 && b.height < 90) {
          magnet = target;
          const mx = (e.clientX - (b.left + b.width / 2)) * 0.3;
          const my = (e.clientY - (b.top + b.height / 2)) * 0.3;
          target.style.transition = "transform 0.25s cubic-bezier(0.2,0.8,0.2,1)";
          target.style.transform = `translate(${mx}px, ${my}px)`;
        }
      }

      // Sections with their own cursor effect (X-ray lens, liquid) hide the ring and keep the dot
      const zone = t.closest<HTMLElement>("[data-cursor-mode]")?.dataset.cursorMode;
      if (zone) setMode("hidden");
      else if (target) setMode("label", target.dataset.cursor ?? "Open");
      else if (t.closest("p, h1, h2, h3, li") && getComputedStyle(t).userSelect !== "none") setMode("text");
      else setMode("default");
    }

    function onLeave() {
      shown = false;
      d.style.opacity = r.style.opacity = "0";
    }
    function onDown() {
      r.style.scale = "0.8";
    }
    function onUp() {
      r.style.scale = "1";
    }

    function tick() {
      // The ring eases after the pointer
      const vx = mouse.x - pos.x;
      const vy = mouse.y - pos.y;
      pos.x += vx * 0.18;
      pos.y += vy * 0.18;

      // Stretch along the direction of travel
      const speed = Math.hypot(vx, vy);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const stretch = mode === "default" ? Math.min(speed / 90, 0.7) : 0;

      d.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
      r.style.transform =
        `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) rotate(${angle}deg) ` +
        `scale(${1 + stretch}, ${1 - stretch * 0.45})`;
      // Keep the label upright while the ring rotates
      l.style.transform = `rotate(${-angle}deg)`;

      frame = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    frame = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(frame);
      if (magnet) magnet.style.transform = "";
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        data-mode="default"
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full opacity-0"
      >
        <span ref={label} className="cursor-label whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.15em]" />
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] h-2 w-2 rounded-full border border-cream bg-red opacity-0"
      />
    </>
  );
}
