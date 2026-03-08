
-- Drop the old 2-day minimum constraint and add 1-day minimum
ALTER TABLE public.booking_enquiries DROP CONSTRAINT IF EXISTS chk_minimum_rental_days;
ALTER TABLE public.booking_enquiries ADD CONSTRAINT chk_minimum_rental_days CHECK (total_days >= 1);
