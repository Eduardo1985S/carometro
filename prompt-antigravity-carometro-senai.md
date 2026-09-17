# PROMPT PARA ANTIGRAVITY — CARÔMETRO DIGITAL SENAI

## Objetivo

Crie uma aplicação web completa chamada **Carômetro Digital SENAI**, com foco em consulta visual de alunos por curso e turma.

A aplicação deve ser moderna, responsiva, simples de usar e funcionar muito bem em:

- Celular
- Tablet
- Notebook
- Desktop

O projeto deve ser desenvolvido com **React + Vite + JavaScript**, usando **Supabase** como backend, banco de dados, autenticação e armazenamento de imagens.

A infraestrutura deve ser pensada para operar em **custo zero**, utilizando apenas planos gratuitos.

---

# Stack obrigatória

Utilize:

- React
- Vite
- JavaScript
- React Router DOM
- Supabase
  - PostgreSQL
  - Authentication
  - Storage
  - Row Level Security
- React Hook Form
- Zod
- Lucide React
- CSS moderno ou CSS Modules

Evite:

- Prisma
- Backend Node separado
- Serviços pagos
- Bibliotecas pesadas sem necessidade

---

# Arquitetura geral

```text
VISITANTE
   ↓
CARÔMETRO PÚBLICO
   ↓
Curso
   ↓
Turma
   ↓
Busca
   ↓
Aluno


ADMIN
   ↓
LOGIN
   ↓
DASHBOARD
   ↓
CRUD
   ├── usuários
   ├── cursos
   ├── turmas
   ├── alunos
   └── fotos
```

---

# Regra principal de acesso

A aplicação possui dois contextos distintos:

## Visitante não autenticado

Pode apenas visualizar o carômetro.

Pode:

- visualizar cursos
- visualizar turmas
- visualizar alunos
- pesquisar alunos dinamicamente
- visualizar foto principal
- navegar entre várias fotos
- visualizar nome
- visualizar curso
- visualizar turma

Não pode:

- cadastrar
- editar
- excluir
- acessar painel administrativo
- visualizar dados sensíveis
- visualizar matrícula
- visualizar telefone
- visualizar data de nascimento
- visualizar e-mail
- visualizar observações internas

---

# Administrador

O administrador deve realizar login.

Após autenticação pode:

- visualizar dashboard
- cadastrar usuário
- editar usuário
- excluir/desativar usuário
- cadastrar curso
- editar curso
- excluir/desativar curso
- cadastrar turma
- editar turma
- excluir/desativar turma
- cadastrar aluno
- editar aluno
- excluir/desativar aluno
- adicionar fotos
- excluir fotos
- definir foto principal
- alterar ordem das fotos

---

# Rotas

Crie as seguintes rotas:

```text
/
├── /carometro
├── /curso/:cursoId
├── /turma/:turmaId
│
└── /admin
    ├── /login
    ├── /dashboard
    ├── /usuarios
    ├── /cursos
    ├── /turmas
    ├── /alunos
    └── /fotos
```

As rotas administrativas devem ser protegidas.

Se o usuário não estiver autenticado e tentar acessar `/admin/*`, redirecione para:

```text
/admin/login
```

---

# Home pública

A tela inicial deve apresentar os cursos disponíveis.

Exemplo:

```text
CARÔMETRO DIGITAL

Escolha um curso

┌────────────────────────────┐
│ Desenvolvimento de Sistemas│
│ 4 turmas                   │
│ 128 alunos                 │
└────────────────────────────┘
```

Os cards devem ser clicáveis.

---

# Seleção de turma

Após escolher o curso, mostrar as turmas.

Exemplo:

```text
Desenvolvimento de Sistemas

Escolha a turma

[ 1TDS1 ]    32 alunos
[ 1TDS2 ]    31 alunos
[ 2TDS1 ]    30 alunos
[ 2TDS2 ]    35 alunos
```

---

# Tela do carômetro

A tela deve possuir:

- nome do curso
- nome da turma
- contador de alunos
- campo de busca
- botão para limpar busca
- ordenação A-Z
- grid responsivo
- estado de carregamento
- estado vazio

Exemplo:

```text
CARÔMETRO

Desenvolvimento de Sistemas
2TDS1

30 alunos

🔍 Buscar aluno...

[ A-Z ▼ ]

┌─────────┐
│  FOTO   │
│ João    │
│ 2TDS1   │
└─────────┘
```

---

# Busca dinâmica

A busca deve funcionar enquanto o usuário digita.

Não deve ser necessário clicar em botão de pesquisa.

Pesquisar por:

- nome
- curso
- turma

No painel administrativo também permitir busca por:

- matrícula
- e-mail

Utilize debounce quando necessário.

---

# Card público do aluno

Cada card deve apresentar apenas:

- foto
- nome
- curso
- turma

Exemplo:

```text
┌─────────────────────────┐
│                         │
│      FOTO DO ALUNO      │
│                         │
│        ● ● ○            │
│                         │
│ João Pedro Silva        │
│                         │
│ Desenvolvimento         │
│ de Sistemas             │
│                         │
│ 2TDS1                   │
│                         │
└─────────────────────────┘
```

---

# Múltiplas fotos

Cada aluno pode possuir várias fotos.

Exemplo:

```text
João Pedro
├── foto1.webp
├── foto2.webp
├── foto3.webp
└── foto4.webp
```

No celular:

- permitir swipe horizontal

No desktop:

- permitir setas
- permitir clique
- mostrar indicadores

Exemplo:

```text
← [ FOTO ] →

   ● ● ○
```

---

# Responsividade

A aplicação deve ser mobile-first.

## Celular

- 1 card por linha
- fotos grandes
- filtros em largura total
- swipe nas fotos
- menu administrativo adaptado
- formulários em coluna

## Tablet

- 2 ou 3 cards por linha

## Desktop

- 3, 4 ou mais cards por linha
- sidebar administrativa
- tabelas completas
- modal ou painel lateral para edição

Use grid responsivo.

Exemplo:

```css
.carometro-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}
```

---

# Painel administrativo

Criar dashboard com layout moderno.

Exemplo:

```text
┌──────────────────────────────────────┐
│ CARÔMETRO                    ADMIN   │
├───────────────┬──────────────────────┤
│ Dashboard     │                      │
│ Usuários      │      CONTEÚDO        │
│ Cursos        │                      │
│ Turmas        │                      │
│ Alunos        │                      │
│ Fotos         │                      │
│               │                      │
│ Sair          │                      │
└───────────────┴──────────────────────┘
```

---

# Dashboard

Mostrar cards com:

- total de alunos
- total de turmas
- total de cursos
- total de fotos
- últimos alunos cadastrados

Exemplo:

```text
┌────────────────────┐
│    245 ALUNOS      │
└────────────────────┘

┌────────────────────┐
│     8 TURMAS       │
└────────────────────┘

┌────────────────────┐
│     3 CURSOS       │
└────────────────────┘

┌────────────────────┐
│    682 FOTOS       │
└────────────────────┘
```

---

# CRUD de usuários

Administrador pode:

- cadastrar
- editar
- desativar
- excluir

Campos:

```text
nome
email
role
ativo
```

Inicialmente utilize:

```text
admin
```

Mas deixe arquitetura preparada para futuramente existir:

```text
admin
professor
```

---

# CRUD de cursos

Campos:

```text
id
nome
sigla
ativo
created_at
```

Exemplo:

```text
Técnico em Desenvolvimento de Sistemas
TDS
```

---

# CRUD de turmas

Campos:

```text
id
curso_id
nome
ano
semestre
turno
ativa
created_at
```

Exemplo:

```text
2TDS1
2026
2
Manhã
```

---

# CRUD de alunos

Campos:

```text
id
turma_id
nome
matricula
data_nascimento
email
telefone
observacao
ativo
created_at
```

---

# Cadastro de aluno

Criar formulário parecido com:

```text
NOVO ALUNO

Nome
[________________________________]

Matrícula
[________________________________]

Curso
[ Desenvolvimento de Sistemas ▼ ]

Turma
[ 2TDS1 ▼ ]

Nascimento
[____/____/________]

E-mail
[________________________________]

Telefone
[________________________________]

Observação
[________________________________]

Fotos

[ + selecionar fotos ]

┌──────┐ ┌──────┐ ┌──────┐
│foto 1│ │foto 2│ │foto 3│
└──────┘ └──────┘ └──────┘

[ CANCELAR ]            [ SALVAR ]
```

---

# Idade

Não salve a idade no banco.

Salve:

```text
data_nascimento
```

Calcule a idade apenas quando necessário.

Exemplo:

```js
export function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const mes = hoje.getMonth() - nascimento.getMonth();

  if (
    mes < 0 ||
    (mes === 0 && hoje.getDate() < nascimento.getDate())
  ) {
    idade--;
  }

  return idade;
}
```

---

# Tabela de fotos

Criar tabela:

```text
aluno_fotos
```

Campos:

```text
id
aluno_id
arquivo
thumbnail
principal
ordem
created_at
```

---

# Storage

Utilizar Supabase Storage.

Criar bucket:

```text
alunos
```

Organização sugerida:

```text
alunos/
│
├── 2tds1/
│   ├── aluno-123/
│   │   ├── 01.webp
│   │   ├── 01-thumb.webp
│   │   ├── 02.webp
│   │   └── 02-thumb.webp
│
└── 1tds1/
```

---

# Compressão das imagens

A aplicação precisa economizar armazenamento.

Antes do upload:

1. ler a imagem
2. redimensionar
3. converter para WebP
4. comprimir
5. gerar thumbnail
6. enviar ao Supabase

Gerar preferencialmente:

```text
thumbnail
300x400
20KB a 50KB aproximadamente
```

e:

```text
perfil
800x1000
100KB a 200KB aproximadamente
```

Evite armazenar fotos originais de vários megabytes.

---

# Regras de segurança

Nunca colocar no front-end:

```text
SUPABASE_SERVICE_ROLE_KEY
```

No React utilizar apenas:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

---

# RLS

Ative Row Level Security.

Criar regras claras.

## Visitante

Pode apenas:

```text
SELECT
```

dos dados públicos do carômetro.

Não deve ter acesso aos dados administrativos.

---

# Dados públicos

Não exponha diretamente a tabela completa de alunos.

Criar uma view ou estrutura equivalente chamada:

```text
carometro_publico
```

Ela deve retornar apenas:

```text
aluno_id
nome
curso
turma
foto
```

Nunca retornar:

```text
matricula
email
telefone
data_nascimento
observacao
```

---

# Dados administrativos

Usuários autenticados com role `admin` podem realizar:

```text
SELECT
INSERT
UPDATE
DELETE
```

em:

```text
cursos
turmas
alunos
aluno_fotos
profiles
```

---

# Gerenciamento de usuários

Não utilize a Service Role diretamente no React.

Para criar ou excluir usuários do Supabase Auth:

```text
React
  ↓
Supabase Edge Function
  ↓
Supabase Auth Admin API
```

A Service Role deve ficar somente no ambiente seguro da Edge Function.

---

# Profiles

Criar tabela:

```text
profiles
```

Campos:

```text
id
nome
email
role
ativo
created_at
```

O `id` deve ser relacionado ao usuário do Supabase Auth.

---

# Componentização

Organize o projeto.

Sugestão:

```text
src/
│
├── components/
│   ├── Header/
│   ├── Sidebar/
│   ├── SearchBar/
│   ├── CourseCard/
│   ├── ClassCard/
│   ├── StudentCard/
│   ├── StudentCarousel/
│   ├── StudentModal/
│   ├── FilterBar/
│   ├── Avatar/
│   ├── ProtectedRoute/
│   ├── Loading/
│   └── EmptyState/
│
├── pages/
│   ├── Home/
│   ├── Courses/
│   ├── Classes/
│   ├── Students/
│   │
│   └── Admin/
│       ├── Login/
│       ├── Dashboard/
│       ├── Users/
│       ├── Courses/
│       ├── Classes/
│       ├── Students/
│       └── Photos/
│
├── services/
│   └── supabase.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useStudents.js
│   ├── useCourses.js
│   └── useClasses.js
│
├── utils/
│   ├── calculateAge.js
│   └── imageCompression.js
│
├── routes/
│   └── AppRoutes.jsx
│
├── App.jsx
└── main.jsx
```

---

# UX/UI

Criar aparência moderna.

Evite aparência de sistema acadêmico antigo.

Referências visuais:

```text
Google Contacts
+
LinkedIn
+
Dashboard administrativo moderno
```

Características:

- visual clean
- bastante espaço
- cards modernos
- bordas arredondadas
- sombras discretas
- ícones Lucide
- tipografia legível
- foco na fotografia
- mobile-first
- bom contraste
- feedback visual
- loaders
- empty states
- mensagens de sucesso e erro

---

# Estado vazio

Exemplo:

```text
Nenhum aluno encontrado.

Tente alterar o curso, turma ou termo de pesquisa.
```

---

# Upload de fotos

O administrador deve conseguir:

- selecionar várias fotos
- visualizar preview
- excluir antes de salvar
- definir foto principal
- alterar ordem
- excluir foto já salva
- adicionar novas fotos posteriormente

---

# Regras de exclusão

Prefira exclusão lógica para dados acadêmicos.

Utilize:

```text
ativo = false
```

para:

- aluno
- turma
- curso
- usuário

Quando necessário, permita exclusão definitiva apenas após confirmação explícita.

Exemplo:

```text
Tem certeza que deseja excluir este aluno?

Esta ação não poderá ser desfeita.

[ CANCELAR ] [ EXCLUIR ]
```

---

# Confirmações

Toda ação destrutiva precisa de confirmação:

- excluir aluno
- excluir turma
- excluir curso
- excluir usuário
- excluir foto

---

# Feedback

Mostrar mensagens como:

```text
Aluno cadastrado com sucesso.
Aluno atualizado com sucesso.
Foto removida com sucesso.
Erro ao carregar alunos.
```

---

# Loading

Não deixar telas vazias enquanto os dados carregam.

Utilizar:

- skeletons
- spinner discreto
- placeholders

---

# Performance

Evitar carregar todas as fotos grandes no carômetro.

No grid utilizar:

```text
thumbnail
```

Carregar a imagem maior apenas quando necessário.

Usar:

```html
loading="lazy"
```

nas imagens.

---

# Acessibilidade

Aplicar:

- labels em formulários
- navegação por teclado
- foco visível
- alt em imagens
- aria-label quando necessário
- contraste adequado

---

# Custo

O projeto deve depender apenas de serviços gratuitos.

Arquitetura:

```text
GitHub
  ↓
Front-End React
  ↓
Hospedagem gratuita
  ↓
Supabase Free
   ├── Database
   ├── Auth
   └── Storage
```

Não adicionar nenhum serviço pago obrigatório.

---

# Resultado esperado

Ao final deve existir uma aplicação funcional com:

## Público

```text
Curso
  ↓
Turma
  ↓
Busca
  ↓
Cards dos alunos
  ↓
Carrossel de fotos
```

## Administrativo

```text
Login
  ↓
Dashboard
  ↓
Usuários
Cursos
Turmas
Alunos
Fotos
```

---

# Ordem de implementação

Implemente por etapas.

## Etapa 1

Configuração:

- React
- Vite
- Router
- estrutura de pastas
- layout global

## Etapa 2

Supabase:

- conexão
- tabelas
- relacionamentos
- RLS
- view pública

## Etapa 3

Carômetro público:

- cursos
- turmas
- alunos
- cards
- busca dinâmica
- responsividade

## Etapa 4

Autenticação:

- login
- logout
- sessão
- rota protegida
- role admin

## Etapa 5

Painel administrativo:

- dashboard
- sidebar
- navegação

## Etapa 6

CRUD:

- cursos
- turmas
- alunos

## Etapa 7

Fotos:

- upload
- compressão
- thumbnail
- múltiplas imagens
- foto principal

## Etapa 8

Usuários:

- profiles
- Edge Function
- criação e administração de usuários

## Etapa 9

Refinamentos:

- loaders
- empty states
- erros
- acessibilidade
- performance
- responsividade final

---

# Importante

Não gere apenas uma interface visual.

O projeto deve ser funcional e possuir:

- banco integrado
- autenticação
- CRUD real
- upload real
- permissões reais
- proteção de rotas
- RLS
- responsividade
- estrutura organizada
- código limpo
- componentes reutilizáveis

O objetivo é criar um MVP realmente utilizável do **Carômetro Digital SENAI**.
