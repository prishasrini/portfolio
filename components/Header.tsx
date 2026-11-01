"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

// Minimal top bar. mix-blend-difference keeps it readable on black, red and cream.
export default function Header() {
  const [time, setTime] = useState("");

  // Live Chennai time (shown only after load, so server and browser HTML match)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 text-cream mix-blend-difference sm:px-10">
      <a href="#top" className="pointer-events-auto font-serif text-2xl italic">
        {profile.name}
      </a>
      <span className="hidden text-xs uppercase tracking-[0.25em] md:block">
        Chennai {time && `· ${time} IST`}
      </span>
      <nav aria-label="Main" className="pointer-events-auto flex gap-5 text-xs uppercase tracking-[0.25em] sm:text-sm">
        <a href="#work" className="hover:italic">
          Work
        </a>
        <a href="#about" className="hover:italic">
          About
        </a>
        <a href="#contact" className="hover:italic">
          Contact
        </a>
      </nav>
    </header>
  );
}
