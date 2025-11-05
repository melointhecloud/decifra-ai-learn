-- Create student_progress table to track overall student performance
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  overall_accuracy FLOAT DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create question_attempts table to track every question attempt
CREATE TABLE IF NOT EXISTS public.question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  source TEXT NOT NULL CHECK (source IN ('diagnostic', 'question_bank', 'duel', 'practice')),
  xp_earned INTEGER DEFAULT 0
);

-- Create topic_progress table to track progress per topic
CREATE TABLE IF NOT EXISTS public.topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  diagnostic_accuracy FLOAT DEFAULT 0,
  current_accuracy FLOAT DEFAULT 0,
  questions_attempted INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  average_time INTEGER DEFAULT 0,
  last_practiced TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, topic_name)
);

-- Create daily_activity table for heatmap
CREATE TABLE IF NOT EXISTS public.daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  questions_answered INTEGER DEFAULT 0,
  flashcards_reviewed INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.student_progress TO authenticated;
GRANT SELECT, INSERT ON public.question_attempts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.topic_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.daily_activity TO authenticated;

-- RLS Policies for student_progress
CREATE POLICY "Users can view their own progress"
ON public.student_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.student_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.student_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for question_attempts
CREATE POLICY "Users can view their own attempts"
ON public.question_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts"
ON public.question_attempts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for topic_progress
CREATE POLICY "Users can view their own topic progress"
ON public.topic_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own topic progress"
ON public.topic_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topic progress"
ON public.topic_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for daily_activity
CREATE POLICY "Users can view their own daily activity"
ON public.daily_activity
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activity"
ON public.daily_activity
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activity"
ON public.daily_activity
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_id ON public.question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_question_id ON public.question_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_user_id ON public.topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_id ON public.daily_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activity_date ON public.daily_activity(date);