import apiClient from "./client/apiclient";
import type { Session, CreateSessionRequest, UpdateSessionRequest } from "./models/sessionModels";

const url = '/sessions';

export const getSessionById = async (sessionId: string): Promise<Session> => {
  try {
    const res = await apiClient.get(`${url}/${sessionId}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
};

export const updateSession = async (sessionId: string, sessionData: UpdateSessionRequest): Promise<Session> => {
  try {
    const res = await apiClient.put(`${url}/${sessionId}`, sessionData);
    return res.data.data;
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${sessionId}`);
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

export const createSession = async (topicId: string, sessionData: CreateSessionRequest): Promise<Session> => {
  try {
    const res = await apiClient.post(`/topics/${topicId}/sessions`, sessionData);
    return res.data.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};
