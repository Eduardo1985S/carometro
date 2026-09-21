import React, { useState } from 'react';
import { useStudents } from '../../../hooks/useStudents';
import { useClasses } from '../../../hooks/useClasses';
import { useCourses } from '../../../hooks/useCourses';
import { processarFotoAluno } from '../../../utils/imageCompression';
import { api } from '../../../services/supabase';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Upload, 
  Star, 
  Image as ImageIcon, 
  X, 
  UserSquare2, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Sparkles,
  Camera,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { Loading } from '../../../components/Loading/Loading';
import { SkeletonTableRow } from '../../../components/Loading/SkeletonCard';
import { ConfirmModal } from '../../../components/ConfirmModal/ConfirmModal';
import { StudentModal } from '../../../components/StudentModal/StudentModal';
import { CameraCaptureModal } from '../../../components/CameraCapture/CameraCaptureModal';
import { formatarData, calcularIdade } from '../../../utils/calculateAge';

export function AdminStudents() {
  const { students, loading: studentsLoading, saveStudent, deleteStudent } = useStudents({ isAdmin: true });
  const { classes, loading: classesLoading, saveClass } = useClasses();
  const { courses } = useCourses();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurmaFilter, setSelectedTurmaFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // Estados para Câmera e Criação Rápida de Turma
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isQuickClassModalOpen, setIsQuickClassModalOpen] = useState(false);
  const [quickClassData, setQuickClassData] = useState({
    curso_id: '',
    unidade: 'Valinhos',
    turno: 'Manhã',
    ano: new Date().getFullYear(),
    semestre: 1,
    nome: ''
  });
  const [savingQuickClass, setSavingQuickClass] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    turma_id: '',
    data_nascimento: '',
    email: '',
    telefone: '',
    observacao: '',
    ativo: true,
    fotos: []
  });

  const filteredStudents = students.filter((aluno) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      aluno.nome?.toLowerCase().includes(term) ||
      aluno.matricula?.toLowerCase().includes(term) ||
      aluno.email?.toLowerCase().includes(term);

    const matchTurma = selectedTurmaFilter ? aluno.turma_id === selectedTurmaFilter : true;
    return matchSearch && matchTurma;
  });

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setFormData({
      nome: '',
      matricula: '',
      turma_id: classes[0]?.id || '',
      data_nascimento: '',
      email: '',
      telefone: '',
      observacao: '',
      ativo: true,
      fotos: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    const existingFotos = (student.fotos || student.aluno_fotos || []).map((f, idx) => ({
      id: f.id || `f_temp_${idx}`,
      arquivo: f.arquivo,
      thumbnail: f.thumbnail || f.arquivo,
      principal: Boolean(f.principal),
      ordem: f.ordem || (idx + 1)
    }));

    setFormData({
      nome: student.nome,
      matricula: student.matricula || '',
      turma_id: student.turma_id,
      data_nascimento: student.data_nascimento ? student.data_nascimento.substring(0, 10) : '',
      email: student.email || '',
      telefone: student.telefone || '',
      observacao: student.observacao || '',
      ativo: student.ativo !== false,
      fotos: existingFotos
    });
    setIsModalOpen(true);
  };

  // Upload e Compressão de Fotos com WebP
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setCompressing(true);
    try {
      const newFotosList = [...formData.fotos];

      for (const file of files) {
        // Redimensionar e converter para WebP
        const { perfilFile, thumbFile, perfilPreviewUrl, thumbPreviewUrl } = await processarFotoAluno(file);

        // Upload no Storage
        const pathPerfil = `${Date.now()}_${file.name.replace(/\.[^/.]+$/, '')}.webp`;
        const pathThumb = `${Date.now()}_${file.name.replace(/\.[^/.]+$/, '')}_thumb.webp`;

        const finalPerfilUrl = await api.uploadFotoStorage(perfilFile, pathPerfil);
        const finalThumbUrl = await api.uploadFotoStorage(thumbFile, pathThumb);

        const isFirst = newFotosList.length === 0;

        newFotosList.push({
          id: `f_temp_${Date.now()}_${Math.random()}`,
          arquivo: finalPerfilUrl,
          thumbnail: finalThumbUrl,
          principal: isFirst,
          ordem: newFotosList.length + 1
        });
      }

      setFormData((prev) => ({ ...prev, fotos: newFotosList }));
    } catch (err) {
      console.error('Erro no upload de foto:', err);
      alert('Erro ao processar imagem: ' + err.message);
    } finally {
      setCompressing(false);
    }
  };

  const handleSetPrincipal = (fotoIndex) => {
    const updated = formData.fotos.map((f, idx) => ({
      ...f,
      principal: idx === fotoIndex
    }));
    setFormData((prev) => ({ ...prev, fotos: updated }));
  };

  const handleRemovePhoto = (fotoIndex) => {
    const updated = formData.fotos.filter((_, idx) => idx !== fotoIndex);
    // Se removeu a principal, marca a primeira como principal
    if (updated.length > 0 && !updated.some((f) => f.principal)) {
      updated[0].principal = true;
    }
    setFormData((prev) => ({ ...prev, fotos: updated }));
  };

  // Captura via Câmera / Webcam
  const handleCameraCapture = async (file) => {
    setCompressing(true);
    try {
      const { perfilFile, thumbFile } = await processarFotoAluno(file);
      const pathPerfil = `${Date.now()}_camera.webp`;
      const pathThumb = `${Date.now()}_camera_thumb.webp`;

      const finalPerfilUrl = await api.uploadFotoStorage(perfilFile, pathPerfil);
      const finalThumbUrl = await api.uploadFotoStorage(thumbFile, pathThumb);

      const isFirst = formData.fotos.length === 0;
      const newFoto = {
        id: `f_temp_${Date.now()}_${Math.random()}`,
        arquivo: finalPerfilUrl,
        thumbnail: finalThumbUrl,
        principal: isFirst,
        ordem: formData.fotos.length + 1
      };

      setFormData((prev) => ({ ...prev, fotos: [...prev.fotos, newFoto] }));
    } catch (err) {
      console.error('Erro ao processar foto da câmera:', err);
      alert('Erro ao salvar foto da câmera: ' + err.message);
    } finally {
      setCompressing(false);
    }
  };

  // Abrir Modal de Criação Rápida de Turma
  const handleOpenQuickClass = () => {
    const defaultCursoId = courses[0]?.id || '';
    const sigla = courses[0]?.sigla || 'DS';
    const count = classes.filter((t) => t.curso_id === defaultCursoId).length + 1;

    setQuickClassData({
      curso_id: defaultCursoId,
      unidade: 'Valinhos',
      turno: 'Manhã',
      ano: new Date().getFullYear(),
      semestre: 1,
      nome: `1${sigla}${count}`
    });
    setIsQuickClassModalOpen(true);
  };

  const handleQuickClassCourseChange = (novoCursoId) => {
    const curso = courses.find((c) => c.id === novoCursoId);
    const sigla = curso?.sigla || 'TURMA';
    const count = classes.filter((t) => t.curso_id === novoCursoId).length + 1;

    setQuickClassData((prev) => ({
      ...prev,
      curso_id: novoCursoId,
      nome: `${prev.semestre || 1}${sigla}${count}`
    }));
  };

  const handleSaveQuickClass = async (e) => {
    e.preventDefault();
    setSavingQuickClass(true);
    try {
      const saved = await saveClass({
        ...quickClassData,
        ativa: true
      });
      setIsQuickClassModalOpen(false);
      // Seleciona automaticamente a turma criada no formulário do aluno
      if (saved && saved.id) {
        setFormData((prev) => ({ ...prev, turma_id: saved.id }));
      }
    } catch (err) {
      alert('Erro ao criar turma rápida: ' + err.message);
    } finally {
      setSavingQuickClass(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveStudent({
        ...(editingStudent ? { id: editingStudent.id } : {}),
        ...formData
      });
      setIsModalOpen(false);
    } catch (err) {
      alert('Erro ao salvar aluno: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteStudent(deleteCandidate.id, true);
      setDeleteCandidate(null);
    } catch (err) {
      alert('Erro ao desativar aluno: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Topo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Gerenciar Alunos</h1>
          <p className="page-subtitle">Cadastro completo de alunos, fotos em carrossel e dados acadêmicos</p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} />
          <span>Cadastrar Aluno</span>
        </button>
      </div>

      {/* Filtros */}
      {/* Filtros Fluidos */}
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, matrícula ou e-mail..."
          className="form-control"
          style={{ maxWidth: '320px', flex: '1 1 220px' }}
        />

        <select
          value={selectedTurmaFilter}
          onChange={(e) => setSelectedTurmaFilter(e.target.value)}
          className="form-control"
          style={{ maxWidth: '240px', flex: '1 1 180px' }}
        >
          <option value="">Todas as turmas</option>
          {classes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome} — SENAI {t.unidade || 'Valinhos'} ({t.turno})
            </option>
          ))}
        </select>
      </div>

      {/* Tabela / Cards de Alunos */}
      <div className="card" style={{ padding: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
        {studentsLoading || classesLoading ? (
          <Loading message="Carregando alunos..." />
        ) : filteredStudents.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Nenhum aluno encontrado com os filtros atuais.
          </p>
        ) : (
          <>
            {/* Visualização em Cartões Mobile (Zero Scroll Lateral) */}
            <div className="mobile-only mobile-card-list">
              {filteredStudents.map((aluno) => {
                const fotos = aluno.fotos || aluno.aluno_fotos || [];
                const fotoPrincipal = fotos.find((f) => f.principal) || fotos[0];
                const turma = classes.find((t) => t.id === aluno.turma_id);

                return (
                  <div key={aluno.id} className="mobile-data-card">
                    <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        backgroundColor: '#f1f5f9',
                        flexShrink: 0
                      }}>
                        {fotoPrincipal ? (
                          <img
                            src={fotoPrincipal.thumbnail || fotoPrincipal.arquivo}
                            alt={aluno.nome}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            <UserSquare2 size={24} />
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--senai-blue-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {aluno.nome}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Matrícula: <strong>{aluno.matricula}</strong>
                        </div>
                      </div>

                      <div style={{ flexShrink: 0 }}>
                        {aluno.ativo !== false ? (
                          <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Ativo</span>
                        ) : (
                          <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>Inativo</span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <div>
                        Turma: <span className="badge badge-blue">{turma?.nome || '—'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                          ({turma?.unidade || 'Valinhos'})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {fotos.length} {fotos.length === 1 ? 'foto' : 'fotos'}
                      </div>
                    </div>

                    <div className="mobile-card-footer">
                      <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => setViewingStudent(aluno)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.375rem 0.65rem' }}
                        >
                          <Eye size={14} />
                          <span>Ver</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(aluno)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.375rem 0.65rem' }}
                        >
                          <Edit2 size={14} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(aluno)}
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

            {/* Tabela Tradicional Desktop */}
            <div className="desktop-only" style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Foto</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Nome do Aluno</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Matrícula</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Turma</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Fotos</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((aluno) => {
                    const fotos = aluno.fotos || aluno.aluno_fotos || [];
                    const fotoPrincipal = fotos.find((f) => f.principal) || fotos[0];
                    const turma = classes.find((t) => t.id === aluno.turma_id);

                    return (
                      <tr key={aluno.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            backgroundColor: '#f1f5f9',
                            flexShrink: 0
                          }}>
                            {fotoPrincipal ? (
                              <img
                                src={fotoPrincipal.thumbnail || fotoPrincipal.arquivo}
                                alt={aluno.nome}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                <UserSquare2 size={24} />
                              </div>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--senai-blue-900)' }}>{aluno.nome}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{aluno.email || 'Sem e-mail'}</div>
                        </td>

                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {aluno.matricula}
                        </td>

                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span className="badge badge-blue">{turma?.nome || '—'}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              SENAI {turma?.unidade || 'Valinhos'}
                            </span>
                          </div>
                        </td>

                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                          {fotos.length} {fotos.length === 1 ? 'foto' : 'fotos'}
                        </td>

                        <td style={{ padding: '0.75rem 1rem' }}>
                          {aluno.ativo !== false ? (
                            <span className="badge badge-green">Ativo</span>
                          ) : (
                            <span className="badge badge-red">Inativo</span>
                          )}
                        </td>

                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                            <button
                              onClick={() => setViewingStudent(aluno)}
                              className="btn btn-secondary btn-sm btn-icon"
                              title="Visualizar Perfil Completo"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(aluno)}
                              className="btn btn-secondary btn-sm btn-icon"
                              title="Editar Cadastro e Fotos"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteCandidate(aluno)}
                              className="btn btn-ghost btn-sm btn-icon"
                              style={{ color: 'var(--senai-red-600)' }}
                              title="Desativar Aluno"
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

      {/* Modal Formulário de Aluno com Upload de Múltiplas Fotos */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--senai-blue-900)' }}>
                {editingStudent ? 'Editar Aluno' : 'Novo Aluno'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon btn-ghost">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: João Pedro da Silva"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Matrícula *</label>
                  <input
                    type="text"
                    required
                    value={formData.matricula}
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    placeholder="Ex: 20261010"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Turma *</label>
                    <button
                      type="button"
                      onClick={handleOpenQuickClass}
                      className="btn btn-ghost btn-sm"
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.5rem',
                        color: 'var(--senai-blue-700)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      title="Cadastrar uma turma rapidamente sem sair desta tela"
                    >
                      <Plus size={13} />
                      <span>+ Nova Turma</span>
                    </button>
                  </div>

                  {classes.length === 0 ? (
                    <div style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem',
                      color: '#92400e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                        <span>Nenhuma turma cadastrada.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenQuickClass}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        + Criar Turma
                      </button>
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.turma_id}
                      onChange={(e) => setFormData({ ...formData, turma_id: e.target.value })}
                      className="form-control"
                    >
                      <option value="" disabled>Selecione a turma</option>
                      {classes.map((t) => {
                        const curso = courses.find((c) => c.id === t.curso_id);
                        return (
                          <option key={t.id} value={t.id}>
                            {t.nome} {curso ? `(${curso.sigla})` : ''} — SENAI {t.unidade || 'Valinhos'} ({t.turno})
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aluno@senai.br"
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Observação Interna</label>
                  <textarea
                    rows={2}
                    value={formData.observacao}
                    onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                    placeholder="Informações adicionais pedagógicas ou administrativas..."
                    className="form-control"
                  />
                </div>
              </div>

              {/* Seção de Fotos do Aluno */}
              <div style={{
                marginTop: '1rem',
                padding: '1.25rem',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--senai-blue-900)' }}>
                      Fotos do Aluno (Carômetro)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Imagens são comprimidas automaticamente em WebP para máxima performance
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Botão Câmera */}
                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      disabled={compressing}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                      title="Tirar foto usando a câmera do computador ou celular"
                    >
                      <Camera size={15} />
                      <span>Tirar Foto</span>
                    </button>

                    {/* Botão Galeria */}
                    <label
                      className="btn btn-secondary btn-sm"
                      style={{ cursor: compressing ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                      title="Escolher arquivos da galeria ou computador"
                    >
                      <Upload size={15} />
                      <span>{compressing ? 'Comprimindo...' : 'Galeria / Arquivo'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={compressing}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                {formData.fotos.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Nenhuma foto adicionada ainda. Use "Tirar Foto" com a câmera ou escolha fotos da galeria.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                    {formData.fotos.map((f, idx) => (
                      <div
                        key={f.id || idx}
                        style={{
                          position: 'relative',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          border: f.principal ? '2px solid var(--senai-blue-700)' : '1px solid var(--border-color)',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <img
                          src={f.thumbnail || f.arquivo}
                          alt={`Foto ${idx + 1}`}
                          style={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', display: 'block' }}
                        />

                        {/* Tag Principal */}
                        {f.principal && (
                          <div style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            backgroundColor: 'var(--senai-blue-700)',
                            color: '#ffffff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.625rem',
                            fontWeight: 700
                          }}>
                            PRINCIPAL
                          </div>
                        )}

                        {/* Barra de Ações da Foto */}
                        <div style={{
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#ffffff',
                          borderTop: '1px solid var(--border-color)'
                        }}>
                          <button
                            type="button"
                            onClick={() => handleSetPrincipal(idx)}
                            className="btn-icon btn-ghost"
                            title="Definir como foto principal"
                            style={{ padding: '3px', color: f.principal ? 'var(--warning)' : 'var(--text-muted)' }}
                          >
                            <Star size={14} fill={f.principal ? 'var(--warning)' : 'none'} />
                          </button>

                          <div style={{ display: 'flex', gap: '2px' }}>
                            <button
                              type="button"
                              onClick={() => handleMovePhoto(idx, idx - 1)}
                              disabled={idx === 0}
                              className="btn-icon btn-ghost"
                              style={{ padding: '3px' }}
                              title="Mover para a esquerda"
                            >
                              <ArrowUp size={14} style={{ transform: 'rotate(-90deg)' }} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMovePhoto(idx, idx + 1)}
                              disabled={idx === formData.fotos.length - 1}
                              className="btn-icon btn-ghost"
                              style={{ padding: '3px' }}
                              title="Mover para a direita"
                            >
                              <ArrowDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="btn-icon btn-ghost"
                            style={{ padding: '3px', color: 'var(--senai-red-600)' }}
                            title="Remover foto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botões de Ação do Formulário */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={saving || compressing} className="btn btn-primary">
                  {saving ? 'Salvando...' : 'Salvar Aluno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Captura via Câmera */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Modal de Criação Rápida de Turma */}
      {isQuickClassModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setIsQuickClassModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--senai-blue-900)', margin: 0 }}>
                Cadastrar Turma Rápida
              </h4>
              <button onClick={() => setIsQuickClassModalOpen(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuickClass}>
              <div className="form-group">
                <label className="form-label">Unidade SENAI *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.625rem',
                    borderRadius: 'var(--radius-md)',
                    border: quickClassData.unidade === 'Valinhos' ? '2px solid var(--senai-blue-600)' : '1px solid var(--border-color)',
                    backgroundColor: quickClassData.unidade === 'Valinhos' ? 'var(--senai-blue-50)' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontWeight: 600
                  }}>
                    <input
                      type="radio"
                      name="quick_unidade"
                      value="Valinhos"
                      checked={quickClassData.unidade === 'Valinhos'}
                      onChange={(e) => setQuickClassData({ ...quickClassData, unidade: e.target.value })}
                    />
                    <span>Valinhos</span>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.625rem',
                    borderRadius: 'var(--radius-md)',
                    border: quickClassData.unidade === 'Vinhedo' ? '2px solid #6366f1' : '1px solid var(--border-color)',
                    backgroundColor: quickClassData.unidade === 'Vinhedo' ? '#ede9fe' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontWeight: 600
                  }}>
                    <input
                      type="radio"
                      name="quick_unidade"
                      value="Vinhedo"
                      checked={quickClassData.unidade === 'Vinhedo'}
                      onChange={(e) => setQuickClassData({ ...quickClassData, unidade: e.target.value })}
                    />
                    <span>Vinhedo</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Curso Técnico *</label>
                <select
                  required
                  value={quickClassData.curso_id}
                  onChange={(e) => handleQuickClassCourseChange(e.target.value)}
                  className="form-control"
                >
                  <option value="" disabled>Selecione o curso</option>
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
                  value={quickClassData.nome}
                  onChange={(e) => setQuickClassData({ ...quickClassData, nome: e.target.value.toUpperCase() })}
                  placeholder="Ex: 1DS1, 1MEC1..."
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Semestre *</label>
                  <select
                    value={quickClassData.semestre}
                    onChange={(e) => setQuickClassData({ ...quickClassData, semestre: parseInt(e.target.value, 10) })}
                    className="form-control"
                  >
                    <option value={1}>1º Semestre</option>
                    <option value={2}>2º Semestre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Turno *</label>
                  <select
                    value={quickClassData.turno}
                    onChange={(e) => setQuickClassData({ ...quickClassData, turno: e.target.value })}
                    className="form-control"
                  >
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                    <option value="Integral">Integral</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsQuickClassModalOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={savingQuickClass} className="btn btn-primary">
                  {savingQuickClass ? 'Salvando...' : 'Criar e Selecionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visualizador Completo do Aluno (com dados sensíveis) */}
      <StudentModal
        student={viewingStudent}
        isOpen={Boolean(viewingStudent)}
        onClose={() => setViewingStudent(null)}
        isAdmin={true}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Desativar Aluno"
        message={`Tem certeza que deseja desativar o cadastro de "${deleteCandidate?.nome}"?`}
        confirmText="Desativar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
