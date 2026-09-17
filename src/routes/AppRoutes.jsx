import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { CourseClasses } from '../pages/Courses/CourseClasses';
import { Carometro } from '../pages/Students/Carometro';

import { Login } from '../pages/Admin/Login/Login';
import { Dashboard } from '../pages/Admin/Dashboard/Dashboard';
import { AdminCourses } from '../pages/Admin/Courses/AdminCourses';
import { AdminClasses } from '../pages/Admin/Classes/AdminClasses';
import { AdminStudents } from '../pages/Admin/Students/AdminStudents';
import { AdminPhotos } from '../pages/Admin/Photos/AdminPhotos';
import { AdminUsers } from '../pages/Admin/Users/AdminUsers';

import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Menu } from 'lucide-react';

function AdminLayoutWrapper({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getPageName = () => {
    if (location.pathname.includes('/cursos')) return 'Cursos';
    if (location.pathname.includes('/turmas')) return 'Turmas';
    if (location.pathname.includes('/alunos')) return 'Alunos';
    if (location.pathname.includes('/fotos')) return 'Galeria de Fotos';
    if (location.pathname.includes('/usuarios')) return 'Usuários';
    return 'Painel Geral';
  };

  return (
    <div className="admin-layout">
      {/* Barra superior de navegação exclusiva para Mobile no Admin */}
      <div className="admin-mobile-bar show-mobile">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.4rem 0.65rem' }}
          title="Abrir Menu de Navegação"
        >
          <Menu size={18} />
          <span>Menu Admin</span>
        </button>

        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--senai-blue-900)' }}>
          {getPageName()}
        </span>
      </div>

      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="admin-main">
        <div className="admin-content-container">
          {children}
        </div>
      </main>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/carometro" element={<Home />} />
      <Route path="/curso/:cursoId" element={<CourseClasses />} />
      <Route path="/turma/:turmaId" element={<Carometro />} />

      {/* Autenticação Admin */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Rotas Administrativas Protegidas */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayoutWrapper>
              <Dashboard />
            </AdminLayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cursos"
        element={
          <ProtectedRoute>
            <AdminLayoutWrapper>
              <AdminCourses />
            </AdminLayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/turmas"
        element={
          <ProtectedRoute>
            <AdminLayoutWrapper>
              <AdminClasses />
            </AdminLayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/alunos"
        element={
          <ProtectedRoute>
            <AdminLayoutWrapper>
              <AdminStudents />
            </AdminLayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/fotos"
        element={
          <ProtectedRoute>
            <AdminLayoutWrapper>
              <AdminPhotos />
            </AdminLayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute>
            <AdminLayoutWrapper>
              <AdminUsers />
            </AdminLayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
