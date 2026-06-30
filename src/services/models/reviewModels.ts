// Review Models
export type ReviewType = 'AI' | 'TEACHER';

export interface Review {
  id: string;
  documentId: string;
  reviewType: ReviewType;
  score: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  reviewType: ReviewType;
  score: number;
  comment?: string;
}
