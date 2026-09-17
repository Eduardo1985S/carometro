import React, { useState } from 'react';
import { useCourses } from '../../hooks/useCourses';
import { useClasses } from '../../hooks/useClasses';
import { useStudents } from '../../hooks/useStudents';
import { CourseCard } from '../../components/CourseCard/CourseCard';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { SkeletonCourseCard } from '../../components/Loading/SkeletonCard';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { GraduationCap, Users, BookOpen, Sparkles } from 'lucide-react';

export function Home() {
  const { courses, loading: coursesLoading } = useCourses();
  const { classes } = useClasses();
  const { students } = useStudents({ isAdmin: false });
  const [searchTerm, setSearchTerm] = useState('');

  const activeCourses = courses.filter((c) => c.ativo !== false);

  const filteredCourses = activeCourses.filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      course.nome.toLowerCase().includes(term) ||
      course.sigla.toLowerCase().includes(term) ||
      course.descricao?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Banner SENAI */}
      <section style={{
        background: 'linear-gradient(135deg, #002d5a 0%, #004d95 60%, #0060b8 100%)',
        color: '#ffffff',
        padding: '3.5rem 1.25rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Detalhe de fundo geométrico */}
        <div style={{
          position: 'absolute',
          right: '-5%',
          bottom: '-20%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(227, 6, 19, 0.15) 0%, rgba(0, 77, 149, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '720px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              <Sparkles size={14} color="#ffd166" />
              <span>Portal de Consulta Acadêmica SENAI</span>
            </div>

            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.15
            }}>
              Carômetro Digital
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.85)',
              marginTop: '0.75rem',
              lineHeight: 1.5
            }}>
              Selecione um curso para explorar as turmas e consultar visualmente os alunos matriculados.
            </p>

            {/* Barra de Busca de Cursos */}
            <div style={{ marginTop: '2rem' }}>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Pesquisar curso por nome ou sigla (ex: TDS, Mecatrônica)..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Cursos */}
      <section className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--senai-blue-900)' }}>
              Cursos Disponíveis
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
            </p>
          </div>
        </div>

        {coursesLoading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonCourseCard key={idx} />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            title="Nenhum curso encontrado"
            description={searchTerm ? `Não encontramos cursos com o termo "${searchTerm}".` : 'Nenhum curso cadastrado no momento.'}
            onAction={searchTerm ? () => setSearchTerm('') : null}
            actionText={searchTerm ? 'Limpar busca' : null}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredCourses.map((course) => {
              const courseTurmas = classes.filter((t) => t.curso_id === course.id && t.ativa !== false);
              const turmaIds = courseTurmas.map((t) => t.id);
              const courseAlunos = students.filter((a) => turmaIds.includes(a.turma_id) && a.ativo !== false);

              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  turmasCount={courseTurmas.length}
                  alunosCount={courseAlunos.length}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
