import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Users, LogIn, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';

export function Header() {
  const { isAuthenticated, user, signOut } = useAuth();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px'
      }}>
        {/* Logo & Marca SENAI */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--senai-blue-700), var(--senai-blue-900))',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '0.05em',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            boxShadow: '0 2px 6px rgba(0, 77, 149, 0.3)'
          }}>
            <span>SENAI</span>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--senai-red-600)'
            }}></span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--senai-blue-900)',
              lineHeight: 1.1
            }}>
              Carômetro Digital
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>
              Identificação & Consulta Acadêmica
            </span>
          </div>
        </Link>

        {/* Ações / Navegação */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Link para Carômetro Público */}
          <Link
            to="/"
            className={`btn btn-sm ${!isAdminPath ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Users size={16} />
            <span className="hide-mobile">Carômetro Público</span>
          </Link>

          {/* Área Administrativa */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/admin/dashboard"
                className={`btn btn-sm ${isAdminPath ? 'btn-primary' : 'btn-secondary'}`}
              >
                <LayoutDashboard size={16} />
                <span className="hide-mobile">Painel Admin</span>
              </Link>
              
              <button
                onClick={signOut}
                className="btn btn-sm btn-ghost"
                title="Encerrar Sessão"
              >
                <LogOut size={16} />
                <span className="hide-mobile">Sair</span>
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="btn btn-sm btn-secondary"
              title="Acesso de Professores e Administradores"
            >
              <LogIn size={16} />
              <span>Acesso Docente</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
