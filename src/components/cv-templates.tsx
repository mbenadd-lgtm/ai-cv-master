import type { CvData } from "@/lib/cv-types";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

interface Props { data: CvData }

export function ModernTemplate({ data }: Props) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  return (
    <div className="cv-page flex" style={{ fontFamily: "Inter, sans-serif", fontSize: 11 }}>
      <aside className="w-[34%] bg-[#0F172A] text-white p-8 space-y-6">
        {personal.photo && (
          <img src={personal.photo} alt={personal.fullName} className="w-28 h-28 rounded-full object-cover border-4 border-white/20" />
        )}
        <div>
          <h1 className="text-2xl font-semibold leading-tight" style={{ fontFamily: "Inter" }}>{personal.fullName || "Your Name"}</h1>
          {personal.title && <p className="text-[#A5B4FC] mt-1 text-sm">{personal.title}</p>}
        </div>
        <div className="space-y-2 text-xs text-white/80">
          {personal.email && <div className="flex items-center gap-2"><Mail size={12}/> {personal.email}</div>}
          {personal.phone && <div className="flex items-center gap-2"><Phone size={12}/> {personal.phone}</div>}
          {personal.location && <div className="flex items-center gap-2"><MapPin size={12}/> {personal.location}</div>}
          {personal.links && <div className="flex items-center gap-2"><Globe size={12}/> {personal.links}</div>}
        </div>
        {skills.length > 0 && (
          <Section title="Skills" dark>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => <span key={s} className="text-[10px] bg-white/10 px-2 py-1 rounded">{s}</span>)}
            </div>
          </Section>
        )}
        {languages.length > 0 && (
          <Section title="Languages" dark>
            <ul className="space-y-1 text-xs">
              {languages.map((l) => <li key={l.id} className="flex justify-between"><span>{l.name}</span><span className="text-white/60">{l.level}</span></li>)}
            </ul>
          </Section>
        )}
        {certifications.length > 0 && (
          <Section title="Certifications" dark>
            <ul className="space-y-2 text-xs">
              {certifications.map((c) => <li key={c.id}><div className="font-medium">{c.name}</div><div className="text-white/60">{c.issuer} · {c.date}</div></li>)}
            </ul>
          </Section>
        )}
      </aside>
      <main className="flex-1 p-10 space-y-6 text-[#0F172A]">
        {summary && (
          <Section title="Profile"><p className="leading-relaxed whitespace-pre-line">{summary}</p></Section>
        )}
        {experience.length > 0 && (
          <Section title="Experience">
            <div className="space-y-4">
              {experience.map((e) => (
                <div key={e.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-xs text-slate-500">{e.startDate} – {e.endDate || "Present"}</div>
                  </div>
                  <div className="text-sm text-slate-600">{e.company}{e.location ? `, ${e.location}` : ""}</div>
                  <div className="mt-1 text-sm leading-relaxed whitespace-pre-line">{e.description}</div>
                </div>
              ))}
            </div>
          </Section>
        )}
        {education.length > 0 && (
          <Section title="Education">
            <div className="space-y-3">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="font-semibold">{e.degree}</div>
                    <div className="text-xs text-slate-500">{e.startDate} – {e.endDate || "Present"}</div>
                  </div>
                  <div className="text-sm text-slate-600">{e.school}{e.location ? `, ${e.location}` : ""}</div>
                  {e.description && <div className="mt-1 text-sm whitespace-pre-line">{e.description}</div>}
                </div>
              ))}
            </div>
          </Section>
        )}
      </main>
    </div>
  );
}

export function MinimalTemplate({ data }: Props) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  return (
    <div className="cv-page p-14 text-[#111]" style={{ fontFamily: "Inter, sans-serif", fontSize: 11 }}>
      <header className="text-center mb-8 pb-6 border-b">
        <h1 className="text-3xl font-light tracking-tight">{personal.fullName || "Your Name"}</h1>
        {personal.title && <p className="text-slate-500 mt-1">{personal.title}</p>}
        <div className="mt-3 text-xs text-slate-500 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.links && <span>{personal.links}</span>}
        </div>
      </header>
      <div className="space-y-7">
        {summary && <MinSection title="Summary"><p className="leading-relaxed whitespace-pre-line">{summary}</p></MinSection>}
        {experience.length > 0 && (
          <MinSection title="Experience">
            {experience.map((e) => (
              <div key={e.id} className="mb-4">
                <div className="flex justify-between"><span className="font-medium">{e.title} · {e.company}</span><span className="text-slate-500 text-xs">{e.startDate} – {e.endDate || "Present"}</span></div>
                <div className="text-slate-500 text-xs">{e.location}</div>
                <p className="mt-1 whitespace-pre-line">{e.description}</p>
              </div>
            ))}
          </MinSection>
        )}
        {education.length > 0 && (
          <MinSection title="Education">
            {education.map((e) => (
              <div key={e.id} className="mb-2">
                <div className="flex justify-between"><span className="font-medium">{e.degree} · {e.school}</span><span className="text-slate-500 text-xs">{e.startDate} – {e.endDate || "Present"}</span></div>
              </div>
            ))}
          </MinSection>
        )}
        {skills.length > 0 && <MinSection title="Skills"><p>{skills.join(" · ")}</p></MinSection>}
        {languages.length > 0 && <MinSection title="Languages"><p>{languages.map(l=>`${l.name} (${l.level})`).join(" · ")}</p></MinSection>}
        {certifications.length > 0 && (
          <MinSection title="Certifications">
            {certifications.map((c) => <div key={c.id}>{c.name} — {c.issuer}, {c.date}</div>)}
          </MinSection>
        )}
      </div>
    </div>
  );
}

export function CorporateTemplate({ data }: Props) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  return (
    <div className="cv-page p-12 text-[#1a1a1a]" style={{ fontFamily: "Georgia, serif", fontSize: 11 }}>
      <header className="border-b-2 border-[#1a1a1a] pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider">{personal.fullName || "Your Name"}</h1>
        {personal.title && <p className="mt-1 italic text-slate-700">{personal.title}</p>}
        <div className="mt-2 text-xs text-slate-600">
          {[personal.email, personal.phone, personal.location, personal.links].filter(Boolean).join(" | ")}
        </div>
      </header>
      <div className="space-y-5">
        {summary && <CorpSection title="Professional Summary"><p className="leading-relaxed whitespace-pre-line">{summary}</p></CorpSection>}
        {experience.length > 0 && (
          <CorpSection title="Professional Experience">
            {experience.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between"><span className="font-bold">{e.title}</span><span className="text-xs">{e.startDate} – {e.endDate || "Present"}</span></div>
                <div className="italic">{e.company}{e.location ? `, ${e.location}` : ""}</div>
                <p className="mt-1 whitespace-pre-line">{e.description}</p>
              </div>
            ))}
          </CorpSection>
        )}
        {education.length > 0 && (
          <CorpSection title="Education">
            {education.map((e) => (
              <div key={e.id} className="mb-2">
                <div className="flex justify-between"><span className="font-bold">{e.degree}</span><span className="text-xs">{e.startDate} – {e.endDate || "Present"}</span></div>
                <div className="italic">{e.school}{e.location ? `, ${e.location}` : ""}</div>
              </div>
            ))}
          </CorpSection>
        )}
        {skills.length > 0 && <CorpSection title="Core Competencies"><p>{skills.join(" • ")}</p></CorpSection>}
        {languages.length > 0 && <CorpSection title="Languages"><p>{languages.map(l=>`${l.name} (${l.level})`).join(", ")}</p></CorpSection>}
        {certifications.length > 0 && (
          <CorpSection title="Certifications">
            {certifications.map((c) => <div key={c.id}>{c.name} — {c.issuer} ({c.date})</div>)}
          </CorpSection>
        )}
      </div>
    </div>
  );
}

function Section({ title, children, dark }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section>
      <h2 className={`text-[11px] font-semibold uppercase tracking-[0.18em] mb-2 ${dark ? "text-white/60" : "text-slate-400"}`}>{title}</h2>
      {children}
    </section>
  );
}
function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">{title}</h2>
      {children}
    </section>
  );
}
function CorpSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-bold uppercase border-b border-slate-300 pb-1 mb-2">{title}</h2>
      {children}
    </section>
  );
}

export function CvPreview({ template, data }: { template: string; data: CvData }) {
  if (template === "minimal") return <MinimalTemplate data={data} />;
  if (template === "corporate") return <CorporateTemplate data={data} />;
  return <ModernTemplate data={data} />;
}
