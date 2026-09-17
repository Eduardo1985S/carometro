import React from 'react';
import { Search, X } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Buscar aluno por nome...', onClear }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
      <div style={{
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none'
      }}>
        <Search size={18} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-control"
        style={{
          paddingLeft: '2.75rem',
          paddingRight: value ? '2.5rem' : '1rem',
          height: '44px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
          fontSize: '0.9375rem'
        }}
      />

      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange(''))}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '50%'
          }}
          title="Limpar busca"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
