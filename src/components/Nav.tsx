"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate, stagger } from "animejs";
import { Home, Music, ListMusic, Users, ShieldCheck, LogOut, type LucideIcon } from "lucide-react";
import { logout } from "@/app/actions";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const links: NavItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/canciones", label: "Canciones", icon: Music },
  { href: "/listas", label: "Listas", icon: ListMusic },
  { href: "/grupos", label: "Grupos", icon: Users },
];

export default function Nav({ isAdmin }: { isAdmin: boolean }) {
  const path = usePathname();
  const ref = useRef<HTMLElement>(null);
  const first = useRef(true);
  const all: NavItem[] = isAdmin
    ? [...links, { href: "/admin", label: "Admin", icon: ShieldCheck }]
    : links;
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
      {all.map((l) => {
        const Icon = l.icon;
        return (
          <Link key={l.href} href={l.href} className={`nav-link ${active(l.href) ? "active" : ""}`}>
            <span className="ico" aria-hidden>
              <Icon size={18} strokeWidth={2.2} />
            </span>
            {l.label}
          </Link>
        );
      })}
      <span className="spacer" />
      <form action={logout}>
        <button className="nav-link" style={{ width: "100%" }}>
          <span className="ico" aria-hidden>
            <LogOut size={18} strokeWidth={2.2} />
          </span>
          Salir
        </button>
      </form>
    </nav>
  );
}
