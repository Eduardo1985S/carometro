import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

function requireSupabase() {
  if (!supabase) throw new Error('Supabase não está configurado.');
  return supabase;
}

export const api = {
  async getCursos() {
    const { data, error } = await requireSupabase().from('cursos').select('*').order('nome');
    if (error) throw error;
    return data;
  },
  async saveCurso(curso) {
    const client = requireSupabase();
    const payload = { nome: curso.nome, sigla: curso.sigla, descricao: curso.descricao || null, ativo: curso.ativo !== false, updated_at: new Date().toISOString() };
    const query = curso.id ? client.from('cursos').update(payload).eq('id', curso.id) : client.from('cursos').insert(payload);
    const { data, error } = await query.select().single();
    if (error) throw error;
    return data;
  },
  async deleteCurso(id, logical = true) {
    const { error } = logical ? await requireSupabase().from('cursos').update({ ativo: false }).eq('id', id) : await requireSupabase().from('cursos').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  async getTurmas(cursoId = null) {
    let query = requireSupabase().from('turmas').select('*, cursos(nome, sigla)').order('nome');
    if (cursoId) query = query.eq('curso_id', cursoId);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  async saveTurma(turma) {
    const client = requireSupabase();
    const payload = { nome: turma.nome, curso_id: turma.curso_id, unidade: turma.unidade || 'Valinhos', ano: Number(turma.ano), semestre: Number(turma.semestre), turno: turma.turno, ativa: turma.ativa !== false, updated_at: new Date().toISOString() };
    const query = turma.id ? client.from('turmas').update(payload).eq('id', turma.id) : client.from('turmas').insert(payload);
    const { data, error } = await query.select().single();
    if (error) throw error;
    return data;
  },
  async deleteTurma(id, logical = true) {
    const { error } = logical ? await requireSupabase().from('turmas').update({ ativa: false }).eq('id', id) : await requireSupabase().from('turmas').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  async getAlunos({ turmaId = null, cursoId = null, isAdmin = false, search = '' } = {}) {
    const client = requireSupabase();
    let query = isAdmin ? client.from('alunos').select('*, turmas(id, nome, curso_id, cursos(id, nome, sigla)), aluno_fotos(*)').order('nome') : client.from('carometro_publico').select('*').order('nome');
    if (turmaId) query = query.eq('turma_id', turmaId);
    if (cursoId && !isAdmin) query = query.eq('curso_id', cursoId);
    if (search) query = query.ilike('nome', `%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  async saveAluno(aluno) {
    const client = requireSupabase();
    const { fotos = [], id, turma_id, nome, matricula, data_nascimento, email, telefone, observacao, ativo } = aluno;
    const payload = {
      turma_id,
      nome,
      matricula,
      data_nascimento: data_nascimento || null,
      email: email || null,
      telefone: telefone || null,
      observacao: observacao || null,
      ativo: ativo !== false,
      updated_at: new Date().toISOString()
    };
    const query = id ? client.from('alunos').update(payload).eq('id', id) : client.from('alunos').insert(payload);
    const { data, error } = await query.select().single();
    if (error) throw error;
    for (const [index, foto] of fotos.entries()) {
      const photoPayload = { aluno_id: data.id, arquivo: foto.arquivo, thumbnail: foto.thumbnail || foto.arquivo, principal: Boolean(foto.principal), ordem: foto.ordem || index + 1 };
      const result = foto.id ? await client.from('aluno_fotos').update(photoPayload).eq('id', foto.id) : await client.from('aluno_fotos').insert(photoPayload);
      if (result.error) throw result.error;
    }
    return data;
  },
  async deleteAluno(id, logical = true) {
    const { error } = logical ? await requireSupabase().from('alunos').update({ ativo: false }).eq('id', id) : await requireSupabase().from('alunos').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  async uploadFotoStorage(file, path) {
    const client = requireSupabase();
    const { error } = await client.storage.from('alunos').upload(path, file, { cacheControl: '3600', upsert: true, contentType: file.type || 'image/webp' });
    if (error) throw error;
    return client.storage.from('alunos').getPublicUrl(path).data.publicUrl;
  },
  async getUsers() {
    const { data, error } = await requireSupabase().from('profiles').select('*').order('nome');
    if (error) throw error;
    return data;
  },
  async saveUser(user) {
    const { data, error } = await requireSupabase().from('profiles').upsert(user).select().single();
    if (error) throw error;
    return data;
  },
  async deleteUser(id) {
    const { error } = await requireSupabase().from('profiles').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  async getDashboardStats() {
    const [cursos, turmas, alunos] = await Promise.all([this.getCursos(), this.getTurmas(), this.getAlunos({ isAdmin: true })]);
    return { totalCursos: cursos.filter((item) => item.ativo).length, totalTurmas: turmas.filter((item) => item.ativa).length, totalAlunos: alunos.filter((item) => item.ativo).length, totalFotos: alunos.reduce((total, item) => total + (item.aluno_fotos?.length || 0), 0), recentAlunos: [...alunos].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 5) };
  }
};
