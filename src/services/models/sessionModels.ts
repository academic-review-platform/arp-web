// Session Models
export interface Session {
  id: string;
  topicId: string;
  title: string;
  summary: string;
  contentMd: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionRequest {
  topicId: string;
  title: string;
  summary: string;
  contentMd: string;
}

export interface UpdateSessionRequest {
  title?: string;
  summary?: string;
  contentMd?: string;
}
