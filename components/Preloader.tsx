"use client";

import { useEffect, useState } from "react";

// A quick 0 → 100 counter, then the curtain lifts.
export default function Preloader() {
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const DURATION = 1300;
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / DURATION);
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setTimeout(() => setGone(true), 900); // after the slide-up animation
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (gone) return null;
  const done = count === 100;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[95] flex flex-col justify-between bg-red p-5 text-cream sm:p-8"
      style={done ? { animation: "loader-out 0.9s cubic-bezier(0.76,0,0.24,1) forwards" } : undefined}
    >
      <div className="flex justify-between text-sm uppercase tracking-widest">
        <span>Portfolio</span>
        <span>©2026</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="font-serif text-4xl italic sm:text-6xl">Prisha</span>
        <span className="font-mega text-[28vw] sm:text-[18vw]">{count}</span>
      </div>
    </div>
  );
}
