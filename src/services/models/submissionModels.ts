// Submission Models
export interface Submission {
  id: string;
  assignmentId: string;
  createdAt: string;
  updatedAt: string;
  document: SubmissionDocument;
  currentVersion: SubmissionVersion;
}

export interface SubmissionDocument {
  id: string;
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionVersion {
  id: string;
  documentId: string;
  url: string;
  mimeType: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubmissionRequest {
  url: string;
  mimeType: string;
  file?: File;
}

export interface UpdateSubmissionRequest {
  url: string;
  mimeType: string;
}

export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'GRADED';

export interface UpdateSubmissionStatusRequest {
  status: SubmissionStatus;
}
