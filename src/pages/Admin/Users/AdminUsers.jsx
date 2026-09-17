import React, { useState, useEffect } from 'react';
import { api } from '../../../services/supabase';
import { Plus, Edit2, Trash2, ShieldCheck, UserCheck, Search, X } from 'lucide-react';
import { Loading } from '../../../components/Loading/Loading';
import { ConfirmModal } from '../../../components/ConfirmModal/ConfirmModal';

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    role: 'admin',
    ativo: true
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return u.nome?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ nome: '', email: '', role: 'admin', ativo: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      role: user.role || 'admin',
      ativo: user.ativo !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.saveUser({
        ...(editingUser ? { id: editingUser.id } : {}),
        ...formData
      });
      await loadUsers();
      setIsModalOpen(false);
    } catch (err) {
      alert('Erro ao salvar usuário: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await api.deleteUser(deleteCandidate.id);
      await loadUsers();
      setDeleteCandidate(null);
    } catch (err) {
      alert('Erro ao remover usuário: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Usuários & Permissões</h1>
          <p className="page-subtitle">Gerenciamento de acessos para administradores e corpo docente</p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} />
          <span>Novo Usuário</span>
        </button>
      </div>

      <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ marginBottom: '1.25rem', maxWidth: '360px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome ou e-mail..."
            className="form-control"
          />
        </div>

        {loading ? (
          <Loading message="Carregando usuários..." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Nome</th>
                <th style={{ padding: '0.75rem 1rem' }}>E-mail</th>
                <th style={{ padding: '0.75rem 1rem' }}>Perfil / Função</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--senai-blue-900)' }}>
                    {u.nome}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-blue' : 'badge-gray'}`}>
                      {u.role === 'admin' ? 'Administrador' : 'Professor'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {u.ativo !== false ? (
                      <span className="badge badge-green">Ativo</span>
                    ) : (
                      <span className="badge badge-red">Inativo</span>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="btn btn-secondary btn-sm btn-icon"
                        title="Editar"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(u)}
                        className="btn btn-ghost btn-sm btn-icon"
                        style={{ color: 'var(--senai-red-600)' }}
                        title="Remover"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Criar / Editar Usuário */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--senai-blue-900)' }}>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Carlos Eduardo Silveira"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail Institucional *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nome@senai.br"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Papel / Função *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="form-control"
                >
                  <option value="admin">Administrador (Acesso total)</option>
                  <option value="professor">Professor (Visualização docente)</option>
                </select>
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="user_ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                />
                <label htmlFor="user_ativo" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                  Usuário Ativo
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Remover Usuário"
        message={`Tem certeza que deseja remover o acesso de "${deleteCandidate?.nome}"?`}
        confirmText="Remover"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
