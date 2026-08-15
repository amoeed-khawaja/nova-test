import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/SiteChrome";
import { getStory, stories, type Story, type StoryBlock } from "@/nova/stories";

export const Route = createFileRoute("/story/$slug")({
  loader: ({ params }) => {
    const story = getStory(params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Story not found — NOVA" }, { name: "robots", content: "noindex" }],
      };
    }
    const { story } = loaderData;
    return {
      meta: [
        { title: `${story.title} — NOVA` },
        { name: "description", content: story.summary },
        { property: "og:title", content: story.title },
        { property: "og:description", content: story.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: StoryNotFound,
  component: StoryPage,
});

function StoryNotFound() {
  return (
    <PageShell>
      <section className="section">
        <div className="wrap prose">
          <h1>Story not found</h1>
          <p>That milestone doesn't exist (yet).</p>
          <div className="story-nav">
            <Link className="btn btn-primary magnet" to="/stories">
              All stories
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Block({ block }: { block: StoryBlock }) {
  switch (block.type) {
    case "lead":
      return <p className="lead">{block.text}</p>;
    case "p":
      return <p>{block.text}</p>;
    case "h2":
      return <h2>{block.text}</h2>;
    case "quote":
      return <blockquote className="pullquote">{block.text}</blockquote>;
    case "list":
      return (
        <ul>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "figure":
      return (
        <figure className="figure">
          <img src={block.src} alt={block.alt} loading="lazy" width={1600} height={900} />
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
  }
}

function StoryPage() {
  const { story } = Route.useLoaderData() as { story: Story };
  const idx = stories.findIndex((s) => s.slug === story.slug);
  const next = stories[(idx + 1) % stories.length]!;


  return (
    <PageShell>
      <article className="section">
        <div className="wrap">
          <div className="crumbs">
            <Link to="/">NOVA</Link> / <Link to="/stories">Trajectory</Link> / {story.period}
          </div>
          <div className="prose">
            <h1>{story.title}</h1>
          </div>
          <div className="story-hero">
            <img src={story.hero} alt={story.heroAlt} width={1600} height={900} />
          </div>
          <div className="prose">
            <div className="facts">
              {story.facts.map((f) => (
                <div className="fact" key={f.k}>
                  <div className="k">{f.k}</div>
                  <div className="v">{f.v}</div>
                </div>
              ))}
            </div>
            {story.blocks.map((b, i) => (
              <Block key={i} block={b} />
            ))}
            <div className="story-nav">
              <Link className="btn btn-primary magnet" to="/story/$slug" params={{ slug: next.slug }}>
                Next: {next.period}
              </Link>
              <Link className="btn btn-ghost magnet" to="/stories">
                All milestones
              </Link>
              <Link className="btn btn-ghost magnet" to="/register">
                Register for NOVA
              </Link>
            </div>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
