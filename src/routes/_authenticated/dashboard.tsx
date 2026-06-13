import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { listCvs, createCv, deleteCv } from "@/lib/cv-storage";
import { FileText, Plus, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AI CV Generator" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: cvs = [], isLoading } = useQuery({ queryKey: ["cvs"], queryFn: listCvs });

  const handleCreate = async () => {
    const id = await createCv();
    qc.invalidateQueries({ queryKey: ["cvs"] });
    navigate({ to: "/builder/$id", params: { id } });
  };

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="grid place-items-center size-8 rounded-lg bg-primary text-primary-foreground"><FileText size={16}/></div>
            CV Genie
          </Link>
          <Button variant="ghost" size="sm" onClick={handleSignOut}><LogOut size={14}/> Sign out</Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Your CVs</h1>
            <p className="text-sm text-muted-foreground">Free plan · 1 CV</p>
          </div>
          <Button onClick={handleCreate}><Plus size={16}/> New CV</Button>
        </div>
        {isLoading ? (
          <div className="text-muted-foreground">Loading…</div>
        ) : cvs.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <div className="mx-auto size-12 rounded-full bg-accent grid place-items-center text-accent-foreground"><FileText/></div>
            <h2 className="mt-4 font-medium">No CVs yet</h2>
            <p className="text-sm text-muted-foreground mt-1">Create your first one in a couple of minutes.</p>
            <Button className="mt-5" onClick={handleCreate}><Plus size={16}/> Create my CV</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvs.map((c) => (
              <div key={c.id} className="rounded-xl border bg-card p-5 group">
                <Link to="/builder/$id" params={{ id: c.id }} className="block">
                  <div className="aspect-[3/4] rounded-md bg-surface-muted grid place-items-center text-muted-foreground">
                    <FileText size={32}/>
                  </div>
                  <div className="mt-3 font-medium truncate">{c.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{c.template} · {new Date(c.updated_at).toLocaleDateString()}</div>
                </Link>
                <Button
                  variant="ghost" size="icon"
                  className="mt-2 opacity-0 group-hover:opacity-100"
                  onClick={async () => {
                    if (!confirm("Delete this CV?")) return;
                    await deleteCv(c.id);
                    toast.success("Deleted");
                    qc.invalidateQueries({ queryKey: ["cvs"] });
                  }}
                ><Trash2 size={16}/></Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
