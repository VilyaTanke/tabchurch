"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate, stagger } from "animejs";

type Props = {
  children: React.ReactNode;
  /** Elementos internos que se animan en cascada. */
  selector?: string;
  /** Si es true, se vuelve a animar en cada cambio de ruta. */
  onRoute?: boolean;
  className?: string;
};

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Entrada escalonada con anime.js para tarjetas, títulos y campos. */
export default function Reveal({
  children,
  selector = ".card, h1",
  onRoute = false,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || reduced()) return;
    const targets = root.querySelectorAll(selector);
    if (!targets.length) return;
    const anim = animate(targets, {
      opacity: [0, 1],
      translateY: [18, 0],
      scale: [0.98, 1],
      delay: stagger(70),
      duration: 650,
      ease: "outExpo",
    });
    return () => {
      anim.revert();
    };
  }, [selector, onRoute ? path : null]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
