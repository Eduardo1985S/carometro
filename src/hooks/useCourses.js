import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/supabase';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCursos();
      setCourses(data || []);
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
      setError('Não foi possível carregar os cursos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const saveCourse = async (courseData) => {
    try {
      const saved = await api.saveCurso(courseData);
      await fetchCourses();
      return saved;
    } catch (err) {
      console.error('Erro ao salvar curso:', err);
      throw err;
    }
  };

  const deleteCourse = async (courseId, logical = true) => {
    try {
      await api.deleteCurso(courseId, logical);
      await fetchCourses();
      return true;
    } catch (err) {
      console.error('Erro ao excluir curso:', err);
      throw err;
    }
  };

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
    saveCourse,
    deleteCourse
  };
}
