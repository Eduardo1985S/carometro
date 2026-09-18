// ==============================================================================
// CARÔMETRO DIGITAL SENAI — DADOS INICIAIS PADRONIZADOS
// ==============================================================================

export const INITIAL_CURSOS = [
  {
    id: 'c1',
    nome: 'Técnico em Mecânica',
    sigla: 'MEC',
    descricao: 'Processos de usinagem e fabricação mecânica, manutenção de máquinas e equipamentos industriais, conformação mecânica e projetos.',
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'c2',
    nome: 'Técnico em Desenvolvimento de Sistemas',
    sigla: 'DS',
    descricao: 'Desenvolvimento e modelagem de software, programação para web e mobile, banco de dados, arquitetura de sistemas e segurança.',
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'c3',
    nome: 'Técnico em Eletroeletrônica',
    sigla: 'ELE',
    descricao: 'Instalações elétricas industriais e prediais, eletrônica analógica e digital, circuitos integrados, sensores e automação.',
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'c4',
    nome: 'Técnico em Administração',
    sigla: 'ADM',
    descricao: 'Gestão de processos organizacionais, rotinas financeiras, contábeis e fiscais, logística, gestão de pessoas e planejamento comercial.',
    ativo: true,
    created_at: new Date().toISOString()
  }
];

// Turmas vazias por padrão (gerenciadas via Supabase ou cadastro local)
export const INITIAL_TURMAS = [];

// Alunos vazios por padrão (gerenciados via Supabase ou cadastro local)
export const INITIAL_ALUNOS = [];

// Usuários administrativos padrão para testes/demo
export const INITIAL_USERS = [
  {
    id: 'u1',
    email: 'admin@senai.br',
    nome: 'Administrador SENAI',
    role: 'admin',
    ativo: true
  }
];
