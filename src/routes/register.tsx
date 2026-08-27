import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/SiteChrome";
import { NOVA_ROLE_CODES, type NovaRole } from "@/lib/form-codes";
import { submitRegistration } from "@/lib/submit-registration";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register for NOVA — Students, Partners & Ecosystem" },
      {
        name: "description",
        content:
          "Register for NOVA as a student team, university, partner, sponsor, instructor, judge, speaker or media.",
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

const roles: { v: NovaRole; label: string; note: string }[] = [
  {
    v: "student",
    label: "Student / Team",
    note: "Compete in the national challenge with your university team.",
  },
  {
    v: "university",
    label: "University",
    note: "Host NOVA on your campus and bring your students into the journey.",
  },
  {
    v: "partner",
    label: "Partner",
    note: "Collaborate with NOVA across tracks, campuses or the ecosystem.",
  },
  {
    v: "sponsor",
    label: "Sponsor",
    note: "Back the national challenge and reach 2,000,000+ students.",
  },
  {
    v: "instructor",
    label: "Instructor",
    note: "Teach workshops and masterclasses across the tracks.",
  },
  {
    v: "judge",
    label: "Judge",
    note: "Evaluate submissions across the regional and national rounds.",
  },
  {
    v: "speaker",
    label: "Speaker",
    note: "Share your work on the NOVA stage.",
  },
  {
    v: "media",
    label: "Media",
    note: "Cover the challenge and access the press kit.",
  },
];

const ORG_ROLES: NovaRole[] = ["partner", "sponsor", "media"];
const TRACK_ROLES: NovaRole[] = ["instructor", "judge", "speaker"];

function val(form: HTMLFormElement, id: string): string {
  const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    `#${CSS.escape(id)}`,
  );
  return el?.value.trim() ?? "";
}

function RegisterPage() {
  const [role, setRole] = useState<NovaRole>("student");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const active = roles.find((r) => r.v === role);

  const isStudent = role === "student";
  const isUniversity = role === "university";
  const isOrg = ORG_ROLES.includes(role);
  const isTrackRole = TRACK_ROLES.includes(role);
  const isMedia = role === "media";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const form = e.currentTarget;

    const fields: Record<string, string> = {
      name: val(form, "name"),
      email: val(form, "email"),
      phone: val(form, "phone"),
      idea: val(form, "idea"),
      role_label: active?.label ?? role,
      role_code: NOVA_ROLE_CODES[role],
    };

    if (isUniversity) {
      fields["university"] = val(form, "university");
      fields["designation"] = val(form, "designation");
    } else {
      fields["organisation"] = val(form, "org");
    }
    if (isOrg || isUniversity) {
      if (!fields["designation"]) fields["designation"] = val(form, "designation");
    }
    if (isStudent) {
      fields["city"] = val(form, "city");
      fields["track"] = val(form, "track");
    }
    if (isTrackRole) {
      fields["track"] = val(form, "track");
      fields["linkedin"] = val(form, "linkedin");
    }
    if (isMedia) {
      fields["social"] = val(form, "social");
    }

    try {
      await submitRegistration({ source: "nova", role, fields });
      setSent(true);
    } catch (err) {
      console.error("[register]", err);
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err && "message" in err
            ? String((err as { message: unknown }).message)
            : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setSending(false);
    }
  }

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
                <li>You&apos;ll receive a confirmation email with your track brief.</li>
                <li>Student teams get the challenge pack and submission timeline.</li>
                <li>Universities, partners and sponsors are matched with the NOVA team.</li>
                <li>Instructors, judges and speakers are assigned to a round.</li>
                <li>For the Malaysia flagship track, also explore NEXUS.</li>
              </ul>
              <div className="facts" style={{ marginTop: 28 }}>
                <div className="fact">
                  <div className="k">Codes</div>
                  <div className="v">STU · UNI · PRT · SPN · INS · JDG · SPK · MED</div>
                </div>
                <div className="fact">
                  <div className="k">Team size</div>
                  <div className="v">1 – 4 members</div>
                </div>
                <div className="fact">
                  <div className="k">Fee</div>
                  <div className="v">Free to join</div>
                </div>
              </div>
            </div>

            {sent ? (
              <div className="form-card reveal" role="status">
                <div className="eyebrow">Received</div>
                <h3 style={{ fontSize: 22, margin: "8px 0 12px" }}>Thank you for your submission</h3>
                <p style={{ color: "var(--dim)", fontSize: 15 }}>
                  We&apos;ve received your registration
                  {active ? ` as ${active.label}` : ""}. The NOVA team will follow up by email.
                </p>
                <button
                  className="btn btn-ghost magnet"
                  type="button"
                  style={{ marginTop: 20 }}
                  onClick={() => {
                    setSent(false);
                    setError(null);
                  }}
                >
                  Submit another
                </button>
              </div>
            ) : (
              <form className="form-card reveal" onSubmit={onSubmit}>
                <div className="field">
                  <label htmlFor="role">I AM REGISTERING AS</label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value as NovaRole);
                      setSent(false);
                      setError(null);
                    }}
                  >
                    {roles.map((r) => (
                      <option key={r.v} value={r.v}>
                        {r.label} ({NOVA_ROLE_CODES[r.v]})
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
                    <input id="name" name="name" type="text" required />
                  </div>

                  {isUniversity ? (
                    <div className="field">
                      <label htmlFor="university">UNIVERSITY NAME</label>
                      <input id="university" name="university" type="text" required />
                    </div>
                  ) : (
                    <div className="field">
                      <label htmlFor="org">
                        {isStudent ? "UNIVERSITY / ORGANISATION" : "ORGANISATION"}
                      </label>
                      <input id="org" name="org" type="text" required />
                    </div>
                  )}

                  {(isUniversity || isOrg) && (
                    <div className="field">
                      <label htmlFor="designation">DESIGNATION</label>
                      <input id="designation" name="designation" type="text" required />
                    </div>
                  )}

                  <div className="field">
                    <label htmlFor="email">EMAIL</label>
                    <input id="email" name="email" type="email" required />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">PHONE</label>
                    <input id="phone" name="phone" type="tel" required />
                  </div>

                  {isStudent && (
                    <div className="field">
                      <label htmlFor="city">CITY</label>
                      <input id="city" name="city" type="text" />
                    </div>
                  )}

                  {(isStudent || isTrackRole) && (
                    <div className="field">
                      <label htmlFor="track">PREFERRED TRACK</label>
                      <select id="track" name="track" defaultValue="ai" required={isTrackRole}>
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
                      <input
                        id="linkedin"
                        name="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/in/…"
                        required
                      />
                    </div>
                  )}

                  {isMedia && (
                    <div className="field">
                      <label htmlFor="social">ORGANISATION SOCIAL MEDIA PROFILE</label>
                      <input id="social" name="social" type="url" placeholder="https://…" required />
                    </div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="idea">
                    {isStudent
                      ? "TELL US ABOUT YOUR IDEA OR INTEREST"
                      : "YOUR QUERY — WHAT ARE YOU LOOKING FOR FROM NOVA?"}
                  </label>
                  <textarea id="idea" name="idea" required />
                </div>

                <button className="btn btn-primary magnet" type="submit" disabled={sending}>
                  {sending ? "Sending…" : "Submit registration"}
                </button>
                {error && (
                  <p style={{ marginTop: 14, color: "#FF7C9A", fontSize: 13 }} role="alert">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>

          <div className="story-nav">
            <Link className="btn btn-ghost magnet" to="/nexus">
              Also interested in NEXUS (Malaysia)?
            </Link>
            <Link className="btn btn-ghost magnet" to="/partner">
              Looking at sponsorship tiers?
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
