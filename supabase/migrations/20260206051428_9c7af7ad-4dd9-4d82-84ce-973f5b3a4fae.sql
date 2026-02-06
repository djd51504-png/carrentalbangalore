ALTER TABLE public.booking_enquiries 
ADD COLUMN IF NOT EXISTS booking_id TEXT,
ADD COLUMN IF NOT EXISTS deposit_type TEXT;