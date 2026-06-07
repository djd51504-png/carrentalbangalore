ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS km_7_20 integer,
  ADD COLUMN IF NOT EXISTS km_20_plus integer,
  ADD COLUMN IF NOT EXISTS custom_location text;