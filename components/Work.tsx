"use client";

import { useCallback, useRef } from "react";
import { projects, type Project } from "@/lib/data";
import { clamp, stepped, usePinnedProgress } from "@/lib/scroll";

/**
 * Projects as full-screen panels.
 * On laptops the section pins and the panels slide sideways as you scroll down.
 * On phones they simply stack.
 */
export default function Work() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLElement[][]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const n = projects.length;

  const onProgress = useCallback(
    (p: number) => {
      const wide = window.innerWidth >= 1024;
      // Each panel rests on screen for a while before the next slides in
      const k = stepped(Math.min(1, p / 0.85), n, 0.4); // the last 15% rests on the final panel
      if (track.current) track.current.style.transform = wide ? `translateX(${-k * 100}vw)` : "none";
      if (bar.current) bar.current.style.transform = `scaleX(${wide ? p : 0})`;
      // Each panel's own progress: -1 (to the right) → 0 (centered) → 1 (gone left)
      parallax.current.forEach((els, i) => {
        const local = wide ? clamp(k - i, -1, 1) : 0;
        els?.forEach((el) => {
          const depth = Number(el.dataset.depth || 0);
          el.style.transform = `translateX(${-local * depth}px)`;
        });
      });
    },
    [n],
  );
  usePinnedProgress(section, onProgress);

  return (
    <section ref={section} id="work" className="relative lg:h-[300vh]"> {/* 100vh per project */}
      <div className="lg:sticky lg:top-0 lg:h-[100svh] lg:overflow-hidden">
        <div ref={track} className="flex flex-col lg:h-full lg:w-max lg:flex-row" style={{ willChange: "transform" }}>
          {projects.map((p, i) => (
            <Panel
              key={p.slug}
              project={p}
              index={i}
              total={n}
              register={(el) => {
                if (!el) return;
                parallax.current[i] = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));
              }}
            />
          ))}
        </div>
        {/* Progress bar along the bottom (laptops) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1 bg-black/10 lg:block">
          <div ref={bar} className="h-full origin-left bg-red" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}

function Panel({
  project: p,
  index,
  total,
  register,
}: {
  project: Project;
  index: number;
  total: number;
  register: (el: HTMLElement | null) => void;
}) {
  const links = p.links.filter((l) => l.href);

  return (
    <article
      ref={register}
      className="relative flex min-h-[100svh] w-full flex-col gap-10 overflow-hidden px-5 py-20 sm:px-10 lg:h-full lg:w-screen lg:flex-row lg:items-center lg:gap-14 lg:py-14"
      style={{ background: p.color, color: p.ink }}
    >
      {/* Text side */}
      <div className="relative z-10 flex flex-col lg:h-full lg:w-[42%] lg:justify-between">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] sm:text-sm">
          <span>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="opacity-70">{p.kind}</span>
        </div>

        <h3 className="font-mega mt-8 text-[22vw] lg:mt-0 lg:text-[9.5vw]" data-depth="-60">
          {p.name}
        </h3>

        <div className="mt-8 lg:mt-0">
          <p className="max-w-xl text-lg leading-relaxed">{p.summary}</p>
          <ul className="mt-5 space-y-1.5 text-[15px] opacity-85">
            {p.built.map((b) => (
              <li key={b} className="flex gap-3">
                <span aria-hidden>—</span>
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs uppercase tracking-[0.2em] opacity-60">{p.stack.join(" · ")}</p>
          {links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors"
                  style={{ borderColor: p.ink }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = p.ink;
                    e.currentTarget.style.color = p.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = p.ink;
                  }}
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Visual side */}
      <div className="relative flex-1 lg:h-full" data-cursor="Scroll">
        {p.shots.length > 0 ? <Shots project={p} /> : <Building ink={p.ink} />}
      </div>
    </article>
  );
}

function Browser({ src, className = "", depth }: { src: string; className?: string; depth: number }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] ${className}`} data-depth={depth}>
      <div className="flex h-7 items-center gap-1.5 bg-[#ececec] px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block w-full" loading="lazy" draggable={false} />
    </div>
  );
}

function Shots({ project: p }: { project: Project }) {
  const [main, second, third] = p.shots;
  return (
    <div className="relative mx-auto aspect-[16/11] w-full max-w-3xl lg:absolute lg:inset-y-0 lg:right-0 lg:my-auto lg:h-fit lg:max-w-none">
      {third && <Browser src={third} depth={40} className="absolute right-0 top-0 w-[62%] rotate-[4deg] opacity-90" />}
      {second && <Browser src={second} depth={120} className="absolute bottom-0 left-0 w-[58%] -rotate-[3deg]" />}
      <Browser src={main} depth={220} className="absolute left-[12%] top-[12%] w-[70%]" />
      {p.phone && (
        <div
          data-depth={320}
          className="absolute -bottom-4 right-[4%] w-[22%] overflow-hidden rounded-[1.6rem] border-[6px] border-black bg-black shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.phone} alt="" className="block w-full rounded-[1.1rem]" loading="lazy" draggable={false} />
        </div>
      )}
    </div>
  );
}

// For projects without screenshots yet: a bold building made of blocks
function Building({ ink }: { ink: string }) {
  return (
    <div className="flex h-full min-h-[50vh] items-end justify-center gap-3 pb-6 lg:pb-0" aria-hidden>
      {[5, 8, 11, 7, 4].map((floors, col) => (
        <div key={col} className="flex w-[14%] max-w-24 flex-col gap-2" data-depth={60 + col * 40}>
          {Array.from({ length: floors }, (_, f) => (
            <div key={f} className="grid h-8 grid-cols-3 gap-1.5 border-2 p-1.5 sm:h-10" style={{ borderColor: ink }}>
              {[0, 1, 2].map((w) => (
                <span key={w} style={{ background: (f + w + col) % 3 === 0 ? ink : "transparent", opacity: 0.85 }} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
