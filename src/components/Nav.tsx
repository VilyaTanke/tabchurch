"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate, stagger } from "animejs";
import { logout } from "@/app/actions";

const links = [
  { href: "/", label: "Inicio", ico: "🏠" },
  { href: "/canciones", label: "Canciones", ico: "🎸" },
  { href: "/listas", label: "Listas", ico: "📋" },
  { href: "/grupos", label: "Grupos", ico: "👥" },
];

export default function Nav({ isAdmin }: { isAdmin: boolean }) {
  const path = usePathname();
  const ref = useRef<HTMLElement>(null);
  const first = useRef(true);
  const all = isAdmin ? [...links, { href: "/admin", label: "Admin", ico: "🛡️" }] : links;
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  useEffect(() => {
    const nav = ref.current;
    if (!nav || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (first.current) {
      first.current = false;
      animate(nav.querySelectorAll(".nav-link, .brand"), {
        opacity: [0, 1],
        translateY: [14, 0],
        delay: stagger(60, { start: 150 }),
        duration: 600,
        ease: "outBack",
      });
    }
    const ico = nav.querySelector(".nav-link.active .ico");
    if (ico) {
      animate(ico, {
        scale: [0.6, 1.3, 1],
        rotate: [-12, 8, 0],
        duration: 550,
        ease: "outElastic(1, .6)",
      });
    }
  }, [path]);

  return (
    <nav className="nav" aria-label="Principal" ref={ref}>
      <span className="brand">TabChurch</span>
      {all.map((l) => (
        <Link key={l.href} href={l.href} className={`nav-link ${active(l.href) ? "active" : ""}`}>
          <span className="ico" aria-hidden>{l.ico}</span>
          {l.label}
        </Link>
      ))}
      <span className="spacer" />
      <form action={logout}>
        <button className="nav-link" style={{ width: "100%" }}>
          <span className="ico" aria-hidden>🚪</span>Salir
        </button>
      </form>
    </nav>
  );
}
