import { useState, useEffect } from 'react';

import { getCourseParticipants, getCourses } from '../services/courseService';
import { partitionCourses } from '../services/mappers/courseMapper';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import type { Course } from '../store/models/courseStoreModels';

export interface UseDashboardReturn {
  ownedCourses: Course[];
  enrolledCourses: Course[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const currentUser = useAuthStore((state) => state.user);
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
        const participants = await Promise.all(
          dtos.map(async (course) => {
            const courseParticipants = await getCourseParticipants(course.id);
            return courseParticipants.map((participant) => ({
              ...participant,
              courseId: course.id,
            }));
          }),
        );
        if (cancelled) return;
        const { owned, enrolled } = partitionCourses(dtos, currentUser, participants.flat());
        setCourses(owned, enrolled);
      } catch {
        if (!cancelled) setError('No se pudieron cargar los cursos.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCourses();

    return () => { cancelled = true; };
  }, [currentUser, fetchTick, setCourses]);

  const refetch = () => setFetchTick((t) => t + 1);

  return { ownedCourses, enrolledCourses, isLoading, error, refetch };
};
