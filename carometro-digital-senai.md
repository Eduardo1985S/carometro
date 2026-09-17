# Carômetro Digital SENAI

## Visão Geral

O **Carômetro Digital SENAI** é uma aplicação web responsiva para facilitar a identificação e consulta de alunos por curso e turma.

A proposta é permitir que docentes e usuários autorizados encontrem rapidamente informações de alunos por meio de uma interface visual, moderna e simples, com foco em **foto, nome, turma e dados acadêmicos básicos**.

A aplicação deve funcionar muito bem em:

- Celulares
- Tablets
- Notebooks
- Computadores desktop

---

# Objetivo do Projeto

Criar um sistema onde o usuário possa:

1. Realizar login.
2. Escolher um curso.
3. Escolher uma turma.
4. Visualizar os alunos em formato de carômetro.
5. Pesquisar alunos dinamicamente.
6. Visualizar informações básicas diretamente no card.
7. Abrir o perfil completo do aluno.
8. Navegar por várias fotos do mesmo aluno.
9. Filtrar e ordenar alunos.
10. Gerar versões do carômetro para impressão ou PDF.

---

# Stack Recomendada

## Front-End

- React
- Vite
- JavaScript
- React Router DOM
- Lucide React
- React Hook Form
- Zod

## Back-End / Banco de Dados

- Supabase
  - PostgreSQL
  - Authentication
  - Storage

---

# Arquitetura Geral

```text
LOGIN
   ↓
DASHBOARD
   ↓
ESCOLHER CURSO
   ↓
ESCOLHER TURMA
   ↓
CARÔMETRO
   ↓
PERFIL DO ALUNO
```

---

# Tela de Login

A aplicação deve ser protegida por autenticação.

Exemplo:

```text
┌─────────────────────────────┐
│                             │
│      CARÔMETRO SENAI        │
│                             │
│ Email                       │
│ [____________________]      │
│                             │
│ Senha                       │
│ [____________________]      │
│                             │
│       [ ENTRAR ]            │
│                             │
└─────────────────────────────┘
```

---

# Dashboard

Após o login, o usuário deve visualizar os cursos disponíveis.

Exemplo:

```text
Olá, Eduardo 👋

Escolha um curso

┌────────────────────────────┐
│ Desenvolvimento de Sistemas│
│ 4 turmas                   │
│ 128 alunos                 │
└────────────────────────────┘

┌────────────────────────────┐
│ Mecatrônica                │
│ 3 turmas                   │
│ 82 alunos                  │
└────────────────────────────┘
```

---

# Seleção de Turma

Ao escolher um curso, o sistema mostra as turmas relacionadas.

Exemplo:

```text
Desenvolvimento de Sistemas

Escolha a turma

[ 1TDS1 ]   32 alunos

[ 1TDS2 ]   31 alunos

[ 2TDS1 ]   30 alunos

[ 2TDS2 ]   35 alunos
```

---

# Tela do Carômetro

Após selecionar a turma, o usuário visualiza os alunos.

No topo da tela:

```text
CARÔMETRO

[ Curso ▼ ] [ Turma ▼ ]

🔍 Buscar aluno...

[ Todos ] [ Favoritos ]

Ordenar:
[ A-Z ▼ ]
```

---

# Card do Aluno

Cada aluno será apresentado em um card.

Exemplo:

```text
┌─────────────────────────┐
│                         │
│      FOTO DO ALUNO      │
│                         │
│         ● ● ○           │
│                         │
│ João Pedro Silva        │
│                         │
│ Desenvolvimento         │
│ de Sistemas             │
│                         │
│ 2TDS1                   │
│                         │
│ 🎂 17 anos              │
│ ✉ joao@email.com        │
│                         │
│     [ Ver perfil ]      │
│                         │
└─────────────────────────┘
```

---

# Múltiplas Fotos

Cada aluno poderá possuir várias fotos.

Exemplo:

```text
João Pedro
├── foto1.jpg ⭐ principal
├── foto2.jpg
├── foto3.jpg
└── foto4.jpg
```

No celular ou tablet, o usuário poderá navegar pelas fotos utilizando **swipe lateral**.

No desktop, poderão existir:

- Setas laterais
- Indicadores
- Navegação por clique

Exemplo:

```text
← [ FOTO ] →

   ● ● ○
```

---

# Busca Dinâmica

A busca deve acontecer enquanto o usuário digita.

Exemplo:

```text
jo
```

Resultado:

```text
João Pedro
João Victor
Jorge Oliveira
```

Não será necessário clicar em um botão de pesquisa.

A busca poderá considerar:

- Nome
- Matrícula
- E-mail
- Turma
- Curso

---

# Exemplo de Busca com React

```js
const alunosFiltrados = alunos.filter((aluno) => {
  const termo = busca.toLowerCase();

  return (
    aluno.nome.toLowerCase().includes(termo) ||
    aluno.email?.toLowerCase().includes(termo) ||
    aluno.matricula?.toLowerCase().includes(termo)
  );
});
```

Para consultas diretamente no banco, pode ser utilizado **debounce** para evitar requisições excessivas.

---

# Perfil Completo do Aluno

Ao clicar em **Ver perfil**, o sistema deve apresentar informações completas.

Exemplo:

```text
← Voltar

      [ FOTO ]
       ● ● ●

João Pedro Silva

2TDS1
Técnico em Desenvolvimento de Sistemas

Matrícula
202612345

Idade
17 anos

Nascimento
12/03/2009

E-mail
joao@email.com

---------------------

[ Editar aluno ]

[ Adicionar foto ]
```

---

# Comportamento Responsivo

## Celular

- 1 card por linha
- Fotos grandes
- Navegação por swipe
- Menu compacto
- Perfil em tela cheia

## Tablet

- 2 ou 3 cards por linha
- Navegação por toque
- Filtros acessíveis

## Desktop

- 3, 4 ou mais cards por linha
- Perfil podendo abrir em modal ou painel lateral
- Mais informações visíveis simultaneamente

---

# Exemplo de Grid Responsivo

```css
.carometro {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}
```

---

# Estrutura do Banco de Dados

## Tabela `cursos`

```text
id
nome
sigla
ativo
created_at
```

Exemplo:

```text
1
Técnico em Desenvolvimento de Sistemas
TDS
true
```

---

# Tabela `turmas`

```text
id
nome
curso_id
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

# Tabela `alunos`

```text
id
nome
data_nascimento
email
telefone
turma_id
matricula
observacao
ativo
created_at
```

---

# Idade do Aluno

Não é recomendado salvar a idade diretamente no banco.

O ideal é salvar:

```text
data_nascimento
```

E calcular a idade automaticamente.

Exemplo:

```js
function calcularIdade(dataNascimento) {
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

# Tabela `aluno_fotos`

Responsável por permitir várias fotos para o mesmo aluno.

```text
id
aluno_id
url
principal
ordem
created_at
```

Exemplo:

```text
1
15
/alunos/joao/foto1.jpg
true
1
```

---

# Armazenamento das Fotos

As imagens dos alunos podem ser armazenadas utilizando:

```text
Supabase Storage
```

Exemplo de organização:

```text
alunos/
│
├── aluno-15/
│   ├── foto-01.jpg
│   ├── foto-02.jpg
│   └── foto-03.jpg
│
├── aluno-16/
│   ├── foto-01.jpg
│   └── foto-02.jpg
```

---

# Estrutura do Projeto React

```text
src/
│
├── components/
│   ├── Header/
│   ├── SearchBar/
│   ├── CourseCard/
│   ├── ClassCard/
│   ├── StudentCard/
│   ├── StudentCarousel/
│   ├── StudentModal/
│   ├── FilterBar/
│   ├── Avatar/
│   └── Loading/
│
├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── Courses/
│   ├── Classes/
│   ├── Students/
│   └── Student/
│
├── services/
│   └── supabase.js
│
├── hooks/
│   ├── useStudents.js
│   ├── useCourses.js
│   └── useClasses.js
│
├── utils/
│   └── calculateAge.js
│
├── App.jsx
└── main.jsx
```

---

# Componentes Principais

## Header

Responsável por:

- Logo
- Nome do sistema
- Usuário logado
- Logout
- Navegação

---

## CourseCard

Apresenta:

- Nome do curso
- Sigla
- Quantidade de turmas
- Quantidade de alunos

---

## ClassCard

Apresenta:

- Nome da turma
- Curso
- Turno
- Ano
- Quantidade de alunos

---

## StudentCard

Apresenta:

- Foto
- Nome
- Curso
- Turma
- Idade
- E-mail
- Botão de perfil

---

## StudentCarousel

Responsável por:

- Navegação entre fotos
- Swipe no celular
- Indicadores
- Foto principal

---

## SearchBar

Responsável pela busca dinâmica de alunos.

---

# Recursos Planejados

## MVP

A primeira versão deve possuir:

- Login
- Cursos
- Turmas
- Carômetro
- Busca dinâmica
- Cards de alunos
- Múltiplas fotos
- Perfil do aluno
- Responsividade
- Supabase
- Storage
- Autenticação

---

# Recursos Futuros

Após o MVP poderão ser adicionados:

- Favoritar alunos
- Ordenação A-Z
- Ordenação Z-A
- Filtro por turma
- Filtro por curso
- Filtro por turno
- Dark Mode
- Importação via CSV
- Exportação de turma
- Impressão do carômetro
- Exportação para PDF
- Perfil de professor
- Perfil administrador
- Cadastro de usuários
- Cadastro de cursos
- Cadastro de turmas
- Cadastro de alunos
- Upload de várias fotos
- Estatísticas por turma

---

# Impressão do Carômetro

O sistema poderá oferecer a opção:

```text
[ 🖨️ Imprimir carômetro ]
```

Resultado:

```text
2TDS1
Desenvolvimento de Sistemas

[foto]       [foto]       [foto]
João         Maria        Carlos

[foto]       [foto]       [foto]
Pedro        Ana          Lucas
```

Essa função pode ser útil para:

- Conselhos
- Reuniões
- Início de semestre
- Identificação de alunos
- Organização docente

---

# Design

A interface deve evitar aparência de sistemas acadêmicos antigos.

A proposta visual deve ser:

- Moderna
- Clean
- Minimalista
- Responsiva
- Fácil de usar
- Focada nas fotos

Referências de estilo:

```text
LinkedIn
+
Google Contacts
+
Sistema acadêmico moderno
```

Características:

- Fundo claro
- Cards brancos
- Bordas arredondadas
- Sombras discretas
- Tipografia limpa
- Muito espaço visual
- Fotos em destaque
- Informações secundárias menores

---

# Segurança e Privacidade

Como o sistema poderá armazenar:

- Foto
- Nome
- E-mail
- Matrícula
- Data de nascimento
- Dados acadêmicos

A aplicação deve ser considerada um **sistema interno autenticado**.

Não é recomendado deixar o carômetro disponível publicamente.

---

# Níveis de Informação

Uma boa estratégia é separar as informações em dois níveis.

## Carômetro

Mostrar apenas:

```text
Foto
Nome
Turma
Curso
```

## Perfil Completo

Mostrar:

```text
Foto
Nome
E-mail
Matrícula
Nascimento
Turma
Curso
Outras informações autorizadas
```

Assim, dados pessoais não ficam expostos desnecessariamente na tela principal.

---

# Perfis de Usuário

## Professor

Pode:

- Consultar cursos
- Consultar turmas
- Visualizar alunos
- Pesquisar alunos
- Abrir perfil

## Administrador

Pode:

- Cadastrar cursos
- Cadastrar turmas
- Cadastrar alunos
- Editar alunos
- Excluir alunos
- Adicionar fotos
- Gerenciar usuários

---

# MVP Recomendado

A primeira versão pode seguir este fluxo:

```text
Login
  ↓
Cursos
  ↓
Turmas
  ↓
Carômetro
  ↓
Busca dinâmica
  ↓
Card do aluno
  ↓
Carrossel de fotos
  ↓
Perfil do aluno
  ↓
Supabase
```

---

# Possível Evolução

Depois do MVP:

```text
MVP
 ↓
Administração
 ↓
Importação CSV
 ↓
Exportação PDF
 ↓
Impressão
 ↓
Estatísticas
 ↓
Integrações
```

---

# Nome do Projeto

Sugestões:

- Carômetro SENAI
- Carômetro Digital
- SENAI Faces
- TurmaView
- EduFaces
- ClassFaces
- Minha Turma
- FaceClass
- AlunoView

---

# Resumo

O **Carômetro Digital SENAI** será uma aplicação responsiva baseada em React e Supabase para facilitar a identificação e consulta de alunos por curso e turma.

O foco principal será uma experiência visual rápida:

```text
CURSO
  ↓
TURMA
  ↓
FOTO + NOME
  ↓
PERFIL
```

A aplicação será planejada inicialmente como um MVP simples e funcional, com possibilidade de evolução para um sistema completo de consulta e gerenciamento de alunos.
