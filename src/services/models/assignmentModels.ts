// Assignment Models
export type AssignmentStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';

export interface Assignment {
  id: string;
  topicId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  assignmentStatus: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
  bibliographies?: AssignmentBibliographyReference[];
  sessionReferences?: AssignmentSessionReference[];
  references?: AssignmentSessionReference[];
}

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  assignmentStatus?: AssignmentStatus;
}

export interface UpdateAssignmentRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  assignmentStatus?: AssignmentStatus;
}

export interface AssignmentSessionReference {
  assignmentId: string;
  sessionId: string;
  title?: string;
  createdAt: string;
}

export interface AssignmentBibliographyReference {
  assignmentId?: string;
  bibliographyId: string;
  title?: string;
  createdAt?: string;
}
