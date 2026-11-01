"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile, projects } from "@/lib/data";
import { easeIn, easeInOut, range, stepped, usePinnedProgress } from "@/lib/scroll";

// Every screenshot, repeated to fill the 3D ring
const ringShots = (() => {
  const all = projects.flatMap((p) => p.shots);
  const out: string[] = [];
  while (out.length < 10) out.push(...all);
  return out.slice(0, 10);
})();

/**
 * The scroll-driven opening, in three scenes inside one pinned screen:
 *  1. My name cut out of a black screen. Scrolling zooms into the letter "I" until it fills the screen.
 *  2. Inside it, a red screen: "I build" + giant words rolling past.
 *  3. A black circle opens up, revealing a 3D ring of my project screenshots spinning with the scroll.
 */
export default function Intro() {
  const section = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const nameText = useRef<SVGTextElement>(null);
  const zoomGroup = useRef<SVGGElement>(null);
  const sceneOneUi = useRef<HTMLDivElement>(null);
  const redScene = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLDivElement>(null);
  const redContent = useRef<HTMLDivElement>(null);
  const darkScene = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const workTitle = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const xray = useRef<HTMLDivElement>(null);
  const nameBox = useRef({ x: 0, y: 0, w: 0, h: 0 }); // where the name sits on screen
  const lensOn = useRef(true); // the X-ray lens only works on the first scene

  const [size, setSize] = useState({ w: 1440, h: 900 });
  const [fontSize, setFontSize] = useState(400);
  const origin = useRef({ x: 720, y: 450 });

  // Size the name to fill the screen width, and find the middle of the "I" to zoom into
  useEffect(() => {
    function measure() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setSize({ w, h });
      const text = nameText.current;
      if (!text) return;
      // Measure a copy at a known size, then scale so the word is ~94% of the screen width
      const probe = text.cloneNode(true) as SVGTextElement;
      probe.setAttribute("font-size", "100");
      text.parentNode?.appendChild(probe);
      const width = probe.getBBox().width || 1;
      probe.remove();
      setFontSize(Math.min((w * 0.94 * 100) / width, h * 0.62));
    }
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const text = nameText.current;
    if (!text) return;
    const iIndex = profile.name.toUpperCase().indexOf("I");
    try {
      // Zoom towards the middle of the "I", vertically centred on the word
      const r = text.getExtentOfChar(Math.max(0, iIndex));
      const box = text.getBBox();
      origin.current = { x: r.x + r.width / 2, y: box.y + box.height / 2 };
      nameBox.current = { x: box.x, y: box.y, w: box.width, h: box.height };
    } catch {
      origin.current = { x: size.w / 2, y: size.h / 2 };
    }
  }, [fontSize, size]);

  const onProgress = useCallback((p: number) => {
    const n = profile.builds.length;

    // Scene 1: zoom into the "I"
    const a = range(p, 0, 0.26);
    const s = 1 + easeIn(a) * 60;
    const { x, y } = origin.current;
    const zoom = `translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`;
    zoomGroup.current?.setAttribute("transform", zoom);
    lensOn.current = a < 0.12;
    // Tell the cursor to step aside while the lens is the cursor
    if (section.current) {
      if (lensOn.current) section.current.dataset.cursorMode = "lens";
      else delete section.current.dataset.cursorMode;
    }
    if (svg.current) {
      // The black fades away at the end of the zoom, so we always land fully on red
      svg.current.style.opacity = String(1 - range(a, 0.55, 0.95));
      svg.current.style.visibility = a >= 0.995 ? "hidden" : "visible";
    }
    if (sceneOneUi.current) {
      sceneOneUi.current.style.opacity = String(1 - range(a, 0, 0.35));
      sceneOneUi.current.style.transform = `translateY(${-a * 60}px)`;
    }
    if (hint.current) hint.current.style.opacity = String(1 - range(p, 0, 0.04));

    // Scene 2: red screen, words roll upwards
    if (redScene.current) redScene.current.style.transform = `scale(${1.25 - 0.25 * easeInOut(a)})`;
    // The words only appear once we're inside the red, so they don't show through the letters
    if (redContent.current) redContent.current.style.opacity = String(range(a, 0.8, 1));
    const step = stepped(range(p, 0.26, 0.64), n, 0.5);
    if (words.current) words.current.style.transform = `translateY(${-(step * 100) / n}%)`;

    // Scene 3: black circle opens, ring spins
    const c = range(p, 0.62, 0.8);
    if (darkScene.current) darkScene.current.style.clipPath = `circle(${easeInOut(c) * 75}% at 50% 50%)`;
    const spin = range(p, 0.62, 1);
    if (ring.current) ring.current.style.transform = `rotateX(-10deg) rotateY(${-30 - spin * 220}deg)`;
    if (workTitle.current) {
      const t = range(p, 0.72, 0.85);
      workTitle.current.style.opacity = String(t);
      workTitle.current.style.transform = `translateY(${(1 - t) * 40}px)`;
    }
  }, []);

  usePinnedProgress(section, onProgress);

  // X-ray lens: a circle around the cursor that shows a hidden red layer under scene 1
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = stage.current;
    const layer = xray.current;
    if (!el || !layer) return;
    const mouse = { x: -999, y: -999, inside: false };
    const pos = { x: -999, y: -999 };
    let radius = 0;
    let frame = 0;
    function onMove(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.inside = mouse.y >= 0 && mouse.y <= r.height;
      if (pos.x === -999) {
        pos.x = mouse.x;
        pos.y = mouse.y;
      }
    }
    function tick() {
      pos.x += (mouse.x - pos.x) * 0.18;
      pos.y += (mouse.y - pos.y) * 0.18;
      // Small lens normally; over the name it opens wide so the whole secret word shows
      const b = nameBox.current;
      const overName =
        mouse.x > b.x && mouse.x < b.x + b.w && mouse.y > b.y + b.h * 0.15 && mouse.y < b.y + b.h * 0.85;
      const big = Math.min(380, Math.max(200, el!.clientWidth * 0.26));
      const target = !lensOn.current || !mouse.inside ? 0 : overName ? big : 90;
      radius += (target - radius) * 0.12;
      layer!.style.clipPath = `circle(${radius.toFixed(1)}px at ${pos.x}px ${pos.y}px)`;
      frame = requestAnimationFrame(tick);
    }
    window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const cardW = Math.min(340, Math.max(170, size.w * 0.22));
  const radius = (cardW * ringShots.length) / (2 * Math.PI) + 40;

  return (
    <section ref={section} id="top" className="relative h-[560vh]" aria-label="Introduction">
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* ---------- Scene 2: red (sits behind the black cut-out) ---------- */}
        <div ref={redScene} className="absolute inset-0 flex flex-col justify-center bg-red px-5 sm:px-10">
          <div ref={redContent} style={{ opacity: 0 }}>
            <p className="font-serif text-[9vw] italic leading-none sm:text-[5vw]">I build</p>
            {/* Window that shows one word at a time. Sizes are in em so the window always matches one line,
                and the words never wrap, so a long one like "real products" can't spill over the next. */}
            <div className="mt-[1vw] h-[0.9em] overflow-hidden whitespace-nowrap text-[14vw] leading-[0.9em]">
              <div ref={words}>
                {profile.builds.map((w) => (
                  <p key={w} className="font-mega h-[0.9em] leading-[0.9em]">
                    {w}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-x-5 bottom-6 flex justify-between text-xs uppercase tracking-[0.2em] sm:inset-x-10 sm:text-sm">
            <span>Full-stack · React · React Native</span>
            <span>Websites, apps, APIs</span>
          </div>
        </div>

        {/* ---------- Scene 1: black screen with my name cut out of it ---------- */}
        <svg ref={svg} className="absolute inset-0 h-full w-full" width={size.w} height={size.h} aria-hidden>
          <defs>
            <mask id="name-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={size.w} height={size.h}>
              <rect width={size.w} height={size.h} fill="white" />
              <g ref={zoomGroup}>
                <text
                  ref={nameText}
                  x={size.w / 2}
                  y={size.h / 2}
                  fontSize={fontSize}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="black"
                  style={{ fontFamily: "Archivo Variable", fontStretch: "62%", fontWeight: 900, letterSpacing: "-0.02em" }}
                >
                  {profile.name.toUpperCase()}
                </text>
              </g>
            </mask>
          </defs>
          <rect width={size.w} height={size.h} fill="#0b0b0c" mask="url(#name-mask)" />
        </svg>

        <div ref={sceneOneUi} className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 sm:p-10">
          {/* Starts below the fixed header */}
          <div className="mt-14 flex justify-between gap-4 text-xs uppercase tracking-[0.2em] text-cream/70 sm:text-sm">
            <span>{profile.role}</span>
            <span>Portfolio ©2026</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="max-w-[16rem] font-serif text-2xl italic leading-tight sm:text-4xl">
              hello, I&apos;m a developer who builds the whole product.
            </p>
            <p className="hidden text-right text-xs uppercase tracking-[0.2em] text-cream/80 sm:block sm:text-sm">
              {profile.status}
            </p>
          </div>
        </div>

        <div
          ref={hint}
          className="pointer-events-none absolute bottom-24 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-cream/70 sm:bottom-8"
          aria-hidden
        >
          Scroll
          <span className="block h-10 w-px animate-pulse bg-cream/60" />
        </div>

        {/* ---------- X-ray layer: only visible inside the lens around the cursor ---------- */}
        <div
          ref={xray}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-red text-ink"
          style={{ clipPath: "circle(0px at -999px -999px)" }}
        >
          {/* A smaller secret word in the middle, so it fits inside the open lens */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="font-mega text-[24vw] sm:text-[15vw]">Hello</p>
            <p className="mt-2 font-serif text-2xl italic sm:text-4xl">you found the secret layer</p>
          </div>
        </div>

        {/* ---------- Scene 3: black circle with the 3D ring of work ---------- */}
        <div
          ref={darkScene}
          className="absolute inset-0 flex items-center justify-center bg-ink"
          style={{ clipPath: "circle(0% at 50% 50%)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1600px" }}>
            <div ref={ring} className="relative" style={{ transformStyle: "preserve-3d", width: cardW, height: cardW * 0.625 }}>
              {ringShots.map((src, i) => (
                <div
                  key={i}
                  className="absolute inset-0 overflow-hidden rounded-md bg-ink-2"
                  style={{
                    transform: `rotateY(${(i * 360) / ringShots.length}deg) translateZ(${radius}px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover object-top" draggable={false} />
                </div>
              ))}
            </div>
          </div>

          <div ref={workTitle} className="relative z-10 text-center mix-blend-difference" style={{ opacity: 0 }}>
            <p className="font-serif text-[12vw] italic leading-none sm:text-[8vw]">Selected</p>
            <p className="font-mega -mt-[1vw] text-[22vw] sm:text-[14vw]">Work</p>
            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-cream/70 sm:text-sm">
              ({String(projects.length).padStart(2, "0")}) projects · keep scrolling
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
