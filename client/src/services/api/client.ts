import axios from 'axios';

// In production with Nginx, API requests will be proxied through /api
// For development, we can still use a direct connection to the backend
const isProduction = import.meta.env.PROD;
export const API_URL = isProduction ? '/api' : 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;