import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  GraduationCap, 
  Menu 
} from 'lucide-react';

export function MobileTabBar({ onOpenMenu }) {
  const location = useLocation();
  const isMoreActive = location.pathname.includes('/fotos') || location.pathname.includes('/usuarios');

  const tabs = [
    { to: '/admin/dashboard', label: 'Painel', icon: LayoutDashboard },
    { to: '/admin/turmas', label: 'Turmas', icon: Users },
    { to: '/admin/alunos', label: 'Alunos', icon: UserSquare2 },
    { to: '/admin/cursos', label: 'Cursos', icon: GraduationCap }
  ];

  return (
    <nav className="mobile-tab-bar show-mobile" aria-label="Navegação móvel principal">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => 
              `mobile-tab-item ${isActive ? 'active' : ''}`
            }
          >
            <div className="mobile-tab-icon-wrapper">
              <Icon size={20} className="mobile-tab-icon" />
            </div>
            <span className="mobile-tab-label">{tab.label}</span>
          </NavLink>
        );
      })}

      {/* 5ª Aba: Mais / Menu lateral */}
      <button
        type="button"
        onClick={onOpenMenu}
        className={`mobile-tab-item mobile-tab-button ${isMoreActive ? 'active' : ''}`}
        aria-label="Abrir menu mais opções"
      >
        <div className="mobile-tab-icon-wrapper">
          <Menu size={20} className="mobile-tab-icon" />
          {isMoreActive && <span className="mobile-tab-badge" />}
        </div>
        <span className="mobile-tab-label">Mais</span>
      </button>
    </nav>
  );
}
