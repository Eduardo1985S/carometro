import { createClient } from '@supabase/supabase-js';
import { INITIAL_CURSOS, INITIAL_TURMAS, INITIAL_ALUNOS, INITIAL_USERS } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('seu-projeto')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// STORAGE LOCAL / MOCK FALLBACK
// ============================================================================
const STORAGE_KEYS = {
  CURSOS: 'senai_carometro_cursos_v3',
  TURMAS: 'senai_carometro_turmas_v3',
  ALUNOS: 'senai_carometro_alunos_v3',
  USERS: 'senai_carometro_users_v3'
};

// Limpa caches antigos de versões anteriores
try {
  [
    'senai_carometro_cursos', 'senai_carometro_turmas', 'senai_carometro_alunos', 'senai_carometro_users',
    'senai_carometro_cursos_v2', 'senai_carometro_turmas_v2', 'senai_carometro_alunos_v2', 'senai_carometro_users_v2'
  ].forEach(k => {
    if (localStorage.getItem(k)) localStorage.removeItem(k);
  });
} catch (e) {}

function getLocalData(key, initialData) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    const parsed = JSON.parse(item);
    // Se estiver vazio mas houver dados iniciais recomendados (como cursos ou turmas), inicializa com initialData
    if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(initialData) && initialData.length > 0) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return parsed;
  } catch (e) {
    return initialData;
  }
}

function saveLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Erro ao salvar no localStorage', e);
  }
}

// ============================================================================
// SERVIÇOS UNIFICADOS (SUPABASE REAL + LOCAL FALLBACK)
// ============================================================================

export const api = {
  // CURSOS
  async getCursos() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .order('nome', { ascending: true });
      if (error) throw error;
      return data;
    }
    return getLocalData(STORAGE_KEYS.CURSOS, INITIAL_CURSOS);
  },

  async saveCurso(curso) {
    if (isSupabaseConfigured) {
      if (curso.id && !curso.id.startsWith('c_temp_')) {
        const { data, error } = await supabase
          .from('cursos')
          .update({ nome: curso.nome, sigla: curso.sigla, descricao: curso.descricao, ativo: curso.ativo, updated_at: new Date() })
          .eq('id', curso.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('cursos')
          .insert([{ nome: curso.nome, sigla: curso.sigla, descricao: curso.descricao, ativo: curso.ativo !== false }])
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    }

    const cursos = getLocalData(STORAGE_KEYS.CURSOS, INITIAL_CURSOS);
    if (curso.id) {
      const index = cursos.findIndex(c => c.id === curso.id);
      if (index !== -1) {
        cursos[index] = { ...cursos[index], ...curso };
      }
    } else {
      const newCurso = {
        ...curso,
        id: 'c_' + Date.now(),
        ativo: curso.ativo !== false,
        created_at: new Date().toISOString()
      };
      cursos.push(newCurso);
    }
    saveLocalData(STORAGE_KEYS.CURSOS, cursos);
    return curso;
  },

  async deleteCurso(cursoId, logical = true) {
    if (isSupabaseConfigured) {
      if (logical) {
        const { error } = await supabase.from('cursos').update({ ativo: false }).eq('id', cursoId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('cursos').delete().eq('id', cursoId);
        if (error) throw error;
      }
      return true;
    }

    let cursos = getLocalData(STORAGE_KEYS.CURSOS, INITIAL_CURSOS);
    if (logical) {
      cursos = cursos.map(c => c.id === cursoId ? { ...c, ativo: false } : c);
    } else {
      cursos = cursos.filter(c => c.id !== cursoId);
    }
    saveLocalData(STORAGE_KEYS.CURSOS, cursos);
    return true;
  },

  // TURMAS
  async getTurmas(cursoId = null) {
    if (isSupabaseConfigured) {
      let query = supabase.from('turmas').select('*, cursos(nome, sigla)').order('nome', { ascending: true });
      if (cursoId) {
        query = query.eq('curso_id', cursoId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }

    const turmas = getLocalData(STORAGE_KEYS.TURMAS, INITIAL_TURMAS);
    const cursos = getLocalData(STORAGE_KEYS.CURSOS, INITIAL_CURSOS);
    
    const enriched = turmas.map(t => {
      const c = cursos.find(item => item.id === t.curso_id);
      return {
        ...t,
        unidade: t.unidade || 'Valinhos',
        cursos: c ? { nome: c.nome, sigla: c.sigla } : null
      };
    });

    if (cursoId) {
      return enriched.filter(t => t.curso_id === cursoId);
    }
    return enriched;
  },

  async saveTurma(turma) {
    if (isSupabaseConfigured) {
      if (turma.id && !turma.id.startsWith('t_temp_')) {
        const { data, error } = await supabase
          .from('turmas')
          .update({
            nome: turma.nome,
            curso_id: turma.curso_id,
            unidade: turma.unidade || 'Valinhos',
            ano: parseInt(turma.ano, 10),
            semestre: parseInt(turma.semestre, 10),
            turno: turma.turno,
            ativa: turma.ativa,
            updated_at: new Date()
          })
          .eq('id', turma.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('turmas')
          .insert([{
            nome: turma.nome,
            curso_id: turma.curso_id,
            unidade: turma.unidade || 'Valinhos',
            ano: parseInt(turma.ano, 10),
            semestre: parseInt(turma.semestre, 10),
            turno: turma.turno,
            ativa: turma.ativa !== false
          }])
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    }

    const turmas = getLocalData(STORAGE_KEYS.TURMAS, INITIAL_TURMAS);
    if (turma.id) {
      const idx = turmas.findIndex(t => t.id === turma.id);
      if (idx !== -1) {
        turmas[idx] = { ...turmas[idx], ...turma, unidade: turma.unidade || 'Valinhos' };
      }
    } else {
      const newTurma = {
        ...turma,
        id: 't_' + Date.now(),
        unidade: turma.unidade || 'Valinhos',
        ano: parseInt(turma.ano, 10),
        semestre: parseInt(turma.semestre, 10),
        ativa: turma.ativa !== false,
        created_at: new Date().toISOString()
      };
      turmas.push(newTurma);
    }
    saveLocalData(STORAGE_KEYS.TURMAS, turmas);
    return turma;
  },

  async deleteTurma(turmaId, logical = true) {
    if (isSupabaseConfigured) {
      if (logical) {
        const { error } = await supabase.from('turmas').update({ ativa: false }).eq('id', turmaId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('turmas').delete().eq('id', turmaId);
        if (error) throw error;
      }
      return true;
    }

    let turmas = getLocalData(STORAGE_KEYS.TURMAS, INITIAL_TURMAS);
    if (logical) {
      turmas = turmas.map(t => t.id === turmaId ? { ...t, ativa: false } : t);
    } else {
      turmas = turmas.filter(t => t.id !== turmaId);
    }
    saveLocalData(STORAGE_KEYS.TURMAS, turmas);
    return true;
  },

  // ALUNOS (CARÔMETRO PÚBLICO OU ADMIN)
  async getAlunos({ turmaId = null, cursoId = null, isAdmin = false, search = '' } = {}) {
    if (isSupabaseConfigured) {
      if (!isAdmin) {
        // Usa a VIEW pública segura
        let query = supabase.from('carometro_publico').select('*');
        if (turmaId) query = query.eq('turma_id', turmaId);
        if (cursoId) query = query.eq('curso_id', cursoId);
        if (search) query = query.ilike('nome', `%${search}%`);
        const { data, error } = await query;
        if (error) throw error;
        return data;
      } else {
        // Área administrativa: busca completa
        let query = supabase
          .from('alunos')
          .select('*, turmas(id, nome, curso_id, cursos(id, nome, sigla)), aluno_fotos(*)')
          .order('nome', { ascending: true });
        if (turmaId) query = query.eq('turma_id', turmaId);
        const { data, error } = await query;
        if (error) throw error;
        return data;
      }
    }

    const alunos = getLocalData(STORAGE_KEYS.ALUNOS, INITIAL_ALUNOS);
    const turmas = getLocalData(STORAGE_KEYS.TURMAS, INITIAL_TURMAS);
    const cursos = getLocalData(STORAGE_KEYS.CURSOS, INITIAL_CURSOS);

    let result = alunos.map(a => {
      const t = turmas.find(item => item.id === a.turma_id);
      const c = t ? cursos.find(item => item.id === t.curso_id) : null;
      
      if (!isAdmin) {
        // Omitir dados sensíveis no modo público (conforme especificação da view carometro_publico)
        return {
          aluno_id: a.id,
          nome: a.nome,
          turma_id: a.turma_id,
          turma: t ? t.nome : '',
          turno: t ? t.turno : '',
          ano: t ? t.ano : '',
          semestre: t ? t.semestre : '',
          curso_id: c ? c.id : '',
          curso: c ? c.nome : '',
          curso_sigla: c ? c.sigla : '',
          fotos: a.fotos || [],
          ativo: a.ativo
        };
      }

      return {
        ...a,
        turmas: t ? { ...t, cursos: c } : null
      };
    });

    if (!isAdmin) {
      result = result.filter(a => a.ativo !== false);
    }

    if (turmaId) {
      result = result.filter(a => a.turma_id === turmaId);
    }

    if (cursoId) {
      result = result.filter(a => {
        if (!isAdmin) return a.curso_id === cursoId;
        return a.turmas?.curso_id === cursoId;
      });
    }

    if (search) {
      const termo = search.toLowerCase();
      result = result.filter(a => {
        const matchNome = a.nome?.toLowerCase().includes(termo);
        if (!isAdmin) return matchNome;
        const matchMatricula = a.matricula?.toLowerCase().includes(termo);
        const matchEmail = a.email?.toLowerCase().includes(termo);
        return matchNome || matchMatricula || matchEmail;
      });
    }

    return result;
  },

  async saveAluno(alunoData) {
    if (isSupabaseConfigured) {
      const { fotos, ...alunoFields } = alunoData;
      let savedAluno;

      if (alunoFields.id && !alunoFields.id.startsWith('a_temp_')) {
        const { data, error } = await supabase
          .from('alunos')
          .update({ ...alunoFields, updated_at: new Date() })
          .eq('id', alunoFields.id)
          .select()
          .single();
        if (error) throw error;
        savedAluno = data;
      } else {
        const { data, error } = await supabase
          .from('alunos')
          .insert([alunoFields])
          .select()
          .single();
        if (error) throw error;
        savedAluno = data;
      }

      // Sincronizar fotos
      if (fotos && fotos.length > 0) {
        for (const [idx, foto] of fotos.entries()) {
          if (!foto.id || foto.id.startsWith('f_temp_')) {
            await supabase.from('aluno_fotos').insert([{
              aluno_id: savedAluno.id,
              arquivo: foto.arquivo,
              thumbnail: foto.thumbnail || foto.arquivo,
              principal: Boolean(foto.principal),
              ordem: foto.ordem || (idx + 1)
            }]);
          } else {
            await supabase.from('aluno_fotos').update({
              principal: Boolean(foto.principal),
              ordem: foto.ordem || (idx + 1)
            }).eq('id', foto.id);
          }
        }
      }

      return savedAluno;
    }

    const alunos = getLocalData(STORAGE_KEYS.ALUNOS, INITIAL_ALUNOS);
    let saved;
    if (alunoData.id) {
      const idx = alunos.findIndex(a => a.id === alunoData.id);
      if (idx !== -1) {
        alunos[idx] = { ...alunos[idx], ...alunoData };
        saved = alunos[idx];
      }
    } else {
      saved = {
        ...alunoData,
        id: 'a_' + Date.now(),
        ativo: alunoData.ativo !== false,
        created_at: new Date().toISOString()
      };
      alunos.push(saved);
    }
    saveLocalData(STORAGE_KEYS.ALUNOS, alunos);
    return saved;
  },

  async deleteAluno(alunoId, logical = true) {
    if (isSupabaseConfigured) {
      if (logical) {
        const { error } = await supabase.from('alunos').update({ ativo: false }).eq('id', alunoId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('alunos').delete().eq('id', alunoId);
        if (error) throw error;
      }
      return true;
    }

    let alunos = getLocalData(STORAGE_KEYS.ALUNOS, INITIAL_ALUNOS);
    if (logical) {
      alunos = alunos.map(a => a.id === alunoId ? { ...a, ativo: false } : a);
    } else {
      alunos = alunos.filter(a => a.id !== alunoId);
    }
    saveLocalData(STORAGE_KEYS.ALUNOS, alunos);
    return true;
  },

  // UPLOAD DE FOTOS NO SUPABASE STORAGE
  async uploadFotoStorage(file, path) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.storage.from('alunos').upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/webp'
      });
      if (error) throw error;
      const { data: publicData } = supabase.storage.from('alunos').getPublicUrl(path);
      return publicData.publicUrl;
    }

    // Fallback: criar data URL ou object URL em memória
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  },

  // USUÁRIOS / PROFILES
  async getUsers() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*').order('nome');
      if (error) throw error;
      return data;
    }
    return getLocalData(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  async saveUser(userData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').upsert(userData).select().single();
      if (error) throw error;
      return data;
    }

    const users = getLocalData(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (userData.id) {
      const idx = users.findIndex(u => u.id === userData.id);
      if (idx !== -1) users[idx] = { ...users[idx], ...userData };
    } else {
      const newUser = {
        ...userData,
        id: 'u_' + Date.now(),
        created_at: new Date().toISOString()
      };
      users.push(newUser);
    }
    saveLocalData(STORAGE_KEYS.USERS, users);
    return userData;
  },

  async deleteUser(userId) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      return true;
    }
    let users = getLocalData(STORAGE_KEYS.USERS, INITIAL_USERS);
    users = users.filter(u => u.id !== userId);
    saveLocalData(STORAGE_KEYS.USERS, users);
    return true;
  },

  // DASHBOARD STATS
  async getDashboardStats() {
    const cursos = await this.getCursos();
    const turmas = await this.getTurmas();
    const alunos = await this.getAlunos({ isAdmin: true });
    
    let totalFotos = 0;
    alunos.forEach(a => {
      if (a.fotos && Array.isArray(a.fotos)) {
        totalFotos += a.fotos.length;
      } else if (a.aluno_fotos && Array.isArray(a.aluno_fotos)) {
        totalFotos += a.aluno_fotos.length;
      }
    });

    const recentAlunos = [...alunos]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 5);

    return {
      totalCursos: cursos.filter(c => c.ativo !== false).length,
      totalTurmas: turmas.filter(t => t.ativa !== false).length,
      totalAlunos: alunos.filter(a => a.ativo !== false).length,
      totalFotos: totalFotos,
      recentAlunos
    };
  }
};
