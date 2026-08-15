import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register for NOVA — Students, Partners & Volunteers" },
      {
        name: "description",
        content:
          "Register for NOVA, Pakistan's national innovation challenge. Apply as a student team, university, partner, sponsor, volunteer, instructor, judge, speaker or media.",
      },
      { property: "og:title", content: "Register for NOVA" },
      {
        property: "og:description",
        content: "Pick your role and join Pakistan's national innovation challenge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

const roles = [
  { v: "student", label: "Student / Team", note: "Compete in the national challenge with your university team." },
  { v: "university", label: "University", note: "Host NOVA on your campus and bring your students into the journey." },
  { v: "partner", label: "Partner", note: "Collaborate with NOVA across tracks, campuses or the ecosystem." },
  { v: "sponsor", label: "Sponsor", note: "Back the national challenge and reach 300,000+ students." },
  { v: "volunteer", label: "Volunteer", note: "Run campus activations and support event operations." },
  { v: "instructor", label: "Instructor", note: "Teach workshops and masterclasses across the tracks." },
  { v: "judge", label: "Judge", note: "Evaluate submissions across the regional and national rounds." },
  { v: "speaker", label: "Speaker", note: "Share your work on the NOVA stage." },
  { v: "media", label: "Media", note: "Cover the challenge and access the press kit." },
];

const ORG_ROLES = ["partner", "sponsor", "media"];
const TRACK_ROLES = ["volunteer", "instructor", "judge", "speaker"];

function RegisterPage() {
  const [role, setRole] = useState("student");
  const [sent, setSent] = useState(false);
  const active = roles.find((r) => r.v === role);

  const isStudent = role === "student";
  const isUniversity = role === "university";
  const isOrg = ORG_ROLES.includes(role);
  const isTrackRole = TRACK_ROLES.includes(role);
  const isMedia = role === "media";

  return (
    <PageShell>
      <section className="section">
        <div className="wrap">
          <div className="crumbs">
            <Link to="/">NOVA</Link> / Registration
          </div>
          <div className="section-head reveal">
            <h1 style={{ fontSize: "clamp(30px,4.4vw,50px)" }}>Join the movement</h1>
            <p>
              Registration takes two minutes. Choose the role that fits you and the NOVA team will
              follow up with the next steps for your track.
            </p>
          </div>

          <div className="split">
            <div className="reveal">
              <div className="eyebrow">What happens next</div>
              <ul className="checklist">
                <li>You'll receive a confirmation email with your track brief.</li>
                <li>Student teams get the challenge pack and submission timeline.</li>
                <li>Universities, partners and sponsors are matched with the NOVA team.</li>
                <li>Instructors, judges and speakers are assigned to a round.</li>
                <li>Volunteers are assigned to the nearest campus activation.</li>
              </ul>
              <div className="facts" style={{ marginTop: 28 }}>
                <div className="fact">
                  <div className="k">Eligibility</div>
                  <div className="v">University students, Pakistan</div>
                </div>
                <div className="fact">
                  <div className="k">Team size</div>
                  <div className="v">1 – 4 members</div>
                </div>
                <div className="fact">
                  <div className="k">Fee</div>
                  <div className="v">Free to enter</div>
                </div>
              </div>
            </div>

            <form
              className="form-card reveal"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="field">
                <label htmlFor="role">I AM REGISTERING AS</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setSent(false);
                  }}
                >
                  {roles.map((r) => (
                    <option key={r.v} value={r.v}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {active && (
                  <p style={{ color: "var(--dim)", fontSize: 13, marginTop: 8 }}>{active.note}</p>
                )}
              </div>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="name">FULL NAME</label>
                  <input id="name" type="text" required />
                </div>

                {isUniversity ? (
                  <div className="field">
                    <label htmlFor="university">UNIVERSITY NAME</label>
                    <input id="university" type="text" required />
                  </div>
                ) : (
                  <div className="field">
                    <label htmlFor="org">
                      {isStudent ? "UNIVERSITY / ORGANISATION" : "ORGANISATION"}
                    </label>
                    <input id="org" type="text" required />
                  </div>
                )}

                {(isUniversity || isOrg) && (
                  <div className="field">
                    <label htmlFor="designation">DESIGNATION</label>
                    <input id="designation" type="text" required />
                  </div>
                )}

                <div className="field">
                  <label htmlFor="email">EMAIL</label>
                  <input id="email" type="email" required />
                </div>
                <div className="field">
                  <label htmlFor="phone">PHONE</label>
                  <input id="phone" type="tel" required />
                </div>

                {isStudent && (
                  <div className="field">
                    <label htmlFor="city">CITY</label>
                    <input id="city" type="text" />
                  </div>
                )}

                {(isStudent || isTrackRole) && (
                  <div className="field">
                    <label htmlFor="track">PREFERRED TRACK</label>
                    <select id="track" defaultValue="ai" required={isTrackRole}>
                      <option value="ai">AI</option>
                      <option value="climate">Climate</option>
                      <option value="web3">Web3</option>
                      <option value="venture">Venture</option>
                    </select>
                  </div>
                )}

                {isTrackRole && (
                  <div className="field">
                    <label htmlFor="linkedin">LINKEDIN PROFILE URL</label>
                    <input id="linkedin" type="url" placeholder="https://linkedin.com/in/…" required />
                  </div>
                )}

                {isMedia && (
                  <div className="field">
                    <label htmlFor="social">ORGANISATION SOCIAL MEDIA PROFILE</label>
                    <input id="social" type="url" placeholder="https://…" required />
                  </div>
                )}
              </div>

              <div className="field">
                <label htmlFor="idea">
                  {isStudent
                    ? "TELL US ABOUT YOUR IDEA OR INTEREST"
                    : "YOUR QUERY — WHAT ARE YOU LOOKING FOR FROM NOVA?"}
                </label>
                <textarea id="idea" required />
              </div>

              <button className="btn btn-primary magnet" type="submit">
                Submit registration
              </button>
              {sent && (
                <p style={{ marginTop: 14, color: "var(--cyan)", fontSize: 13 }}>
                  Received — the NOVA team will follow up by email.
                </p>
              )}
            </form>
          </div>

          <div className="story-nav">
            <Link className="btn btn-ghost magnet" to="/partner">
              Registering an organisation instead?
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
