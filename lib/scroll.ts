"use client";

import { useEffect, type RefObject } from "react";

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// Map p from [start, end] to [0, 1]. Handy for splitting one scroll into phases.
export const range = (p: number, start: number, end: number) => clamp((p - start) / (end - start));

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeIn = (t: number) => t * t * t;

/**
 * Calls onProgress(p) on every animation frame while scrolling.
 * p is how far you've scrolled through a tall "pinned" section: 0 when its top reaches
 * the top of the screen, 1 when its bottom reaches the bottom of the screen.
 *
 * We write styles straight to the DOM inside onProgress instead of using React state,
 * so 60 updates a second don't re-render the page.
 */
export function usePinnedProgress(ref: RefObject<HTMLElement | null>, onProgress: (p: number) => void) {
  useEffect(() => {
    let frame = 0;
    let last = -1;
    function tick() {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = total > 0 ? clamp(-r.top / total) : 0;
        if (p !== last) {
          last = p;
          onProgress(p);
        }
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ref, onProgress]);
}

/** Like usePinnedProgress, but for a normal section: 0 when it enters at the bottom, 1 when it leaves at the top. */
export function usePassProgress(ref: RefObject<HTMLElement | null>, onProgress: (p: number) => void) {
  useEffect(() => {
    let frame = 0;
    let last = -1;
    function tick() {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = clamp((vh - r.top) / (vh + r.height));
        if (p !== last) {
          last = p;
          onProgress(p);
        }
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ref, onProgress]);
}

/**
 * Turns smooth progress over n items into "hold, then move" steps.
 * Returns a value from 0 to n-1 that rests on each whole number for `hold` of each step.
 */
export function stepped(p: number, n: number, hold = 0.45) {
  const k = clamp(p) * (n - 1);
  const i = Math.min(n - 2, Math.floor(k));
  const f = k - i;
  return i + easeInOut(clamp((f - hold) / (1 - hold)));
}
