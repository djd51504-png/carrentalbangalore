-- Replace overly permissive WITH CHECK (true) on booking_enquiries INSERT
-- with explicit field-level validation to satisfy least-privilege and
-- harden against malformed/spam inserts.

DROP POLICY IF EXISTS "Anyone can create enquiries" ON public.booking_enquiries;

CREATE POLICY "Anyone can create valid enquiries"
ON public.booking_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  customer_name IS NOT NULL
  AND length(btrim(customer_name)) BETWEEN 2 AND 100
  AND customer_phone ~ '^[0-9]{10}$'
  AND car_name IS NOT NULL
  AND length(btrim(car_name)) BETWEEN 1 AND 200
  AND pickup_location IS NOT NULL
  AND length(btrim(pickup_location)) BETWEEN 1 AND 200
  AND pickup_date IS NOT NULL
  AND drop_date IS NOT NULL
  AND drop_date > pickup_date
  AND total_days BETWEEN 1 AND 365
  AND (total_hours IS NULL OR total_hours BETWEEN 0 AND 23)
  AND estimated_price BETWEEN 0 AND 10000000
  AND status IN ('pending','confirmed','cancelled','completed')
);
