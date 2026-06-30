// Note Models
export interface Note {
  id?: string;
  documentId: string;
  topicId: string;
  userId?: string;
  user?: {
    id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  document?: NoteDocument;
  currentVersion?: NoteVersion;
}

export interface NoteDocument {
  id: string;
  userId?: string;
  ownerId?: string;
  user?: {
    id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
  };
  owner?: {
    id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
  };
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteVersion {
  id: string;
  documentId: string;
  url: string;
  mimeType: string;
  version?: number;
  versionNumber?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateNoteRequest {
  url: string;
  mimeType: string;
}

export interface UpdateNoteRequest {
  url: string;
  mimeType: string;
}
