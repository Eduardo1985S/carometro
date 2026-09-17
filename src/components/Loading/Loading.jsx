import React from 'react';
import { Loader2 } from 'lucide-react';

export function Loading({ message = 'Carregando dados...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      gap: '1rem',
      color: 'var(--senai-blue-700)'
    }}>
      <Loader2 size={36} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
        {message}
      </span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
