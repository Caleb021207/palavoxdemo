-- Fix search_path security issues for functions
DROP FUNCTION IF EXISTS public.generate_access_code(UUID);
DROP FUNCTION IF EXISTS public.process_access_code(TEXT, UUID);
DROP FUNCTION IF EXISTS public.recalculate_student_metrics(UUID);

CREATE OR REPLACE FUNCTION public.generate_access_code(class_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_record RECORD;
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
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Placeholder function for demo
  UPDATE public.student_metrics 
  SET last_updated = now()
  WHERE student_id = student_id_input;
END;
$$;