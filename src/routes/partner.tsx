import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/SiteChrome";
import { submitRegistration } from "@/lib/submit-registration";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Become a NOVA Partner or Sponsor" },
      {
        name: "description",
        content:
          "Partner with NOVA to reach 300,000+ students across 150+ universities in Pakistan. Sponsorship tiers, university partnerships and ecosystem collaborations.",
      },
      { property: "og:title", content: "Become a NOVA Partner or Sponsor" },
      {
        property: "og:description",
        content: "Reach 300,000+ students across 150+ Pakistani universities through NOVA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartnerPage,
});

const tiers = [
  {
    name: "Title Partner",
    amt: "Flagship",
    perks: [
      "Naming rights across the national edition",
      "Keynote slot at the finale",
      "Judging council seat",
      "Full-funnel brand presence on campus",
    ],
  },
  {
    name: "Track Partner",
    amt: "Per track",
    perks: [
      "Own a track: AI, Climate, Web3 or Venture",
      "Set the challenge problem statement",
      "Mentor and judge access to teams",
      "Talent pipeline from finalists",
    ],
  },
  {
    name: "Campus Partner",
    amt: "Regional",
    perks: [
      "Sponsor activations at selected universities",
      "Workshops and booth presence",
      "Co-branded regional round",
      "Local media coverage",
    ],
  },
  {
    name: "Ecosystem Partner",
    amt: "In-kind",
    perks: [
      "Credits, tooling or infrastructure",
      "Community and media amplification",
      "Logo placement across editions",
      "Access to the demo showcase",
    ],
  },
];

function PartnerPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const form = e.currentTarget;
    const fields = {
      name: (form.elements.namedItem("pname") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("pemail") as HTMLInputElement).value.trim(),
      organisation: (form.elements.namedItem("porg") as HTMLInputElement).value.trim(),
      tier: (form.elements.namedItem("ptier") as HTMLSelectElement).value.trim(),
      goals: (form.elements.namedItem("pgoals") as HTMLTextAreaElement).value.trim(),
      role_code: "PRT",
    };
    try {
      await submitRegistration({
        data: { source: "partner", role: "partner", fields },
      });
      setSent(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <PageShell>
      <section className="section">
        <div className="wrap">
          <div className="crumbs">
            <Link to="/">NOVA</Link> / Partnerships
          </div>
          <div className="section-head reveal">
            <h1 style={{ fontSize: "clamp(30px,4.4vw,50px)" }}>Become a partner</h1>
            <p>
              NOVA connects sponsors directly to Pakistan's next technical generation — students,
              universities and early ventures, on one national platform.
            </p>
          </div>

          <div className="facts reveal">
            <div className="fact">
              <div className="k">Students reached</div>
              <div className="v">300,000+</div>
            </div>
            <div className="fact">
              <div className="k">Universities</div>
              <div className="v">150+</div>
            </div>
            <div className="fact">
              <div className="k">Journey stages</div>
              <div className="v">12</div>
            </div>
            <div className="fact">
              <div className="k">Tracks</div>
              <div className="v">AI · Climate · Web3 · Venture</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="eyebrow reveal">Tiers</div>
          <div className="section-head reveal">
            <h2>Ways to partner</h2>
          </div>
          <div className="tier-cards reveal">
            {tiers.map((t) => (
              <div className="tier-card" key={t.name}>
                <span className="n mono" style={{ color: "var(--cyan)", fontSize: 11 }}>
                  {t.name}
                </span>
                <div className="amt">{t.amt}</div>
                <ul>
                  {t.perks.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <div className="reveal">
            <div className="eyebrow">Talk to us</div>
            <h3 style={{ fontSize: 24, marginBottom: 12 }}>Build the pipeline with us</h3>
            <p style={{ color: "var(--dim)", maxWidth: 420 }}>
              Previous editions have been backed by government bodies, exchanges and national
              regulators. Tell us what you want out of the partnership and we'll shape a package
              around it.
            </p>
            <ul className="checklist">
              <li>Custom packages for hiring, brand or product adoption</li>
              <li>University-level co-branding across regional rounds</li>
              <li>Post-event impact report with verified reach</li>
            </ul>
          </div>

          <form className="form-card reveal" onSubmit={onSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="pname">CONTACT NAME</label>
                <input id="pname" name="pname" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="pemail">WORK EMAIL</label>
                <input id="pemail" name="pemail" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="porg">ORGANISATION</label>
                <input id="porg" name="porg" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="ptier">INTERESTED TIER</label>
                <select id="ptier" name="ptier" defaultValue="Track Partner">
                  {tiers.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                  <option value="Other">Something else</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="pgoals">WHAT ARE YOU HOPING TO GET OUT OF NOVA?</label>
              <textarea id="pgoals" name="pgoals" required />
            </div>
            <button className="btn btn-primary magnet" type="submit" disabled={sending}>
              {sending ? "Sending…" : "Request the partnership deck"}
            </button>
            {error && (
              <p style={{ marginTop: 14, color: "#FF7C9A", fontSize: 13 }} role="alert">
                {error}
              </p>
            )}
            {sent && !error && (
              <p style={{ marginTop: 14, color: "var(--cyan)", fontSize: 13 }}>
                Received — we&apos;ll send the deck and follow up shortly.
              </p>
            )}
          </form>
        </div>
      </section>
    </PageShell>
  );
}
