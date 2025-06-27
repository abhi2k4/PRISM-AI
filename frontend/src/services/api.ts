import axios from 'axios';
import { RiskAssessmentRequest, RiskAssessmentResponse, ApiResponse } from '../types';

// Use explicit backend URL - bypassing proxy issues
const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: false, // Disable credentials for CORS
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const riskAssessmentService = {
  // Perform risk assessment
  assessRisk: async (request: RiskAssessmentRequest): Promise<ApiResponse<RiskAssessmentResponse>> => {
    try {
      console.log('Making API request to:', API_BASE_URL + '/assess-risk');
      console.log('Request data:', request);
      const response = await api.post<RiskAssessmentResponse>('/assess-risk', request);
      console.log('API response:', response.data);
      return { data: response.data };
    } catch (error: any) {
      console.error('API Error:', error);
      console.error('Error response:', error.response?.data);
      return {
        error: error.response?.data?.detail || error.message || 'Assessment failed',
      };
    }
  },

  // Health check
  healthCheck: async (): Promise<ApiResponse<{ status: string; service: string; version: string }>> => {
    try {
      const response = await api.get('/health');
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || error.message || 'Health check failed',
      };
    }
  },

  // Get API status
  getStatus: async (): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await api.get('/');
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || error.message || 'Status check failed',
      };
    }
  },
};

export default api;
