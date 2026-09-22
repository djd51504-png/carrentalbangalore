DROP POLICY IF EXISTS "Anyone can create valid enquiries" ON public.booking_enquiries;

CREATE POLICY "Anyone can create valid enquiries"
ON public.booking_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (customer_name IS NOT NULL)
  AND ((length(btrim(customer_name)) >= 2) AND (length(btrim(customer_name)) <= 100))
  AND (customer_phone ~ '^[0-9]{10}$'::text)
  AND (car_name IS NOT NULL)
  AND ((length(btrim(car_name)) >= 1) AND (length(btrim(car_name)) <= 200))
  AND ((pickup_location IS NULL) OR ((length(btrim(pickup_location)) >= 1) AND (length(btrim(pickup_location)) <= 200)))
  AND (pickup_date IS NOT NULL)
  AND (drop_date IS NOT NULL)
  AND (drop_date > pickup_date)
  AND ((total_days >= 1) AND (total_days <= 365))
  AND ((total_hours IS NULL) OR ((total_hours >= 0) AND (total_hours <= 23)))
  AND ((estimated_price >= 0) AND (estimated_price <= 10000000))
  AND (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text, 'completed'::text]))
);