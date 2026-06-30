// Bibliography Models
export type BibliographyType = 'PDF' | 'WORD' | 'POWERPOINT' | 'URL';

export interface Bibliography {
  id: string;
  userId: string;
  title: string;
  url: string;
  bibliographyType: BibliographyType;
  mimeType: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  courseReference?: CourseReference;
  topicReference?: TopicReference;
  assignmentReference?: AssignmentReference;
}

export interface CourseReference {
  courseId: string;
  bibliographyId: string;
  createdAt: string;
}

export interface TopicReference {
  topicId: string;
  bibliographyId: string;
  createdAt: string;
}

export interface AssignmentReference {
  assignmentId: string;
  bibliographyId: string;
  createdAt: string;
}

export interface CreateBibliographyRequest {
  title: string;
  url: string;
  bibliographyType: BibliographyType;
  mimeType: string;
  file?: File;
}

export interface UpdateBibliographyRequest {
  title?: string;
  summary?: string;
  bibliographyType?: BibliographyType;
}
