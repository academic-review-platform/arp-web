import apiClient from "./client/apiclient";
import type { Topic, CreateTopicRequest, UpdateTopicRequest } from "./models/topicModels";
import type { Session, CreateSessionRequest } from "./models/sessionModels";
import type { Note } from "./models/noteModels";
import type { Assignment, CreateAssignmentRequest } from "./models/assignmentModels";
import type { Bibliography, CreateBibliographyRequest } from "./models/bibliographyModels";

const url = '/topics';

export const getTopicById = async (topicId: string): Promise<Topic> => {
  try {
    const res = await apiClient.get(`${url}/${topicId}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching topic:', error);
    throw error;
  }
};

export const updateTopic = async (topicId: string, topicData: UpdateTopicRequest): Promise<Topic> => {
  try {
    const res = await apiClient.put(`${url}/${topicId}`, topicData);
    return res.data.data;
  } catch (error) {
    console.error('Error updating topic:', error);
    throw error;
  }
};

export const deleteTopic = async (topicId: string): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${topicId}`);
  } catch (error) {
    console.error('Error deleting topic:', error);
    throw error;
  }
};

export const createTopic = async (courseId: string, topicData: CreateTopicRequest): Promise<Topic> => {
  try {
    const res = await apiClient.post(`/courses/${courseId}/topics`, topicData);
    return res.data.data;
  } catch (error) {
    console.error('Error creating topic:', error);
    throw error;
  }
};

export const getTopicSessions = async (topicId: string): Promise<Session[]> => {
  try {
    const res = await apiClient.get(`${url}/${topicId}/sessions`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching topic sessions:', error);
    throw error;
  }
};

export const createTopicSession = async (
  topicId: string,
  sessionData: CreateSessionRequest
): Promise<Session> => {
  try {
    const res = await apiClient.post(`${url}/${topicId}/sessions`, sessionData);
    return res.data.data;
  } catch (error) {
    console.error('Error creating topic session:', error);
    throw error;
  }
};

export const getTopicNotes = async (topicId: string): Promise<Note[]> => {
  try {
    const res = await apiClient.get(`${url}/${topicId}/notes`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching topic notes:', error);
    throw error;
  }
};


export const getTopicAssignments = async (topicId: string): Promise<Assignment[]> => {
  try {
    const res = await apiClient.get(`${url}/${topicId}/assignments`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching topic assignments:', error);
    throw error;
  }
};

export const createTopicAssignment = async (
  topicId: string,
  assignmentData: CreateAssignmentRequest
): Promise<Assignment> => {
  try {
    const res = await apiClient.post(`${url}/${topicId}/assignments`, assignmentData);
    return res.data.data;
  } catch (error) {
    console.error('Error creating topic assignment:', error);
    throw error;
  }
};

export const getTopicBibliographies = async (topicId: string): Promise<Bibliography[]> => {
  try {
    const res = await apiClient.get(`${url}/${topicId}/bibliographies`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching topic bibliographies:', error);
    throw error;
  }
};

export const createTopicBibliography = async (
  topicId: string,
  bibliographyData: CreateBibliographyRequest
): Promise<Bibliography> => {
  try {
    const formData = new FormData();
    formData.append('title', bibliographyData.title);
    formData.append('url', bibliographyData.url);
    formData.append('bibliographyType', bibliographyData.bibliographyType);
    formData.append('mimeType', bibliographyData.mimeType);
    if (bibliographyData.file) formData.append('file', bibliographyData.file);

    const res = await apiClient.post(`${url}/${topicId}/bibliographies`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error creating topic bibliography:', error);
    throw error;
  }
};
