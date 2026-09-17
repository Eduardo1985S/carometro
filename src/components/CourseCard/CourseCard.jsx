import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, ArrowRight } from 'lucide-react';

export function CourseCard({ course, turmasCount = 0, alunosCount = 0 }) {
  return (
    <Link
      to={`/curso/${course.id}`}
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid var(--senai-blue-700)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--senai-blue-50)',
          color: 'var(--senai-blue-700)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <GraduationCap size={26} />
        </div>
        <span className="badge badge-blue">{course.sigla}</span>
      </div>

      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--senai-blue-900)' }}>
        {course.nome}
      </h3>

      {course.descricao && (
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.25rem',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {course.descricao}
        </p>
      )}

      <div style={{
        marginTop: 'auto',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <strong>{turmasCount}</strong> {turmasCount === 1 ? 'turma' : 'turmas'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Users size={14} />
            <strong>{alunosCount}</strong> alunos
          </span>
        </div>

        <div style={{
          color: 'var(--senai-blue-700)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          <span>Ver turmas</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}
