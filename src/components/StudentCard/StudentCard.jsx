import React from 'react';
import { StudentCarousel } from '../StudentCarousel/StudentCarousel';
import { Eye } from 'lucide-react';

export function StudentCard({ student, onSelect }) {
  const fotos = student.fotos || student.aluno_fotos || [];
  const cursoNome = student.curso || student.turmas?.cursos?.nome || '';
  const turmaNome = student.turma || student.turmas?.nome || '';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Carrossel de Fotos do Aluno */}
      <StudentCarousel
        fotos={fotos}
        studentName={student.nome}
        onClick={() => onSelect && onSelect(student)}
      />

      {/* Conteúdo do Card */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: '0.375rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
            {turmaNome}
          </span>
          {student.turno && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {student.turno}
            </span>
          )}
        </div>

        <h4 style={{
          fontSize: '1.0625rem',
          fontWeight: 700,
          color: 'var(--senai-blue-900)',
          marginTop: '0.25rem',
          lineHeight: 1.3
        }}>
          {student.nome}
        </h4>

        {cursoNome && (
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {cursoNome}
          </p>
        )}

        <button
          type="button"
          onClick={() => onSelect && onSelect(student)}
          className="btn btn-secondary btn-sm"
          style={{
            marginTop: 'auto',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            width: '100%',
            fontWeight: 600,
            fontSize: '0.8125rem'
          }}
        >
          <Eye size={15} />
          <span>Ver Detalhes</span>
        </button>
      </div>
    </div>
  );
}
