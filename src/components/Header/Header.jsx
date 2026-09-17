import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Users, LogIn, LogOut, LayoutDashboard, Menu } from 'lucide-react';

export function Header() {
  const { isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      width: '100%'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        gap: '0.5rem'
      }}>
        {/* Logo & Marca SENAI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          {isAdminPath && isAuthenticated && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin-sidebar'))}
              className="btn-icon btn-ghost show-mobile"
              title="Abrir Menu Admin"
              style={{ padding: '0.4rem', color: 'var(--senai-blue-900)', borderRadius: 'var(--radius-sm)' }}
            >
              <Menu size={20} />
            </button>
          )}

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--senai-blue-700), var(--senai-blue-900))',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.05rem',
              letterSpacing: '0.04em',
              padding: '0.28rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              boxShadow: '0 2px 5px rgba(0, 77, 149, 0.25)',
              lineHeight: 1
            }}>
              <span>SENAI</span>
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: 'var(--senai-red-600)'
              }}></span>
            </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--senai-blue-900)',
              lineHeight: 1.1,
              whiteSpace: 'nowrap'
            }}>
              Carômetro <span className="desktop-only" style={{ display: 'inline' }}>Digital</span>
            </span>
            <span className="desktop-only" style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              lineHeight: 1.2
            }}>
              Identificação & Consulta Acadêmica
            </span>
          </div>
        </Link>
      </div>

        {/* Ações / Navegação Responsiva */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Link para Carômetro Público */}
          <Link
            to="/"
            className={`btn btn-sm ${!isAdminPath ? 'btn-primary' : 'btn-ghost'}`}
            title="Ir para o Carômetro Público"
            style={{ padding: '0.35rem 0.65rem' }}
          >
            <Users size={16} />
            <span className="desktop-only">Carômetro Público</span>
          </Link>

          {/* Área Administrativa */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Link
                to="/admin/dashboard"
                className={`btn btn-sm ${isAdminPath ? 'btn-primary' : 'btn-secondary'}`}
                title="Acessar Painel Administrativo"
                style={{ padding: '0.35rem 0.65rem' }}
              >
                <LayoutDashboard size={16} />
                <span className="desktop-only">Painel Admin</span>
              </Link>
              
              <button
                onClick={signOut}
                className="btn btn-sm btn-ghost btn-icon"
                title="Encerrar Sessão"
                style={{ padding: '0.4rem', color: 'var(--senai-red-600)' }}
              >
                <LogOut size={16} />
                <span className="desktop-only" style={{ marginLeft: '0.25rem' }}>Sair</span>
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="btn btn-sm btn-secondary"
              title="Acesso de Professores e Administradores"
              style={{ padding: '0.35rem 0.75rem' }}
            >
              <LogIn size={15} />
              <span>Acesso Docente</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
