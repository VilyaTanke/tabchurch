export type AvatarItem = {
  id: string;
  name: string;
  src: string;
  bgColor: string;
};

export const AVATAR_OPTIONS: AvatarItem[] = [
  {
    id: "avatar-1",
    name: "Gatito Amarillo",
    src: "/avatars/avatar-1.jpg",
    bgColor: "#a7f3d0",
  },
  {
    id: "avatar-2",
    name: "Chica Bob",
    src: "/avatars/avatar-2.jpg",
    bgColor: "#bbf7d0",
  },
  {
    id: "avatar-3",
    name: "Chico con Gafas Rojas",
    src: "/avatars/avatar-3.jpg",
    bgColor: "#fef08a",
  },
  {
    id: "avatar-4",
    name: "Osito Tierno",
    src: "/avatars/avatar-4.jpg",
    bgColor: "#bae6fd",
  },
  {
    id: "avatar-5",
    name: "Chica Pelo Rosa",
    src: "/avatars/avatar-5.jpg",
    bgColor: "#99f6e4",
  },
  {
    id: "avatar-6",
    name: "Chico Castaño",
    src: "/avatars/avatar-6.jpg",
    bgColor: "#fed7aa",
  },
  {
    id: "avatar-7",
    name: "Chico Pícaro",
    src: "/avatars/avatar-7.jpg",
    bgColor: "#a7f3d0",
  },
  {
    id: "avatar-8",
    name: "Gorra Verde",
    src: "/avatars/avatar-8.jpg",
    bgColor: "#99f6e4",
  },
];

export const DEFAULT_AVATAR = "/avatars/avatar-1.jpg";

export function getAvatarSrc(avatar?: string | null): string {
  if (!avatar) return DEFAULT_AVATAR;
  if (avatar.startsWith("/") || avatar.startsWith("http")) return avatar;
  const found = AVATAR_OPTIONS.find((a) => a.id === avatar);
  if (found) return found.src;
  return DEFAULT_AVATAR;
}
