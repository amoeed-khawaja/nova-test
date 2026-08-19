import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { HOME_HTML } from "@/nova/home-html.js";
import { initNova } from "@/nova/home-script.js";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NOVA — Pakistan's National Innovation Challenge" },
      {
        name: "description",
        content:
          "NOVA empowers university students across Pakistan with skills, mentorship and global exposure to build ventures in sustainability and blockchain innovation.",
      },
      { property: "og:title", content: "NOVA — Pakistan's National Innovation Challenge" },
      {
        property: "og:description",
        content:
          "From campus activations to international opportunities, NOVA turns student ideas into impactful startups.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("nova-cursor");
    const cleanup = initNova();
    return () => {
      document.body.classList.remove("nova-cursor");
      cleanup();
    };
  }, []);

  // Client-side routing for the links inside the ported markup.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || !href.startsWith("/") || target.getAttribute("target")) return;
      e.preventDefault();
      navigate({ to: href });
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [navigate]);

  // Smooth in-page hash scrolling on load (e.g. arriving from /#partners).
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 60);
  }, []);

  return (
    <div ref={ref} className="nova-home" dangerouslySetInnerHTML={{ __html: HOME_HTML }} />
  );
}
