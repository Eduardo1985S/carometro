import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/supabase';
import { 
  Users, 
  GraduationCap, 
  UserSquare2, 
  Image as ImageIcon, 
  PlusCircle, 
  ArrowRight, 
  ArrowUpRight,
  Clock, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { Loading } from '../../../components/Loading/Loading';
import { formatarData } from '../../../utils/calculateAge';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return <Loading message="Carregando estatísticas do painel..." />;
  }

  const statCards = [
    {
      title: 'Total de Alunos',
      value: stats.totalAlunos,
      icon: UserSquare2,
      color: 'var(--senai-blue-700)',
      bg: 'var(--senai-blue-50)',
      link: '/admin/alunos'
    },
    {
      title: 'Total de Turmas',
      value: stats.totalTurmas,
      icon: Users,
      color: '#0284c7',
      bg: '#f0f9ff',
      link: '/admin/turmas'
    },
    {
      title: 'Total de Cursos',
      value: stats.totalCursos,
      icon: GraduationCap,
      color: '#059669',
      bg: '#ecfdf5',
      link: '/admin/cursos'
    },
    {
      title: 'Fotos Armazenadas',
      value: stats.totalFotos,
      icon: ImageIcon,
      color: '#d97706',
      bg: '#fffbeb',
      link: '/admin/fotos'
    }
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Cabeçalho */}
      <div className="dashboard-header">
        <h1 className="page-title">Painel Administrativo</h1>
        <p className="page-subtitle">
          Visão geral do sistema de carômetro e gerenciamento acadêmico
        </p>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="dashboard-stats-grid">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.link}
              className="card card-interactive dashboard-stat-card"
              title={`Ver ${stat.title}`}
            >
              <div className="dashboard-stat-header">
                <div
                  className="dashboard-stat-icon-box"
                  style={{
                    backgroundColor: stat.bg,
                    color: stat.color
                  }}
                >
                  <Icon size={24} />
                </div>
                <ArrowUpRight size={18} className="dashboard-stat-arrow" />
              </div>

              <div className="dashboard-stat-body">
                <div className="dashboard-stat-value">
                  {stat.value}
                </div>
                <div className="dashboard-stat-title">
                  {stat.title}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Ações Rápidas */}
      <div className="card dashboard-card-section">
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--senai-blue-900)', marginBottom: '0.875rem' }}>
          Ações Rápidas
        </h2>
        <div className="dashboard-quick-actions-grid">
          <Link to="/admin/alunos" className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>Novo Aluno</span>
          </Link>
          <Link to="/admin/turmas" className="btn btn-secondary btn-sm">
            <PlusCircle size={15} />
            <span>Nova Turma</span>
          </Link>
          <Link to="/admin/cursos" className="btn btn-secondary btn-sm">
            <PlusCircle size={15} />
            <span>Novo Curso</span>
          </Link>
          <Link to="/" className="btn btn-secondary btn-sm">
            <ArrowRight size={15} />
            <span>Carômetro Público</span>
          </Link>
        </div>
      </div>

      {/* Alunos Cadastrados Recentemente */}
      <div className="card dashboard-card-section" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--senai-blue-900)' }}>
            Últimos Alunos Cadastrados
          </h2>
          <Link to="/admin/alunos" style={{ fontSize: '0.8125rem', color: 'var(--senai-blue-700)', fontWeight: 600 }}>
            Ver todos
          </Link>
        </div>

        {stats.recentAlunos?.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Nenhum aluno cadastrado recentemente.</p>
        ) : (
          <div className="dashboard-recent-list">
            {stats.recentAlunos.map((aluno) => {
              const foto = aluno.fotos?.[0] || aluno.aluno_fotos?.[0];
              return (
                <div key={aluno.id} className="dashboard-recent-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      backgroundColor: '#e2e8f0',
                      flexShrink: 0
                    }}>
                      {foto ? (
                        <img src={foto.thumbnail || foto.arquivo} alt={aluno.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <UserSquare2 size={20} />
                        </div>
                      )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'var(--senai-blue-900)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {aluno.nome}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        Matrícula: {aluno.matricula} • {aluno.turmas?.nome || 'Sem turma'}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    flexShrink: 0
                  }}>
                    <Clock size={12} />
                    <span>{formatarData(aluno.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
