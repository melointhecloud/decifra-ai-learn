-- First, let's make sure the RLS policy is correct
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create a clear policy for users to read their own role
CREATE POLICY "Users can read their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Insert role assignments for existing users
-- Student user
INSERT INTO public.user_roles (user_id, role)
VALUES ('a2af50da-a1ab-4218-8874-91946f941eb6', 'student')
ON CONFLICT (user_id, role) DO NOTHING;

-- Teacher user
INSERT INTO public.user_roles (user_id, role)
VALUES ('ff7dcaaa-5039-441f-bf3e-7c2f26e6e62c', 'teacher')
ON CONFLICT (user_id, role) DO NOTHING;