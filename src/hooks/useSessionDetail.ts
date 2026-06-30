import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { buildTopicRoute } from '../constants/routes.constants';
import { sessionSchema, type SessionFormValues } from './schemas/sessionSchema';
import { getCourseParticipants } from '../services/courseService';
import { isCourseOwner } from '../services/mappers/courseMapper';
import { deleteSession, getSessionById, updateSession } from '../services/sessionService';
import type { Session } from '../services/models/sessionModels';
import { useAuthStore } from '../store/authStore';

type ModalState = 'none' | 'edit' | 'delete';

interface UseSessionDetailParams {
  courseId?: string;
  topicId?: string;
  sessionId?: string;
}

export const useSessionDetail = ({ courseId, topicId, sessionId }: UseSessionDetailParams) => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const [session, setSession] = useState<Session | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>('none');
  const [fetchTick, setFetchTick] = useState(0);

  useEffect(() => {
    if (!courseId || !sessionId) return;

    let cancelled = false;

    const fetchSessionDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [sessionResponse, participants] = await Promise.all([
          getSessionById(sessionId),
          getCourseParticipants(courseId),
        ]);

        if (cancelled) return;

        setSession(sessionResponse);
        setIsOwner(isCourseOwner(participants, currentUser));
      } catch {
        if (!cancelled) setError('No se pudo cargar el detalle de la sesión.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchSessionDetail();

    return () => {
      cancelled = true;
    };
  }, [courseId, currentUser, fetchTick, sessionId]);

  const closeModal = () => {
    if (!isSaving) setModal('none');
  };

  const refetch = () => setFetchTick((tick) => tick + 1);

  const formik = useFormik<SessionFormValues>({
    initialValues: {
      title: session?.title ?? '',
      summary: session?.summary ?? '',
      contentMd: session?.contentMd ?? '',
    },
    enableReinitialize: true,
    validationSchema: sessionSchema,
    onSubmit: async (values, helpers) => {
      if (!sessionId) return;

      setIsSaving(true);
      try {
        const updatedSession = await updateSession(sessionId, {
          title: values.title,
          summary: values.summary,
          contentMd: values.contentMd ?? '',
        });
        setSession(updatedSession);
        setModal('none');
        helpers.setStatus(undefined);
      } catch {
        helpers.setStatus('No se pudo actualizar la sesión. Intenta de nuevo.');
      } finally {
        setIsSaving(false);
      }
    },
  });

  const handleDeleteSession = async () => {
    if (!sessionId || !courseId || !topicId) return;

    setIsSaving(true);
    try {
      await deleteSession(sessionId);
      navigate(buildTopicRoute(courseId, topicId));
    } catch {
      setError('No se pudo borrar la sesión. Intenta de nuevo.');
      setIsSaving(false);
    }
  };

  return {
    session,
    isOwner,
    isLoading,
    isSaving,
    error: courseId && topicId && sessionId ? error : 'No se encontró la sesión solicitada.',
    modal,
    formik,
    refetch,
    openEditModal: () => setModal('edit'),
    openDeleteModal: () => setModal('delete'),
    closeModal,
    handleDeleteSession,
  };
};

export type UseSessionDetailReturn = ReturnType<typeof useSessionDetail>;
