import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/supabase';

export function useClasses(cursoId = null) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTurmas(cursoId);
      setClasses(data || []);
    } catch (err) {
      console.error('Erro ao buscar turmas:', err);
      setError('Não foi possível carregar as turmas.');
    } finally {
      setLoading(false);
    }
  }, [cursoId]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const saveClass = async (classData) => {
    try {
      const saved = await api.saveTurma(classData);
      await fetchClasses();
      return saved;
    } catch (err) {
      console.error('Erro ao salvar turma:', err);
      throw err;
    }
  };

  const deleteClass = async (classId, logical = true) => {
    try {
      await api.deleteTurma(classId, logical);
      await fetchClasses();
      return true;
    } catch (err) {
      console.error('Erro ao excluir turma:', err);
      throw err;
    }
  };

  return {
    classes,
    loading,
    error,
    refetch: fetchClasses,
    saveClass,
    deleteClass
  };
}
