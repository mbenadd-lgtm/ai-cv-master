import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Plus, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CvData, CvExperience, CvEducation, CvLanguage, CvCertification } from "@/lib/cv-types";
import { newId } from "@/lib/cv-types";
import { improveWithAi } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";

interface StepProps {
  data: CvData;
  update: (patch: Partial<CvData>) => void;
  market: "Germany" | "France" | "Remote" | "General";
  jobDescription: string;
}

export function PersonalStep({ data, update }: StepProps) {
  const p = data.personal;
  const set = (k: keyof typeof p, v: string) => update({ personal: { ...p, [k]: v } });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name"><Input value={p.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Jane Doe" /></Field>
      <Field label="Professional title"><Input value={p.title} onChange={(e) => set("title", e.target.value)} placeholder="Senior Product Designer" /></Field>
      <Field label="Email"><Input type="email" value={p.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" /></Field>
      <Field label="Phone"><Input value={p.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+49 30 1234567" /></Field>
      <Field label="Location"><Input value={p.location} onChange={(e) => set("location", e.target.value)} placeholder="Berlin, Germany" /></Field>
      <Field label="Website / LinkedIn"><Input value={p.links ?? ""} onChange={(e) => set("links", e.target.value)} placeholder="linkedin.com/in/jane" /></Field>
      <Field label="Photo URL (optional)" className="sm:col-span-2"><Input value={p.photo ?? ""} onChange={(e) => set("photo", e.target.value)} placeholder="https://..." /></Field>
    </div>
  );
}

export function SummaryStep({ data, update, market, jobDescription }: StepProps) {
  return (
    <div className="space-y-3">
      <Label>Professional summary</Label>
      <Textarea rows={8} value={data.summary} onChange={(e) => update({ summary: e.target.value })} placeholder="2-4 sentences describing who you are, what you do, and your strongest results." />
      <AiButton text={data.summary} section="summary" market={market} jobDescription={jobDescription} onResult={(t) => update({ summary: t })} />
    </div>
  );
}

export function ExperienceStep({ data, update, market, jobDescription }: StepProps) {
  const add = () => update({ experience: [...data.experience, { id: newId(), title: "", company: "", location: "", startDate: "", endDate: "", description: "" }] });
  const remove = (id: string) => update({ experience: data.experience.filter((e) => e.id !== id) });
  const patch = (id: string, p: Partial<CvExperience>) => update({ experience: data.experience.map((e) => e.id === id ? { ...e, ...p } : e) });
  return (
    <div className="space-y-4">
      {data.experience.map((e) => (
        <div key={e.id} className="rounded-lg border bg-surface p-4 space-y-3">
          <div className="flex justify-between items-center"><div className="text-sm font-medium">Position</div><Button size="icon" variant="ghost" onClick={() => remove(e.id)}><Trash2 size={16}/></Button></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Title"><Input value={e.title} onChange={(ev) => patch(e.id, { title: ev.target.value })} /></Field>
            <Field label="Company"><Input value={e.company} onChange={(ev) => patch(e.id, { company: ev.target.value })} /></Field>
            <Field label="Location"><Input value={e.location} onChange={(ev) => patch(e.id, { location: ev.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Start"><Input placeholder="Jan 2022" value={e.startDate} onChange={(ev) => patch(e.id, { startDate: ev.target.value })} /></Field>
              <Field label="End"><Input placeholder="Present" value={e.endDate} onChange={(ev) => patch(e.id, { endDate: ev.target.value })} /></Field>
            </div>
          </div>
          <Field label="Description / achievements">
            <Textarea rows={5} value={e.description} onChange={(ev) => patch(e.id, { description: ev.target.value })} placeholder="Led ... · Shipped ... · Improved ..." />
          </Field>
          <AiButton text={e.description} section="experience" market={market} jobDescription={jobDescription} onResult={(t) => patch(e.id, { description: t })} />
        </div>
      ))}
      <Button variant="outline" onClick={add} className="w-full"><Plus size={16}/> Add experience</Button>
    </div>
  );
}

export function EducationStep({ data, update }: StepProps) {
  const add = () => update({ education: [...data.education, { id: newId(), degree: "", school: "", location: "", startDate: "", endDate: "", description: "" }] });
  const remove = (id: string) => update({ education: data.education.filter((e) => e.id !== id) });
  const patch = (id: string, p: Partial<CvEducation>) => update({ education: data.education.map((e) => e.id === id ? { ...e, ...p } : e) });
  return (
    <div className="space-y-4">
      {data.education.map((e) => (
        <div key={e.id} className="rounded-lg border bg-surface p-4 space-y-3">
          <div className="flex justify-between items-center"><div className="text-sm font-medium">Degree</div><Button size="icon" variant="ghost" onClick={() => remove(e.id)}><Trash2 size={16}/></Button></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Degree"><Input value={e.degree} onChange={(ev) => patch(e.id, { degree: ev.target.value })} /></Field>
            <Field label="School"><Input value={e.school} onChange={(ev) => patch(e.id, { school: ev.target.value })} /></Field>
            <Field label="Location"><Input value={e.location} onChange={(ev) => patch(e.id, { location: ev.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Start"><Input value={e.startDate} onChange={(ev) => patch(e.id, { startDate: ev.target.value })} /></Field>
              <Field label="End"><Input value={e.endDate} onChange={(ev) => patch(e.id, { endDate: ev.target.value })} /></Field>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={add} className="w-full"><Plus size={16}/> Add education</Button>
    </div>
  );
}

export function SkillsStep({ data, update }: StepProps) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (!v) return;
    if (!data.skills.includes(v)) update({ skills: [...data.skills, v] });
    setInput("");
  };
  return (
    <div className="space-y-3">
      <Label>Skills</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. TypeScript" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <Button onClick={add}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((s) => (
          <span key={s} className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground text-sm px-3 py-1">
            {s}
            <button onClick={() => update({ skills: data.skills.filter((x) => x !== s) })}><X size={12}/></button>
          </span>
        ))}
      </div>
    </div>
  );
}

export function LanguagesStep({ data, update }: StepProps) {
  const add = () => update({ languages: [...data.languages, { id: newId(), name: "", level: "Fluent" }] });
  const patch = (id: string, p: Partial<CvLanguage>) => update({ languages: data.languages.map((l) => l.id === id ? { ...l, ...p } : l) });
  return (
    <div className="space-y-3">
      {data.languages.map((l) => (
        <div key={l.id} className="flex gap-2 items-end">
          <Field label="Language" className="flex-1"><Input value={l.name} onChange={(e) => patch(l.id, { name: e.target.value })} /></Field>
          <Field label="Level" className="w-48">
            <Select value={l.level} onValueChange={(v) => patch(l.id, { level: v as CvLanguage["level"] })}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                {["Basic", "Conversational", "Fluent", "Native"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Button size="icon" variant="ghost" onClick={() => update({ languages: data.languages.filter((x) => x.id !== l.id) })}><Trash2 size={16}/></Button>
        </div>
      ))}
      <Button variant="outline" onClick={add} className="w-full"><Plus size={16}/> Add language</Button>
    </div>
  );
}

export function CertificationsStep({ data, update }: StepProps) {
  const add = () => update({ certifications: [...data.certifications, { id: newId(), name: "", issuer: "", date: "" }] });
  const patch = (id: string, p: Partial<CvCertification>) => update({ certifications: data.certifications.map((c) => c.id === id ? { ...c, ...p } : c) });
  return (
    <div className="space-y-3">
      {data.certifications.map((c) => (
        <div key={c.id} className="grid sm:grid-cols-[1fr_1fr_140px_auto] gap-2 items-end">
          <Field label="Name"><Input value={c.name} onChange={(e) => patch(c.id, { name: e.target.value })} /></Field>
          <Field label="Issuer"><Input value={c.issuer} onChange={(e) => patch(c.id, { issuer: e.target.value })} /></Field>
          <Field label="Date"><Input value={c.date} onChange={(e) => patch(c.id, { date: e.target.value })} placeholder="2024" /></Field>
          <Button size="icon" variant="ghost" onClick={() => update({ certifications: data.certifications.filter((x) => x.id !== c.id) })}><Trash2 size={16}/></Button>
        </div>
      ))}
      <Button variant="outline" onClick={add} className="w-full"><Plus size={16}/> Add certification</Button>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function AiButton({ text, section, market, jobDescription, onResult }: { text: string; section: "summary" | "experience" | "general"; market: StepProps["market"]; jobDescription: string; onResult: (t: string) => void }) {
  const [loading, setLoading] = useState(false);
  const fn = useServerFn(improveWithAi);
  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={loading || !text.trim()}
      onClick={async () => {
        setLoading(true);
        try {
          const out = await fn({ data: { text, section, market, jobDescription } });
          onResult(out.text);
          toast.success("Rewritten with AI");
        } catch (e: unknown) {
          toast.error(e instanceof Error ? e.message : "AI request failed");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>}
      Improve with AI
    </Button>
  );
}
