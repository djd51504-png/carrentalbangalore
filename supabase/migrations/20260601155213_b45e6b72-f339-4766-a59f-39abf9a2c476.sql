-- Remove public SELECT policies on storage.objects for car-images to prevent listing/enumeration.
-- Files remain accessible via public CDN URLs (bucket is public); only the list/metadata API is locked down.
DROP POLICY IF EXISTS "Car images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public can view car images" ON storage.objects;

-- Restrict listing/metadata of car-images to admins only.
CREATE POLICY "Admins can list car images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'car-images' AND has_role(auth.uid(), 'admin'::app_role));