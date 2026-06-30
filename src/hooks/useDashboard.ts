import { useState, useEffect } from 'react';

import { getCourses } from '../services/courseService';
import { partitionCourses } from '../services/mappers/courseMapper';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import type { Course } from '../store/models/courseStoreModels';

export interface UseDashboardReturn {
  ownedCourses: Course[];
  enrolledCourses: Course[];
  currentUserId: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const currentUserId = useAuthStore((state) => state.user.id);
  const setCourses      = useCourseStore((state) => state.setCourses);
  const ownedCourses    = useCourseStore((state) => state.ownedCourses);
  const enrolledCourses = useCourseStore((state) => state.enrolledCourses);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [fetchTick, setFetchTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dtos = await getCourses();
        if (cancelled) return;
        const { owned, enrolled } = partitionCourses(dtos, currentUserId);
        setCourses(owned, enrolled);
      } catch {
        if (!cancelled) setError('No se pudieron cargar los cursos.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCourses();

    return () => { cancelled = true; };
  // fetchTick permite forzar un re-fetch desde fuera llamando refetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTick]);

  const refetch = () => setFetchTick((t) => t + 1);

  return { ownedCourses, enrolledCourses, currentUserId, isLoading, error, refetch };
};
