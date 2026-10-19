import SongEditor from "@/components/SongEditor";
import { requireSongEditor } from "@/lib/auth";

export const metadata = { title: "Nueva canción · Tab-NuevaVida" };

export default async function NewSongPage() {
  await requireSongEditor();
  return (
    <div className="stack">
      <h1>Nueva canción</h1>
      <SongEditor />
    </div>
  );
}
