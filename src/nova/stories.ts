import metrixImg from "@/assets/story-metrix.jpg";
import hackathonsImg from "@/assets/story-hackathons.jpg";
import summitImg from "@/assets/story-summit.jpg";
import codingImg from "@/assets/story-coding.jpg";

export type StoryBlock =
  | { type: "p"; text: string }
  | { type: "lead"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "figure"; src: string; alt: string; caption: string };

export type Story = {
  slug: string;
  period: string;
  title: string;
  summary: string;
  hero: string;
  heroAlt: string;
  facts: { k: string; v: string }[];
  blocks: StoryBlock[];
};

export const stories: Story[] = [
  {
    slug: "metrix-pakistan",
    period: "2022–2023",
    title: "Metrix Pakistan: Building Technology, Talent & Impact",
    summary:
      "A technology education venture built for Khyber Pakhtunkhwa — government patronage, a Binance-sponsored flagship event, and a second act in community health.",
    hero: metrixImg,
    heroAlt: "Abstract network of glowing nodes representing Pakistan's emerging tech ecosystem",
    facts: [
      { k: "Years", v: "2022 – 2023" },
      { k: "Focus", v: "Tech education & freelancing" },
      { k: "Patron-in-Chief", v: "Governor Mushtaq Ahmed Ghani" },
      { k: "Title Sponsor", v: "Binance" },
    ],
    blocks: [
      {
        type: "lead",
        text: "Metrix Pakistan was launched to advance technical education, digital innovation, and opportunities for freelancers across developing regions, with a primary focus on Khyber Pakhtunkhwa.",
      },
      {
        type: "p",
        text: "The province had talent but very little infrastructure around it: few structured pathways into technology careers, limited exposure to global platforms, and almost no bridge between universities, industry and government. Metrix was built to close that gap — not with a one-off event, but with a repeatable model that could bring all of those stakeholders into the same room.",
      },
      { type: "h2", text: "A flagship event with the government at the table" },
      {
        type: "p",
        text: "In 2022, Metrix hosted a flagship technology event in partnership with the government, with Governor Mushtaq Ahmed Ghani serving as Patron-in-Chief and Binance joining as Title Sponsor. Young talent, academic institutions, industry leaders and government stakeholders shared one platform — for many attendees it was their first direct contact with a global technology company.",
      },
      {
        type: "figure",
        src: hackathonsImg,
        alt: "Neon circuitry illustration representing the flagship technology event",
        caption: "The flagship edition brought government, academia and industry onto one stage.",
      },
      {
        type: "quote",
        text: "The point was never the event. The point was proving that this ecosystem could convene itself.",
      },
      { type: "h2", text: "Metrix iSubmit and one of KP's first tech exhibitions" },
      {
        type: "p",
        text: "The initiative later expanded through Metrix iSubmit, a second venture built on the same vision of enabling talent through technology, innovation, and accessible opportunities. Metrix also contributed to one of the first major technology exhibitions of its kind in Khyber Pakhtunkhwa, helping strengthen the province's emerging technology ecosystem and create greater visibility for innovation.",
      },
      { type: "h2", text: "Beyond technology: medical camps in underserved districts" },
      {
        type: "p",
        text: "Beyond technology, Metrix organized and supported medical camps in underserved and underdeveloped areas of Khyber Pakhtunkhwa, reflecting a broader commitment to community development and meaningful social impact.",
      },
      {
        type: "list",
        items: [
          "Technical education and freelancing pathways for students across KP",
          "Government-backed flagship event with a global title sponsor",
          "Metrix iSubmit as a second venture on the same thesis",
          "Community medical camps in underserved districts",
        ],
      },
      {
        type: "p",
        text: "Taken together, Metrix became the first working proof of the ecosystem-building approach that now sits behind NOVA: convene the stakeholders, remove the access barrier, then hand the platform to the students.",
      },
    ],
  },
  {
    slug: "national-hackathons",
    period: "2023–2026",
    title: "National Innovation Initiatives: A Hackathon Circuit for Universities",
    summary:
      "Multiple university-focused hackathons, run with partner organisations, turning classroom skills into shipped solutions for real problems.",
    hero: hackathonsImg,
    heroAlt: "Magenta light trails forming code brackets",
    facts: [
      { k: "Years", v: "2023 – 2026" },
      { k: "Format", v: "University hackathons" },
      { k: "Model", v: "Sponsored & co-hosted" },
      { k: "Outcome", v: "Real-world problem sets" },
    ],
    blocks: [
      {
        type: "lead",
        text: "Hosted multiple university-focused hackathons in partnership with and sponsored by different organizations, giving students the opportunity to solve real-world challenges, develop practical skills, and showcase innovative ideas.",
      },
      {
        type: "p",
        text: "Each edition followed the same discipline: a problem statement sourced from a partner organisation rather than invented for the occasion, mentors on the floor for the full build window, and a demo round judged by people who actually operate in that domain.",
      },
      { type: "h2", text: "Why partner-sourced problems matter" },
      {
        type: "p",
        text: "A hackathon that invents its own brief produces demos. A hackathon that borrows a live constraint from a sponsor produces candidates for pilots. Partner organisations brought the constraint; students brought the speed. That trade is what kept sponsors returning across editions.",
      },
      {
        type: "figure",
        src: codingImg,
        alt: "Illuminated terminals and orbit rings representing a hackathon build night",
        caption: "Build nights: mentors on the floor, judges from the domain, demos at dawn.",
      },
      { type: "h2", text: "What students walked away with" },
      {
        type: "list",
        items: [
          "A shipped artefact, not a slide deck",
          "Direct feedback from industry judges",
          "Team experience under a real deadline",
          "Introductions that outlived the weekend",
        ],
      },
      {
        type: "quote",
        text: "Skills compound when they are used under pressure, in public, with someone watching who can hire you.",
      },
      {
        type: "p",
        text: "The circuit is the direct ancestor of the NOVA journey stages — the same convening model, scaled from single campuses to a national platform.",
      },
    ],
  },
  {
    slug: "impact-summit",
    period: "2024",
    title: "Impact Summit: A First-of-its-Kind Platform for Climate Action",
    summary:
      "Bringing young people, innovators, organisations and changemakers together around sustainability and practical climate solutions.",
    hero: summitImg,
    heroAlt: "Glowing globe wrapped in cyan light representing climate action",
    facts: [
      { k: "Year", v: "2024" },
      { k: "Theme", v: "Climate action & sustainability" },
      { k: "Audience", v: "Youth, innovators, organisations" },
      { k: "Format", v: "Summit + solution tracks" },
    ],
    blocks: [
      {
        type: "lead",
        text: "Impact Summit was a first-of-its-kind platform focused on climate action and sustainability, bringing together young people, innovators, organizations and changemakers to explore solutions for a more sustainable future.",
      },
      {
        type: "p",
        text: "Pakistan sits near the front of the climate risk curve while contributing a fraction of global emissions. The summit was built on the premise that the response has to be locally authored: the people who will live with the consequences should be the ones designing around them.",
      },
      { type: "h2", text: "From awareness to solution tracks" },
      {
        type: "p",
        text: "Rather than a day of panels, the programme pushed attendees into working tracks — resilience, energy, waste and data — each closing with a concrete proposal instead of a summary. Organisations that came to speak stayed to review the output.",
      },
      {
        type: "figure",
        src: metrixImg,
        alt: "Network of light representing collaboration between organisations and youth",
        caption: "Cross-sector rooms: students, founders, NGOs and public bodies in one track.",
      },
      { type: "h2", text: "The through-line to NOVA" },
      {
        type: "p",
        text: "Sustainability is now one of the two innovation pillars NOVA is built on, alongside blockchain. Impact Summit is where that pillar was tested with a live audience before it became part of a national programme.",
      },
      {
        type: "quote",
        text: "Climate work stops being abstract the moment a student is handed a budget, a deadline and a district.",
      },
    ],
  },
  {
    slug: "coding-competition",
    period: "2025 → ongoing",
    title: "An International Coding Competition for School Students",
    summary:
      "Early exposure to programming, computational thinking and problem-solving — on a global stage, before university even begins.",
    hero: codingImg,
    heroAlt: "Neon holographic keyboards and orbit ring representing a global coding contest",
    facts: [
      { k: "Since", v: "2025 — ongoing" },
      { k: "Audience", v: "School students" },
      { k: "Reach", v: "International" },
      { k: "Focus", v: "Computational thinking" },
    ],
    blocks: [
      {
        type: "lead",
        text: "Created an international coding competition for school students, encouraging early exposure to programming, computational thinking, problem-solving and technology-driven learning on a global stage.",
      },
      {
        type: "p",
        text: "Most national innovation programmes start at university, by which point the gap between students who met code early and students who did not is already years wide. This competition moves the starting line: school-age participants, an international field, and problems that reward reasoning over memorised syntax.",
      },
      { type: "h2", text: "Designed around thinking, not tooling" },
      {
        type: "list",
        items: [
          "Language-agnostic problem sets",
          "Rounds that scale from first-time coders to olympiad level",
          "Global leaderboard so local schools can benchmark honestly",
          "Feedback that explains the approach, not just the verdict",
        ],
      },
      {
        type: "figure",
        src: summitImg,
        alt: "Glowing globe representing the international field of participants",
        caption: "An international field — local schools benchmarked against global peers.",
      },
      { type: "h2", text: "Still running" },
      {
        type: "p",
        text: "The competition is ongoing and feeds directly into the NOVA pipeline: students who compete at school age arrive on campus already knowing how to ship under a clock.",
      },
      {
        type: "quote",
        text: "Every orbit starts with a nova — and most of them start earlier than we think.",
      },
    ],
  },
];

export const getStory = (slug: string) => stories.find((s) => s.slug === slug);
