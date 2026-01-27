-- Add images array column to cars table for multi-image support
ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add availability toggle for cars
ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true NOT NULL;

-- Migrate existing single image to images array if image exists
UPDATE public.cars 
SET images = ARRAY[image] 
WHERE image IS NOT NULL AND image != '' AND (images IS NULL OR array_length(images, 1) IS NULL);