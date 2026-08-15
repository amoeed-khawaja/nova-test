import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/SiteChrome";
import { stories } from "@/nova/stories";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Founder's Trajectory — Stories Behind NOVA" },
      {
        name: "description",
        content:
          "Long-form stories behind NOVA: Metrix Pakistan, national hackathons, Impact Summit and the international coding competition.",
      },
      { property: "og:title", content: "Founder's Trajectory — Stories Behind NOVA" },
      {
        property: "og:description",
        content: "The milestones that shaped the ecosystem-building vision behind NOVA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoriesPage,
});

function StoriesPage() {
  return (
    <PageShell>
      <section className="section">
        <div className="wrap">
          <div className="eyebrow reveal">Origin</div>
          <div className="section-head reveal">
            <h1 style={{ fontSize: "clamp(30px,4.4vw,50px)" }}>Founder's trajectory</h1>
            <p>
              From technology education and community impact to national innovation platforms —
              each milestone, told in full.
            </p>
          </div>
          <div className="story-index reveal">
            {stories.map((s) => (
              <Link key={s.slug} to="/story/$slug" params={{ slug: s.slug }}>
                <img src={s.hero} alt={s.heroAlt} loading="lazy" width={1600} height={900} />
                <div className="body">
                  <span className="n mono" style={{ color: "var(--cyan)", fontSize: 11 }}>
                    {s.period}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
