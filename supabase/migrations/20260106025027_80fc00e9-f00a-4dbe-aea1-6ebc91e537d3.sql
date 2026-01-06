-- Add pricing columns for different durations
ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS price_3_days INTEGER,
ADD COLUMN IF NOT EXISTS price_7_days INTEGER,
ADD COLUMN IF NOT EXISTS price_15_days INTEGER,
ADD COLUMN IF NOT EXISTS price_30_days INTEGER;

-- Create booking_enquiries table
CREATE TABLE IF NOT EXISTS public.booking_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  car_id UUID REFERENCES public.cars(id) ON DELETE SET NULL,
  car_name TEXT NOT NULL,
  pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
  drop_date TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_location TEXT NOT NULL,
  total_days INTEGER NOT NULL,
  total_hours INTEGER DEFAULT 0,
  estimated_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on booking_enquiries
ALTER TABLE public.booking_enquiries ENABLE ROW LEVEL SECURITY;

-- Admins can view all enquiries
CREATE POLICY "Admins can view all enquiries"
ON public.booking_enquiries
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update enquiries
CREATE POLICY "Admins can update enquiries"
ON public.booking_enquiries
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete enquiries
CREATE POLICY "Admins can delete enquiries"
ON public.booking_enquiries
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can create enquiries (public form)
CREATE POLICY "Anyone can create enquiries"
ON public.booking_enquiries
FOR INSERT
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_booking_enquiries_updated_at
BEFORE UPDATE ON public.booking_enquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();