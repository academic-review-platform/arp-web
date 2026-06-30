// Course Models
export interface Course {
  id: string;
  title: string;
  description?: string;
  enrollmentCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
}

export interface EnrollRequest {
  enrollmentCode: string;
}

export interface EnrollResponse {
  userId: string;
  courseId: string;
  participantRole: 'STUDENT' | 'TEACHER' | 'ASSISTANT' | 'OWNER';
  createdAt: string;
}

export interface Participant {
  courseId?: string;
  id?: string;
  userId?: string;
  user?: {
    id?: string;
    email?: string;
  };
  email?: string;
  firstname: string;
  lastname: string;
  participantRole?: 'STUDENT' | 'TEACHER' | 'ASSISTANT' | 'OWNER';
  ParticipantRole?: 'STUDENT' | 'TEACHER' | 'ASSISTANT' | 'OWNER';
}
