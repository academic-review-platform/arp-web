// Note Models
export interface Note {
  id: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
  document: NoteDocument;
  currentVersion: NoteVersion;
}

export interface NoteDocument {
  id: string;
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteVersion {
  id: string;
  documentId: string;
  url: string;
  mimeType: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  url: string;
  mimeType: string;
}

export interface UpdateNoteRequest {
  url: string;
  mimeType: string;
}
