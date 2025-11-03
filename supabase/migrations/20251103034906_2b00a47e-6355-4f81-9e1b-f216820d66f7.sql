-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('student', 'teacher');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create diagnostic_results table
CREATE TABLE public.diagnostic_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  performance_level TEXT NOT NULL,
  weak_topics JSONB,
  strong_topics JSONB,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  alternatives JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty_level TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for diagnostic_results
CREATE POLICY "Students can view their own results"
ON public.diagnostic_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own results"
ON public.diagnostic_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for questions
CREATE POLICY "Authenticated users can view questions"
ON public.questions FOR SELECT
TO authenticated
USING (true);

-- Create trigger function for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', '')
  );
  RETURN new;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed 20 sample math questions
INSERT INTO public.questions (question_text, alternatives, correct_answer, topic, difficulty_level, explanation) VALUES
('Qual é o resultado de 2 + 2?', '["2", "3", "4", "5"]', '4', 'Aritmética Básica', 'Básico', 'A adição de 2 + 2 resulta em 4.'),
('Resolva: 15 - 7 = ?', '["6", "7", "8", "9"]', '8', 'Aritmética Básica', 'Básico', 'Subtraindo 7 de 15, temos 15 - 7 = 8.'),
('Quanto é 6 × 8?', '["42", "48", "54", "56"]', '48', 'Multiplicação', 'Básico', 'A multiplicação de 6 por 8 resulta em 48.'),
('Calcule: 36 ÷ 4 = ?', '["8", "9", "10", "12"]', '9', 'Divisão', 'Básico', 'Dividindo 36 por 4, obtemos 9.'),
('Qual é 25% de 200?', '["25", "50", "75", "100"]', '50', 'Porcentagem', 'Intermediário', '25% de 200 = 0,25 × 200 = 50.'),
('Se x + 5 = 12, qual é o valor de x?', '["5", "6", "7", "8"]', '7', 'Álgebra', 'Intermediário', 'Isolando x: x = 12 - 5 = 7.'),
('Qual é a raiz quadrada de 64?', '["6", "7", "8", "9"]', '8', 'Raízes', 'Intermediário', '√64 = 8, pois 8² = 64.'),
('Resolva: 3x = 21', '["5", "6", "7", "8"]', '7', 'Álgebra', 'Intermediário', 'Dividindo ambos os lados por 3: x = 21 ÷ 3 = 7.'),
('Qual é o próximo número na sequência: 2, 4, 8, 16, ?', '["20", "24", "30", "32"]', '32', 'Sequências', 'Intermediário', 'Cada número é o dobro do anterior: 16 × 2 = 32.'),
('Calcule: (5 + 3) × 2 = ?', '["10", "13", "16", "18"]', '16', 'Ordem de Operações', 'Intermediário', 'Primeiro resolvemos o parênteses: 8 × 2 = 16.'),
('Se um triângulo tem ângulos de 60°, 60° e x°, qual é x?', '["30", "45", "60", "90"]', '60', 'Geometria', 'Intermediário', 'A soma dos ângulos de um triângulo é 180°. Logo, x = 180 - 60 - 60 = 60.'),
('Resolva: 2x + 5 = 15', '["3", "4", "5", "6"]', '5', 'Álgebra', 'Intermediário', '2x = 15 - 5 = 10, então x = 10 ÷ 2 = 5.'),
('Qual é 1/4 de 80?', '["15", "20", "25", "30"]', '20', 'Frações', 'Básico', '1/4 de 80 = 80 ÷ 4 = 20.'),
('Se 3 maçãs custam R$6, quanto custam 5 maçãs?', '["R$8", "R$9", "R$10", "R$12"]', 'R$10', 'Proporção', 'Intermediário', 'Cada maçã custa R$2. Portanto, 5 maçãs custam 5 × 2 = R$10.'),
('Qual é o perímetro de um quadrado com lado 5 cm?', '["15 cm", "20 cm", "25 cm", "30 cm"]', '20 cm', 'Geometria', 'Básico', 'Perímetro do quadrado = 4 × lado = 4 × 5 = 20 cm.'),
('Resolva: x² = 49', '["5", "6", "7", "8"]', '7', 'Equações Quadráticas', 'Avançado', 'A raiz quadrada de 49 é 7, então x = 7.'),
('Qual é a média de 10, 20 e 30?', '["15", "18", "20", "25"]', '20', 'Estatística', 'Intermediário', 'Média = (10 + 20 + 30) ÷ 3 = 60 ÷ 3 = 20.'),
('Se um número aumenta 50% e depois diminui 50%, qual é o resultado?', '["Mesmo valor", "25% menor", "25% maior", "50% menor"]', '25% menor', 'Porcentagem', 'Avançado', 'Exemplo: 100 → 150 (aumento de 50%) → 75 (redução de 50% de 150) = 25% menor que o original.'),
('Qual é o valor de 2³ + 3²?', '["13", "15", "17", "19"]', '17', 'Potências', 'Intermediário', '2³ = 8 e 3² = 9, então 8 + 9 = 17.'),
('Um produto custa R$120 com 20% de desconto. Qual era o preço original?', '["R$140", "R$144", "R$150", "R$160"]', 'R$150', 'Porcentagem', 'Avançado', 'Se R$120 é 80% do preço (100% - 20%), então 100% = 120 ÷ 0,8 = R$150.');