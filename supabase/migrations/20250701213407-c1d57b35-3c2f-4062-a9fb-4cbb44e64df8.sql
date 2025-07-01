
-- Criar tabela de participantes
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  total_score INTEGER NOT NULL DEFAULT 0,
  chapters_completed INTEGER NOT NULL DEFAULT 0,
  current_book TEXT,
  current_chapter INTEGER NOT NULL DEFAULT 1,
  join_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de cronogramas de leitura
CREATE TABLE public.reading_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES public.participants(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de perguntas de quiz
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  created_by UUID REFERENCES public.participants(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de resultados de quiz
CREATE TABLE public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES public.participants(id) NOT NULL,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  questions JSONB NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Políticas para participants (todos podem ver, apenas o próprio pode modificar)
CREATE POLICY "Todos podem ver participantes" ON public.participants FOR SELECT USING (true);
CREATE POLICY "Apenas admins podem criar participantes" ON public.participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Apenas próprio usuário pode atualizar" ON public.participants FOR UPDATE USING (id = auth.uid() OR EXISTS (SELECT 1 FROM public.participants WHERE id = auth.uid() AND is_admin = true));

-- Políticas para reading_schedules (todos podem ver, apenas admins podem modificar)
CREATE POLICY "Todos podem ver cronogramas" ON public.reading_schedules FOR SELECT USING (true);
CREATE POLICY "Apenas admins podem criar cronogramas" ON public.reading_schedules FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.participants WHERE id = created_by AND is_admin = true));
CREATE POLICY "Apenas admins podem atualizar cronogramas" ON public.reading_schedules FOR UPDATE USING (EXISTS (SELECT 1 FROM public.participants WHERE id = auth.uid() AND is_admin = true));

-- Políticas para quiz_questions (todos podem ver, apenas admins podem modificar)
CREATE POLICY "Todos podem ver perguntas" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Apenas admins podem criar perguntas" ON public.quiz_questions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.participants WHERE id = created_by AND is_admin = true));
CREATE POLICY "Apenas admins podem atualizar perguntas" ON public.quiz_questions FOR UPDATE USING (EXISTS (SELECT 1 FROM public.participants WHERE id = auth.uid() AND is_admin = true));

-- Políticas para quiz_results (apenas próprio usuário pode ver e criar)
CREATE POLICY "Usuários podem ver próprios resultados" ON public.quiz_results FOR SELECT USING (participant_id = auth.uid() OR EXISTS (SELECT 1 FROM public.participants WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Usuários podem criar próprios resultados" ON public.quiz_results FOR INSERT WITH CHECK (participant_id = auth.uid());

-- Inserir participante admin padrão
INSERT INTO public.participants (name, email, is_admin, total_score, chapters_completed)
VALUES ('Pastor João', 'pastor@igreja.com', true, 850, 15);

-- Inserir alguns participantes de exemplo
INSERT INTO public.participants (name, email, total_score, chapters_completed)
VALUES 
  ('Maria Silva', 'maria@email.com', 720, 12),
  ('Ana Costa', 'ana@email.com', 950, 18);

-- Inserir cronograma ativo inicial
INSERT INTO public.reading_schedules (book_id, is_active, created_by)
VALUES ('genesis', true, (SELECT id FROM public.participants WHERE email = 'pastor@igreja.com'));

-- Inserir algumas perguntas de exemplo
INSERT INTO public.quiz_questions (book_id, chapter, question, options, correct_answer, explanation, created_by)
VALUES 
  ('genesis', 1, 'Quantos dias Deus levou para criar o mundo?', '["5 dias", "6 dias", "7 dias", "8 dias"]', 1, 'Deus criou o mundo em 6 dias e descansou no sétimo dia.', (SELECT id FROM public.participants WHERE email = 'pastor@igreja.com')),
  ('genesis', 1, 'O que Deus criou no primeiro dia?', '["Os animais", "A luz", "As plantas", "O homem"]', 1, 'No primeiro dia, Deus disse: "Haja luz", e houve luz.', (SELECT id FROM public.participants WHERE email = 'pastor@igreja.com')),
  ('genesis', 1, 'Em que dia Deus criou o homem?', '["Quinto dia", "Sexto dia", "Sétimo dia", "Primeiro dia"]', 1, 'Deus criou o homem no sexto dia, à sua imagem e semelhança.', (SELECT id FROM public.participants WHERE email = 'pastor@igreja.com'));
