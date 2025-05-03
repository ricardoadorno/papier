import axios from 'axios';

// Define base API URL - make it configurable through environment variables in real app
export const API_URL = 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;