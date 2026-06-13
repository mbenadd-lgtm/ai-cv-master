import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — AI CV Generator" }, { name: "description", content: "Sign in or create your free CV Genie account." }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/dashboard" });
  };

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. You're signed in.");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 font-semibold justify-center mb-6">
          <div className="grid place-items-center size-8 rounded-lg bg-primary text-primary-foreground"><FileText size={16}/></div>
          CV Genie
        </Link>
        <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 mb-4 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-3">
              <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
              <Field label="Password"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
              <Button className="w-full" onClick={signIn} disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-3">
              <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
              <Field label="Password (min 6 chars)"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
              <Button className="w-full" onClick={signUp} disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
            </TabsContent>
          </Tabs>
        </div>
        <div className="text-center mt-4 text-sm text-muted-foreground">
          <Link to="/builder/$id" params={{ id: "guest" }} className="hover:text-foreground">Or try as guest →</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
