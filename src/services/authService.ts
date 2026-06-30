import apiClient from "./client/apiclient";
import type { LoginRequest, RegisterRequest, authResponse } from "./models/authModels";

const url = '/auth/';

export const login = async (loginRequest: LoginRequest): Promise<authResponse> => {
  try {
    const res = await apiClient.post(`${url}login`, loginRequest);
    return res.data.data;
  }
  catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export const register = async (registerRequest: RegisterRequest): Promise<authResponse> => {
  try {
    const res = await apiClient.post(`${url}register`, registerRequest);
    return res.data.data;
  }
  catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

export const getMe = async (): Promise<authResponse['user']> => {
  try {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  }
  catch (error) {
    console.error("Get me error:", error);
    throw error;
  }
}
