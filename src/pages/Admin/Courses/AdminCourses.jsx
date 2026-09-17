import React, { useState } from 'react';
import { useCourses } from '../../../hooks/useCourses';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Search, X, GraduationCap } from 'lucide-react';
import { Loading } from '../../../components/Loading/Loading';
import { SkeletonTableRow } from '../../../components/Loading/SkeletonCard';
import { ConfirmModal } from '../../../components/ConfirmModal/ConfirmModal';

export function AdminCourses() {
  const { courses, loading, saveCourse, deleteCourse } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    descricao: '',
    ativo: true
  });

  const filteredCourses = courses.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.nome.toLowerCase().includes(term) ||
      c.sigla.toLowerCase().includes(term)
    );
  });

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({ nome: '', sigla: '', descricao: '', ativo: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      nome: course.nome,
      sigla: course.sigla,
      descricao: course.descricao || '',
      ativo: course.ativo !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveCourse({
        ...(editingCourse ? { id: editingCourse.id } : {}),
        ...formData
      });
      setIsModalOpen(false);
    } catch (err) {
      alert('Erro ao salvar curso: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteCourse(deleteCandidate.id, true); // Exclusão lógica
      setDeleteCandidate(null);
    } catch (err) {
      alert('Erro ao excluir curso: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Topo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Gerenciar Cursos</h1>
          <p className="page-subtitle">Cadastre e gerencie as formações técnicas e cursos SENAI</p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} />
          <span>Novo Curso</span>
        </button>
      </div>

      {/* Tabela de Cursos */}
      <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ marginBottom: '1.25rem', maxWidth: '360px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar cursos..."
            className="form-control"
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Sigla</th>
              <th style={{ padding: '0.75rem 1rem' }}>Nome do Curso</th>
              <th style={{ padding: '0.75rem 1rem' }}>Descrição</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <SkeletonTableRow key={idx} columns={5} />
              ))
            ) : filteredCourses.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span className="badge badge-blue">{c.sigla}</span>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--senai-blue-900)' }}>
                  {c.nome}
                </td>
                <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                  {c.descricao || '—'}
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  {c.ativo !== false ? (
                    <span className="badge badge-green">Ativo</span>
                  ) : (
                    <span className="badge badge-red">Inativo</span>
                  )}
                </td>
                <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="btn btn-secondary btn-sm btn-icon"
                      title="Editar"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(c)}
                      className="btn btn-ghost btn-sm btn-icon"
                      style={{ color: 'var(--senai-red-600)' }}
                      title="Desativar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro / Edição */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--senai-blue-900)' }}>
                {editingCourse ? 'Editar Curso' : 'Novo Curso'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Nome do Curso *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Técnico em Desenvolvimento de Sistemas"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sigla do Curso *</label>
                <input
                  type="text"
                  required
                  value={formData.sigla}
                  onChange={(e) => setFormData({ ...formData, sigla: e.target.value.toUpperCase() })}
                  placeholder="Ex: TDS"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Breve resumo da matriz curricular ou foco do curso..."
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                />
                <label htmlFor="ativo" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                  Curso Ativo
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Salvando...' : 'Salvar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Desativar Curso"
        message={`Tem certeza que deseja desativar o curso "${deleteCandidate?.nome}"? Ele não aparecerá mais no carômetro público.`}
        confirmText="Desativar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
