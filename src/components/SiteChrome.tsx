import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header>
        <nav className="pillnav">
          <Link className="logo magnet" to="/">
            <span className="orb" />
            NOVA
          </Link>
          <a className="link magnet" href="/#journey">
            Journey
          </a>
          <a className="link magnet" href="/#about">
            About
          </a>
          <Link className="link magnet" to="/stories">
            Stories
          </Link>
          <a className="link magnet" href="/#team">
            Team
          </a>
          <a className="link magnet" href="/#partners">
            Partners
          </a>
          <Link className="link magnet" to="/partner">
            Sponsor
          </Link>
          <button className="mobbtn" onClick={() => setOpen((v) => !v)}>
            Menu
          </button>
          <Link className="cta magnet" to="/register">
            Register
          </Link>
        </nav>
      </header>
      <div id="mobmenu" className={open ? "open" : undefined} onClick={() => setOpen(false)}>
        <a href="/#journey">Journey</a>
        <a href="/#about">About</a>
        <Link to="/stories">Stories</Link>
        <a href="/#team">Team</a>
        <a href="/#partners">Partners</a>
        <Link to="/partner">Sponsor</Link>
        <Link to="/register">Register</Link>
        <a href="/#contact">Contact</a>
      </div>
    </>
  );
}

export function SiteFooter() {
  return <footer>© 2026 NOVA · National Innovation Platform · Pakistan</footer>;
}

/** Shared page shell: background glow layer + header + footer. */
export function PageShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className="glow-layer" />
      <div className="content">
        <SiteHeader />
        <main className="page-top">{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}
