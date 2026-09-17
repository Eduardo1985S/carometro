import React from 'react';
import { SearchX, UserX, FolderOpen } from 'lucide-react';

export function EmptyState({
  title = 'Nenhum resultado encontrado',
  description = 'Tente alterar os termos de busca ou selecionar outro curso/turma.',
  icon: Icon = SearchX,
  actionText,
  onAction
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '4rem 1.5rem',
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-color)',
      maxWidth: '560px',
      margin: '2rem auto'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--senai-blue-50)',
        color: 'var(--senai-blue-700)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem'
      }}>
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--senai-blue-900)', marginBottom: '0.5rem' }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '400px' }}>
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
          style={{ marginTop: '1.5rem' }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
