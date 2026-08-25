import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { PageShell } from "@/components/SiteChrome";

const ticketChips = [
  "Bootcamp",
  "Workshop",
  "Training",
  "Boost your startup",
] as const;

const seats = ["A12", "B07", "C03", "D14"] as const;
const gates = ["B4", "C2", "A1"] as const;
const boardMilestones = ["REGISTER", "CERTIFY", "COMPETE", "MALAYSIA"] as const;

const passportMarks = [
  { id: "cleared", label: "CLEARED", angle: -16 },
  { id: "visa", label: "MY · VISA", angle: 12 },
  { id: "entry", label: "ENTRY OK", angle: -8 },
] as const;

export const Route = createFileRoute("/nexus")({
  head: () => ({
    meta: [
      { title: "NEXUS — Learn, Compete & Fly to Malaysia | NOVA" },
      {
        name: "description",
        content:
          "NEXUS is NOVA's flagship student platform: certify with leading partners, compete through judge rounds, earn a week-long Malaysia bootcamp, and launch your startup.",
      },
      { property: "og:title", content: "NEXUS — Your path to Malaysia" },
      {
        property: "og:description",
        content:
          "Learn · Certify · Compete · Travel · Build. Apply to NEXUS Edition 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap",
      },
    ],
  }),
  component: NexusPage,
});

const certTracks = [
  {
    mono: "ALI",
    name: "Alibaba",
    focus: "E-commerce & digital commerce fundamentals",
    note: "Course tracks framed for founders shipping to markets.",
  },
  {
    mono: "ORA",
    name: "Oracle",
    focus: "Cloud, data & enterprise systems",
    note: "Cert pathways that signal technical depth to judges.",
  },
  {
    mono: "MSFT",
    name: "Microsoft",
    focus: "AI, cloud & productivity stack",
    note: "Practical credentials you can put on a pitch deck.",
  },
];

const competeRounds = [
  {
    n: "01",
    title: "Application & learning window",
    body: "Apply, pick a track, and complete the course + certification sprint before the submission gate.",
  },
  {
    n: "02",
    title: "Submission & regional rounds",
    body: "Ship your build. Regional judges score product, narrative, and traction signals.",
  },
  {
    n: "03",
    title: "National finals → Malaysia cohort",
    body: "Finalists pitch on the national stage. Selected teams join the Malaysia bootcamp cohort.",
  },
];

const pathSteps = [
  { n: "01", label: "Sign up", detail: "Create your NEXUS profile" },
  { n: "02", label: "Courses", detail: "Complete partner learning tracks" },
  { n: "03", label: "Certify", detail: "Earn credentials that count" },
  { n: "04", label: "Compete", detail: "Regional → national judge rounds" },
  { n: "05", label: "Malaysia", detail: "7-day international bootcamp" },
  { n: "06", label: "Launch", detail: "Mentorship & investor exposure" },
];

const audienceFacts = [
  { k: "Who", v: "University students in Pakistan" },
  { k: "Team size", v: "Solo or 1–4 members" },
  { k: "Tracks", v: "AI · Climate · Web3 · Venture" },
  { k: "Edition", v: "2026 · dates TBA" },
  { k: "Entry", v: "Free to apply" },
  { k: "Reward", v: "Malaysia bootcamp for winners" },
];

const itineraryPins = [
  { pin: "KUL", label: "Arrive" },
  { pin: "LAB", label: "Workshops" },
  { pin: "DEMO", label: "Demo day" },
] as const;

const arrivePanel = {
  beat: "Arrive",
  title: "Touchdown Kuala Lumpur",
  body: "Arrive with your cohort. City pulse, founder dinner, and the week ahead mapped.",
} as const;

const journeyStages = [
  { id: "register", label: "Register" },
  { id: "training", label: "Training & workshop at Malaysia" },
  { id: "startup", label: "Turn your startup into a profitable organization" },
] as const;

const nexusBatchYear = new Date().getFullYear();

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useTicketTilt(intensity = 1) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (py - 0.5) * -8 * intensity,
      y: (px - 0.5) * 12 * intensity,
    });
  }

  function onPointerLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return { tilt, onPointerMove, onPointerLeave };
}

function FlipBoard({ text }: { text: string }) {
  return (
    <div className="nexus-flip-board" aria-hidden="true">
      {text.split("").map((ch, i) => (
        <span
          key={`${text}-${i}`}
          className="nexus-flip-cell"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <span className="nexus-flip-face">{ch === " " ? "\u00A0" : ch}</span>
        </span>
      ))}
    </div>
  );
}

function ProgressRing({ value, max }: { value: number; max: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const pct = max === 0 ? 0 : value / max;
  const offset = c * (1 - pct);
  return (
    <div className="nexus-progress-wrap" aria-hidden="true">
      <svg className="nexus-progress-ring" viewBox="0 0 44 44">
        <circle className="nexus-progress-ring-track" cx="22" cy="22" r={r} />
        <circle
          className="nexus-progress-ring-fill"
          cx="22"
          cy="22"
          r={r}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="nexus-progress-ring-label mono">
        {value}/{max}
      </span>
    </div>
  );
}

function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="nexus-confetti" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="nexus-confetti-bit"
          style={{
            ["--i" as string]: String(i),
            ["--x" as string]: `${(i % 6) * 16 - 40}px`,
            ["--h" as string]: `${20 + ((i * 37) % 60)}%`,
          }}
        />
      ))}
    </div>
  );
}

function NexusHeroTicket() {
  const { tilt, onPointerMove, onPointerLeave } = useTicketTilt(1);
  const [marks, setMarks] = useState<string[]>([]);
  const [seat, setSeat] = useState<(typeof seats)[number]>("B07");
  const [gate, setGate] = useState<(typeof gates)[number]>("B4");
  const [boardIdx, setBoardIdx] = useState(0);
  const markCycle = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setBoardIdx((i) => (i + 1) % boardMilestones.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  function stampPassport(e: MouseEvent | KeyboardEvent) {
    e.stopPropagation();
    const next = passportMarks[markCycle.current % passportMarks.length]!;
    markCycle.current += 1;
    setMarks((prev) => {
      const without = prev.filter((id) => id !== next.id);
      return [...without, next.id].slice(-3);
    });
  }

  const milestone = boardMilestones[boardIdx]!;

  return (
    <div
      className={`nexus-ticket${marks.length ? " is-stamped" : ""}`}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <aside className="nexus-ticket-stub" aria-hidden="true">
        <p className="nexus-ticket-stub-label mono">BOARDING</p>
        <p className="nexus-ticket-stub-flight mono">NX-26</p>
        <div className="nexus-ticket-barcode nexus-ticket-barcode--stub">
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} style={{ ["--w" as string]: `${2 + ((i * 7) % 5)}px` }} />
          ))}
        </div>
        <p className="nexus-ticket-stub-gate mono">GATE · {gate}</p>
      </aside>

      <div className="nexus-ticket-tear" aria-hidden="true" />

      <div className="nexus-ticket-main">
        <div className="nexus-ticket-head">
          <div className="nexus-ticket-meta-cell">
            <span className="nexus-ticket-meta-label">Flight edition</span>
            <strong className="nexus-ticket-meta-value">NEXUS AIR</strong>
          </div>
          <div className="nexus-ticket-meta-cell nexus-ticket-meta-cell--end">
            <strong className="nexus-ticket-meta-value nexus-ticket-meta-value--accent">
              Batch &apos;{nexusBatchYear}
            </strong>
          </div>
        </div>

        <div className="nexus-ticket-board" aria-live="polite">
          <span className="nexus-ticket-board-label mono">Next milestone</span>
          <FlipBoard text={milestone.padEnd(8, " ")} />
        </div>

        <div className="nexus-ticket-route-row">
          <p className="nexus-ticket-route">
            <span>PK</span>
            <span className="nexus-ticket-flightline" aria-hidden="true" />
            <span>KUL</span>
          </p>
          <div className="nexus-boarding-pulse mono" title="Boarding group">
            <span className="nexus-boarding-dot" aria-hidden="true" />
            Group B
          </div>
        </div>

        <div className="nexus-ticket-fields mono" role="list">
          <div className="nexus-ticket-field" role="listitem" title="Flight number for Edition 2026">
            <span>Flight</span>
            <strong>NX-2026</strong>
          </div>
          <div className="nexus-ticket-field" role="listitem">
            <span>Gate</span>
            <strong>{gate}</strong>
          </div>
          <div className="nexus-ticket-field" role="listitem" title="Selected seat">
            <span>Seat</span>
            <strong>{seat}</strong>
          </div>
          <div className="nexus-ticket-field" role="listitem" title="Boarding opens — dates TBA">
            <span>Board</span>
            <strong>TBA</strong>
          </div>
          <div className="nexus-ticket-field" role="listitem" title="Cabin class for founders">
            <span>Class</span>
            <strong>Founder</strong>
          </div>
        </div>

        <h1 className="nexus-ticket-dest">MALAYSIA</h1>

        <ul className="nexus-ticket-chips" aria-label="Program details">
          {ticketChips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>

        <div className="nexus-ticket-pickers">
          <div className="nexus-picker" role="group" aria-label="Choose gate">
            <span className="nexus-picker-label mono">Gate</span>
            <div className="nexus-picker-opts">
              {gates.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`nexus-picker-btn${gate === g ? " is-on" : ""}`}
                  aria-pressed={gate === g}
                  onClick={(e) => {
                    e.stopPropagation();
                    setGate(g);
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="nexus-picker" role="group" aria-label="Choose seat">
            <span className="nexus-picker-label mono">Seat</span>
            <div className="nexus-picker-opts">
              {seats.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`nexus-picker-btn${seat === s ? " is-on" : ""}`}
                  aria-pressed={seat === s}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSeat(s);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <footer className="nexus-ticket-foot">
          <button
            type="button"
            className="nexus-ticket-qr"
            aria-label="Stamp passport mark on ticket"
            title="Click to stamp"
            onClick={stampPassport}
          >
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </button>
          <div className="nexus-ticket-barcode nexus-ticket-barcode--main" aria-hidden="true">
            {Array.from({ length: 28 }, (_, i) => (
              <span key={i} style={{ ["--w" as string]: `${1.5 + ((i * 11) % 4)}px` }} />
            ))}
          </div>
          <p className="nexus-ticket-passenger">
            Passenger · NEXUS Cohort · Compete · Win · Fly
          </p>
        </footer>
      </div>

      {passportMarks.map((m) => (
        <span
          key={m.id}
          className={`nexus-ticket-stamp nexus-ticket-stamp--${m.id}${marks.includes(m.id) ? " is-show" : ""}`}
          style={{ ["--stamp-angle" as string]: `${m.angle}deg` }}
          aria-hidden="true"
        >
          {m.label}
        </span>
      ))}
    </div>
  );
}

function NexusTripPass() {
  const [ticked, setTicked] = useState<Record<string, boolean>>({
    register: true,
    training: false,
    startup: false,
  });
  const [celebrate, setCelebrate] = useState(false);
  const { tilt, onPointerMove, onPointerLeave } = useTicketTilt(0.65);
  const prevAllDone = useRef(false);

  const allDone = journeyStages.every((s) => ticked[s.id]);
  const progress = journeyStages.filter((s) => ticked[s.id]).length;

  useEffect(() => {
    if (allDone && !prevAllDone.current) {
      if (!prefersReducedMotion()) setCelebrate(true);
      const t = window.setTimeout(() => setCelebrate(false), 1600);
      prevAllDone.current = true;
      return () => window.clearTimeout(t);
    }
    if (!allDone) prevAllDone.current = false;
  }, [allDone]);

  function toggleStage(id: string) {
    setTicked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div
      className={`nexus-pass${allDone ? " is-winner" : ""}`}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-label="Interactive Malaysia journey checklist"
    >
      <ConfettiBurst active={celebrate} />

      <div className="nexus-pass-head">
        <div className="nexus-pass-head-row">
          <p className="nexus-pass-eyebrow mono">Week plan</p>
          <p className="nexus-pass-meta mono">
            7 DAYS · MY · NEXUS {nexusBatchYear}
          </p>
        </div>
        <div className="nexus-pass-head-row nexus-pass-head-row--title">
          <p className="nexus-pass-title-static">Your path on the ground</p>
          <ProgressRing value={progress} max={journeyStages.length} />
        </div>
        <p className="nexus-pass-route mono" aria-label="Itinerary stops">
          {itineraryPins.map((d) => d.pin).join(" → ")}
        </p>
      </div>

      <div className="nexus-pass-panel">
        <p className="nexus-pass-beat mono">{arrivePanel.beat}</p>
        <h3 className="nexus-pass-title">{arrivePanel.title}</h3>
        <p className="nexus-pass-body">{arrivePanel.body}</p>
      </div>

      <div className="nexus-pass-journey">
        <div className="nexus-pass-journey-head">
          <p className="nexus-pass-eyebrow mono">Checklist</p>
          <p className="nexus-pass-progress mono" aria-live="polite">
            Toward Malaysia · {progress}/{journeyStages.length}
          </p>
        </div>
        <ul className="nexus-pass-stages">
          {journeyStages.map((s) => {
            const on = Boolean(ticked[s.id]);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className={`nexus-pass-stage${on ? " is-ticked" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggleStage(s.id)}
                >
                  <span className="nexus-pass-check" aria-hidden="true" />
                  <span>{s.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <span className={`nexus-pass-stamp${allDone ? " is-show" : ""}`} aria-hidden="true">
        WINNER
      </span>
    </div>
  );
}

function NexusPage() {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const path = document.querySelector(".nexus-path");
    if (!path) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-drawn");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 },
    );
    io.observe(path);
    return () => io.disconnect();
  }, []);

  return (
    <PageShell>
      <div className="nexus-page">
        {/* ── Hero ── */}
        <section className="nexus-hero" aria-label="NEXUS hero">
          <div className="nexus-hero-skyline" aria-hidden="true">
            <img
              src="/nova_images/nexus-hero-bg.png"
              alt=""
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="nexus-mesh" aria-hidden="true">
            <span className="nexus-orb nexus-orb-a" />
            <span className="nexus-orb nexus-orb-b" />
            <span className="nexus-orb nexus-orb-c" />
            <span className="nexus-grid" />
          </div>
          <div className="wrap nexus-hero-inner">
            <div className="crumbs nexus-crumbs">
              <Link to="/">NOVA</Link> / NEXUS
            </div>
            <div className="nexus-hero-grid">
              <div className="nexus-hero-copy">
                <NexusHeroTicket />
                <div className="hero-ctas nexus-ctas">
                  <a className="btn btn-primary magnet" href="#register">
                    Apply to NEXUS
                  </a>
                  <a className="btn btn-ghost magnet" href="#malaysia">
                    Explore the trip
                  </a>
                </div>
              </div>
              <aside className="nexus-pass-wrap" aria-label="Malaysia journey checklist">
                <NexusTripPass />
              </aside>
            </div>
          </div>
        </section>

        {/* ── Proof strip ── */}
        <section className="nexus-proof" aria-label="NEXUS at a glance">
          <div className="wrap">
            <ul className="nexus-proof-row mono">
              <li>Cert partners</li>
              <li>Judge rounds</li>
              <li>1 week abroad</li>
              <li>Startup track</li>
            </ul>
          </div>
        </section>

        {/* ── What is NEXUS ── */}
        <section className="section nexus-section nexus-ambient" id="about">
          <div className="nexus-ambient-bg" aria-hidden="true">
            <img
              src="/nova_images/nexus-bg-platform.png"
              alt=""
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="nexus-ambient-veil" aria-hidden="true" />
          <div className="wrap nexus-manifesto">
            <div className="reveal">
              <div className="eyebrow">Platform</div>
              <div className="section-head">
                <h2>What is NEXUS?</h2>
                <p>
                  NEXUS is NOVA&apos;s flagship student platform — a single orbit from
                  campus skills to an international bootcamp. It is built for university
                  founders who want more than a certificate on a slide.
                </p>
              </div>
            </div>
            <ul className="nexus-keywords reveal" aria-label="NEXUS path keywords">
              <li>Learn</li>
              <li>Certify</li>
              <li>Compete</li>
              <li>Travel</li>
              <li>Build</li>
            </ul>
          </div>
        </section>

        {/* ── Learn & certify ── */}
        <section className="section nexus-section nexus-ambient" id="learn" style={{ paddingTop: 0 }}>
          <div className="nexus-ambient-bg" aria-hidden="true">
            <img
              src="/nova_images/nexus-bg-courses.png"
              alt=""
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="nexus-ambient-veil" aria-hidden="true" />
          <div className="wrap">
            <div className="eyebrow reveal">Courses</div>
            <div className="section-head reveal">
              <h2>Learn &amp; certify</h2>
              <p>
                Complete structured tracks with leading certification and course
                providers. Partner lineup for Edition 2026 is indicative — more partners TBA.
              </p>
            </div>
            <div className="nexus-monograms reveal">
              {certTracks.map((t) => (
                <article className="nexus-mono-tile" key={t.name}>
                  <span className="nexus-mono-mark mono">{t.mono}</span>
                  <h3>{t.name}</h3>
                  <p className="nexus-mono-focus">{t.focus}</p>
                  <p className="nexus-mono-note">{t.note}</p>
                </article>
              ))}
              <article className="nexus-mono-tile nexus-mono-tba">
                <span className="nexus-mono-mark mono">+</span>
                <h3>More partners</h3>
                <p className="nexus-mono-focus">Additional providers TBA</p>
                <p className="nexus-mono-note">
                  Final course catalogue published with the Edition 2026 brief.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ── Compete ── */}
        <section className="section nexus-section nexus-ambient" id="compete" style={{ paddingTop: 0 }}>
          <div className="nexus-ambient-bg" aria-hidden="true">
            <img
              src="/nova_images/nexus-bg-competition.png"
              alt=""
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="nexus-ambient-veil" aria-hidden="true" />
          <div className="wrap">
            <div className="eyebrow reveal">Competition</div>
            <div className="section-head reveal">
              <h2>Compete with judges</h2>
              <p>
                Multi-round selection from regional heats to the national stage.
                Performance — not paperwork — decides who flies.
              </p>
            </div>
            <div className="nexus-runway reveal">
              {competeRounds.map((r) => (
                <article className="nexus-round" key={r.n}>
                  <span className="nexus-round-n mono">{r.n}</span>
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Malaysia Bootcamp ── */}
        <section className="nexus-destination-chapter" id="malaysia">
          <div className="nexus-chapter-skyline" aria-hidden="true">
            <img
              src="/nova_images/nexus-kl-skyline.png"
              alt=""
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="nexus-chapter-mesh" aria-hidden="true" />
          <div className="wrap reveal">
            <div className="eyebrow">Flagship reward</div>
            <p className="nexus-chapter-place">MALAYSIA</p>
            <h2 className="nexus-chapter-title">Seven days. One cohort. Global context.</h2>
            <p className="nexus-chapter-lede">
              Winners join a week-long international bootcamp — workshops with founders,
              peer intensity, and a demo day that ties to NOVA Stage 11. Exact dates for
              Edition 2026 will be announced with the cohort brief (TBA).
            </p>
            <ul className="checklist nexus-chapter-list">
              <li>Immersive founder workshops and peer critique</li>
              <li>Exposure to operators building across Southeast Asia</li>
              <li>Demo day to close the week strong</li>
              <li>Travel support details confirmed for selected teams</li>
            </ul>
          </div>
        </section>

        {/* ── Startup opportunities ── */}
        <section className="section nexus-section nexus-ambient" id="startup">
          <div className="nexus-ambient-bg" aria-hidden="true">
            <img
              src="/nova_images/nexus-bg-aftertrip.png"
              alt=""
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="nexus-ambient-veil" aria-hidden="true" />
          <div className="wrap">
            <div className="eyebrow reveal">After the trip</div>
            <div className="section-head reveal">
              <h2>Startup opportunities</h2>
              <p>
                Malaysia is the climax — not the end. Graduating teams stay on the
                NOVA orbit with mentorship, investor exposure, and launch support.
              </p>
            </div>
            <div className="nexus-startup-row reveal">
              <div>
                <h3>Mentorship</h3>
                <p>Operators and advisors who stay with you past the demo.</p>
              </div>
              <div>
                <h3>Investor exposure</h3>
                <p>Introductions and showcase moments — not guaranteed funding.</p>
              </div>
              <div>
                <h3>Launch support</h3>
                <p>Follow-on programming to help teams ship and stay accountable.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Path / timeline ── */}
        <section className="section nexus-section nexus-ambient" id="path" style={{ paddingTop: 0 }}>
          <div className="nexus-ambient-bg" aria-hidden="true">
            <img
              src="/nova_images/nexus-bg-later.png"
              alt=""
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="nexus-ambient-veil" aria-hidden="true" />
          <div className="wrap">
            <div className="eyebrow reveal">Trajectory</div>
            <div className="section-head reveal">
              <h2>Your path through NEXUS</h2>
              <p>Six steps from signup to launch — one continuous orbit.</p>
            </div>
            <ol className="nexus-path reveal">
              {pathSteps.map((s) => (
                <li className="nexus-path-step" key={s.n}>
                  <span className="nexus-path-n mono">{s.n}</span>
                  <strong>{s.label}</strong>
                  <span>{s.detail}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Who it's for ── */}
        <section className="section nexus-section nexus-ambient" id="audience" style={{ paddingTop: 0 }}>
          <div className="nexus-ambient-bg" aria-hidden="true">
            <img
              src="/nova_images/nexus-bg-eligibility.png"
              alt=""
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="nexus-ambient-veil" aria-hidden="true" />
          <div className="wrap">
            <div className="eyebrow reveal">Eligibility</div>
            <div className="section-head reveal">
              <h2>Who it&apos;s for</h2>
              <p>
                NEXUS is open to university students across Pakistan who want to learn,
                ship, and compete for an international experience. Soft placeholders below
                will firm up in the Edition 2026 handbook.
              </p>
            </div>
            <div className="facts reveal">
              {audienceFacts.map((f) => (
                <div className="fact" key={f.k}>
                  <div className="k">{f.k}</div>
                  <div className="v">{f.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Register ── */}
        <section className="section nexus-section nexus-register nexus-ambient" id="register">
          <div className="nexus-ambient-bg" aria-hidden="true">
            <img
              src="/nova_images/nexus-bg-aftertrip.png"
              alt=""
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="nexus-ambient-veil" aria-hidden="true" />
          <div className="wrap split">
            <div className="reveal">
              <div className="eyebrow">Edition 2026</div>
              <h2 style={{ fontSize: "clamp(28px, 3.6vw, 40px)", marginBottom: 14 }}>
                Apply to NEXUS
              </h2>
              <p style={{ color: "var(--dim)", maxWidth: 420 }}>
                Tell us who you are and why you want this orbit. The NOVA team will email
                next steps — no backend automation yet; this form confirms intent on-device.
              </p>
              <ul className="checklist">
                <li>Student-focused application (not the multi-role /register page)</li>
                <li>Track interest helps us match you to the right brief</li>
                <li>Team name optional — solo founders welcome</li>
              </ul>
            </div>

            {sent ? (
              <div className="form-card reveal nexus-success" role="status">
                <div className="eyebrow">Received</div>
                <h3 style={{ fontSize: 22, margin: "8px 0 12px" }}>Application received</h3>
                <p style={{ color: "var(--dim)", fontSize: 15 }}>
                  We&apos;ll email next steps. Watch your inbox for the Edition 2026 brief
                  and learning window dates.
                </p>
                <button
                  className="btn btn-ghost magnet"
                  type="button"
                  style={{ marginTop: 20 }}
                  onClick={() => setSent(false)}
                >
                  Submit another
                </button>
              </div>
            ) : (
              <form
                className="form-card reveal"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="nx-name">FULL NAME</label>
                    <input id="nx-name" name="name" type="text" required autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="nx-email">EMAIL</label>
                    <input id="nx-email" name="email" type="email" required autoComplete="email" />
                  </div>
                  <div className="field">
                    <label htmlFor="nx-phone">PHONE</label>
                    <input id="nx-phone" name="phone" type="tel" required autoComplete="tel" />
                  </div>
                  <div className="field">
                    <label htmlFor="nx-uni">UNIVERSITY</label>
                    <input id="nx-uni" name="university" type="text" required />
                  </div>
                  <div className="field">
                    <label htmlFor="nx-year">YEAR / PROGRAM</label>
                    <input
                      id="nx-year"
                      name="year"
                      type="text"
                      required
                      placeholder="e.g. 3rd year · CS"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="nx-track">TRACK INTEREST</label>
                    <select id="nx-track" name="track" defaultValue="ai" required>
                      <option value="ai">AI</option>
                      <option value="climate">Climate</option>
                      <option value="web3">Web3</option>
                      <option value="venture">Venture</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="nx-team">TEAM NAME (OPTIONAL)</label>
                  <input id="nx-team" name="team" type="text" />
                </div>
                <div className="field">
                  <label htmlFor="nx-why">WHY NEXUS?</label>
                  <textarea
                    id="nx-why"
                    name="why"
                    required
                    rows={4}
                    placeholder="What do you want to build — and why Malaysia matters to you?"
                  />
                </div>
                <div className="field nexus-check">
                  <label htmlFor="nx-agree">
                    <input id="nx-agree" name="agree" type="checkbox" required />
                    <span>I agree to be contacted by the NOVA team about NEXUS.</span>
                  </label>
                </div>
                <button className="btn btn-primary magnet" type="submit">
                  Submit NEXUS application
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
