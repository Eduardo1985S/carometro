import React, { useState } from 'react';
import { useStudents } from '../../../hooks/useStudents';
import { useClasses } from '../../../hooks/useClasses';
import { Image as ImageIcon, Search, Star, UserSquare2 } from 'lucide-react';
import { Loading } from '../../../components/Loading/Loading';
import { EmptyState } from '../../../components/EmptyState/EmptyState';
import { StudentModal } from '../../../components/StudentModal/StudentModal';

export function AdminPhotos() {
  const { students, loading } = useStudents({ isAdmin: true });
  const { classes } = useClasses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurma, setSelectedTurma] = useState('');
  const [viewingStudent, setViewingStudent] = useState(null);

  // Flatten all photos with their student reference
  const allPhotos = [];
  students.forEach((aluno) => {
    const fotos = aluno.fotos || aluno.aluno_fotos || [];
    fotos.forEach((foto, idx) => {
      allPhotos.push({
        ...foto,
        aluno,
        turma: classes.find((t) => t.id === aluno.turma_id)
      });
    });
  });

  const filteredPhotos = allPhotos.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchName = item.aluno?.nome?.toLowerCase().includes(term);
    const matchTurma = selectedTurma ? item.aluno?.turma_id === selectedTurma : true;
    return matchName && matchTurma;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 className="page-title">Galeria de Fotos</h1>
        <p className="page-subtitle">
          Auditoria visual de fotos cadastradas ({allPhotos.length} fotos no total)
        </p>
      </div>

      {/* Filtros */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar fotos por nome do aluno..."
          className="form-control"
          style={{ maxWidth: '320px' }}
        />

        <select
          value={selectedTurma}
          onChange={(e) => setSelectedTurma(e.target.value)}
          className="form-control"
          style={{ maxWidth: '240px' }}
        >
          <option value="">Todas as turmas</option>
          {classes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome} ({t.turno})
            </option>
          ))}
        </select>
      </div>

      {/* Grid de Fotos */}
      {loading ? (
        <Loading message="Carregando galeria..." />
      ) : filteredPhotos.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Nenhuma foto encontrada"
          description="Nenhuma imagem cadastrada para os filtros selecionados."
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredPhotos.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setViewingStudent(item.aluno)}
              className="card card-interactive"
              style={{
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ width: '100%', aspectRatio: '3 / 4', backgroundColor: '#f1f5f9', position: 'relative' }}>
                <img
                  src={item.thumbnail || item.arquivo}
                  alt={item.aluno?.nome}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {item.principal && (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    backgroundColor: 'var(--warning)',
                    color: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <Star size={10} fill="#ffffff" />
                    <span>PRINCIPAL</span>
                  </div>
                )}
              </div>

              <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--senai-blue-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.aluno?.nome}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {item.turma?.nome || '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalhes */}
      <StudentModal
        student={viewingStudent}
        isOpen={Boolean(viewingStudent)}
        onClose={() => setViewingStudent(null)}
        isAdmin={true}
      />
    </div>
  );
}
