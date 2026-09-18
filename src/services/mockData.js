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

// Turmas iniciais padronizadas para cada um dos 4 cursos técnicos oficiais
export const INITIAL_TURMAS = [
  {
    id: 't_ds_1',
    curso_id: 'c2',
    nome: '1DS1',
    unidade: 'Valinhos',
    ano: 2026,
    semestre: 1,
    turno: 'Manhã',
    ativa: true,
    created_at: new Date().toISOString()
  },
  {
    id: 't_mec_1',
    curso_id: 'c1',
    nome: '1MEC1',
    unidade: 'Valinhos',
    ano: 2026,
    semestre: 1,
    turno: 'Manhã',
    ativa: true,
    created_at: new Date().toISOString()
  },
  {
    id: 't_ele_1',
    curso_id: 'c3',
    nome: '1ELE1',
    unidade: 'Valinhos',
    ano: 2026,
    semestre: 1,
    turno: 'Noite',
    ativa: true,
    created_at: new Date().toISOString()
  },
  {
    id: 't_adm_1',
    curso_id: 'c4',
    nome: '1ADM1',
    unidade: 'Valinhos',
    ano: 2026,
    semestre: 1,
    turno: 'Tarde',
    ativa: true,
    created_at: new Date().toISOString()
  }
];

// Alunos vazios por padrão (cadastrados pelo usuário)
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
