// Topic Models
export interface Topic {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTopicRequest {
  title: string;
  description?: string;
}

export interface UpdateTopicRequest {
  title?: string;
  description?: string;
}
