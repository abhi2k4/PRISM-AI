
import axios from 'axios';
import { RiskAssessmentRequest, RiskAssessmentResponse, ApiResponse } from '../types';

// Use environment variable or default based on environment
const getApiBaseUrl = () => {
  // Check if we have an explicit API URL from environment
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Default based on environment
  if (process.env.NODE_ENV === 'production') {
    // For production deployment, you'll need to set this to your deployed backend URL
    return 'https://prism-back.app';
  }
  
  // Development default
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);
console.log('Custom API URL:', process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for production
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
