import { useEffect, useState } from 'react';

import { getCourseParticipants } from '../services/courseService';
import { isCourseOwner } from '../services/mappers/courseMapper';
import type { Assignment } from '../services/models/assignmentModels';
import type { Bibliography } from '../services/models/bibliographyModels';
import type { Note } from '../services/models/noteModels';
import type { Session } from '../services/models/sessionModels';
import type { Topic } from '../services/models/topicModels';
import { getNoteById, getTopicNotes } from '../services/noteService';
import {
  getTopicAssignments,
  getTopicBibliographies,
  getTopicById,
  getTopicSessions,
} from '../services/topicService';
import { useAuthStore } from '../store/authStore';
import type { TopicDetailContent } from './useCourseDetail';

interface UseTopicDetailReturn {
  detail: TopicDetailContent | null;
  isOwner: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const getHydratedTopicNotes = async (topicId: string): Promise<Note[]> => {
  const notes = await getTopicNotes(topicId);

  return Promise.all(
    notes.map((note) => getNoteById(topicId, note.documentId)),
  );
};

export const useTopicDetail = (courseId?: string, topicId?: string): UseTopicDetailReturn => {
  const currentUser = useAuthStore((state) => state.user);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [bibliographies, setBibliographies] = useState<Bibliography[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchTick, setFetchTick] = useState(0);

  useEffect(() => {
    if (!courseId || !topicId) return;

    let cancelled = false;

    const fetchTopicDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [
          topicResponse,
          sessionsResponse,
          assignmentsResponse,
          bibliographiesResponse,
          notesResponse,
          participantsResponse,
        ] = await Promise.all([
          getTopicById(topicId),
          getTopicSessions(topicId),
          getTopicAssignments(topicId),
          getTopicBibliographies(topicId),
          getHydratedTopicNotes(topicId),
          getCourseParticipants(courseId),
        ]);

        if (cancelled) return;

        setTopic(topicResponse);
        setSessions(sessionsResponse);
        setAssignments(assignmentsResponse);
        setBibliographies(bibliographiesResponse);
        setNotes(notesResponse);
        setIsOwner(isCourseOwner(participantsResponse, currentUser));
      } catch {
        if (!cancelled) setError('No se pudo cargar el detalle del topic.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchTopicDetail();

    return () => {
      cancelled = true;
    };
  }, [courseId, currentUser, fetchTick, topicId]);

  const refetch = () => setFetchTick((tick) => tick + 1);

  return {
    detail: topic ? { topic, sessions, assignments, bibliographies, notes } : null,
    isOwner,
    isLoading,
    error: courseId && topicId ? error : 'No se encontró el topic solicitado.',
    refetch,
  };
};
