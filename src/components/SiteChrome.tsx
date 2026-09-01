import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

const LINKEDIN = "https://www.linkedin.com/company/novacamp-io/";
const INSTAGRAM = "https://www.instagram.com/novacamp.io?igsi=dDE2b3lnaXhtcDNn";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.5H3.56V20H6.94V8.5ZM5.25 7.02C6.36 7.02 7.25 6.13 7.25 5.02C7.25 3.91 6.36 3 5.25 3C4.14 3 3.25 3.91 3.25 5.02C3.25 6.13 4.14 7.02 5.25 7.02ZM20.44 20H20.45V13.6C20.45 10.47 19.77 8.06 16.11 8.06C14.35 8.06 13.17 9.03 12.68 9.94H12.63V8.5H9.4V20H12.78V14.19C12.78 12.66 13.07 11.18 14.97 11.18C16.84 11.18 16.87 12.93 16.87 14.29V20H20.44Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 2.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2zm5.35-3.45a1.15 1.15 0 1 0 1.15 1.15 1.15 1.15 0 0 0-1.15-1.15z" />
    </svg>
  );
}

function SocialLinks() {
  return (
    <div className="social-row">
      <a
        className="social-icon magnet"
        href={LINKEDIN}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="NOVA on LinkedIn"
      >
        <LinkedInIcon />
      </a>
      <a
        className="social-icon magnet"
        href={INSTAGRAM}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="NOVA on Instagram"
      >
        <InstagramIcon />
      </a>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header>
        <nav className="pillnav">
          <Link className="logo magnet" to="/">
            <img
              className="logo-mark"
              src="/nova_images/Nova_logo.jpeg"
              alt="NOVA"
              width={28}
              height={28}
            />
            <span className="logo-word">NOVA</span>
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
          <Link className="cta-ghost magnet" to="/fellowship">
            FELLOWSHIP
          </Link>
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
        <Link to="/fellowship">FELLOWSHIP</Link>
        <Link to="/register">Register</Link>
        <a href="/#contact">Contact</a>
      </div>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <SocialLinks />
      <div>© 2026 NOVA · National Innovation Platform · Pakistan</div>
    </footer>
  );
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
