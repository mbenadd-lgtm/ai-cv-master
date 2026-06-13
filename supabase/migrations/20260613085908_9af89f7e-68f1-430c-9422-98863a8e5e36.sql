
CREATE TABLE public.cvs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled CV',
  template TEXT NOT NULL DEFAULT 'modern',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cvs TO authenticated;
GRANT ALL ON public.cvs TO service_role;
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cvs" ON public.cvs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.tg_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER cvs_updated_at BEFORE UPDATE ON public.cvs FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
CREATE INDEX cvs_user_id_idx ON public.cvs(user_id, updated_at DESC);
