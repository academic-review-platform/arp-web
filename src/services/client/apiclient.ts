import axios, { type AxiosError } from "axios";
import { useAuthStore } from "../../store/authStore";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Default timeout for all requests (30 s).
// AI review endpoints override this with LONG_TIMEOUT via per-request config.
export const DEFAULT_TIMEOUT = 30_000;
export const LONG_TIMEOUT = 120_000;

const apiClient = axios.create({
  baseURL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: inject JWT token from Zustand auth store
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Limpia el estado de auth en el store y redirige
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
