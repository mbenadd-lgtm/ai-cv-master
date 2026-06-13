import { supabase } from "@/integrations/supabase/client";
import type { CvData, TemplateId } from "./cv-types";
import { emptyCv } from "./cv-types";

const LOCAL_KEY = "guest_cv_v1";

export interface CvRecord {
  id: string;
  title: string;
  template: TemplateId;
  data: CvData;
  updated_at: string;
}

export async function listCvs(): Promise<CvRecord[]> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    const local = readLocal();
    return local ? [local] : [];
  }
  const { data, error } = await supabase
    .from("cvs")
    .select("id,title,template,data,updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as CvRecord[];
}

export async function getCv(id: string): Promise<CvRecord | null> {
  if (id === "guest") {
    return readLocal() ?? { id: "guest", title: "Guest CV", template: "modern", data: emptyCv(), updated_at: new Date().toISOString() };
  }
  const { data, error } = await supabase
    .from("cvs")
    .select("id,title,template,data,updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as CvRecord | null;
}

export async function createCv(title = "Untitled CV", template: TemplateId = "modern"): Promise<string> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    const rec: CvRecord = { id: "guest", title, template, data: emptyCv(), updated_at: new Date().toISOString() };
    writeLocal(rec);
    return "guest";
  }
  const { data, error } = await supabase
    .from("cvs")
    .insert({ title, template, data: emptyCv() as never, user_id: session.session.user.id })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function saveCv(id: string, patch: Partial<Pick<CvRecord, "title" | "template" | "data">>): Promise<void> {
  if (id === "guest") {
    const current = readLocal() ?? { id: "guest", title: "Guest CV", template: "modern" as TemplateId, data: emptyCv(), updated_at: new Date().toISOString() };
    const next = { ...current, ...patch, updated_at: new Date().toISOString() };
    writeLocal(next);
    return;
  }
  const { error } = await supabase
    .from("cvs")
    .update(patch as never)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCv(id: string): Promise<void> {
  if (id === "guest") {
    if (typeof window !== "undefined") window.localStorage.removeItem(LOCAL_KEY);
    return;
  }
  const { error } = await supabase.from("cvs").delete().eq("id", id);
  if (error) throw error;
}

function readLocal(): CvRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as CvRecord) : null;
  } catch {
    return null;
  }
}
function writeLocal(rec: CvRecord) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(rec));
}
