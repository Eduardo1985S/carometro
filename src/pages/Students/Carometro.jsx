import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClasses } from '../../hooks/useClasses';
import { useStudents } from '../../hooks/useStudents';
import { useCourses } from '../../hooks/useCourses';
import { StudentCard } from '../../components/StudentCard/StudentCard';
import { StudentModal } from '../../components/StudentModal/StudentModal';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { SkeletonCard } from '../../components/Loading/SkeletonCard';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { ChevronLeft, ArrowDownAZ, ArrowUpZA, Printer, Users, UserX, Sparkles } from 'lucide-react';

export function Carometro() {
  const { turmaId } = useParams();
  const { classes, loading: classesLoading } = useClasses();
  const { courses } = useCourses();
  const { students, loading: studentsLoading } = useStudents({ turmaId, isAdmin: false });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [selectedStudent, setSelectedStudent] = useState(null);

  const currentTurma = classes.find((t) => t.id === turmaId);
  const currentCourse = currentTurma ? courses.find((c) => c.id === currentTurma.curso_id) : null;

  // Filtragem e Ordenação
  const processedStudents = useMemo(() => {
    let list = [...students];

    // Busca dinâmica
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter((aluno) => aluno.nome.toLowerCase().includes(term));
    }

    // Ordenação A-Z / Z-A
    list.sort((a, b) => {
      const nomeA = a.nome || '';
      const nomeB = b.nome || '';
      return sortOrder === 'asc'
        ? nomeA.localeCompare(nomeB, 'pt-BR')
        : nomeB.localeCompare(nomeA, 'pt-BR');
    });

    return list;
  }, [students, searchTerm, sortOrder]);

  const handlePrint = () => {
    window.print();
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      {/* Navegação e Voltar */}
      <div className="no-print" style={{ marginBottom: '1.25rem' }}>
        <Link
          to={currentCourse ? `/curso/${currentCourse.id}` : '/'}
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
          <span>Voltar para {currentCourse ? currentCourse.sigla : 'Cursos'}</span>
        </Link>
      </div>

      {/* Cabeçalho da Turma */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <span className="badge badge-blue">{currentTurma?.nome || 'Turma'}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {currentTurma?.turno} • {currentTurma?.ano}/{currentTurma?.semestre}º Semestre
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--senai-blue-900)' }}>
            {currentCourse?.nome || 'Carômetro da Turma'}
          </h1>
        </div>

        {/* Estatísticas e Botão Imprimir */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--senai-blue-50)',
            color: 'var(--senai-blue-800)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 700,
            fontSize: '0.9375rem'
          }}>
            <Users size={18} />
            <span>{processedStudents.length} {processedStudents.length === 1 ? 'Aluno' : 'Alunos'}</span>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-secondary no-print"
            title="Imprimir Carômetro ou Salvar PDF"
          >
            <Printer size={16} />
            <span className="hide-mobile">Imprimir Carômetro</span>
          </button>
        </div>
      </div>

      {/* Barra de Busca e Ordenação */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar aluno por nome..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={toggleSort}
            className="btn btn-secondary"
            title={`Ordenar ${sortOrder === 'asc' ? 'Z-A' : 'A-Z'}`}
          >
            {sortOrder === 'asc' ? <ArrowDownAZ size={18} /> : <ArrowUpZA size={18} />}
            <span>{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
          </button>
        </div>
      </div>

      {/* Grid do Carômetro */}
      {studentsLoading || classesLoading ? (
        <div className="carometro-grid">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : processedStudents.length === 0 ? (
        <EmptyState
          icon={UserX}
          title="Nenhum aluno encontrado"
          description={
            searchTerm
              ? `Nenhum aluno encontrado com o termo "${searchTerm}".`
              : 'Esta turma ainda não possui alunos cadastrados ou ativos.'
          }
          actionText={searchTerm ? 'Limpar busca' : null}
          onAction={searchTerm ? () => setSearchTerm('') : null}
        />
      ) : (
        <div className="carometro-grid">
          {processedStudents.map((aluno) => (
            <StudentCard
              key={aluno.aluno_id || aluno.id}
              student={aluno}
              onSelect={(student) => setSelectedStudent(student)}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalhes do Aluno */}
      <StudentModal
        student={selectedStudent}
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        isAdmin={false}
      />
    </div>
  );
}
