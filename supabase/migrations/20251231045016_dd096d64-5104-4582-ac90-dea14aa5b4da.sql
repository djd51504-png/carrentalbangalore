-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true);

-- Allow anyone to view car images (public bucket)
CREATE POLICY "Car images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

-- Allow anyone to upload car images (for admin demo - in production, add auth)
CREATE POLICY "Anyone can upload car images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'car-images');

-- Allow anyone to update car images
CREATE POLICY "Anyone can update car images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'car-images');

-- Allow anyone to delete car images
CREATE POLICY "Anyone can delete car images"
ON storage.objects FOR DELETE
USING (bucket_id = 'car-images');