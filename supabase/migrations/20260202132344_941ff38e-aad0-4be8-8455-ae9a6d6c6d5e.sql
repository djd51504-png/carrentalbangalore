-- Add availability date columns to cars table
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS available_from DATE DEFAULT NULL;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS available_until DATE DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.cars.available_from IS 'Start date when car becomes available (null = always available)';
COMMENT ON COLUMN public.cars.available_until IS 'End date when car is available until (null = indefinitely)';
