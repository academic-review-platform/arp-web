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
  createdAt: string;
}
