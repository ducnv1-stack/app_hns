import { config } from '../config/env';

// API Configuration
const API_BASE_URL = config.API_BASE_URL;

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const requestConfig = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('hns_auth_token');
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  try {
    console.log('🌐 API Request:', { url, method: requestConfig.method, body: requestConfig.body });
    const response = await fetch(url, requestConfig);
    console.log('🌐 API Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error response:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Success response:', data);
    console.log('✅ API Response structure:', {
      hasSuccess: 'success' in data,
      hasData: 'data' in data,
      hasError: 'error' in data,
      keys: Object.keys(data)
    });
    return data;
  } catch (error) {
    console.error('❌ API Request failed:', error);
    throw error;
  }
}

// API Methods
export const api = {
  // GET request
  get: (endpoint, params = {}) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return apiRequest(url, { method: 'GET' });
  },

  // POST request
  post: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT request
  put: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  delete: (endpoint) => {
    return apiRequest(endpoint, { method: 'DELETE' });
  },

  // PATCH request
  patch: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// Health check
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return response;
  } catch (error) {
    console.error('API Health check failed:', error);
    throw error;
  }
};

export default api;
