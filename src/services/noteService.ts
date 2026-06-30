import apiClient, { LONG_TIMEOUT } from "./client/apiclient";
import type { Note, CreateNoteRequest, UpdateNoteRequest } from "./models/noteModels";
import type { Review, CreateReviewRequest } from "./models/reviewModels";

export const getTopicNotes = async (topicId: string): Promise<Note[]> => {
  try {
    const res = await apiClient.get(`/topics/${topicId}/notes`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching topic notes:', error);
    throw error;
  }
};

export const createNote = async (
  topicId: string,
  noteData: CreateNoteRequest
): Promise<Note> => {
  try {
    const res = await apiClient.post(`/topics/${topicId}/notes`, noteData);
    return res.data.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const getNoteById = async (topicId: string, documentId: string): Promise<Note> => {
  try {
    const res = await apiClient.get(`/topics/${topicId}/notes/${documentId}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

export const updateNote = async (
  topicId: string,
  documentId: string,
  noteData: UpdateNoteRequest & { file?: File }
): Promise<Note> => {
  try {
    const formData = new FormData();
    formData.append('url', noteData.url);
    formData.append('mimeType', noteData.mimeType);
    if (noteData.file) formData.append('file', noteData.file);

    const res = await apiClient.put(`/topics/${topicId}/notes/${documentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (topicId: string, documentId: string): Promise<void> => {
  try {
    await apiClient.delete(`/topics/${topicId}/notes/${documentId}`);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const downloadNote = async (documentId: string): Promise<void> => {
  try {
    const res = await apiClient.get(`/topics/download/${documentId}`, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const redirectUrl =
      res.request?.responseURL ??
      res.headers.location ??
      (typeof res.data === 'string' ? res.data : undefined);

    if (redirectUrl) {
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    }
  } catch (error) {
    console.error('Error downloading note:', error);
    throw error;
  }
};

export const createNoteReview = async (
  topicId: string,
  documentId: string,
  reviewData: CreateReviewRequest
): Promise<Review> => {
  try {
    const res = await apiClient.post(
      `/topics/${topicId}/notes/${documentId}/reviews`,
      reviewData
    );
    return res.data.data;
  } catch (error) {
    console.error('Error creating note review:', error);
    throw error;
  }
};

export const createNoteReviewAI = async (topicId: string, documentId: string): Promise<Review> => {
  try {
    const res = await apiClient.post(
      `/topics/${topicId}/notes/${documentId}/reviews/ai`,
      undefined,
      { timeout: LONG_TIMEOUT },
    );
    return res.data.data;
  } catch (error) {
    console.error('Error creating AI note review:', error);
    throw error;
  }
};
