"use client";

import { useCallback, useRef } from "react";
import { education, profile } from "@/lib/data";
import { range, usePinnedProgress } from "@/lib/scroll";

// A big paragraph that lights up word by word as you scroll, like reading along.
export default function Statement() {
  const section = useRef<HTMLElement>(null);
  const wordEls = useRef<HTMLSpanElement[]>([]);
  const words = profile.statement.split(" ");

  const onProgress = useCallback(
    (p: number) => {
      const lit = range(p, 0.05, 0.85) * words.length;
      wordEls.current.forEach((el, i) => {
        if (el) el.style.opacity = String(0.14 + 0.86 * Math.min(1, Math.max(0, lit - i)));
      });
    },
    [words.length],
  );
  usePinnedProgress(section, onProgress);

  return (
    <section ref={section} id="about" className="relative h-[260vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center px-5 sm:px-10">
        <p className="mb-8 text-xs uppercase tracking-[0.3em] text-mute sm:text-sm">(About)</p>
        <p className="max-w-6xl text-[clamp(1.9rem,4.6vw,4.6rem)] font-medium leading-[1.08] tracking-[-0.02em]">
          {words.map((w, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) wordEls.current[i] = el;
              }}
              style={{ opacity: 0.14, transition: "opacity 0.15s linear" }}
            >
              {w}{" "}
            </span>
          ))}
        </p>
        <div className="mt-12 grid max-w-6xl grid-cols-2 gap-6 border-t border-cream/15 pt-6 text-sm sm:grid-cols-4">
          <div>
            <p className="text-mute">Studying</p>
            <p className="mt-1">B.Tech CSE, SRM</p>
          </div>
          <div>
            <p className="text-mute">Graduating</p>
            <p className="mt-1">May 2027</p>
          </div>
          <div>
            <p className="text-mute">CGPA</p>
            <p className="mt-1 font-serif text-2xl italic text-red">{education.cgpa}</p>
          </div>
          <div>
            <p className="text-mute">Based in</p>
            <p className="mt-1">{profile.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
