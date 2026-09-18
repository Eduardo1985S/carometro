-- ==============================================================================
-- CARÔMETRO SENAI — SCRIPT DE ATUALIZAÇÃO E LIMPEZA DE DADOS MOCKADOS
-- Execute este script no SQL Editor do seu projeto Supabase
-- ==============================================================================

-- 1. Adicionar coluna 'unidade' na tabela 'turmas' (caso ainda não exista)
ALTER TABLE public.turmas 
ADD COLUMN IF NOT EXISTS unidade VARCHAR(50) NOT NULL DEFAULT 'Valinhos' CHECK (unidade IN ('Valinhos', 'Vinhedo'));

-- 2. Atualizar a View do Carômetro Público para expor a Unidade
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

-- 3. Limpeza completa dos dados mockados anteriores
DELETE FROM public.aluno_fotos;
DELETE FROM public.alunos;
DELETE FROM public.turmas;
DELETE FROM public.cursos;

-- 4. Inserção dos 4 Cursos Técnicos Oficiais SENAI
INSERT INTO public.cursos (id, nome, sigla, descricao, ativo) VALUES
('c0000001-0000-0000-0000-000000000001', 'Técnico em Mecânica', 'MEC', 'Formação técnica abrangendo usinagem mecânica, manutenção industrial, projetos de máquinas e processos de manufatura.', true),
('c0000002-0000-0000-0000-000000000002', 'Técnico em Desenvolvimento de Sistemas', 'DS', 'Formação voltada ao desenvolvimento de software, aplicações web, mobile, lógica algorítmica e gestão de bancos de dados.', true),
('c0000003-0000-0000-0000-000000000003', 'Técnico em Eletroeletrônica', 'ELE', 'Projetos e manutenção de circuitos elétricos e eletrônicos, automação de comandos e equipamentos industriais.', true),
('c0000004-0000-0000-0000-000000000004', 'Técnico em Administração', 'ADM', 'Capacitação em processos administrativos, gestão de suprimentos, recursos humanos, finanças e suporte a decisões corporativas.', true)
ON CONFLICT (id) DO UPDATE 
SET nome = EXCLUDED.nome, sigla = EXCLUDED.sigla, descricao = EXCLUDED.descricao, ativo = true;

-- 5. Inserção de Turmas Iniciais Padrão para os Cursos
INSERT INTO public.turmas (id, curso_id, nome, unidade, ano, semestre, turno, ativa) VALUES
('t0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000002', '1DS1', 'Valinhos', 2026, 1, 'Manhã', true),
('t0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', '1MEC1', 'Valinhos', 2026, 1, 'Manhã', true),
('t0000003-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', '1ELE1', 'Valinhos', 2026, 1, 'Noite', true),
('t0000004-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', '1ADM1', 'Valinhos', 2026, 1, 'Tarde', true)
ON CONFLICT (id) DO NOTHING;
