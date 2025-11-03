-- Grant necessary permissions to authenticated users on the public schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant SELECT permission on user_roles table to authenticated users
GRANT SELECT ON public.user_roles TO authenticated;

-- Ensure the RLS policy exists and is correct
DROP POLICY IF EXISTS "Users can read their own role" ON public.user_roles;

CREATE POLICY "Users can read their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);