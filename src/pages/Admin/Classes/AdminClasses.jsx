import React, { useState } from 'react';
import { useClasses } from '../../../hooks/useClasses';
import { useCourses } from '../../../hooks/useCourses';
import { Plus, Edit2, Trash2, Search, X, Users } from 'lucide-react';
import { Loading } from '../../../components/Loading/Loading';
import { ConfirmModal } from '../../../components/ConfirmModal/ConfirmModal';

export function AdminClasses() {
  const { classes, loading: classesLoading, saveClass, deleteClass } = useClasses();
  const { courses, loading: coursesLoading } = useCourses();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    curso_id: '',
    ano: new Date().getFullYear(),
    semestre: 1,
    turno: 'Manhã',
    ativa: true
  });

  const filteredClasses = classes.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.nome.toLowerCase().includes(term) ||
      t.turno.toLowerCase().includes(term) ||
      t.cursos?.nome?.toLowerCase().includes(term) ||
      t.cursos?.sigla?.toLowerCase().includes(term)
    );
  });

  const handleOpenCreate = () => {
    setEditingClass(null);
    setFormData({
      nome: '',
      curso_id: courses[0]?.id || '',
      ano: new Date().getFullYear(),
      semestre: 1,
      turno: 'Manhã',
      ativa: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (turma) => {
    setEditingClass(turma);
    setFormData({
      nome: turma.nome,
      curso_id: turma.curso_id,
      ano: turma.ano,
      semestre: turma.semestre,
      turno: turma.turno,
      ativa: turma.ativa !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveClass({
        ...(editingClass ? { id: editingClass.id } : {}),
        ...formData
      });
      setIsModalOpen(false);
    } catch (err) {
      alert('Erro ao salvar turma: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteClass(deleteCandidate.id, true);
      setDeleteCandidate(null);
    } catch (err) {
      alert('Erro ao desativar turma: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Gerenciar Turmas</h1>
          <p className="page-subtitle">Cadastre e organize as turmas ativas por ano, semestre e turno</p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} />
          <span>Nova Turma</span>
        </button>
      </div>

      <div className="card" style={{ padding: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '1.25rem', maxWidth: '360px', width: '100%' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar turmas por nome, turno ou curso..."
            className="form-control"
          />
        </div>

        {classesLoading || coursesLoading ? (
          <Loading message="Carregando turmas..." />
        ) : filteredClasses.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Nenhuma turma encontrada.
          </p>
        ) : (
          <>
            {/* Visualização em Cartões para Dispositivos Móveis (Zero Scroll Lateral) */}
            <div className="mobile-only mobile-card-list">
              {filteredClasses.map((t) => {
                const curso = courses.find((c) => c.id === t.curso_id);
                return (
                  <div key={t.id} className="mobile-data-card">
                    <div className="mobile-card-header">
                      <div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--senai-blue-900)' }}>
                          {t.nome}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          {t.ano} • {t.semestre}º Semestre
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                        <span className="badge badge-blue">{t.turno}</span>
                        {t.ativa !== false ? (
                          <span className="badge badge-green">Ativa</span>
                        ) : (
                          <span className="badge badge-red">Inativa</span>
                        )}
                      </div>
                    </div>

                    <div className="mobile-card-body">
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {curso ? `${curso.sigla} - ${curso.nome}` : '—'}
                      </div>
                    </div>

                    <div className="mobile-card-footer">
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Turno: <strong>{t.turno}</strong>
                      </span>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.375rem 0.65rem' }}
                        >
                          <Edit2 size={14} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(t)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--senai-red-600)', padding: '0.375rem 0.65rem' }}
                        >
                          <Trash2 size={14} />
                          <span>Desativar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tabela Tradicional para Desktop / Telas Médias e Grandes */}
            <div className="desktop-only" style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Turma</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Curso</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Ano / Semestre</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Turno</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.map((t) => {
                    const curso = courses.find((c) => c.id === t.curso_id);
                    return (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--senai-blue-900)' }}>
                          {t.nome}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: 'var(--text-primary)' }}>
                          {curso ? `${curso.sigla} - ${curso.nome}` : '—'}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>
                          {t.ano} • {t.semestre}º Sem.
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span className="badge badge-blue">{t.turno}</span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          {t.ativa !== false ? (
                            <span className="badge badge-green">Ativa</span>
                          ) : (
                            <span className="badge badge-red">Inativa</span>
                          )}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenEdit(t)}
                              className="btn btn-secondary btn-sm btn-icon"
                              title="Editar"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteCandidate(t)}
                              className="btn btn-ghost btn-sm btn-icon"
                              style={{ color: 'var(--senai-red-600)' }}
                              title="Desativar"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal Nova / Editar Turma */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--senai-blue-900)' }}>
                {editingClass ? 'Editar Turma' : 'Nova Turma'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Curso *</label>
                <select
                  required
                  value={formData.curso_id}
                  onChange={(e) => setFormData({ ...formData, curso_id: e.target.value })}
                  className="form-control"
                >
                  <option value="" disabled>Selecione um curso</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.sigla} - {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nome da Turma *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value.toUpperCase() })}
                  placeholder="Ex: 2TDS1, 1MEC2"
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Ano *</label>
                  <input
                    type="number"
                    required
                    min={2020}
                    max={2035}
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Semestre *</label>
                  <select
                    value={formData.semestre}
                    onChange={(e) => setFormData({ ...formData, semestre: e.target.value })}
                    className="form-control"
                  >
                    <option value={1}>1º Semestre</option>
                    <option value={2}>2º Semestre</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Turno *</label>
                <select
                  value={formData.turno}
                  onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                  className="form-control"
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                  <option value="Integral">Integral</option>
                </select>
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="turma_ativa"
                  checked={formData.ativa}
                  onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
                />
                <label htmlFor="turma_ativa" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                  Turma Ativa
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Salvando...' : 'Salvar Turma'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Desativar Turma"
        message={`Tem certeza que deseja desativar a turma "${deleteCandidate?.nome}"?`}
        confirmText="Desativar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
