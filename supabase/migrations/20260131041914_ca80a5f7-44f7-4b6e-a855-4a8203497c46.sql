-- Add locations column to cars table (array of location names)
ALTER TABLE public.cars 
ADD COLUMN locations TEXT[] DEFAULT '{}'::text[];