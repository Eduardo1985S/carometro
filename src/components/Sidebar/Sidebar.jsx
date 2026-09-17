import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  UserSquare2, 
  Image as ImageIcon, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Sidebar() {
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
    <aside style={{
      width: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      {/* Informações do Administrador */}
      <div style={{
        padding: '1.25rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
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

      {/* Itens de Navegação */}
      <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
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
          onClick={signOut}
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--senai-red-600)' }}
        >
          <LogOut size={18} />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
}
