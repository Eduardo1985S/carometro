// Dados iniciais e demonstração realista para o Carômetro Digital SENAI

export const INITIAL_CURSOS = [
  {
    id: 'c1',
    nome: 'Técnico em Desenvolvimento de Sistemas',
    sigla: 'TDS',
    descricao: 'Formação técnica focada em desenvolvimento web, mobile, APIs e arquitetura de software moderna.',
    ativo: true,
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'c2',
    nome: 'Técnico em Mecatrônica',
    sigla: 'MEC',
    descricao: 'Integração de mecânica de precisão, eletrônica, robótica e controle computacional.',
    ativo: true,
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'c3',
    nome: 'Técnico em Eletrotécnica',
    sigla: 'ELE',
    descricao: 'Projetos elétricos industriais e prediais, automação predial e eficiência energética.',
    ativo: true,
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'c4',
    nome: 'Técnico em Automação Industrial',
    sigla: 'AUT',
    descricao: 'Programação de CLPs, robótica industrial, sensores e controle de processos industriais.',
    ativo: true,
    created_at: '2026-01-15T08:00:00Z'
  }
];

export const INITIAL_TURMAS = [
  {
    id: 't1',
    curso_id: 'c1',
    nome: '2TDS1',
    ano: 2026,
    semestre: 1,
    turno: 'Manhã',
    ativa: true,
    created_at: '2026-02-01T08:00:00Z'
  },
  {
    id: 't2',
    curso_id: 'c1',
    nome: '2TDS2',
    ano: 2026,
    semestre: 1,
    turno: 'Tarde',
    ativa: true,
    created_at: '2026-02-01T08:00:00Z'
  },
  {
    id: 't3',
    curso_id: 'c1',
    nome: '1TDS1',
    ano: 2026,
    semestre: 1,
    turno: 'Manhã',
    ativa: true,
    created_at: '2026-02-01T08:00:00Z'
  },
  {
    id: 't4',
    curso_id: 'c2',
    nome: '1MEC1',
    ano: 2026,
    semestre: 1,
    turno: 'Integral',
    ativa: true,
    created_at: '2026-02-01T08:00:00Z'
  },
  {
    id: 't5',
    curso_id: 'c3',
    nome: '2ELE1',
    ano: 2026,
    semestre: 1,
    turno: 'Noite',
    ativa: true,
    created_at: '2026-02-01T08:00:00Z'
  },
  {
    id: 't6',
    curso_id: 'c4',
    nome: '1AUT1',
    ano: 2026,
    semestre: 1,
    turno: 'Tarde',
    ativa: true,
    created_at: '2026-02-01T08:00:00Z'
  }
];

export const INITIAL_ALUNOS = [
  {
    id: 'a1',
    turma_id: 't1',
    nome: 'Ana Carolina Mendonça',
    matricula: '20261001',
    data_nascimento: '2008-04-12',
    email: 'ana.mendonca@aluno.senai.br',
    telefone: '(11) 98765-4321',
    observacao: 'Líder de turma. Excelente desempenho em Front-End.',
    ativo: true,
    created_at: '2026-02-05T10:00:00Z',
    fotos: [
      {
        id: 'f1-1',
        arquivo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=70',
        principal: true,
        ordem: 1
      },
      {
        id: 'f1-2',
        arquivo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=70',
        principal: false,
        ordem: 2
      }
    ]
  },
  {
    id: 'a2',
    turma_id: 't1',
    nome: 'Bruno Henrique Silva',
    matricula: '20261002',
    data_nascimento: '2007-09-23',
    email: 'bruno.silva@aluno.senai.br',
    telefone: '(11) 97654-3210',
    observacao: 'Interesse em banco de dados e backend Node.js.',
    ativo: true,
    created_at: '2026-02-05T10:05:00Z',
    fotos: [
      {
        id: 'f2-1',
        arquivo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=70',
        principal: true,
        ordem: 1
      },
      {
        id: 'f2-2',
        arquivo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=70',
        principal: false,
        ordem: 2
      }
    ]
  },
  {
    id: 'a3',
    turma_id: 't1',
    nome: 'Camila Fernandes Lima',
    matricula: '20261003',
    data_nascimento: '2008-01-18',
    email: 'camila.lima@aluno.senai.br',
    telefone: '(11) 96543-2109',
    observacao: 'Participante do Grand Prix SENAI de Inovação.',
    ativo: true,
    created_at: '2026-02-05T10:10:00Z',
    fotos: [
      {
        id: 'f3-1',
        arquivo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=70',
        principal: true,
        ordem: 1
      },
      {
        id: 'f3-2',
        arquivo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=70',
        principal: false,
        ordem: 2
      }
    ]
  },
  {
    id: 'a4',
    turma_id: 't1',
    nome: 'Diego Alves Santos',
    matricula: '20261004',
    data_nascimento: '2007-11-05',
    email: 'diego.santos@aluno.senai.br',
    telefone: '(11) 95432-1098',
    observacao: 'Monitor de laboratório.',
    ativo: true,
    created_at: '2026-02-05T10:15:00Z',
    fotos: [
      {
        id: 'f4-1',
        arquivo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=70',
        principal: true,
        ordem: 1
      }
    ]
  },
  {
    id: 'a5',
    turma_id: 't1',
    nome: 'Eduarda Martins Ramos',
    matricula: '20261005',
    data_nascimento: '2008-07-30',
    email: 'eduarda.martins@aluno.senai.br',
    telefone: '(11) 94321-0987',
    observacao: 'Foco em UI/UX e design de interfaces.',
    ativo: true,
    created_at: '2026-02-05T10:20:00Z',
    fotos: [
      {
        id: 'f5-1',
        arquivo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=70',
        principal: true,
        ordem: 1
      },
      {
        id: 'f5-2',
        arquivo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=70',
        principal: false,
        ordem: 2
      }
    ]
  },
  {
    id: 'a6',
    turma_id: 't1',
    nome: 'Felipe Gabriel Souza',
    matricula: '20261006',
    data_nascimento: '2007-06-14',
    email: 'felipe.souza@aluno.senai.br',
    telefone: '(11) 93210-9876',
    observacao: 'Projeto integrador voltado a IoT.',
    ativo: true,
    created_at: '2026-02-05T10:25:00Z',
    fotos: [
      {
        id: 'f6-1',
        arquivo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=70',
        principal: true,
        ordem: 1
      }
    ]
  },
  {
    id: 'a7',
    turma_id: 't1',
    nome: 'Gabriela Vasconcelos',
    matricula: '20261007',
    data_nascimento: '2008-03-09',
    email: 'gabriela.vasconcelos@aluno.senai.br',
    telefone: '(11) 92109-8765',
    observacao: 'Bolsista de iniciação tecnológica.',
    ativo: true,
    created_at: '2026-02-05T10:30:00Z',
    fotos: [
      {
        id: 'f7-1',
        arquivo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=70',
        principal: true,
        ordem: 1
      }
    ]
  },
  {
    id: 'a8',
    turma_id: 't1',
    nome: 'Henrique Oliveira Costa',
    matricula: '20261008',
    data_nascimento: '2007-12-01',
    email: 'henrique.costa@aluno.senai.br',
    telefone: '(11) 91098-7654',
    observacao: 'Destaque em lógica de programação.',
    ativo: true,
    created_at: '2026-02-05T10:35:00Z',
    fotos: [
      {
        id: 'f8-1',
        arquivo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=70',
        principal: true,
        ordem: 1
      }
    ]
  },
  {
    id: 'a9',
    turma_id: 't2',
    nome: 'Isabela Rocha Pinheiro',
    matricula: '20262001',
    data_nascimento: '2008-05-19',
    email: 'isabela.rocha@aluno.senai.br',
    telefone: '(11) 90987-6543',
    observacao: 'Foco em desenvolvimento mobile.',
    ativo: true,
    created_at: '2026-02-05T11:00:00Z',
    fotos: [
      {
        id: 'f9-1',
        arquivo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=70',
        principal: true,
        ordem: 1
      }
    ]
  },
  {
    id: 'a10',
    turma_id: 't4',
    nome: 'Lucas Barreto Prado',
    matricula: '20263001',
    data_nascimento: '2007-08-11',
    email: 'lucas.prado@aluno.senai.br',
    telefone: '(11) 99876-5432',
    observacao: 'Operador de tornos CNC e robôs colaborativos.',
    ativo: true,
    created_at: '2026-02-05T11:10:00Z',
    fotos: [
      {
        id: 'f10-1',
        arquivo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=70',
        principal: true,
        ordem: 1
      }
    ]
  }
];

export const INITIAL_USERS = [
  {
    id: 'u1',
    nome: 'Coordenação SENAI',
    email: 'admin@senai.br',
    role: 'admin',
    ativo: true,
    created_at: '2026-01-01T08:00:00Z'
  },
  {
    id: 'u2',
    nome: 'Prof. Carlos Eduardo',
    email: 'carlos.eduardo@prof.senai.br',
    role: 'professor',
    ativo: true,
    created_at: '2026-01-10T08:00:00Z'
  }
];
