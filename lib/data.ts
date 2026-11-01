// Everything the portfolio says lives in this one file.
// To update the site (new project, new link, new skill), edit this file only.

export const profile = {
  name: "Prisha",
  fullName: "S P Prisha",
  role: "Full-stack & React developer",
  location: "Chennai, India",
  email: "prishasrini@gmail.com",
  github: "https://github.com/prishasrini",
  linkedin: "https://www.linkedin.com/in/prisha-s-p-1503b334a",
  status: "Open to React / React Native roles",
  // The big words in the intro: "I build ___"
  builds: ["websites", "mobile apps", "REST APIs", "real products"],
  // The statement that lights up word by word as you scroll
  statement:
    "I'm a Computer Science student at SRM who likes building the whole thing: the website people land on, the app in their pocket and the API and database quietly doing the work behind both.",
};

export const education = {
  degree: "B.Tech, Computer Science and Engineering",
  school: "SRM Institute of Science and Technology, Ramapuram",
  years: "2023 – 2027",
  cgpa: "9.52",
};

export const experience = [
  {
    role: "Full Stack Developer Intern",
    company: "ImagiNET Ventures",
    dates: "Aug – Sep 2026",
    clients: ["ISACA", "Ashok Leyland · Ohm Mobility", "Thangamayil Jewellers", "ALDA Constructions"],
    points: [
      "Built interactive dashboards for ISACA, Ohm Mobility (Ashok Leyland) and Thangamayil Jewellers",
      "Functional testing for Ohm Mobility and Thangamayil Jewellers: found defects, verified fixes",
      "Responsive 3D and static web interfaces for ALDA Constructions",
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: string; // one-line category
  summary: string;
  built: string[]; // what I personally built
  stack: string[];
  links: { label: string; href: string }[];
  shots: string[]; // screenshots in public/work/ (first one is the main image)
  phone?: string; // optional phone-sized screenshot
  color: string; // panel background
  ink: string; // text colour on that background
};

// Empty links are hidden automatically. Fill these in once deployed.
const CLEARDOCS_WEBSITE = "https://cleardocs-beta.vercel.app";
const CLEARDOCS_APP = "https://expo.dev/accounts/prishasrini/projects/cleardocs/builds/861c185d-9c66-459f-9444-fec9ae027d6b";
const CLEARDOCS_VIDEO = "https://drive.google.com/drive/folders/1-VCaKoxKbOdlYGzTDnjlSuDQsHxSWVes";

export const projects: Project[] = [
  {
    slug: "cleardocs",
    name: "ClearDocs",
    kind: "Website · Mobile app · REST API · WordPress",
    summary:
      "A document attestation service, built end to end. Customers find the right route on the website, upload scans in the app and track every stage, while the team manages requests from an admin view.",
    built: [
      "Next.js + TypeScript website with a route finder, price estimator and contact form",
      "React Native (Expo) app: login, document upload, tracking, admin area",
      "Express + MongoDB API with JWT auth, uploads, roles and automated tests",
      "Blog from WordPress via its REST API, with 301 redirects and SEO for the migration",
    ],
    stack: ["Next.js", "React", "TypeScript", "React Native", "Expo", "Express", "MongoDB", "WordPress"],
    links: [
      { label: "GitHub", href: "https://github.com/prishasrini/cleardocs" },
      { label: "Live site", href: CLEARDOCS_WEBSITE },
      { label: "Android app", href: CLEARDOCS_APP },
      { label: "App demo", href: CLEARDOCS_VIDEO },
      { label: "WordPress site", href: "https://cleardocsguides.wordpress.com" },
    ],
    shots: ["/work/cd-home.webp", "/work/cd-services.webp", "/work/cd-blog.webp"],
    phone: "/work/cd-mobile.webp",
    color: "#e9e4f7",
    ink: "#1d1340",
  },
  {
    slug: "hush",
    name: "Hush",
    kind: "AI-powered student wellness platform",
    summary:
      "An anonymous space for students to check in on their mood, talk to an AI companion and calm down when it gets too much. No real names needed.",
    built: [
      "Mood check-ins with a 7-day history chart",
      "Juno, an AI companion (OpenRouter) with conversation context and model fallback",
      "Peer support rooms with multilingual moderation",
      "SOS page with guided breathing and grounding",
    ],
    stack: ["Python", "Flask", "PostgreSQL", "SQLite", "Chart.js", "OpenRouter API"],
    links: [
      { label: "GitHub", href: "https://github.com/prishasrini/hush" },
      { label: "Live site", href: "https://hush-app-zjlb.onrender.com" },
    ],
    shots: ["/work/hush-dashboard.webp", "/work/hush-sos.webp", "/work/hush-rooms.webp"],
    color: "#13122a",
    ink: "#e9e4ff",
  },
  {
    slug: "spbuilders",
    name: "SP Builders",
    kind: "Company website · independent project",
    summary:
      "A website for a construction company that builds itself as you scroll, so the page feels like the work they do.",
    built: [
      "Responsive Next.js, React and TypeScript site",
      "Scroll-driven construction visuals",
      "Mobile navigation",
      "Deployed on Vercel",
    ],
    stack: ["Next.js", "React", "TypeScript", "Vercel"],
    links: [
      { label: "Live site", href: "https://sp-builders-website.vercel.app" },
      { label: "GitHub", href: "https://github.com/prishasrini/SP-BUILDERS-WEBSITE" },
    ],
    shots: [], // add screenshots to public/work/ and list them here
    color: "#f2b632",
    ink: "#1a1406",
  },
];

export const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "React Native",
  "Expo",
  "Node.js",
  "Express",
  "REST APIs",
  "MongoDB",
  "SQL",
  "PostgreSQL",
  "WordPress",
  "Tailwind CSS",
  "Python",
  "Flask",
  "Java",
  "Git",
  "Vercel",
];
