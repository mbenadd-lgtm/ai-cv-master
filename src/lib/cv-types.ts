export type TemplateId = "modern" | "minimal" | "corporate";

export interface CvExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CvEducation {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CvLanguage {
  id: string;
  name: string;
  level: "Basic" | "Conversational" | "Fluent" | "Native";
}

export interface CvCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CvData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    photo?: string;
    links?: string;
  };
  summary: string;
  experience: CvExperience[];
  education: CvEducation[];
  skills: string[];
  languages: CvLanguage[];
  certifications: CvCertification[];
}

export const emptyCv = (): CvData => ({
  personal: { fullName: "", email: "", phone: "", location: "", title: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
});

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
