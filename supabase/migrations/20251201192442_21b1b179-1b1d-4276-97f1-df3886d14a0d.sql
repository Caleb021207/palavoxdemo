-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  teacher_id UUID,
  class_code TEXT UNIQUE,
  school_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_enrollments table
CREATE TABLE IF NOT EXISTS public.student_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_metrics table
CREATE TABLE IF NOT EXISTS public.student_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  test_score NUMERIC,
  progress_percentage NUMERIC,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create certification_attempts table
CREATE TABLE IF NOT EXISTS public.certification_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  certification_type TEXT NOT NULL,
  score NUMERIC NOT NULL,
  level TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create access_codes table
CREATE TABLE IF NOT EXISTS public.access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create access_code_attempts table
CREATE TABLE IF NOT EXISTS public.access_code_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  code TEXT NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_usage_limits table
CREATE TABLE IF NOT EXISTS public.student_usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  daily_limit INTEGER DEFAULT 10,
  used_today INTEGER DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin_override_logs table
CREATE TABLE IF NOT EXISTS public.admin_override_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID,
  action TEXT NOT NULL,
  target_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables (demo mode - permissive policies)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_code_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_override_logs ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for demo mode (allow all operations)
CREATE POLICY "Allow all operations on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on classes" ON public.classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on student_enrollments" ON public.student_enrollments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on student_metrics" ON public.student_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on certification_attempts" ON public.certification_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on access_codes" ON public.access_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on access_code_attempts" ON public.access_code_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on student_usage_limits" ON public.student_usage_limits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on admin_override_logs" ON public.admin_override_logs FOR ALL USING (true) WITH CHECK (true);