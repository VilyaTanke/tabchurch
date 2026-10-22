import Image from "next/image";
import { getAvatarSrc } from "@/lib/avatars";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
  border?: boolean;
  style?: React.CSSProperties;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 84,
  "2xl": 120,
};

export default function UserAvatar({
  src,
  name,
  size = "md",
  className = "",
  border = true,
  style,
}: UserAvatarProps) {
  const px = sizeMap[size];
  const avatarSrc = getAvatarSrc(src);

  return (
    <div
      className={`user-avatar-wrap avatar-size-${size} ${border ? "with-border" : ""} ${className}`}
      style={{
        width: px,
        height: px,
        minWidth: px,
        minHeight: px,
        ...style,
      }}
      title={name ?? "Avatar"}
    >
      <Image
        src={avatarSrc}
        alt={name ? `Foto de perfil de ${name}` : "Foto de perfil"}
        width={px}
        height={px}
        className="user-avatar-img"
        unoptimized
      />
    </div>
  );
}
