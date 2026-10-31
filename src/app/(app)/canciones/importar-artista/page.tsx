import ArtistImporter from "@/components/ArtistImporter";
import { requireSongEditor } from "@/lib/auth";

export const metadata = { title: "Importar Artista · Tab-NuevaVida" };

export default async function ImportArtistPage() {
  await requireSongEditor();
  return <ArtistImporter />;
}

