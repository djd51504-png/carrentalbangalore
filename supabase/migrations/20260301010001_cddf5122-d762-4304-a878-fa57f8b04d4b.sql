-- Remove public read access from settings table
DROP POLICY IF EXISTS "Anyone can view settings" ON public.settings;

-- Create admin-only read policy
CREATE POLICY "Admins can view settings"
ON public.settings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));