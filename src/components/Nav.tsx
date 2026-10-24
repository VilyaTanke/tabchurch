"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate, stagger } from "animejs";
import { Home, Music, ListMusic, Users, ShieldCheck, LogOut, UserCircle, SlidersHorizontal, type LucideIcon } from "lucide-react";
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
  { href: "/galeria", label: "Zamar", icon: SlidersHorizontal },
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

  // Centrar automáticamente en la barra el elemento activo en móviles
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const activeEl = nav.querySelector<HTMLElement>(".nav-link.active");
    if (activeEl && window.innerWidth < 768) {
      activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [path]);

  // Soporte de arrastre (drag-to-scroll) para el menú inferior
  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (window.innerWidth >= 768 || e.pointerType === "touch" || e.button !== 0) return;
    const nav = ref.current;
    if (!nav) return;

    isPointerDown.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    scrollLeftStart.current = nav.scrollLeft;
    pointerIdRef.current = e.pointerId;
    try {
      nav.setPointerCapture(e.pointerId);
    } catch {
      // Fallback si no está soportado
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isPointerDown.current || window.innerWidth >= 768) return;
    const nav = ref.current;
    if (!nav) return;

    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 4) {
      hasDragged.current = true;
    }
    nav.scrollLeft = scrollLeftStart.current - dx;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    const nav = ref.current;
    if (nav && pointerIdRef.current !== null) {
      try {
        nav.releasePointerCapture(pointerIdRef.current);
      } catch {
        // Ignorar
      }
      pointerIdRef.current = null;
    }
    if (hasDragged.current) {
      setTimeout(() => {
        hasDragged.current = false;
      }, 60);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLElement>) => {
    if (window.innerWidth < 768 && ref.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        ref.current.scrollLeft += e.deltaY;
      }
    }
  };

  return (
    <nav
      className="nav"
      aria-label="Principal"
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onClickCapture={(e) => {
        if (hasDragged.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
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
      <form action={logout} className="nav-logout-form">
        <button type="submit" className="nav-link">
          <span className="ico" aria-hidden>
            <LogOut size={18} strokeWidth={2.2} />
          </span>
          Salir
        </button>
      </form>
    </nav>
  );
}
