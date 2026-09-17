import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import { useClasses } from '../../hooks/useClasses';
import { useStudents } from '../../hooks/useStudents';
import { ClassCard } from '../../components/ClassCard/ClassCard';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { Loading } from '../../components/Loading/Loading';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { ChevronLeft, GraduationCap, Users } from 'lucide-react';

export function CourseClasses() {
  const { cursoId } = useParams();
  const { courses, loading: coursesLoading } = useCourses();
  const { classes, loading: classesLoading } = useClasses(cursoId);
  const { students } = useStudents({ isAdmin: false });
  const [searchTerm, setSearchTerm] = useState('');

  const currentCourse = courses.find((c) => c.id === cursoId);

  const activeClasses = classes.filter((t) => t.ativa !== false);

  const filteredClasses = activeClasses.filter((turma) => {
    const term = searchTerm.toLowerCase();
    return (
      turma.nome.toLowerCase().includes(term) ||
      turma.turno.toLowerCase().includes(term) ||
      String(turma.ano).includes(term)
    );
  });

  if (coursesLoading || classesLoading) {
    return <Loading message="Carregando turmas do curso..." />;
  }

  if (!currentCourse) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem' }}>
        <EmptyState
          title="Curso não encontrado"
          description="O curso solicitado não existe ou foi desativado."
          actionText="Voltar para a lista de cursos"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      {/* Botão Voltar & Migalha de pão */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: 'var(--senai-blue-700)',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          <ChevronLeft size={18} />
          <span>Voltar para todos os cursos</span>
        </Link>
      </div>

      {/* Cabeçalho do Curso */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge badge-blue">{currentCourse.sigla}</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {activeClasses.length} {activeClasses.length === 1 ? 'turma ativa' : 'turmas ativas'}
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--senai-blue-900)' }}>
          {currentCourse.nome}
        </h1>

        {currentCourse.descricao && (
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '800px' }}>
            {currentCourse.descricao}
          </p>
        )}
      </div>

      {/* Barra de Filtro / Busca */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--senai-blue-900)' }}>
            Selecione a Turma
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Escolha uma turma para visualizar o carômetro correspondente
          </p>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar turma (ex: 1TDS1, Manhã)..."
        />
      </div>

      {/* Grid de Turmas */}
      {filteredClasses.length === 0 ? (
        <EmptyState
          title="Nenhuma turma encontrada"
          description={searchTerm ? `Não encontramos turmas com o termo "${searchTerm}".` : 'Não há turmas cadastradas para este curso.'}
          onAction={searchTerm ? () => setSearchTerm('') : null}
          actionText={searchTerm ? 'Limpar busca' : null}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredClasses.map((turma) => {
            const turmaAlunos = students.filter((a) => a.turma_id === turma.id && a.ativo !== false);
            return (
              <ClassCard
                key={turma.id}
                turma={turma}
                alunosCount={turmaAlunos.length}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
