CREATE TABLE IF NOT EXISTS public.usage_counters (
  counter_key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_end TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.usage_counters TO service_role;
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.consume_ai_quota(_ip TEXT, _is_realtime BOOLEAN DEFAULT false)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ip_key TEXT := 'ip_hour:' || coalesce(nullif(_ip, ''), 'unknown');
  global_key TEXT := 'global_day:' || to_char((now() AT TIME ZONE 'utc')::date, 'YYYY-MM-DD');
  rt_ip_key TEXT := 'rt_ip_day:' || coalesce(nullif(_ip, ''), 'unknown') || ':' || to_char((now() AT TIME ZONE 'utc')::date, 'YYYY-MM-DD');
  rt_global_key TEXT := 'rt_global_day:' || to_char((now() AT TIME ZONE 'utc')::date, 'YYYY-MM-DD');
  day_end TIMESTAMPTZ := date_trunc('day', now() AT TIME ZONE 'utc') + interval '1 day';
  keys TEXT[];
  limits INTEGER[];
  ends TIMESTAMPTZ[];
  i INTEGER;
  c INTEGER;
  blocked BOOLEAN := false;
BEGIN
  keys := ARRAY[ip_key, global_key];
  limits := ARRAY[40, 600];
  ends := ARRAY[now() + interval '60 minutes', day_end];

  IF _is_realtime THEN
    keys := keys || ARRAY[rt_ip_key, rt_global_key];
    limits := limits || ARRAY[3, 40];
    ends := ends || ARRAY[day_end, day_end];
  END IF;

  FOR i IN 1..array_length(keys, 1) LOOP
    INSERT INTO public.usage_counters (counter_key, count, window_end)
    VALUES (keys[i], 1, ends[i])
    ON CONFLICT (counter_key) DO UPDATE SET
      count = CASE WHEN public.usage_counters.window_end <= now() THEN 1 ELSE public.usage_counters.count + 1 END,
      window_end = CASE WHEN public.usage_counters.window_end <= now() THEN EXCLUDED.window_end ELSE public.usage_counters.window_end END,
      updated_at = now()
    RETURNING count INTO c;

    IF c > limits[i] THEN
      blocked := true;
    END IF;
  END LOOP;

  IF blocked THEN
    -- roll back the increments so a blocked request does not inflate counters
    FOR i IN 1..array_length(keys, 1) LOOP
      UPDATE public.usage_counters
      SET count = GREATEST(count - 1, 0)
      WHERE counter_key = keys[i];
    END LOOP;
    RETURN jsonb_build_object('allowed', false);
  END IF;

  RETURN jsonb_build_object('allowed', true);
END;
$$;

REVOKE ALL ON FUNCTION public.consume_ai_quota(TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_ai_quota(TEXT, BOOLEAN) TO service_role;