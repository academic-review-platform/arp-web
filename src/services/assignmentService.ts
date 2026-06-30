import apiClient, { LONG_TIMEOUT } from "./client/apiclient";
import type {
  Assignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  AssignmentSessionReference,
} from "./models/assignmentModels";
import type { Submission, CreateSubmissionRequest, UpdateSubmissionStatusRequest } from "./models/submissionModels";
import type { Review, CreateReviewRequest } from "./models/reviewModels";
import type { Bibliography, CreateBibliographyRequest } from "./models/bibliographyModels";

const url = '/assignments';

export const getAssignmentById = async (assignmentId: string): Promise<Assignment> => {
  try {
    const res = await apiClient.get(`${url}/${assignmentId}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching assignment:', error);
    throw error;
  }
};

export const updateAssignment = async (
  assignmentId: string,
  assignmentData: UpdateAssignmentRequest
): Promise<Assignment> => {
  try {
    const res = await apiClient.put(`${url}/${assignmentId}`, assignmentData);
    return res.data.data;
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId: string): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${assignmentId}`);
  } catch (error) {
    console.error('Error deleting assignment:', error);
    throw error;
  }
};

export const createAssignment = async (
  topicId: string,
  assignmentData: CreateAssignmentRequest
): Promise<Assignment> => {
  try {
    const res = await apiClient.post(`/topics/${topicId}/assignments`, assignmentData);
    return res.data.data;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

// ── Submissions ───────────────────────────────────────────────────────────────

export const getAssignmentSubmissions = async (assignmentId: string): Promise<Submission[]> => {
  try {
    const res = await apiClient.get(`${url}/${assignmentId}/submissions`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching assignment submissions:', error);
    throw error;
  }
};

export const getSubmissionById = async (assignmentId: string, documentId: string): Promise<Submission> => {
  try {
    const res = await apiClient.get(`${url}/${assignmentId}/submissions/${documentId}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching submission:', error);
    throw error;
  }
};

export const createSubmission = async (
  assignmentId: string,
  submissionData: CreateSubmissionRequest
): Promise<Submission> => {
  try {
    const formData = new FormData();
    formData.append('url', submissionData.url);
    formData.append('mimeType', submissionData.mimeType);
    if (submissionData.file) formData.append('file', submissionData.file);

    const res = await apiClient.post(`${url}/${assignmentId}/submissions`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error creating submission:', error);
    throw error;
  }
};

export const updateSubmission = async (
  assignmentId: string,
  documentId: string,
  submissionData: CreateSubmissionRequest
): Promise<Submission> => {
  try {
    const formData = new FormData();
    formData.append('url', submissionData.url);
    formData.append('mimeType', submissionData.mimeType);
    if (submissionData.file) formData.append('file', submissionData.file);

    const res = await apiClient.put(`${url}/${assignmentId}/submissions/${documentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error updating submission:', error);
    throw error;
  }
};

export const updateSubmissionStatus = async (
  assignmentId: string,
  documentId: string,
  statusData: UpdateSubmissionStatusRequest
): Promise<Submission> => {
  try {
    const res = await apiClient.patch(`${url}/${assignmentId}/submissions/${documentId}`, statusData);
    return res.data.data;
  } catch (error) {
    console.error('Error updating submission status:', error);
    throw error;
  }
};

export const deleteSubmission = async (assignmentId: string, documentId: string): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${assignmentId}/submissions/${documentId}`);
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
};

export const downloadSubmission = async (documentId: string): Promise<Blob> => {
  try {
    const res = await apiClient.get(`${url}/download/${documentId}`, {
      responseType: 'blob',
    });
    return res.data;
  } catch (error) {
    console.error('Error downloading submission:', error);
    throw error;
  }
};

// ── Submission Reviews ────────────────────────────────────────────────────────

export const createSubmissionReview = async (
  assignmentId: string,
  documentId: string,
  reviewData: CreateReviewRequest
): Promise<Review> => {
  try {
    const res = await apiClient.post(
      `${url}/${assignmentId}/submissions/${documentId}/reviews`,
      reviewData
    );
    return res.data.data;
  } catch (error) {
    console.error('Error creating submission review:', error);
    throw error;
  }
};

export const createSubmissionReviewAI = async (
  assignmentId: string,
  documentId: string
): Promise<Review> => {
  try {
    const res = await apiClient.post(
      `${url}/${assignmentId}/submissions/${documentId}/reviews/ai`,
      undefined,
      { timeout: LONG_TIMEOUT },
    );
    return res.data.data;
  } catch (error) {
    console.error('Error creating AI submission review:', error);
    throw error;
  }
};

// ── Bibliographies ────────────────────────────────────────────────────────────

export const getAssignmentBibliographies = async (assignmentId: string): Promise<Bibliography[]> => {
  try {
    const res = await apiClient.get(`${url}/${assignmentId}/bibliographies`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching assignment bibliographies:', error);
    throw error;
  }
};

export const createAssignmentBibliography = async (
  assignmentId: string,
  bibliographyData: CreateBibliographyRequest
): Promise<Bibliography> => {
  try {
    const formData = new FormData();
    formData.append('title', bibliographyData.title);
    formData.append('url', bibliographyData.url);
    formData.append('bibliographyType', bibliographyData.bibliographyType);
    formData.append('mimeType', bibliographyData.mimeType);
    if (bibliographyData.file) formData.append('file', bibliographyData.file);

    const res = await apiClient.post(`${url}/${assignmentId}/bibliographies`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error creating assignment bibliography:', error);
    throw error;
  }
};

export const addBibliographyToAssignment = async (
  assignmentId: string,
  bibliographyId: string
): Promise<void> => {
  try {
    await apiClient.post(`${url}/${assignmentId}/bibliographies/${bibliographyId}`);
  } catch (error) {
    console.error('Error adding bibliography to assignment:', error);
    throw error;
  }
};

export const removeBibliographyFromAssignment = async (
  assignmentId: string,
  bibliographyId: string
): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${assignmentId}/bibliographies/${bibliographyId}`);
  } catch (error) {
    console.error('Error removing bibliography from assignment:', error);
    throw error;
  }
};

// ── Session References ────────────────────────────────────────────────────────

export const getAssignmentReferences = async (
  assignmentId: string
): Promise<AssignmentSessionReference[]> => {
  try {
    const res = await apiClient.get(`${url}/${assignmentId}/references`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching assignment references:', error);
    throw error;
  }
};

export const addSessionReference = async (
  assignmentId: string,
  sessionId: string
): Promise<AssignmentSessionReference> => {
  try {
    const res = await apiClient.post(`${url}/${assignmentId}/references/${sessionId}`);
    return res.data.data;
  } catch (error) {
    console.error('Error adding session reference:', error);
    throw error;
  }
};

export const removeSessionReference = async (
  assignmentId: string,
  sessionId: string
): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${assignmentId}/references/${sessionId}`);
  } catch (error) {
    console.error('Error removing session reference:', error);
    throw error;
  }
};
