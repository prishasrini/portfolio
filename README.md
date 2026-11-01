# Prisha's portfolio

My personal portfolio site. Built with Next.js (App Router), React, TypeScript and Tailwind CSS.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

## Edit the content

Everything the site says (name, intro, projects, links, skills, education) is in **`lib/data.ts`**.
Empty links are hidden automatically, so you can fill in live links after deploying.

## How it's organised

```
app/
  layout.tsx          fonts (self-hosted Archivo + Instrument Serif), SEO
  page.tsx            the page, top to bottom
  globals.css         colours, type and animations
components/
  Preloader.tsx       0 → 100 counter, then the curtain lifts
  Intro.tsx           scroll-driven opening: zoom into the name → "I build ___" → 3D ring of work
  Statement.tsx       paragraph that lights up word by word as you scroll
  Work.tsx            full-screen project panels that slide sideways (stack on phones)
  Header.tsx          top bar with live Chennai time
  Cursor.tsx          custom cursor
  SmoothScroll.tsx    Lenis smooth scrolling
  Reveal.tsx          fades blocks in
lib/
  data.ts             all the content
  scroll.ts           scroll-progress helpers used by the animations
public/work/          project screenshots
```

All scroll animations write styles directly to the page on each frame instead of re-rendering React,
so they stay smooth. Animations switch off for visitors who choose "reduce motion".

## Deploy

Import the repo on Vercel. No environment variables are needed (optionally set `NEXT_PUBLIC_SITE_URL` to the live URL).
