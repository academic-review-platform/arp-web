import apiClient from "./client/apiclient";
import type { Review } from "./models/reviewModels";

const url = '/reviews';

const hasResponseStatus = (error: unknown, status: number) =>
  typeof error === 'object' &&
  error !== null &&
  'response' in error &&
  (error as { response?: { status?: number } }).response?.status === status;

export const getReviewById = async (reviewId: string): Promise<Review> => {
  try {
    const res = await apiClient.get(`${url}/${reviewId}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching review:', error);
    throw error;
  }
};

export const updateReview = async (
  reviewId: string,
  reviewData: { score?: number; comment?: string }
): Promise<Review> => {
  try {
    const res = await apiClient.put(`${url}/${reviewId}`, reviewData);
    return res.data.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${reviewId}`);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

export const getReviewsByDocument = async (documentId: string): Promise<Review[]> => {
  try {
    const res = await apiClient.get(`${url}/document/${documentId}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching reviews by document:', error);
    throw error;
  }
};

export const getReviewsByAssignment = async (assignmentId: string): Promise<Review[]> => {
  try {
    const res = await apiClient.get(`${url}/assignment/${assignmentId}`);
    return res.data.data;
  } catch (error) {
    if (!hasResponseStatus(error, 403)) {
      console.error('Error fetching reviews by assignment:', error);
    }
    throw error;
  }
};
