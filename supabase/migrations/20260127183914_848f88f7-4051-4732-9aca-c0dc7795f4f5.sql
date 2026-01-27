-- Add DELETE policy for profiles table (GDPR compliance)
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (user_id = auth.uid());

-- Add DELETE policy for admins to delete any profile
CREATE POLICY "Admins can delete any profile" 
ON public.profiles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Drop the overly permissive INSERT policy on visitor_analytics
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.visitor_analytics;

-- Create a more restrictive INSERT policy that requires a service role or edge function
-- Analytics will now only be insertable via edge function with proper validation
CREATE POLICY "Service role can insert analytics" 
ON public.visitor_analytics 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Add constraints to prevent data pollution
ALTER TABLE public.visitor_analytics
ADD CONSTRAINT visitor_analytics_page_path_length CHECK (char_length(page_path) <= 500),
ADD CONSTRAINT visitor_analytics_visitor_id_length CHECK (char_length(visitor_id) <= 100),
ADD CONSTRAINT visitor_analytics_referrer_length CHECK (char_length(referrer) <= 2000),
ADD CONSTRAINT visitor_analytics_user_agent_length CHECK (char_length(user_agent) <= 1000),
ADD CONSTRAINT visitor_analytics_device_type_valid CHECK (device_type IN ('desktop', 'mobile', 'tablet') OR device_type IS NULL);