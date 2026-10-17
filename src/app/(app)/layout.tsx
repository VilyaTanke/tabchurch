import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  if (user.mustChangePw) redirect("/cambiar-clave");
  return (
    <div className="shell">
      <Nav isAdmin={user.role === "admin"} />
      <main className="main">
        <Reveal onRoute>{children}</Reveal>
      </main>
    </div>
  );
}
