const API_BASE_URL = 'http://localhost:4000/api/v1';

export const api = {
  getHeaders(isFormData = false) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  },

  async request(endpoint, options = {}) {
    const isFormData = options.body instanceof FormData;
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(isFormData),
          ...options.headers,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'API Error');
      }
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  },

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },
  
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  async del(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};
