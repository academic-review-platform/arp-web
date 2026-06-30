import apiClient from "./client/apiclient";
import type { 
  CreateBibliographyRequest, 
  UpdateBibliographyRequest, 
  Bibliography 
} from "./models/bibliographyModels";

const url = '/bibliographies';

export const createBibliography = async (bibliographyData: CreateBibliographyRequest): Promise<Bibliography> => {
  try {
    const formData = new FormData();
    formData.append('title', bibliographyData.title);
    formData.append('url', bibliographyData.url);
    formData.append('bibliographyType', bibliographyData.bibliographyType);
    formData.append('mimeType', bibliographyData.mimeType);
    if (bibliographyData.file) formData.append('file', bibliographyData.file);
    
    const res = await apiClient.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error creating bibliography:', error);
    throw error;
  }
};

export const getBibliographyById = async (id: string): Promise<Bibliography> => {
  try {
    const res = await apiClient.get(`${url}/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching bibliography:', error);
    throw error;
  }
};

export const updateBibliography = async (id: string, bibliographyData: UpdateBibliographyRequest): Promise<Bibliography> => {
  try {
    const res = await apiClient.put(`${url}/${id}`, bibliographyData);
    return res.data.data;
  } catch (error) {
    console.error('Error updating bibliography:', error);
    throw error;
  }
};

export const deleteBibliography = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${id}`);
  } catch (error) {
    console.error('Error deleting bibliography:', error);
    throw error;
  }
};

export const createCourseBibliography = async (
  courseId: string, 
  bibliographyData: CreateBibliographyRequest
): Promise<Bibliography> => {
  try {
    const formData = new FormData();
    formData.append('title', bibliographyData.title);
    formData.append('url', bibliographyData.url);
    formData.append('bibliographyType', bibliographyData.bibliographyType);
    formData.append('mimeType', bibliographyData.mimeType);
    if (bibliographyData.file) formData.append('file', bibliographyData.file);
    
    const res = await apiClient.post(`/courses/${courseId}/bibliographies`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error creating course bibliography:', error);
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
    
    const res = await apiClient.post(`/topics/${topicId}/bibliographies`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error creating topic bibliography:', error);
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
    
    const res = await apiClient.post(`/assignments/${assignmentId}/bibliographies`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error creating assignment bibliography:', error);
    throw error;
  }
};

export const addBibliographyToAssignment = async (assignmentId: string, bibliographyId: string): Promise<void> => {
  try {
    await apiClient.post(`/assignments/${assignmentId}/bibliographies/${bibliographyId}`);
  } catch (error) {
    console.error('Error adding bibliography to assignment:', error);
    throw error;
  }
};

export const removeBibliographyFromAssignment = async (assignmentId: string, bibliographyId: string): Promise<void> => {
  try {
    await apiClient.delete(`/assignments/${assignmentId}/bibliographies/${bibliographyId}`);
  } catch (error) {
    console.error('Error removing bibliography from assignment:', error);
    throw error;
  }
};
