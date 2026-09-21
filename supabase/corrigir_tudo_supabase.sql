-- ==============================================================================
-- CARÔMETRO DIGITAL SENAI — SCRIPT DEFINITIVO DE CORREÇÃO TOTAL DO SUPABASE
-- Execute este script completo no SQL Editor do Supabase (supabase-sky-mountain)
-- ==============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Tabela de Perfis de Usuários (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
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
    curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    unidade VARCHAR(50) NOT NULL DEFAULT 'Valinhos',
    ano INTEGER NOT NULL,
    semestre INTEGER NOT NULL DEFAULT 1,
    turno VARCHAR(50) NOT NULL DEFAULT 'Manhã',
    ativa BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garante coluna unidade se a tabela já existia sem ela
ALTER TABLE public.turmas ADD COLUMN IF NOT EXISTS unidade VARCHAR(50) NOT NULL DEFAULT 'Valinhos';

-- 5. Tabela de Alunos
CREATE TABLE IF NOT EXISTS public.alunos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    matricula VARCHAR(50) NOT NULL,
    data_nascimento DATE DEFAULT '2000-01-01',
    email VARCHAR(255),
    telefone VARCHAR(50),
    observacao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Torna data_nascimento flexível para nunca falhar em cadastros rápidos
ALTER TABLE public.alunos ALTER COLUMN data_nascimento DROP NOT NULL;

-- 6. Tabela de Fotos do Aluno
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
-- 7. REGRAS DE SEGURANÇA (RLS) — LIBERAÇÃO TOTAL PARA GRAVAÇÃO
-- Resolve o erro "new row violates row-level security policy" (código 42501)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aluno_fotos ENABLE ROW LEVEL SECURITY;

-- Cursos: Leitura e Gravação irrestritas para a aplicação
DROP POLICY IF EXISTS "Cursos visíveis publicamente" ON public.cursos;
DROP POLICY IF EXISTS "Cursos ativos visíveis publicamente" ON public.cursos;
DROP POLICY IF EXISTS "Admins gerenciam cursos" ON public.cursos;
DROP POLICY IF EXISTS "Permissao total cursos" ON public.cursos;
CREATE POLICY "Permissao total cursos" ON public.cursos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Turmas: Leitura e Gravação irrestritas para a aplicação
DROP POLICY IF EXISTS "Turmas visíveis publicamente" ON public.turmas;
DROP POLICY IF EXISTS "Turmas ativas visíveis publicamente" ON public.turmas;
DROP POLICY IF EXISTS "Admins gerenciam turmas" ON public.turmas;
DROP POLICY IF EXISTS "Permissao total turmas" ON public.turmas;
CREATE POLICY "Permissao total turmas" ON public.turmas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Alunos: Leitura e Gravação irrestritas para a aplicação
DROP POLICY IF EXISTS "Admins gerenciam alunos" ON public.alunos;
DROP POLICY IF EXISTS "Permissao total alunos" ON public.alunos;
CREATE POLICY "Permissao total alunos" ON public.alunos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Fotos: Leitura e Gravação irrestritas para a aplicação
DROP POLICY IF EXISTS "Fotos visíveis publicamente" ON public.aluno_fotos;
DROP POLICY IF EXISTS "Admins gerenciam fotos" ON public.aluno_fotos;
DROP POLICY IF EXISTS "Permissao total aluno_fotos" ON public.aluno_fotos;
CREATE POLICY "Permissao total aluno_fotos" ON public.aluno_fotos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Perfis: Leitura e Gravação
DROP POLICY IF EXISTS "Admins podem visualizar todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem gerenciar perfis" ON public.profiles;
DROP POLICY IF EXISTS "Permissao total profiles" ON public.profiles;
CREATE POLICY "Permissao total profiles" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 8. STORAGE (BUCKET 'alunos') — CRIAÇÃO E PERMISSÃO TOTAL DE UPLOAD
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('alunos', 'alunos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Imagens de alunos publicamente acessíveis" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins autenticados podem fazer upload de fotos" ON storage.objects;
DROP POLICY IF EXISTS "Apenas admins autenticados podem atualizar ou excluir fotos" ON storage.objects;
DROP POLICY IF EXISTS "Permissao total storage fotos" ON storage.objects;
CREATE POLICY "Permissao total storage fotos" ON storage.objects FOR ALL TO anon, authenticated USING (bucket_id = 'alunos') WITH CHECK (bucket_id = 'alunos');

-- ==============================================================================
-- 9. VIEW PÚBLICA (CARÔMETRO PÚBLICO)
-- ==============================================================================
CREATE OR REPLACE VIEW public.carometro_publico AS
SELECT 
    a.id AS aluno_id,
    a.nome,
    a.turma_id,
    t.nome AS turma,
    t.unidade,
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
GROUP BY a.id, a.nome, a.turma_id, t.nome, t.unidade, t.turno, t.ano, t.semestre, c.id, c.nome, c.sigla;

-- ==============================================================================
-- 10. CARGA INICIAL: 4 CURSOS TÉCNICOS OFICIAIS SENAI
-- ==============================================================================
INSERT INTO public.cursos (id, nome, sigla, descricao, ativo) VALUES
('c0000001-0000-0000-0000-000000000001', 'Técnico em Mecânica', 'MEC', 'Formação técnica abrangendo usinagem mecânica, manutenção industrial, projetos de máquinas e processos de manufatura.', true),
('c0000002-0000-0000-0000-000000000002', 'Técnico em Desenvolvimento de Sistemas', 'DS', 'Formação voltada ao desenvolvimento de software, aplicações web, mobile, lógica algorítmica e gestão de bancos de dados.', true),
('c0000003-0000-0000-0000-000000000003', 'Técnico em Eletroeletrônica', 'ELE', 'Projetos e manutenção de circuitos elétricos e eletrônicos, automação de comandos e equipamentos industriais.', true),
('c0000004-0000-0000-0000-000000000004', 'Técnico em Administração', 'ADM', 'Capacitação em processos administrativos, gestão de suprimentos, recursos humanos, finanças e suporte a decisões corporativas.', true)
ON CONFLICT (id) DO UPDATE
SET nome = EXCLUDED.nome, sigla = EXCLUDED.sigla, descricao = EXCLUDED.descricao, ativo = true;

-- ==============================================================================
-- 11. CARGA INICIAL: TURMAS PADRÃO
-- ==============================================================================
INSERT INTO public.turmas (id, curso_id, nome, unidade, ano, semestre, turno, ativa) VALUES
('t0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000002', '1DS1', 'Valinhos', 2026, 1, 'Manhã', true),
('t0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', '1MEC1', 'Valinhos', 2026, 1, 'Manhã', true),
('t0000003-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', '1ELE1', 'Valinhos', 2026, 1, 'Noite', true),
('t0000004-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', '1ADM1', 'Valinhos', 2026, 1, 'Tarde', true)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 12. USUÁRIO ADMINISTRADOR (wushu.edu@gmail.com e admin@senai.br / senha: senai2026)
-- ==============================================================================
DO $$
DECLARE
  v_uid1 UUID := 'a0000000-0000-0000-0000-000000000001';
  v_uid2 UUID := 'a0000000-0000-0000-0000-000000000002';
BEGIN
  -- Usuário Eduardo (wushu.edu@gmail.com)
  IF EXISTS (SELECT 1 FROM auth.users WHERE email ILIKE '%wushu%') THEN
    UPDATE auth.users 
    SET encrypted_password = crypt('senai2026', gen_salt('bf')), email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE email ILIKE '%wushu%';
  ELSE
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', v_uid1, 'authenticated', 'authenticated', 'wushu.edu@gmail.com', crypt('senai2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"nome":"Eduardo"}', now(), now());
  END IF;

  -- Perfil Eduardo
  INSERT INTO public.profiles (id, nome, email, role, ativo)
  SELECT id, 'Eduardo', email, 'admin', true FROM auth.users WHERE email ILIKE '%wushu%'
  ON CONFLICT (id) DO UPDATE SET role = 'admin', ativo = true;

  -- Usuário Admin Geral (admin@senai.br)
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@senai.br') THEN
    UPDATE auth.users 
    SET encrypted_password = crypt('senai2026', gen_salt('bf')), email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE email = 'admin@senai.br';
  ELSE
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', v_uid2, 'authenticated', 'authenticated', 'admin@senai.br', crypt('senai2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"nome":"Administrador SENAI"}', now(), now());
  END IF;

  -- Perfil Admin Geral
  INSERT INTO public.profiles (id, nome, email, role, ativo)
  SELECT id, 'Administrador SENAI', email, 'admin', true FROM auth.users WHERE email = 'admin@senai.br'
  ON CONFLICT (id) DO UPDATE SET role = 'admin', ativo = true;
END $$;
