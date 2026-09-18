import React, { useState } from 'react';
import { useClasses } from '../../../hooks/useClasses';
import { useCourses } from '../../../hooks/useCourses';
import { Plus, Edit2, Trash2, Search, X, Users, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { Loading } from '../../../components/Loading/Loading';
import { ConfirmModal } from '../../../components/ConfirmModal/ConfirmModal';

export function AdminClasses() {
  const { classes, loading: classesLoading, saveClass, deleteClass } = useClasses();
  const { courses, loading: coursesLoading } = useCourses();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('Todas'); // 'Todas' | 'Valinhos' | 'Vinhedo'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    curso_id: '',
    unidade: 'Valinhos',
    ano: new Date().getFullYear(),
    semestre: 1,
    turno: 'Manhã',
    ativa: true
  });

  // Função para calcular automaticamente o próximo nome sequencial (1, 2, 3, 4...)
  const calcularSugestaoNome = (cursoId, semestre, ano) => {
    const curso = courses.find((c) => c.id === cursoId);
    if (!curso) return '';
    const sigla = (curso.sigla || 'TURMA').toUpperCase();

    // Filtra turmas ativas deste mesmo curso
    const turmasDoCurso = classes.filter((t) => t.curso_id === cursoId && t.ativa !== false);

    // Identifica o maior número sequencial no final do nome
    let maxSeq = 0;
    turmasDoCurso.forEach((t) => {
      const match = t.nome?.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    });

    const proximoNumero = Math.max(maxSeq + 1, turmasDoCurso.length + 1);
    return `${semestre || 1}${sigla}${proximoNumero}`;
  };

  const filteredClasses = classes.filter((t) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      t.nome.toLowerCase().includes(term) ||
      t.turno.toLowerCase().includes(term) ||
      (t.unidade && t.unidade.toLowerCase().includes(term)) ||
      t.cursos?.nome?.toLowerCase().includes(term) ||
      t.cursos?.sigla?.toLowerCase().includes(term);

    const matchesUnit =
      selectedUnitFilter === 'Todas' ||
      (t.unidade || 'Valinhos') === selectedUnitFilter;

    return matchesSearch && matchesUnit;
  });

  const handleOpenCreate = () => {
    setEditingClass(null);
    const defaultCursoId = courses[0]?.id || '';
    const defaultSemestre = 1;
    const defaultAno = new Date().getFullYear();
    const nomeSugerido = calcularSugestaoNome(defaultCursoId, defaultSemestre, defaultAno);

    setFormData({
      nome: nomeSugerido,
      curso_id: defaultCursoId,
      unidade: 'Valinhos',
      ano: defaultAno,
      semestre: defaultSemestre,
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
      unidade: turma.unidade || 'Valinhos',
      ano: turma.ano,
      semestre: turma.semestre,
      turno: turma.turno,
      ativa: turma.ativa !== false
    });
    setIsModalOpen(true);
  };

  const handleCursoChange = (novoCursoId) => {
    const novoNome = !editingClass
      ? calcularSugestaoNome(novoCursoId, formData.semestre, formData.ano)
      : formData.nome;

    setFormData({
      ...formData,
      curso_id: novoCursoId,
      nome: novoNome
    });
  };

  const handleSemestreChange = (novoSemestre) => {
    const sem = parseInt(novoSemestre, 10);
    const novoNome = !editingClass
      ? calcularSugestaoNome(formData.curso_id, sem, formData.ano)
      : formData.nome;

    setFormData({
      ...formData,
      semestre: sem,
      nome: novoNome
    });
  };

  const handleRegerarNome = () => {
    const novoNome = calcularSugestaoNome(formData.curso_id, formData.semestre, formData.ano);
    setFormData((prev) => ({ ...prev, nome: novoNome }));
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
          <p className="page-subtitle">Cadastre turmas com numeração sequencial e divisão por unidade (Valinhos e Vinhedo)</p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} />
          <span>Nova Turma</span>
        </button>
      </div>

      <div className="card" style={{ padding: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
        {/* Barra de Busca e Filtros de Unidade */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ maxWidth: '360px', width: '100%' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por nome, turno, curso ou unidade..."
              className="form-control"
            />
          </div>

          {/* Filtro por Unidade */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-lg)' }}>
            <button
              type="button"
              onClick={() => setSelectedUnitFilter('Todas')}
              className={`btn btn-sm ${selectedUnitFilter === 'Todas' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}
            >
              Todas as Unidades
            </button>
            <button
              type="button"
              onClick={() => setSelectedUnitFilter('Valinhos')}
              className={`btn btn-sm ${selectedUnitFilter === 'Valinhos' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <MapPin size={13} />
              Valinhos
            </button>
            <button
              type="button"
              onClick={() => setSelectedUnitFilter('Vinhedo')}
              className={`btn btn-sm ${selectedUnitFilter === 'Vinhedo' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <MapPin size={13} />
              Vinhedo
            </button>
          </div>
        </div>

        {classesLoading || coursesLoading ? (
          <Loading message="Carregando turmas..." />
        ) : filteredClasses.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Nenhuma turma encontrada para os critérios selecionados.
          </p>
        ) : (
          <>
            {/* Visualização em Cartões para Dispositivos Móveis */}
            <div className="mobile-only mobile-card-list">
              {filteredClasses.map((t) => {
                const curso = courses.find((c) => c.id === t.curso_id);
                const unidade = t.unidade || 'Valinhos';
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
                        <span
                          className="badge"
                          style={{
                            backgroundColor: unidade === 'Vinhedo' ? '#ede9fe' : 'var(--senai-blue-50)',
                            color: unidade === 'Vinhedo' ? '#5b21b6' : 'var(--senai-blue-800)',
                            fontWeight: 600
                          }}
                        >
                          {unidade}
                        </span>
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

            {/* Tabela para Desktop */}
            <div className="desktop-only" style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Turma</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Unidade</th>
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
                    const unidade = t.unidade || 'Valinhos';
                    return (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--senai-blue-900)' }}>
                          {t.nome}
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: unidade === 'Vinhedo' ? '#ede9fe' : 'var(--senai-blue-50)',
                              color: unidade === 'Vinhedo' ? '#5b21b6' : 'var(--senai-blue-800)',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <MapPin size={12} />
                            {unidade}
                          </span>
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
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--senai-blue-900)' }}>
                  {editingClass ? 'Editar Turma' : 'Nova Turma'}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                  {!editingClass ? 'A numeração final (1, 2, 3...) é gerada automaticamente pelo curso' : 'Atualize os dados da turma'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              {/* Seleção da Unidade (Valinhos ou Vinhedo) */}
              <div className="form-group">
                <label className="form-label">Unidade SENAI *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.unidade === 'Valinhos' ? '2px solid var(--senai-blue-600)' : '1px solid var(--border-color)',
                      backgroundColor: formData.unidade === 'Valinhos' ? 'var(--senai-blue-50)' : '#ffffff',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: formData.unidade === 'Valinhos' ? 'var(--senai-blue-900)' : 'var(--text-secondary)'
                    }}
                  >
                    <input
                      type="radio"
                      name="unidade"
                      value="Valinhos"
                      checked={formData.unidade === 'Valinhos'}
                      onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                      style={{ accentColor: 'var(--senai-blue-600)' }}
                    />
                    <MapPin size={15} color="var(--senai-blue-700)" />
                    <span>Valinhos</span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.unidade === 'Vinhedo' ? '2px solid #6366f1' : '1px solid var(--border-color)',
                      backgroundColor: formData.unidade === 'Vinhedo' ? '#ede9fe' : '#ffffff',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: formData.unidade === 'Vinhedo' ? '#4338ca' : 'var(--text-secondary)'
                    }}
                  >
                    <input
                      type="radio"
                      name="unidade"
                      value="Vinhedo"
                      checked={formData.unidade === 'Vinhedo'}
                      onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                      style={{ accentColor: '#6366f1' }}
                    />
                    <MapPin size={15} color="#6366f1" />
                    <span>Vinhedo</span>
                  </label>
                </div>
              </div>

              {/* Seleção de Curso */}
              <div className="form-group">
                <label className="form-label">Curso Técnico *</label>
                <select
                  required
                  value={formData.curso_id}
                  onChange={(e) => handleCursoChange(e.target.value)}
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

              {/* Ano e Semestre */}
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
                    onChange={(e) => handleSemestreChange(e.target.value)}
                    className="form-control"
                  >
                    <option value={1}>1º Semestre</option>
                    <option value={2}>2º Semestre</option>
                  </select>
                </div>
              </div>

              {/* Nome da Turma com Numeração Sequencial */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Nome da Turma *</label>
                  <button
                    type="button"
                    onClick={handleRegerarNome}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: 'var(--senai-blue-700)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    title="Recalcular próxima numeração para este curso"
                  >
                    <RefreshCw size={12} />
                    <span>Numerar Sequencialmente</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value.toUpperCase() })}
                  placeholder="Ex: 1DS1, 1DS2, 1DS3..."
                  className="form-control"
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  ✨ Numeração sequencial no final (ex: turmas de DS são numeradas como 1, 2, 3...). Você também pode editar livremente.
                </p>
              </div>

              {/* Turno */}
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
