-- Grant necessary permissions on diagnostic_results table
GRANT SELECT, INSERT ON public.diagnostic_results TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Students can view their own results" ON public.diagnostic_results;
DROP POLICY IF EXISTS "Students can insert their own results" ON public.diagnostic_results;

-- Recreate policies with proper configuration
CREATE POLICY "Students can view their own results"
ON public.diagnostic_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own results"
ON public.diagnostic_results
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);