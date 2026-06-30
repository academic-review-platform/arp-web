import { useEffect, useState } from 'react';

import {
  getCourseBibliographies,
  getCourseById,
  getCourseParticipants,
  getCourseTopics,
} from '../services/courseService';
import { isCourseOwner } from '../services/mappers/courseMapper';
import type { Assignment } from '../services/models/assignmentModels';
import type { Bibliography } from '../services/models/bibliographyModels';
import type { Course } from '../services/models/courseModels';
import type { Note } from '../services/models/noteModels';
import type { Session } from '../services/models/sessionModels';
import type { Topic } from '../services/models/topicModels';
import { getNoteById, getTopicNotes } from '../services/noteService';
import {
  getTopicAssignments,
  getTopicBibliographies,
  getTopicSessions,
} from '../services/topicService';
import { useAuthStore } from '../store/authStore';

export interface TopicDetailContent {
  topic: Topic;
  sessions: Session[];
  assignments: Assignment[];
  bibliographies: Bibliography[];
  notes: Note[];
}

const getHydratedTopicNotes = async (topicId: string): Promise<Note[]> => {
  const notes = await getTopicNotes(topicId);

  return Promise.all(
    notes.map((note) => getNoteById(topicId, note.documentId)),
  );
};

export interface UseCourseDetailReturn {
  course: Course | null;
  courseBibliographies: Bibliography[];
  topics: TopicDetailContent[];
  isOwner: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCourseDetail = (courseId?: string): UseCourseDetailReturn => {
  const currentUser = useAuthStore((state) => state.user);

  const [course, setCourse] = useState<Course | null>(null);
  const [courseBibliographies, setCourseBibliographies] = useState<Bibliography[]>([]);
  const [topics, setTopics] = useState<TopicDetailContent[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchTick, setFetchTick] = useState(0);

  useEffect(() => {
    if (!courseId) return;

    let cancelled = false;

    const fetchCourseDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [courseResponse, courseBibliographiesResponse, participants, courseTopics] =
          await Promise.all([
            getCourseById(courseId),
            getCourseBibliographies(courseId),
            getCourseParticipants(courseId),
            getCourseTopics(courseId),
          ]);

        const topicDetails = await Promise.all(
          courseTopics.map(async (topic) => {
            const [sessions, assignments, bibliographies, notes] = await Promise.all([
              getTopicSessions(topic.id),
              getTopicAssignments(topic.id),
              getTopicBibliographies(topic.id),
              getHydratedTopicNotes(topic.id),
            ]);

            return { topic, sessions, assignments, bibliographies, notes };
          }),
        );

        if (cancelled) return;

        setCourse(courseResponse);
        setCourseBibliographies(courseBibliographiesResponse);
        setTopics(topicDetails);
        setIsOwner(isCourseOwner(participants, currentUser));
      } catch {
        if (!cancelled) setError('No se pudo cargar el detalle del curso.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCourseDetail();

    return () => {
      cancelled = true;
    };
  }, [courseId, currentUser, fetchTick]);

  const refetch = () => setFetchTick((tick) => tick + 1);

  return {
    course,
    courseBibliographies,
    topics,
    isOwner,
    isLoading,
    error: courseId ? error : 'No se encontró el curso solicitado.',
    refetch,
  };
};
