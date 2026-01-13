-- Drop existing overly permissive storage policies
DROP POLICY IF EXISTS "Anyone can upload car images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update car images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete car images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view car images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload car images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update car images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete car images" ON storage.objects;

-- Create admin-only policies for write operations
CREATE POLICY "Admin can upload car images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'car-images' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admin can update car images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'car-images' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admin can delete car images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'car-images' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Keep public read access for car images (intentional - needed for website display)
CREATE POLICY "Public can view car images"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');