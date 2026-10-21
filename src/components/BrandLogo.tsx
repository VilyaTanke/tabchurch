import type { SVGProps } from "react";

interface BrandLogoProps extends SVGProps<SVGSVGElement> {
  variant?: "card" | "transparent";
  glow?: boolean;
}

export default function BrandLogo({
  variant = "card",
  glow = true,
  className = "",
  style,
  ...props
}: BrandLogoProps) {
  const isCard = variant === "card";

  return (
    <svg
      viewBox="0 0 460 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Tab-NuevaVida - Soto del Real"
      className={className}
      style={{
        display: "block",
        height: "auto",
        ...style,
      }}
      {...props}
    >
      <defs>
        {/* Obsidian & Onyx Card Background */}
        <radialGradient id="nvCardBg" cx="50%" cy="45%" r="68%">
          <stop offset="0%" stopColor="#24201b" />
          <stop offset="55%" stopColor="#141210" />
          <stop offset="100%" stopColor="#080706" />
        </radialGradient>

        {/* Outer Hairline Gold Border */}
        <linearGradient id="nvGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a5a22" />
          <stop offset="30%" stopColor="#dfba73" />
          <stop offset="70%" stopColor="#9a7029" />
          <stop offset="100%" stopColor="#4a3512" />
        </linearGradient>

        {/* Ambient Warm Halo behind Typography */}
        <radialGradient id="nvGoldHalo" cx="50%" cy="42%" r="48%">
          <stop offset="0%" stopColor="#e8c87e" stopOpacity={glow ? 0.35 : 0.15} />
          <stop offset="55%" stopColor="#c59942" stopOpacity={glow ? 0.14 : 0.05} />
          <stop offset="100%" stopColor="#c59942" stopOpacity="0" />
        </radialGradient>

        {/* Metallic Letters Gradient (NUEVA VIDA) */}
        <linearGradient id="nvGoldLetter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fae7be" />
          <stop offset="26%" stopColor="#e3be6a" />
          <stop offset="68%" stopColor="#c5983d" />
          <stop offset="100%" stopColor="#8c651e" />
        </linearGradient>

        {/* Subtitle Metallic Gradient */}
        <linearGradient id="nvGoldSub" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b88d38" />
          <stop offset="50%" stopColor="#fae8bd" />
          <stop offset="100%" stopColor="#b88d38" />
        </linearGradient>

        {/* Drop Shadow & Gold Radiance Filter */}
        <filter id="nvGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.75" />
          {glow && (
            <feDropShadow dx="0" dy="0" stdDeviation="5.5" floodColor="#dfba73" floodOpacity="0.45" />
          )}
        </filter>
      </defs>

      {/* Card Background Container */}
      {isCard && (
        <>
          <rect
            x="1"
            y="1"
            width="458"
            height="114"
            rx="12"
            fill="url(#nvCardBg)"
            stroke="url(#nvGoldBorder)"
            strokeWidth="1.2"
          />

          {/* Concentric Acoustic Texture Rings */}
          <g opacity="0.08" stroke="#dfba73" strokeWidth="0.8" fill="none">
            <circle cx="230" cy="50" r="115" />
            <circle cx="230" cy="50" r="165" />
            <circle cx="230" cy="50" r="215" />
          </g>
        </>
      )}

      {/* Radiant Atmospheric Halo */}
      <ellipse cx="230" cy="46" rx="175" ry="34" fill="url(#nvGoldHalo)" />

      {/* Main Title: NUEVA VIDA */}
      <text
        x="230"
        y="58"
        textAnchor="middle"
        fontFamily="var(--font-serif), 'Cinzel', 'Playfair Display', 'Times New Roman', Georgia, serif"
        fontWeight="700"
        fontSize="48"
        letterSpacing="0.035em"
        fill="url(#nvGoldLetter)"
        filter="url(#nvGlow)"
      >
        NUEVA VIDA
      </text>

      {/* Subtitle Bounding Box */}
      <rect
        x="128"
        y="75"
        width="204"
        height="24"
        rx="2"
        fill={isCard ? "rgba(10, 9, 8, 0.55)" : "rgba(10, 9, 8, 0.4)"}
        stroke="url(#nvGoldBorder)"
        strokeWidth="1"
      />

      {/* Subtitle Text: SOTO DEL REAL */}
      <text
        x="231"
        y="91"
        textAnchor="middle"
        fontFamily="var(--font-serif), 'Cinzel', 'Playfair Display', 'Times New Roman', Georgia, serif"
        fontWeight="600"
        fontSize="11"
        letterSpacing="0.33em"
        fill="url(#nvGoldSub)"
      >
        SOTO DEL REAL
      </text>
    </svg>
  );
}
