-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy for users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create cars table
CREATE TABLE public.cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price INTEGER NOT NULL,
    km_limit INTEGER NOT NULL DEFAULT 300,
    extra_km_charge INTEGER NOT NULL DEFAULT 10,
    fuel TEXT NOT NULL DEFAULT 'Petrol',
    transmission TEXT NOT NULL DEFAULT 'Manual',
    category TEXT NOT NULL DEFAULT '5-Seater',
    image TEXT,
    category_label TEXT DEFAULT 'Hatchback',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on cars
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Public can view cars
CREATE POLICY "Anyone can view cars"
ON public.cars
FOR SELECT
USING (true);

-- Admins can insert cars
CREATE POLICY "Admins can insert cars"
ON public.cars
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update cars
CREATE POLICY "Admins can update cars"
ON public.cars
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete cars
CREATE POLICY "Admins can delete cars"
ON public.cars
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for cars updated_at
CREATE TRIGGER update_cars_updated_at
BEFORE UPDATE ON public.cars
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial car data
INSERT INTO public.cars (name, brand, price, km_limit, extra_km_charge, fuel, transmission, category, category_label) VALUES
('Swift', 'Maruti Suzuki', 2500, 300, 10, 'Petrol', 'Manual & Automatic', '5-Seater', 'Hatchback'),
('Baleno', 'Maruti Suzuki', 3000, 300, 10, 'Petrol', 'Manual & Automatic', '5-Seater', 'Hatchback'),
('Glanza', 'Toyota', 3000, 300, 10, 'Petrol', 'Manual', '5-Seater', 'Hatchback'),
('Punch', 'Tata', 3000, 300, 10, 'Petrol', 'Manual', '5-Seater', 'SUV'),
('i20', 'Hyundai', 3000, 300, 10, 'Petrol', 'Manual & Automatic', '5-Seater', 'Hatchback'),
('Polo', 'Volkswagen', 3000, 300, 10, 'Petrol', 'Manual', '5-Seater', 'Hatchback'),
('Brezza', 'Maruti Suzuki', 3500, 300, 10, 'Petrol', 'Manual', '5-Seater', 'SUV'),
('Fronx', 'Maruti Suzuki', 3500, 300, 10, 'Petrol', 'Manual', '5-Seater', 'SUV'),
('Sonet', 'Kia', 3500, 300, 10, 'Petrol', 'Manual', '5-Seater', 'SUV'),
('Creta', 'Hyundai', 4000, 300, 10, 'Petrol', 'Manual', '5-Seater', 'SUV'),
('Seltos', 'Kia', 4500, 300, 10, 'Petrol', 'Manual', '5-Seater', 'SUV'),
('Thar', 'Mahindra', 6500, 300, 15, 'Diesel', 'Manual & Automatic', '5-Seater', 'SUV'),
('Thar Roxx', 'Mahindra', 8000, 300, 15, 'Petrol', 'Manual', '5-Seater', 'SUV'),
('Ertiga', 'Maruti Suzuki', 4000, 300, 10, 'Petrol', 'Manual', '7-Seater', 'MUV'),
('Innova', 'Toyota', 4000, 300, 12, 'Diesel', 'Manual', '7-Seater', 'MUV'),
('XUV500', 'Mahindra', 4000, 300, 12, 'Petrol', 'Manual', '7-Seater', 'SUV'),
('Rumion', 'Toyota', 4500, 300, 10, 'Petrol', 'Manual', '7-Seater', 'MUV'),
('Innova Crysta', 'Toyota', 6500, 300, 15, 'Diesel', 'Manual & Automatic', '7-Seater', 'MUV'),
('XUV700', 'Mahindra', 6500, 300, 15, 'Petrol', 'Manual', '7-Seater', 'SUV'),
('Hycross', 'Toyota', 7500, 300, 15, 'Petrol', 'Automatic', '7-Seater', 'MUV'),
('Fortuner', 'Toyota', 9000, 300, 18, 'Petrol', 'Manual', '7-Seater', 'SUV');