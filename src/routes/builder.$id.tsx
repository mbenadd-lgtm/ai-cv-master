import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PersonalStep, SummaryStep, ExperienceStep, EducationStep,
  SkillsStep, LanguagesStep, CertificationsStep,
} from "@/components/builder-steps";
import { CvPreview } from "@/components/cv-templates";
import type { CvData, TemplateId } from "@/lib/cv-types";
import { emptyCv } from "@/lib/cv-types";
import { getCv, saveCv } from "@/lib/cv-storage";
import { exportNodeToPdf } from "@/lib/pdf";
import { ArrowLeft, ArrowRight, Download, FileText, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/builder/$id")({
  head: () => ({ meta: [{ title: "CV Builder — AI CV Generator" }] }),
  component: Builder,
});

const STEPS = [
  { key: "personal", label: "Personal" },
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "languages", label: "Languages" },
  { key: "certifications", label: "Certs" },
  { key: "review", label: "Review" },
] as const;

function Builder() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("Untitled CV");
  const [template, setTemplate] = useState<TemplateId>("modern");
  const [data, setData] = useState<CvData>(emptyCv());
  const [market, setMarket] = useState<"Germany" | "France" | "Remote" | "General">("General");
  const [jobDescription, setJobDescription] = useState("");
  const [exporting, setExporting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getCv(id).then((rec) => {
      if (cancelled || !rec) { setLoaded(true); return; }
      setTitle(rec.title);
      setTemplate(rec.template);
      setData({ ...emptyCv(), ...(rec.data ?? {}) });
      setLoaded(true);
    }).catch(() => setLoaded(true));
    return () => { cancelled = true; };
  }, [id]);

  // Autosave (debounced)
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      saveCv(id, { title, template, data }).catch(() => {});
    }, 600);
    return () => clearTimeout(t);
  }, [id, title, template, data, loaded]);

  const update = (patch: Partial<CvData>) => setData((d) => ({ ...d, ...patch }));
  const stepProps = { data, update, market, jobDescription };

  const exportPdf = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      await exportNodeToPdf(previewRef.current, `${title || "cv"}.pdf`);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b bg-background sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link to={id === "guest" ? "/" : "/dashboard"} className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16}/> Back
          </Link>
          <div className="flex items-center gap-2 ml-3">
            <FileText size={16} className="text-muted-foreground"/>
            <Input className="border-0 shadow-none px-1 h-8 w-44 sm:w-72 focus-visible:ring-0" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Select value={template} onValueChange={(v) => setTemplate(v as TemplateId)}>
              <SelectTrigger className="h-9 w-36"><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowPreviewMobile(s => !s)}><Eye size={14}/> {showPreviewMobile ? "Edit" : "Preview"}</Button>
            <Button size="sm" onClick={exportPdf} disabled={exporting}>
              {exporting ? <Loader2 className="animate-spin" size={14}/> : <Download size={14}/>} PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className={`${showPreviewMobile ? "hidden" : "block"} lg:block`}>
          <div className="rounded-xl border bg-card p-5 sm:p-6">
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <div>Step {step + 1} of {STEPS.length} · <b className="text-foreground">{STEPS[step].label}</b></div>
                <div>{Math.round(progress)}%</div>
              </div>
              <Progress value={progress} />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {STEPS.map((s, i) => (
                  <button key={s.key} onClick={() => setStep(i)} className={`text-[11px] px-2 py-1 rounded-md border ${i === step ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:text-foreground"}`}>{s.label}</button>
                ))}
              </div>
            </div>

            <div className="mb-5 grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Job market</Label>
                <Select value={market} onValueChange={(v) => setMarket(v as typeof market)}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {["General", "Germany", "France", "Remote"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Job description (optional, for ATS alignment)</Label>
                <Textarea rows={2} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job posting here…" />
              </div>
            </div>

            <div className="min-h-[300px]">
              {STEPS[step].key === "personal" && <PersonalStep {...stepProps}/>}
              {STEPS[step].key === "summary" && <SummaryStep {...stepProps}/>}
              {STEPS[step].key === "experience" && <ExperienceStep {...stepProps}/>}
              {STEPS[step].key === "education" && <EducationStep {...stepProps}/>}
              {STEPS[step].key === "skills" && <SkillsStep {...stepProps}/>}
              {STEPS[step].key === "languages" && <LanguagesStep {...stepProps}/>}
              {STEPS[step].key === "certifications" && <CertificationsStep {...stepProps}/>}
              {STEPS[step].key === "review" && (
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>Review your CV on the right and export to PDF when you're ready.</p>
                  <Button onClick={exportPdf} disabled={exporting} className="gap-2">
                    {exporting ? <Loader2 className="animate-spin" size={14}/> : <Download size={14}/>}
                    Download PDF
                  </Button>
                  {id === "guest" && (
                    <p className="text-xs">You're working as a guest. <button className="text-primary underline" onClick={() => navigate({ to: "/auth" })}>Create an account</button> to save unlimited CVs.</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                <ArrowLeft size={14}/> Previous
              </Button>
              <Button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1}>
                Next <ArrowRight size={14}/>
              </Button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className={`${showPreviewMobile ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-20">
            <div className="rounded-xl bg-surface-muted p-4 overflow-auto max-h-[calc(100vh-7rem)]">
              <div className="origin-top scale-[0.55] sm:scale-[0.7] lg:scale-[0.6] xl:scale-[0.72] mx-auto" style={{ width: "210mm" }}>
                <div ref={previewRef}>
                  <CvPreview template={template} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
