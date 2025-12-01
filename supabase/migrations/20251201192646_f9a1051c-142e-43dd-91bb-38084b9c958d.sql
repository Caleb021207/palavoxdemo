-- Create missing tables for classroom/compliance features

-- Student language metrics table
CREATE TABLE IF NOT EXISTS public.student_language_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  grammar_accuracy NUMERIC,
  conversation_complexity NUMERIC,
  vocabulary_score NUMERIC,
  pronunciation_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Compliance tables
CREATE TABLE IF NOT EXISTS public.compliance_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  status TEXT DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.school_districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.district_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID REFERENCES public.school_districts(id) ON DELETE CASCADE,
  min_age INTEGER DEFAULT 13,
  max_age INTEGER DEFAULT 18,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.educational_data_access_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accessor_user_id UUID,
  target_user_id UUID,
  access_type TEXT,
  data_category TEXT,
  data_accessed TEXT,
  purpose TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.data_breach_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  breach_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  affected_users INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.data_export_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add display_name to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Enable RLS on new tables
ALTER TABLE public.student_language_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_data_access_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_breach_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_export_requests ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for demo mode
CREATE POLICY "Allow all on student_language_metrics" ON public.student_language_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on compliance_status" ON public.compliance_status FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on school_districts" ON public.school_districts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on district_settings" ON public.district_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on educational_data_access_audit" ON public.educational_data_access_audit FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on data_breach_notifications" ON public.data_breach_notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on data_export_requests" ON public.data_export_requests FOR ALL USING (true) WITH CHECK (true);

-- Create placeholder functions
CREATE OR REPLACE FUNCTION public.generate_access_code(class_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
BEGIN
  new_code := substring(md5(random()::text) from 1 for 8);
  INSERT INTO public.access_codes (code, class_id, expires_at)
  VALUES (new_code, class_id, now() + interval '7 days');
  RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.process_access_code(code_input TEXT, user_id_input UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  code_record RECORD;
  result JSONB;
BEGIN
  SELECT * INTO code_record FROM public.access_codes WHERE code = code_input;
  
  IF code_record IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Invalid code');
  END IF;
  
  INSERT INTO public.student_enrollments (student_id, class_id)
  VALUES (user_id_input, code_record.class_id);
  
  RETURN jsonb_build_object('success', true, 'class_id', code_record.class_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.recalculate_student_metrics(student_id_input UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Placeholder function for demo
  UPDATE public.student_metrics 
  SET last_updated = now()
  WHERE student_id = student_id_input;
END;
$$;