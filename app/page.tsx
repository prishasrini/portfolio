import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Header from "@/components/Header";
import Intro from "@/components/Intro";
import Statement from "@/components/Statement";
import Work from "@/components/Work";
import Reveal from "@/components/Reveal";
import Liquid from "@/components/Liquid";
import { experience, profile, skills } from "@/lib/data";

export default function Home() {
  const job = experience[0];
  const half = Math.ceil(skills.length / 2);
  const rows = [skills.slice(0, half), skills.slice(half)];

  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <Header />

      <main id="main">
        <Intro />
        <Statement />
        <Work />

        {/* Experience */}
        <section id="experience" className="px-5 py-28 sm:px-10 sm:py-40">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-mute sm:text-sm">(Experience)</p>
          </Reveal>
          <Reveal>
            <div className="mt-8 border-y border-cream/15 py-10 lg:grid lg:grid-cols-[1.3fr_1fr] lg:gap-16">
              <div>
                <p className="font-serif text-3xl italic text-red sm:text-4xl">{job.dates}</p>
                <h2 className="font-mega mt-4 text-[17vw] lg:text-[8.5vw]">{job.company}</h2>
                <p className="mt-4 text-lg">{job.role}</p>
              </div>
              <div className="mt-10 lg:mt-0 lg:self-end">
                <ul className="space-y-4 text-lg leading-relaxed text-cream/85">
                  {job.points.map((pt) => (
                    <li key={pt} className="flex gap-4">
                      <span className="text-red" aria-hidden>
                        ✦
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-xs uppercase tracking-[0.2em] text-mute">Clients · {job.clients.join(" · ")}</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Skills: two giant rows sliding in opposite directions */}
        <section aria-label="Skills" className="overflow-hidden py-10 sm:py-16">
          <p className="mb-8 px-5 text-xs uppercase tracking-[0.3em] text-mute sm:px-10 sm:text-sm">(Toolbox)</p>
          {rows.map((row, r) => (
            <div key={r} className="flex overflow-hidden whitespace-nowrap py-1">
              <div
                className={`marquee flex shrink-0 items-center gap-8 pr-8 ${r === 1 ? "marquee-reverse" : ""}`}
                style={{ "--speed": "45s" } as React.CSSProperties}
              >
                {[...row, ...row].map((s, i) => (
                  <span key={i} className="flex items-center gap-8">
                    <span className={`font-mega text-[15vw] sm:text-[9vw] ${i % 2 ? "outline-text" : ""}`}>{s}</span>
                    <span className="font-serif text-[6vw] italic text-red sm:text-[3.5vw]">✦</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
          <ul className="sr-only">
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section
          id="contact"
          data-cursor-mode="liquid"
          className="relative mt-20 flex min-h-[100svh] flex-col justify-between overflow-hidden bg-red px-5 pb-8 pt-28 sm:px-10"
        >
          <Liquid />
          <Reveal>
            <p className="font-serif text-4xl italic sm:text-6xl">Have a role in mind?</p>
            <h2 className="font-mega mt-4 text-[27vw] leading-[0.78] sm:text-[22vw]">Let&apos;s talk</h2>
          </Reveal>

          <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <a
              href={`mailto:${profile.email}`}
              data-cursor="Say hi"
              className="break-all font-serif text-[clamp(2rem,6vw,5.5rem)] italic leading-none underline decoration-1 underline-offset-[0.15em] hover:no-underline"
            >
              {profile.email}
            </a>
            <div className="flex flex-wrap gap-3 text-sm font-semibold uppercase tracking-wider">
              {[
                { label: "GitHub", href: profile.github },
                { label: "LinkedIn", href: profile.linkedin },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-cream px-6 py-3 transition-colors hover:bg-cream hover:text-red"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>

          <footer className="mt-16 flex flex-col justify-between gap-2 border-t border-cream/40 pt-5 text-xs uppercase tracking-[0.2em] sm:flex-row">
            <span>© 2026 {profile.fullName}</span>
            <span>Designed &amp; built with Next.js</span>
          </footer>
        </section>
      </main>
    </>
  );
}
