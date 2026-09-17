-- ==============================================================================
-- CARÔMETRO DIGITAL SENAI — ESQUEMA COMPLETO DO BANCO DE DADOS (SUPABASE POSTGRES)
-- ==============================================================================

-- 1. Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Perfis de Usuários (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'professor')),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Cursos
CREATE TABLE IF NOT EXISTS public.cursos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    sigla VARCHAR(20) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Turmas
CREATE TABLE IF NOT EXISTS public.turmas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE RESTRICT,
    nome VARCHAR(100) NOT NULL,
    ano INTEGER NOT NULL,
    semestre INTEGER NOT NULL CHECK (semestre IN (1, 2)),
    turno VARCHAR(50) NOT NULL CHECK (turno IN ('Manhã', 'Tarde', 'Noite', 'Integral')),
    ativa BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Alunos (com dados cadastrais completos)
CREATE TABLE IF NOT EXISTS public.alunos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE RESTRICT,
    nome VARCHAR(255) NOT NULL,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(50),
    observacao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela de Fotos do Aluno (Múltiplas Fotos + Thumbnails + Ordem)
CREATE TABLE IF NOT EXISTS public.aluno_fotos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
    arquivo TEXT NOT NULL,
    thumbnail TEXT,
    principal BOOLEAN NOT NULL DEFAULT false,
    ordem INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_turmas_curso_id ON public.turmas(curso_id);
CREATE INDEX IF NOT EXISTS idx_alunos_turma_id ON public.alunos(turma_id);
CREATE INDEX IF NOT EXISTS idx_alunos_nome ON public.alunos(nome);
CREATE INDEX IF NOT EXISTS idx_aluno_fotos_aluno_id ON public.aluno_fotos(aluno_id);

-- ==============================================================================
-- 7. VIEW PÚBLICA (CARÔMETRO PÚBLICO - SEGURANÇA & PRIVACIDADE)
-- Omite dados sensíveis como matrícula, email, telefone, data_nascimento, observações
-- ==============================================================================
CREATE OR REPLACE VIEW public.carometro_publico AS
SELECT 
    a.id AS aluno_id,
    a.nome,
    a.turma_id,
    t.nome AS turma,
    t.turno,
    t.ano,
    t.semestre,
    c.id AS curso_id,
    c.nome AS curso,
    c.sigla AS curso_sigla,
    COALESCE(
        json_agg(
            json_build_object(
                'id', f.id,
                'arquivo', f.arquivo,
                'thumbnail', COALESCE(f.thumbnail, f.arquivo),
                'principal', f.principal,
                'ordem', f.ordem
            ) ORDER BY f.principal DESC, f.ordem ASC
        ) FILTER (WHERE f.id IS NOT NULL), 
        '[]'::json
    ) AS fotos
FROM public.alunos a
JOIN public.turmas t ON a.turma_id = t.id
JOIN public.cursos c ON t.curso_id = c.id
LEFT JOIN public.aluno_fotos f ON a.id = f.aluno_id
WHERE a.ativo = true AND t.ativa = true AND c.ativo = true
GROUP BY a.id, a.nome, a.turma_id, t.nome, t.turno, t.ano, t.semestre, c.id, c.nome, c.sigla;

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aluno_fotos ENABLE ROW LEVEL SECURITY;

-- Regras para Perfis (Admin acessa tudo, usuário acessa próprio perfil)
CREATE POLICY "Admins podem visualizar todos os perfis" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin' AND ativo = true)
    OR auth.uid() = id
);

CREATE POLICY "Admins podem gerenciar perfis" 
ON public.profiles FOR ALL 
TO authenticated 
USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin' AND ativo = true)
);

-- Regras para Cursos (Público apenas leitura de ativos; Admin gerencia)
CREATE POLICY "Cursos ativos visíveis publicamente" 
ON public.cursos FOR SELECT 
TO anon, authenticated 
USING (ativo = true);

CREATE POLICY "Admins gerenciam cursos" 
ON public.cursos FOR ALL 
TO authenticated 
USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin' AND ativo = true)
);

-- Regras para Turmas (Público apenas leitura de ativas; Admin gerencia)
CREATE POLICY "Turmas ativas visíveis publicamente" 
ON public.turmas FOR SELECT 
TO anon, authenticated 
USING (ativa = true);

CREATE POLICY "Admins gerenciam turmas" 
ON public.turmas FOR ALL 
TO authenticated 
USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin' AND ativo = true)
);

-- Regras para Alunos (Público NÃO lê tabela direta de alunos; apenas Admin)
CREATE POLICY "Admins gerenciam alunos" 
ON public.alunos FOR ALL 
TO authenticated 
USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin' AND ativo = true)
);

-- Regras para Fotos (Público lê fotos de alunos ativos; Admin gerencia)
CREATE POLICY "Fotos visíveis publicamente" 
ON public.aluno_fotos FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Admins gerenciam fotos" 
ON public.aluno_fotos FOR ALL 
TO authenticated 
USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin' AND ativo = true)
);

-- ==============================================================================
-- 9. CONFIGURAÇÃO DO STORAGE SUPABASE (Bucket 'alunos')
-- ==============================================================================
-- Inserir bucket se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('alunos', 'alunos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso ao Storage 'alunos'
CREATE POLICY "Imagens de alunos publicamente acessíveis"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'alunos');

CREATE POLICY "Apenas admins autenticados podem fazer upload de fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'alunos');

CREATE POLICY "Apenas admins autenticados podem atualizar ou excluir fotos"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'alunos');

-- ==============================================================================
-- 10. DADOS INICIAIS DE DEMONSTRAÇÃO (SEED)
-- ==============================================================================
INSERT INTO public.cursos (id, nome, sigla, descricao, ativo) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Técnico em Desenvolvimento de Sistemas', 'TDS', 'Formação técnica voltada à criação de aplicações web, mobile e sistemas corporativos.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Técnico em Mecatrônica', 'MEC', 'Integração de mecânica de precisão, eletrônica e controle computacional.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Técnico em Eletrotécnica', 'ELE', 'Projetos elétricos industriais e residenciais, automação e eficiência energética.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Técnico em Automação Industrial', 'AUT', 'Implementação e manutenção de robôs industriais e controladores lógicos.', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.turmas (id, curso_id, nome, ano, semestre, turno, ativa) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1TDS1', 2026, 1, 'Manhã', true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1TDS2', 2026, 1, 'Tarde', true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2TDS1', 2026, 2, 'Manhã', true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '1MEC1', 2026, 1, 'Integral', true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '2ELE1', 2026, 2, 'Noite', true)
ON CONFLICT (id) DO NOTHING;
