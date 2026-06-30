// API Endpoint Definitions - ARP Core API

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  
  // Courses
  COURSES: {
    BASE: '/courses',
    ENROLL: '/courses/enroll',
    UNENROLL: (courseId: string) => `/courses/${courseId}/unenroll`,
    DISENROLL: (courseId: string) => `/courses/${courseId}/disenroll`,
    PARTICIPANTS: (courseId: string) => `/courses/${courseId}/participants`,
    TOPICS: (courseId: string) => `/courses/${courseId}/topics`,
    BIBLIOGRAPHIES: (courseId: string) => `/courses/${courseId}/bibliographies`,
  },
  
  // Topics
  TOPICS: {
    BASE: '/topics',
    TOPIC: (topicId: string) => `/topics/${topicId}`,
    SESSIONS: (topicId: string) => `/topics/${topicId}/sessions`,
    NOTES: (topicId: string) => `/topics/${topicId}/notes`,
    ASSIGNMENTS: (topicId: string) => `/topics/${topicId}/assignments`,
    BIBLIOGRAPHIES: (topicId: string) => `/topics/${topicId}/bibliographies`,
  },
  
  // Sessions
  SESSIONS: {
    BASE: '/sessions',
    SESSION: (sessionId: string) => `/sessions/${sessionId}`,
  },
  
  // Assignments
  ASSIGNMENTS: {
    BASE: '/assignments',
    ASSIGNMENT: (assignmentId: string) => `/assignments/${assignmentId}`,
    SUBMISSIONS: (assignmentId: string) => `/assignments/${assignmentId}/submissions`,
    SUBMISSION: (assignmentId: string, documentId: string) => `/assignments/${assignmentId}/submissions/${documentId}`,
    BIBLIOGRAPHIES: (assignmentId: string) => `/assignments/${assignmentId}/bibliographies`,
    REFERENCES: (assignmentId: string) => `/assignments/${assignmentId}/references`,
    REVIEW: (assignmentId: string, documentId: string) => `/assignments/${assignmentId}/submissions/${documentId}/reviews`,
    REVIEW_AI: (assignmentId: string, documentId: string) => `/assignments/${assignmentId}/submissions/${documentId}/reviews/ai`,
    DOWNLOAD: (documentId: string) => `/assignments/download/${documentId}`,
  },
  
  // Bibliographies
  BIBLIOGRAPHIES: {
    BASE: '/bibliographies',
    BIBLIOGRAPHY: (bibliographyId: string) => `/bibliographies/${bibliographyId}`,
  },
  
  // Notes
  NOTES: {
    BASE: '/notes',
    NOTE: (noteId: string) => `/notes/${noteId}`,
    REVIEW: (topicId: string, documentId: string) => `/topics/${topicId}/notes/${documentId}/reviews`,
    REVIEW_AI: (topicId: string, documentId: string) => `/topics/${topicId}/notes/${documentId}/reviews/ai`,
    DOWNLOAD: (documentId: string) => `/download/${documentId}`,
  },
  
  // Reviews
  REVIEWS: {
    BASE: '/reviews',
    REVIEW: (reviewId: string) => `/reviews/${reviewId}`,
    BY_DOCUMENT: (documentId: string) => `/reviews/document/${documentId}`,
    BY_ASSIGNMENT: (assignmentId: string) => `/reviews/assignment/${assignmentId}`,
  },
  
  // Users
  USERS: {
    BASE: '/users',
    USER: (userId: string) => `/users/${userId}`,
    AVATAR: (userId: string) => `/users/${userId}/avatar`,
  },
  
  // References
  REFERENCES: {
    ADD_SESSION: (assignmentId: string, sessionId: string) => `/assignments/${assignmentId}/references/${sessionId}`,
    REMOVE_SESSION: (assignmentId: string, sessionId: string) => `/assignments/${assignmentId}/references/${sessionId}`,
  },
} as const;
