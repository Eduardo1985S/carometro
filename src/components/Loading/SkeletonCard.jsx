import React from 'react';

/**
 * Card Skeleton para o Carômetro com sombra profunda, bordas suaves e efeito shimmer
 */
export function SkeletonCard() {
  return (
    <div className="skeleton-card-container">
      {/* Imagem do Aluno */}
      <div className="skeleton-box" style={{ width: '100%', aspectRatio: '3 / 4' }} />
      
      {/* Conteúdo do Card */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton-box" style={{ width: '30%', height: '18px', borderRadius: 'var(--radius-full)' }} />
          <div className="skeleton-box" style={{ width: '20%', height: '14px' }} />
        </div>
        
        <div className="skeleton-box" style={{ width: '85%', height: '22px' }} />
        <div className="skeleton-box" style={{ width: '65%', height: '16px' }} />
        
        <div className="skeleton-box" style={{ width: '100%', height: '36px', marginTop: '0.5rem', borderRadius: 'var(--radius-md)' }} />
      </div>
    </div>
  );
}

/**
 * Skeleton para Cards de Cursos na Home
 */
export function SkeletonCourseCard() {
  return (
    <div className="skeleton-card-container" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid #cbd5e1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-box" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)' }} />
        <div className="skeleton-box" style={{ width: '40px', height: '20px', borderRadius: 'var(--radius-full)' }} />
      </div>
      <div className="skeleton-box" style={{ width: '80%', height: '24px' }} />
      <div className="skeleton-box" style={{ width: '95%', height: '16px' }} />
      <div className="skeleton-box" style={{ width: '60%', height: '16px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="skeleton-box" style={{ width: '40%', height: '16px' }} />
        <div className="skeleton-box" style={{ width: '30%', height: '16px' }} />
      </div>
    </div>
  );
}

/**
 * Skeleton para Linhas de Tabelas Administrativas
 */
export function SkeletonTableRow({ columns = 5 }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} style={{ padding: '1rem' }}>
          <div className="skeleton-box" style={{ width: idx === 0 ? '40px' : '70%', height: idx === 0 ? '40px' : '18px', borderRadius: idx === 0 ? 'var(--radius-md)' : 'var(--radius-sm)' }} />
        </td>
      ))}
    </tr>
  );
}
