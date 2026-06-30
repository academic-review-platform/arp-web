import apiClient from "./client/apiclient";
import type {
  CreateCourseRequest,
  UpdateCourseRequest,
  Course,
  EnrollRequest,
  EnrollResponse,
  Participant,
} from "./models/courseModels";
import type { Topic, CreateTopicRequest } from "./models/topicModels";
import type { Bibliography, CreateBibliographyRequest } from "./models/bibliographyModels";

const url = '/courses';

export const createCourse = async (courseData: CreateCourseRequest): Promise<Course> => {
  try {
    const res = await apiClient.post(url, courseData);
    return res.data.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const getCourses = async (): Promise<Course[]> => {
  try {
    const res = await apiClient.get(url);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (id: string): Promise<Course> => {
  try {
    const res = await apiClient.get(`${url}/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const updateCourse = async (id: string, courseData: UpdateCourseRequest): Promise<Course> => {
  try {
    const res = await apiClient.put(`${url}/${id}`, courseData);
    return res.data.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${id}`);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

export const enrollInCourse = async (enrollData: EnrollRequest): Promise<EnrollResponse> => {
  try {
    const res = await apiClient.post(`${url}/enroll`, enrollData);
    return res.data.data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

export const unenrollFromCourse = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${id}/unenroll`);
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    throw error;
  }
};

export const disenrollFromCourse = async (id: string, userId: string): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${id}/disenroll`, { data: { userId } });
  } catch (error) {
    console.error('Error disenrolling user from course:', error);
    throw error;
  }
};

export const getCourseParticipants = async (courseId: string): Promise<Participant[]> => {
  try {
    const res = await apiClient.get(`${url}/${courseId}/participants`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching course participants:', error);
    throw error;
  }
};

export const getCourseTopics = async (courseId: string): Promise<Topic[]> => {
  try {
    const res = await apiClient.get(`${url}/${courseId}/topics`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching course topics:', error);
    throw error;
  }
};

export const createCourseTopic = async (courseId: string, topicData: CreateTopicRequest): Promise<Topic> => {
  try {
    const res = await apiClient.post(`${url}/${courseId}/topics`, topicData);
    return res.data.data;
  } catch (error) {
    console.error('Error creating course topic:', error);
    throw error;
  }
};

export const getCourseBibliographies = async (courseId: string): Promise<Bibliography[]> => {
  try {
    const res = await apiClient.get(`${url}/${courseId}/bibliographies`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching course bibliographies:', error);
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

    const res = await apiClient.post(`${url}/${courseId}/bibliographies`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error creating course bibliography:', error);
    throw error;
  }
};
