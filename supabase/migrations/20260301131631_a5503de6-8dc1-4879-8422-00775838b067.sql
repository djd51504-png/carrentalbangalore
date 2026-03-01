-- Add validation constraints to booking_enquiries
ALTER TABLE public.booking_enquiries
  ADD CONSTRAINT customer_name_length CHECK (char_length(customer_name) BETWEEN 2 AND 100),
  ADD CONSTRAINT customer_phone_format CHECK (customer_phone ~ '^[0-9]{10}$'),
  ADD CONSTRAINT positive_price CHECK (estimated_price >= 0),
  ADD CONSTRAINT positive_days CHECK (total_days >= 2);

-- Add validation constraints to cars table
ALTER TABLE public.cars
  ADD CONSTRAINT car_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT car_brand_length CHECK (char_length(brand) BETWEEN 1 AND 50),
  ADD CONSTRAINT positive_car_price CHECK (price > 0),
  ADD CONSTRAINT positive_km_limit CHECK (km_limit > 0),
  ADD CONSTRAINT positive_extra_km CHECK (extra_km_charge >= 0);
