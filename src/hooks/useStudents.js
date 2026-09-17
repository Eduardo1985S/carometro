import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/supabase';

export function useStudents({ turmaId = null, cursoId = null, isAdmin = false, search = '' } = {}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAlunos({ turmaId, cursoId, isAdmin, search });
      setStudents(data || []);
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
      setError('Não foi possível carregar os alunos.');
    } finally {
      setLoading(false);
    }
  }, [turmaId, cursoId, isAdmin, search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const saveStudent = async (studentData) => {
    try {
      const saved = await api.saveAluno(studentData);
      await fetchStudents();
      return saved;
    } catch (err) {
      console.error('Erro ao salvar aluno:', err);
      throw err;
    }
  };

  const deleteStudent = async (studentId, logical = true) => {
    try {
      await api.deleteAluno(studentId, logical);
      await fetchStudents();
      return true;
    } catch (err) {
      console.error('Erro ao excluir aluno:', err);
      throw err;
    }
  };

  return {
    students,
    loading,
    error,
    refetch: fetchStudents,
    saveStudent,
    deleteStudent
  };
}
