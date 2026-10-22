"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate, stagger } from "animejs";
import { Home, Music, ListMusic, Users, ShieldCheck, LogOut, UserCircle, type LucideIcon } from "lucide-react";
import { logout } from "@/app/actions";
import RoleBadge from "@/components/RoleBadge";
import BrandLogo from "@/components/BrandLogo";
import UserAvatar from "@/components/UserAvatar";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  isProfile?: boolean;
};

const links: NavItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/canciones", label: "Canciones", icon: Music },
  { href: "/listas", label: "Listas", icon: ListMusic },
  { href: "/grupos", label: "Grupos", icon: Users },
];

export default function Nav({
  isAdmin,
  user,
}: {
  isAdmin: boolean;
  user?: { name: string; role: string; avatar?: string | null };
}) {
  const path = usePathname();
  const ref = useRef<HTMLElement>(null);
  const first = useRef(true);

  const all: NavItem[] = [
    ...links,
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: ShieldCheck }] : []),
    { href: "/perfil", label: "Perfil", icon: UserCircle, isProfile: true },
  ];
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  useEffect(() => {
    const nav = ref.current;
    if (!nav || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (first.current) {
      first.current = false;
      animate(nav.querySelectorAll(".nav-link, .brand-link"), {
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
      <Link href="/" className="brand-link" aria-label="Tab-NuevaVida - Inicio">
        <BrandLogo className="brand-logo" />
      </Link>
      {all.map((l) => {
        const Icon = l.icon;
        const isActive = active(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link ${isActive ? "active" : ""} ${l.isProfile ? "nav-link-profile" : ""}`}
          >
            <span className="ico" aria-hidden>
              {l.isProfile && user?.avatar ? (
                <UserAvatar src={user.avatar} name={user.name} size="xs" border={false} />
              ) : (
                <Icon size={18} strokeWidth={2.2} />
              )}
            </span>
            {l.label}
          </Link>
        );
      })}
      <span className="spacer" />
      {user && (
        <Link href="/perfil" className="nav-profile" title="Ver y editar mi perfil">
          <UserAvatar src={user.avatar} name={user.name} size="sm" />
          <div className="nav-profile-details">
            <span className="nav-profile-name" title={user.name}>
              {user.name}
            </span>
            <RoleBadge role={user.role} />
          </div>
        </Link>
      )}
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
