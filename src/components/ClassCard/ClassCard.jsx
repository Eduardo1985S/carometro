import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, Calendar, ArrowRight } from 'lucide-react';

export function ClassCard({ turma, alunosCount = 0 }) {
  return (
    <Link
      to={`/turma/${turma.id}`}
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        textDecoration: 'none',
        position: 'relative',
        borderTop: '4px solid var(--senai-blue-600)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--senai-blue-900)' }}>
          {turma.nome}
        </h3>
        <span className="badge badge-blue">
          {turma.turno}
        </span>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={15} color="var(--text-muted)" />
          <span>Ano {turma.ano} • {turma.semestre}º Semestre</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={15} color="var(--text-muted)" />
          <span>Turno: {turma.turno}</span>
        </div>
      </div>

      <div style={{
        marginTop: 'auto',
        paddingTop: '0.875rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--senai-blue-800)', fontWeight: 600 }}>
          <Users size={16} />
          <span>{alunosCount} {alunosCount === 1 ? 'aluno' : 'alunos'}</span>
        </div>

        <div style={{
          color: 'var(--senai-blue-700)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          <span>Acessar Carômetro</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}
