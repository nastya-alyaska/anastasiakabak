-- Add DELETE policy for site_content so admins/psychologists can delete content
CREATE POLICY "Admins and psychologists can delete site content" 
ON public.site_content 
FOR DELETE 
USING (is_admin_or_psychologist(auth.uid()));