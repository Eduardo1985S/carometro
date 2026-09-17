import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  UserSquare2, 
  Image as ImageIcon, 
  ShieldCheck, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Sidebar({ isOpen = false, onClose }) {
  const { signOut, profile } = useAuth();

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/cursos', label: 'Cursos', icon: GraduationCap },
    { to: '/admin/turmas', label: 'Turmas', icon: Users },
    { to: '/admin/alunos', label: 'Alunos', icon: UserSquare2 },
    { to: '/admin/fotos', label: 'Galeria de Fotos', icon: ImageIcon },
    { to: '/admin/usuarios', label: 'Usuários & Permissões', icon: ShieldCheck }
  ];

  return (
    <>
      {/* Backdrop para mobile quando a sidebar estiver aberta */}
      {isOpen && (
        <div
          onClick={onClose}
          className="sidebar-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(2px)',
            zIndex: 90
          }}
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Informações do Administrador & Botão Fechar no Mobile */}
        <div style={{
          padding: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--senai-blue-100)',
              color: 'var(--senai-blue-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem'
            }}>
              {profile?.nome ? profile.nome.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {profile?.nome || 'Administrador'}
              </div>
              <span className="badge badge-blue" style={{ fontSize: '0.6875rem', padding: '0.1rem 0.4rem' }}>
                {profile?.role || 'Admin'}
              </span>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="btn-icon btn-ghost show-mobile"
              style={{ border: 'none', cursor: 'pointer' }}
              title="Fechar menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Itens de Navegação */}
        <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1, overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--senai-blue-700)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--senai-blue-50)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => {
              if (onClose) onClose();
              signOut();
            }}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--senai-red-600)' }}
          >
            <LogOut size={18} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>
    </>
  );
}
