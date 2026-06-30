export const ROUTES = {
  // Public / auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Dashboard (home — lista de cursos)
  DASHBOARD: '/dashboard',

  // Curso
  COURSE_DETAIL: '/courses/:courseId',

  // Topic (reemplaza subject)
  TOPIC_DETAIL: '/courses/:courseId/topics/:topicId',

  // Recursos anidados dentro de un topic
  SESSION_DETAIL: '/courses/:courseId/topics/:topicId/sessions/:sessionId',
  NOTE_DETAIL:    '/courses/:courseId/topics/:topicId/notes/:noteId',
  TASK_DETAIL:    '/courses/:courseId/topics/:topicId/assignments/:taskId',
} as const;

// Helpers para construir rutas con parámetros reales
export const buildCourseRoute = (courseId: string) =>
  `/courses/${courseId}`;

export const buildTopicRoute = (courseId: string, topicId: string) =>
  `/courses/${courseId}/topics/${topicId}`;

export const buildSessionRoute = (courseId: string, topicId: string, sessionId: string) =>
  `/courses/${courseId}/topics/${topicId}/sessions/${sessionId}`;

export const buildNoteRoute = (courseId: string, topicId: string, documentId: string) =>
  `/courses/${courseId}/topics/${topicId}/notes/${documentId}`;

export const buildTaskRoute = (courseId: string, topicId: string, assignmentId: string) =>
  `/courses/${courseId}/topics/${topicId}/assignments/${assignmentId}`;
